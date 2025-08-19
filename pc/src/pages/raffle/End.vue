<template>
    <div class="mm_page-content">
        <div class="mm_inner">
            <div class="m_raffle">
                <h3 class="mm_title">
                    <b>종료된 래플</b>
                </h3>
                <div v-if="!isCompleteLoading" class="mm_product-list T=skeleton m_raffle-list">
                    <ul>
                        <li v-for="index in 7" :key="index">
                            <div class="mm_product-item">
                                <i class="image_product" />
                                <div class="mm_product-item-info">
                                    <p class="text_brand" />
                                    <p class="text_product" />
                                    <p class="text_price" />
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <!-- 종료된 래플 상품리스트 -->
                <template v-else-if="isCompleteLoading && paginator.data.length > 0">
                    <div class="mm_product-list m_raffle-list">
                        <ul>
                            <li v-for="raffle in paginator.data" :key="raffle.id">
                                <RaffleItem
                                    :raffle="raffle"
                                />
                            </li>
                        </ul>
                    </div>
                    <MMPaginator
                        :page-block-type="'group'"
                        :page-block-count="10"
                        :current-page="paginator.currentPage"
                        :items-per-page="paginator.perPage"
                        :total-count="paginator.total"
                        @move-page-to="fetch"
                    />
                </template>
                <p v-else class="mm_text-none">
                    <i class="ico_text-none" />종료된 래플이 없습니다
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { raffleRepository } from "$/repository/raffleRepository";
import { Raffle } from "$/@type/raffle";
import { onMounted, ref } from "vue";
import { defaultCatch } from "$/functions";
import { mmon } from '$/helper/mmon';
import { typeCastNumber } from "$/filters";
import { useRoute, useRouter } from "vue-router";
import { makePath } from "$/services/http";
import Winners from '@/components/modal/raffle/Winners.vue';
import MMPaginator from '@/components/Paginator.vue';
import { useModal } from '$/composables/pageHandler/modalComposable';
import { Paginator } from "$/@type";
import RaffleItem from '@/pages/raffle/Item.vue';

const route = useRoute()
const router = useRouter()
/** VARIABLE */
const paginator = ref<Paginator<Raffle>>({
    total: 0,
    currentPage: 1,
    perPage: 12,
    data: [],
});

const isCompleteLoading = ref<boolean>(false);

/** FUNCTION */
/**
 * 래플 목록 조회
 *
 * @param {number} page
 */
async function fetch(page = 1) {
    try {
        mmon.loading.show();
        paginator.value = await raffleRepository.getEndedRaffleList(page, paginator.value.perPage);
        router.replace(makePath(route.path, {
            page,
        }))
    } catch (error) {
        defaultCatch(error);
    } finally {
        mmon.loading.hide();
    }
}

async function openWinnersModal(raffle: Raffle) {
    try {
        const winners = await raffleRepository.getWinners(raffle.id);
        useModal().open(Winners, {
            title: '당첨자 보기',
            itemClass: 'm_modal-raffle-winner',
            name: 'Winner',
            props: {
                winners
            }
        });
    } catch(e) {
        defaultCatch(e);
    }
}
/** VUE LIFE CYCLE */
onMounted(async () => {
    try {
        await fetch(typeCastNumber(route.query.page || 1))
        isCompleteLoading.value = true;
    } catch (error) {
        defaultCatch(error);
    }
});

</script>