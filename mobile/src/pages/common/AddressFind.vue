<template>
    <ModalPopup>
        <template #headerTitle>
            <h1><b>우편번호 찾기</b></h1>
        </template>
        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="mm_inner m_popup-postcode">
                            <MMInput
                                v-model="searchKeyword"
                                :form-class="'mm_form-text T=lg'"
                                type="search"     
                                :use-trim="false"        
                                :place-holder-text="'도로명 또는 지번을 입력하세요'"
                                @keyup.enter="searchAddress"
                            >
                                <template #extraTopButton>
                                    <button type="button" class="btn_search" @click="searchAddress">
                                        <i class="ico_search" /><b class="mm_ir-blind">검색하기</b>
                                    </button>
                                </template>
                            </MMInput>
                            <template v-if="isSearched">                                
                                <!-- 우편번호 검색 결과 -->
                                <h5 class="m_popup-postcode-title">
                                    <b>주소 검색결과 총 <strong>{{ MMFilters.formatNumber(searchAddressPaginator.total) }}</strong>건</b>
                                </h5>
                                <p v-if="searchAddressPaginator.total < 1" class="mm_text-none">
                                    <i class="ico_text-none" />검색 결과가 없습니다
                                </p>
                                <div v-else class="m_popup-postcode-list">
                                    <ul class="m_popup-postcode-list">
                                        <li v-for="address in searchAddressPaginator.data" :key="address.zipCode">
                                            <a href="#" @click.prevent="apply(address.zipCode, address.roadAddress)">
                                                <div class="m_popup-postcode-item">
                                                    <dl>
                                                        <dt>도로명</dt>
                                                        <dd>{{ address.roadAddress }}</dd>
                                                    </dl>
                                                    <dl>
                                                        <dt>지번</dt>
                                                        <dd>{{ address.jibunAddress }}</dd>
                                                    </dl>
                                                </div>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <!--// 우편번호 검색 결과 -->
                                <!-- 페이지네이션 -->
                                <!-- (D) 현재 페이지의 메뉴에 'S=page-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
                                <mm-paginator
                                    :page-block-type="'group'"
                                    :page-block-count="3"
                                    :current-page="searchAddressPaginator.currentPage"
                                    :items-per-page="searchAddressPaginator.perPage"
                                    :total-count="searchAddressPaginator.total"
                                    @move-page-to="movePage"
                                />
                                
                                <!--// 페이지네이션 -->
                            </template>
                            <div v-else class="m_popup-postcode-guide">
                                <dl>
                                    <dt><strong>TIP</strong>도로명, 건물명, 지번 중 선택하여<br>입력하세요</dt>
                                    <dd>도로명 + 건물번호<strong>예) 판교로 242</strong></dd>
                                    <dd>동/읍/면/리 + 번지<strong>예) 삼평동 624</strong></dd>
                                    <dd>건물명, 아파트명<strong>예) 삼성동 힐스테이트</strong></dd>
                                </dl>
                                <section>
                                    <h5 class="m_popup-postcode-title">
                                        <b>예) ‘삼성동 힐스테이트’ 검색결과</b>
                                    </h5>
                                    <div class="m_popup-postcode-item">
                                        <dl>
                                            <dt>도로명</dt>
                                            <dd>서울특별시 강남구 테헤란로 152 강남파이낸스센터</dd>
                                        </dl>
                                        <dl>
                                            <dt>지번</dt>
                                            <dd>서울특별시 강남구 역삼1동 737</dd>
                                        </dl>
                                        <strong class="text_postcode">06236</strong>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                    <!--// 본문 -->
                </div>
            </div>
        </template>
    </ModalPopup>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SearchAddressPaginator } from '$/@type/shipping';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import { shippingRepository } from '$/repository/order/shippingRepository';
import ModalPopup from '@/components/layout/ModalPopup.vue';
import MmPaginator from '@/components/Paginator.vue';
import { useRouter } from 'vue-router';
import { useAddressFind } from '$/composables/shippingAddressComposable'

const router = useRouter();
const { setAddress } = useAddressFind();

/** VARIABLE */
const isSearched = ref(false);
const searchKeyword = ref('');
        
const searchAddressPaginator = ref<SearchAddressPaginator>({
    total: 0,
    currentPage: 1,
    perPage: 10,
    data: []
});

const filters = ref({
    keyword: '',
    page: 1,
    perPage: 5,            
})
/** // VARIABLE */

/** FUNCTION */
async function searchAddress() {
    if (searchKeyword.value === '') {
        return mmon.bom.alert('검색어를 입력해주세요');
    }

    if (searchKeyword.value.length < 2) {
        return mmon.bom.alert('검색어는 두글자 이상 입력해주세요.');
    }            

    filters.value.page = 1;
    filters.value.keyword = searchKeyword.value
    await fetchAddress();
}

async function fetchAddress() {
    mmon.loading.show();
    try {
        searchAddressPaginator.value = await shippingRepository.findAddress(filters.value);
    } catch (e) {
        defaultCatch(e);
    } finally {
        isSearched.value = true;
        mmon.loading.hide();
    }
}

async function movePage(page: number) {
    filters.value.page = page;
    await fetchAddress();
}

function apply(zip: string, roadAddress: string ) {
    setAddress(zip, roadAddress)
    router.go(-1);
}
/** // FUNCTION */
</script>

