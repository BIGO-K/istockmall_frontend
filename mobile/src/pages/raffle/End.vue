<template>
    <div class="mm_inner">
        <div class="m_raffle">
            <h3 class="mm_title">
                <b>RAFFLE</b><a class="btn_guide" href="#RAFFLE_GUIDE"><b class="mm_ir-blind">래플 안내</b><i class="ico_help-guide" /></a>
            </h3>
            <template v-if="isCompleteLoading">
                <template v-if="paginator.data.length > 0">
                    <!-- 래플 상품리스트 -->
                    <div class="m_raffle-list">
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
                        :page-block-count="3"
                        :current-page="paginator.currentPage"
                        :items-per-page="paginator.perPage"
                        :total-count="paginator.total"
                        @move-page-to="movePage"
                    />
                </template>
                <p v-else class="mm_text-none">
                    <i class="ico_text-none" />종료된 래플이 없습니다
                </p>
            </template>
            <div v-else class="m_raffle-list T=skeleton">
                <ul>
                    <li v-for="index in 4" :key="index">
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
            <!--// 래플 상품리스트 -->
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, defineAsyncComponent } from 'vue';
import { raffleRepository } from '$/repository/raffleRepository';
import { Raffle } from '$/@type/raffle';
import { defaultCatch } from "$/functions";
import { useRaffleModal } from '$/composables/raffleComposable';
import { mmon } from '$/helper/mmon';
import { typeCastNumber } from '$/filters';
import { useRoute, useRouter } from 'vue-router';
import { makePath } from '$/services/http';
import { Paginator } from '$/@type';

declare module "@vue/runtime-core" { 
    interface ComponentCustomProperties {
        paginator: Paginator<Raffle>;
    }
}

export default defineComponent({
    components: {
        MMPaginator: defineAsyncComponent(() => import("@/components/Paginator.vue")),
        RaffleItem: defineAsyncComponent(() => import("@/pages/raffle/Item.vue")),
    },
    async beforeRouteEnter(to, from, next) {
        try {
            const paginator = await raffleRepository.getEndedRaffleList(typeCastNumber(`${to.query.page || '1'}`), 12)
            next(vm => {
                vm.paginator = paginator;
            })
        } catch (e) {
            next();
        }
    },
    setup() {
        const route = useRoute()
        const router = useRouter()

        // 래플 목록
        const paginator = ref<Paginator<Raffle>>({
            total: 0,
            currentPage: 1,
            perPage: 12,
            data: []
        });

        // 모달 관련
        const { setRaffleId } = useRaffleModal();
        const isCompleteLoading = ref<boolean>(true);

        /**
         * 래플 목록 조회
         * @param {number} page
         */
        async function movePage(page: number) {
            isCompleteLoading.value = false
            try {
                paginator.value = await raffleRepository.getEndedRaffleList(page, paginator.value.perPage);
                router.replace(makePath(route.path, {
                    page,
                }))
            } catch (error) {
                defaultCatch(error);
            } finally {
                isCompleteLoading.value = true
            }
        }

        return {
            isCompleteLoading,
            paginator,
            movePage,
            setRaffleId,
            mmon
        }
    }
});
</script>