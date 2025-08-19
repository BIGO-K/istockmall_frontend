<template>
    <!-- 브랜드 랭킹 -->
    <section id="m_ranking-brand" class="mm_inner m_ranking-brand">
        <h3><b><strong>브랜드</strong>랭킹</b></h3>
        <template v-if="rankingBrand !== null && rankingBrand.brandList.length > 0">
            <p v-if="rankingBrand.hasRankRange" class="text_update">
                <span>{{ rankingBrand.targetDate }}</span>기준
            </p>
            <!-- 브랜드리스트 -->
            <div class="m_ranking-brand-list">
                <ol>
                    <li v-for="brand in rankingBrand.brandList" :key="brand.id">
                        <mm-ranking-brand 
                            :brand="brand" 
                            :has-rank-range="rankingBrand.hasRankRange"
                        />
                    </li>
                </ol>
            </div>
            <!--// 브랜드리스트 -->
            <div class="mm_foot">
                <div class="mm_btn_box">
                    <div class="mm_inline">
                        <MMLink 
                            :to="{ name: 'RankingBrand' }" 
                            :class="'mm_btn T=sm T=line btn_more'"
                        >
                            <b>BEST 브랜드 더보기</b><i class="ico_link" />
                        </MMLink>
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <p class="mm_text-none">
                <i class="ico_text-none" />집계된 브랜드가 없습니다
            </p>
        </template>
    </section>
    <!--// 브랜드 랭킹 -->
</template>
<script setup lang='ts'>
import { RankingBrand } from '$/@type/ranking';
import MmRankingBrand from '@/components/ranking/Brand.vue';
    
defineProps<{
    rankingBrand: RankingBrand|null
}>();
    
</script>
    