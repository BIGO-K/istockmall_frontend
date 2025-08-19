
<template>
    <!-- 아이템 랭킹 -->
    <MMItemRanking :ranking-item="rankingItem" />
    <!--// 아이템 랭킹 -->

    <!-- 브랜드 랭킹 -->
    <MMBrandRanking :ranking-brand="rankingBrand" />
    <!--// 브랜드 랭킹 -->

    <!-- VIEW 랭킹 -->
    <MMViewRanking :ranking-view="rankingView" />
    <!--// VIEW 랭킹 -->

    <!-- 찜 랭킹 -->
    <MMLikeRanking :ranking-like="rankingLike" />
    <!--// 찜 랭킹 -->
</template>


<script setup lang="ts">
import { RankingItem,RankingBrand } from '$/@type/ranking';
import MMItemRanking from '@/pages/ranking/main/item/TypeB.vue';
import MMBrandRanking from '@/pages/ranking/main/brand/TypeB.vue';
import MMViewRanking from '@/pages/ranking/main/view/TypeB.vue';
import MMLikeRanking from '@/pages/ranking/main/like/TypeB.vue';
defineProps<{
    rankingItem: RankingItem;
    rankingBrand: RankingBrand;
    rankingView: RankingItem;
    rankingLike: RankingItem;
}>();
</script>