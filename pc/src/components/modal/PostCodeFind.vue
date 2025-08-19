<template>
    <div class="m_modal-postcode">
        <!-- 우편번호 검색 -->
        <div class="m_modal-postcode-search">
            <MMInput
                v-model="searchKeyword"             
                :use-trim="false"
                :place-holder-text="'도로명 또는 지번을 입력하세요'"
                @keyup.enter="searchAddress"
            />
            <button 
                type="button" 
                class="btn_search"                        
                @click="searchAddress"
            >
                <i class="ico_search T=sm" />
                <b class="mm_ir-blind">검색하기</b>
            </button>
        </div>
        <!--// 우편번호 검색 -->

        <template v-if="isSearched">
            <!-- 우편번호 검색 결과 -->
            <h4 class="m_modal-postcode-title">
                <b>주소 검색결과 총 <strong class="mm_text-variable">{{ MMFilters.formatNumber(searchAddressPaginator.total) }}</strong>건</b>
            </h4>
            <p
                v-if="searchAddressPaginator.total < 1"
                class="mm_text-none T=sm"
            >
                <i class="ico_text-none" />검색결과가 없습니다
            </p>
            <ul
                v-else
                class="m_modal-postcode-list"
            >
                <li 
                    v-for="address in searchAddressPaginator.data" 
                    :key="`${address.zipCode}_${address.roadAddress}`"
                >
                    <a
                        href="#"
                        @click.prevent="setAddress(address)"
                    >
                        <div class="m_modal-postcode-item">
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
            <!--// 우편번호 검색 결과 -->

            <!-- 페이지네이션 -->
            <!-- (D) 현재 페이지의 메뉴에 'S=page-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
            <mm-paginator
                :page-block-type="'group'"
                :page-block-count="5"
                :current-page="searchAddressPaginator.currentPage"
                :items-per-page="searchAddressPaginator.perPage"
                :total-count="searchAddressPaginator.total"
                @move-page-to="movePage"
            />
                    
            <!--// 페이지네이션 -->
        </template>
        <!-- 우편번호 검색 가이드 -->
        <div
            v-else
            class="m_modal-postcode-guide"
        >
            <dl>
                <dt><strong>TIP</strong>도로명, 건물명, 지번 중 선택하여 입력하세요</dt>
                <dd>도로명 + 건물번호<strong>예) 판교로 242</strong></dd>
                <dd>동/읍/면/리 + 번지<strong>예) 삼평동 624</strong></dd>
                <dd>건물명, 아파트명<strong>예) 삼성동 힐스테이트</strong></dd>
            </dl>
            <section>
                <h5 class="m_modal-postcode-title">
                    <b>예) ‘삼성동 힐스테이트’ 검색결과</b>
                </h5>
                <div class="m_modal-postcode-item">
                    <dl>
                        <dt>도로명</dt>
                        <dd>서울특별시 강남구 삼성로 115길 37-4(삼성동,힐 스테이트5차)</dd>
                    </dl>
                    <dl>
                        <dt>지번</dt>
                        <dd>서울특별시 강남구 역삼1동 737</dd>
                    </dl>
                    <strong class="text_postcode">06236</strong>
                </div>
            </section>
        </div>
        <!--// 우편번호 검색 가이드 -->
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue'
import { mmon } from '$/helper/mmon';
import { shippingRepository } from '$/repository/order/shippingRepository';
import { SearchAddress, SearchAddressPaginator } from '$/@type/shipping';
import { defaultCatch } from '$/functions';
import MmPaginator from '@/components/Paginator.vue'
import { ModalCloseHandler } from '$/@type/Modal';

const props = defineProps<{
    closer: ModalCloseHandler<{ zipCode: string, road: string }>,
}>();

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
    isSearched.value = true;
}
/** VARIABLE */

/** FUNCTION */
async function fetchAddress() {
    mmon.loading.show();
    try {
        searchAddressPaginator.value = await shippingRepository.findAddress(filters.value);        
    } catch (e) {
        defaultCatch(e);
    } finally {
        mmon.loading.hide();
    }

}

async function movePage(page: number) {
    filters.value.page = page;
    await fetchAddress();
}

function setAddress(address: SearchAddress) {
    props.closer({
        zipCode: address.zipCode,
        road: address.roadAddress
    });
}
/** VUE LIFE CYCLE */

</script>


