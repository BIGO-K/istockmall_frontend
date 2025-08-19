<template>
    <div class="mm_inner">
        <div class="m_raffle T=ra">
            <h3 class="mm_title">
                <b>RAFFLE</b><a class="btn_guide" href="#RAFFLE_GUIDE"><b class="mm_ir-blind">래플 안내</b><i class="ico_help-guide" /></a>
            </h3>
            <!-- 래플 상품리스트 -->
            <template v-if="raffles.length > 0">
                <div class="m_raffle-list">
                    <ul>
                        <li v-for="raffle in raffles" :key="raffle.id">
                            <RaffleItem
                                :raffle="raffle"
                            />
                        </li>
                    </ul>
                </div>
                <div class="mm_btn_box">
                    <div class="mm_inline">
                        <MMLink :to="{ name: 'RaffleEnd' }" class="btn_more">
                            <b>종료된 래플 전체보기</b><i class="ico_link" />
                        </MMLink>
                    </div>
                </div>
            </template>
            <p v-else class="mm_text-none">
                <i class="ico_text-none" />등록된 래플이 없습니다
            </p>
            <!--// 래플 상품리스트 -->
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, defineAsyncComponent } from 'vue';
import { raffleRepository } from '$/repository/raffleRepository';
import { Raffle } from '$/@type/raffle';
import { usePageTitleSetting } from '$/composables/seoComposable';

declare module "@vue/runtime-core" { 
    interface ComponentCustomProperties {
        raffles: Raffle[]
    }
}
export default defineComponent({
    components: {
        MMLink: defineAsyncComponent(() => import("@/components/MMLink.vue")),
        RaffleItem: defineAsyncComponent(() => import("@/pages/raffle/Item.vue")),
    },
    async beforeRouteEnter(to, from, next) {
        try {
            const raffles = await raffleRepository.getRaffleList()

            next(vm => {
                vm.raffles = raffles
            })
        } catch (e) {
            next();
        }
    },
    setup() {
        usePageTitleSetting('래플');

        // 래플 목록
        const raffles = ref<Raffle[]>([]);

        return {
            raffles,
        }
    }
});
</script>