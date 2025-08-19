<template>
    <template v-if="hasRanking">
        <TypeB
            v-if="rankingType === 'B'"
            :ranking-item="rankingItem"
            :ranking-brand="rankingBrand"
            :ranking-view="rankingView"
            :ranking-like="rankingLike"
        />
        <TypeD 
            v-if="rankingType === 'D'"
            :ranking-item="rankingItem"
            :ranking-brand="rankingBrand"
            :ranking-view="rankingView"
            :ranking-like="rankingLike"
        />
        <TypeA 
            v-else
            :ranking-item="rankingItem"
            :ranking-brand="rankingBrand"
            :ranking-view="rankingView"
            :ranking-like="rankingLike"
        />
    </template>
    <template v-else>
        <p class="mm_text-none">
            <i class="ico_text-none" />집계된 항목이 없습니다
        </p>
    </template>
</template>


<script lang="ts">
import { LikedGoods } from '$/@type/shopping';
import { RankingItem,RankingBrand } from '$/@type/ranking';
import { rankingRepository } from '$/repository/rankingRepository';
import { shoppingRepository } from '$/repository/shoppingRepository';
import { computed, defineComponent, ref } from 'vue'
import TypeA from '@/pages/ranking/main/TypeA.vue';
import TypeB from '@/pages/ranking/main/TypeB.vue';
import TypeD from '@/pages/ranking/main/TypeD.vue';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { useGlobalConfigStore } from '$/store/globalConfig';
import { InitialSettings } from '$/@type/configs';
declare module "@vue/runtime-core" { 
    interface ComponentCustomProperties {
        rankingType: InitialSettings['design']['pcRankingType']
        hasRanking: RankingItem|RankingBrand;
        rankingItem: RankingItem;
        rankingBrand: RankingBrand;
        rankingView: RankingItem;
        rankingLike: RankingItem;
    }
}
export default defineComponent({
    components: {
        TypeA,
        TypeB,
        TypeD,
    },
    async beforeRouteEnter(to, from, next) {
        try {
            const { rankingMain, goodsIds } = await rankingRepository.getRankingMain()
            await shoppingRepository.getRelationLikedGoods(goodsIds)
            next(vm => {
                vm.hasRanking = rankingMain.rankingItem || rankingMain.rankingItem || rankingMain.rankingView || rankingMain.rankingLike
                vm.rankingItem = rankingMain.rankingItem
                vm.rankingBrand = rankingMain.rankingBrand
                vm.rankingView = rankingMain.rankingView
                vm.rankingLike = rankingMain.rankingLike
            })
        } catch (e) {
            return next();
        }
    },
    setup() {
        usePageTitleSetting('랭킹');
        let hasRanking = true;
        const { globalConfigs } = useGlobalConfigStore();
        const rankingType = computed<InitialSettings['design']['mobileRankingType']>(() => globalConfigs.design.mobileRankingType);
        const rankingItem = ref<RankingItem|null>(null); // 아이템 랭킹
        const rankingBrand = ref<RankingBrand|null>(null); // 브랜드 랭킹
        const rankingView = ref<RankingItem|null>(null); // VIEW 랭킹
        const rankingLike = ref<RankingItem|null>(null); // 찜 랭킹
        const likedGoodsRelations = ref<LikedGoods[]>([]); // 찜한 상품
        return {
            rankingType,
            hasRanking,
            rankingItem,
            rankingBrand,
            rankingView,
            rankingLike,
            likedGoodsRelations
        }
    }
});
</script>