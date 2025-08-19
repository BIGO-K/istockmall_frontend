<template>
    <ModalPopup v-if="giveaway && isPaginatorLoaded">
        <template #headerTitle>
            <h1><b>사은품 지급 대상{{ giveawayId }}</b></h1>
        </template>

        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="m_popup-gift-target">
                            <div class="mm_gift-item">
                                <figure>
                                    <i class="mm_bg-cover image_gift" v-lazyload="{ src: giveaway.imageUrl }"></i>
                                    <figcaption>
                                        <p class="text_name">{{ giveaway.name }}</p>
                                        <p class="text_condition">{{ giveaway.conditionLabel }}</p>
                                        <p class="text_date">
                                            {{ MMFilters.formatDate((giveaway.startAt || '').toString(), 'YYYY.MM.DD') }} ~ 
                                            {{ MMFilters.formatDate((giveaway.endAt || '').toString(), 'YYYY.MM.DD') }}
                                        </p>
                                    </figcaption>
                                </figure>
                            </div>
                            <table v-if="giveawayGoodsPaginator.total > 0">
                                <colgroup>
                                    <col style="width:74px;">
                                    <col style="width:32%;">
                                    <col>
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th scope="col"><b>상품</b></th>
                                        <th scope="col"><b>브랜드명</b></th>
                                        <th scope="col"><b>상품명</b></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    
                                    <tr v-for="goods in giveawayGoodsPaginator.data">
                                        <td><i class="mm_bg-cover image_product" v-lazyload="{ src: goods.thumbnailUrl }"></i></td>
                                        <td><b>{{ goods.brandName }}</b></td>
                                        <td><p class="text_product">{{ goods.name }}</p></td>
                                    </tr>
                                </tbody>
                            </table>
                            <!-- 페이지네이션 -->
                            <!-- (D) 현재 페이지의 메뉴에 'S=page-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
                            <MMPaginator
                                :pageBlockType="'group'"
                                :pageBlockCount="3"
                                :currentPage="giveawayGoodsPaginator.currentPage"
                                :itemsPerPage="giveawayGoodsPaginator.perPage"
                                :totalCount="giveawayGoodsPaginator.total"
                                @movePageTo="movePage"
                            />
                            <!--// 페이지네이션 -->
                        </div>
                    </div>
                    <!--// 본문 -->
                </div>
            </div>
        </template>
    </ModalPopup>
</template>

<script setup lang="ts">
import { Paginator } from '$/@type';
import { GiveAway, GiveAwayGoods } from '$/@type/goods';
import { useGiveawayTargetModal } from '$/composables/orderComposable';
import { defaultCatch } from '$/functions';
import { shoppingRepository } from '$/repository/shoppingRepository';
import ModalPopup from '@/components/layout/ModalPopup.vue';
import MMPaginator from '@/components/Paginator.vue';
import { ref, onMounted } from 'vue';

const { giveawayId } = useGiveawayTargetModal();

const giveaway = ref<GiveAway|null>(null);
const giveawayGoodsPaginator = ref<Paginator<GiveAwayGoods>>({
    total: 0,
    currentPage: 1,
    perPage: 5,
    data: []
});
const isPaginatorLoaded = ref<boolean>(false);

const filters = ref<{
    page: number;
    pageSize: number
}> ({
    page: 1,
    pageSize: 5
});


async function movePage(page: number) {
    filters.value.page = page;
    fetchGoods();
}

// 사은품 타겟 조회
async function fetchGoods() {
    try {
        giveawayGoodsPaginator.value = await shoppingRepository.getGiveawayOnGoods(
            giveawayId.value, 
            filters.value.page, 
            filters.value.pageSize
        );
    } catch (e) {
        defaultCatch(e)
    }
}

onMounted(async() => {
    giveaway.value = await shoppingRepository.getGiveawayDetail(giveawayId.value);
    await fetchGoods();
    isPaginatorLoaded.value = true;
});
</script>