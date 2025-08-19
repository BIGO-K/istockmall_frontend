<template>
    <section class="m_ranking-brand">
        <h3><b><strong>브랜드</strong>랭킹</b></h3>
        <template v-if="rankingBrand !== null">
            <template v-if="rankingBrand.brandList.length > 0">
                <div class="mm_inner">
                    <p
                        v-if="rankingBrand.hasRankRange"
                        class="text_update"
                    >
                        <span>{{ rankingBrand.targetDate }}</span>기준
                    </p>
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
                </div>
                <div class="mm_foot">
                    <div class="mm_btn_box">
                        <MMLink 
                            :to="{ name: 'RankingBrand' }" 
                            :class="'mm_btn T=line btn_more'"
                        >
                            <b>BEST 브랜드 더보기</b><i class="ico_link" />
                        </MMLink>
                    </div>
                </div>
            </template>
            <template v-else>
                <p class="mm_text-none">
                    <i class="ico_text-none" />집계된 브랜드가 없습니다
                </p>
            </template>
        </template>
        <template v-else>
            <div class="mm_inner">
                <div class="m_ranking-brand-list">
                    <ol>
                        <li v-for="i in 8" :key="i">
                            <p class="text_rank" />
                            <div class="mm_product-list T=skeleton">
                                <ul>
                                    <li v-for="j in 4" :key="j">
                                        <div class="mm_product-item">
                                            <i class="image_product" />
                                            <div class="mm_product-item-info">
                                                <p
                                                    class="text_price"
                                                    style="float: right;"
                                                />
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ol>
                </div>
            </div>
        </template>
    </section>
</template>
<script setup lang='ts'>
import { RankingBrand } from '$/@type/ranking';
import MmRankingBrand from '@/components/ranking/Brand.vue';

defineProps<{
    rankingBrand: RankingBrand|null
}>();

</script>
