<template>
    <!-- VIEW 랭킹 -->
    <section id="m_ranking-view" class="mm_inner m_ranking-view">
        <h3><b><strong>VIEW</strong>랭킹</b></h3>
        <template v-if="rankingView !== null">
            <!-- 상품리스트 -->
            <template v-if="rankingView.goodsList && rankingView.goodsList.length > 0">
                <!-- 아이템 랭킹 상품 -->
                <div class="mm_product-list T=card">
                    <ol>
                        <li v-for="goods in rankingView.goodsList.slice(0,6)" :key="goods.id">
                            <mm-ranking-goods 
                                :goods="goods" 
                                :has-rank-range="rankingView.hasRankRange" 
                                :use-react-tag="true"
                                :is-hide-all-price="true"
                                :is-show-sell-rate="false"
                                :is-show-brand-name="false"
                            />                         
                        </li>
                    </ol>
                </div>
                <div class="mm_foot">
                    <div class="mm_btn_box">
                        <div class="mm_inline">
                            <MMLink
                                :to="{ name: 'RankingView' }" 
                                :class="'mm_btn T=sm T=line btn_more'"
                            >
                                <b>BEST VIEW 더보기</b><i class="ico_link" />
                            </MMLink>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else>
                <p class="mm_text-none">
                    <i class="ico_text-none" />집계된 상품이 없습니다
                </p>
            </template>
            <!--// 상품리스트 -->
        </template>
        <template v-else>
            <div class="mm_product-list T=card T=skeleton">
                <ol>
                    <li v-for="i in 10" :key="i">
                        <div class="mm_product-item">
                            <i class="image_product" />
                            <div class="mm_product-item-info">
                                <p class="text_brand" />
                                <p class="text_product" />
                                <p class="text_price" />
                            </div>
                        </div>
                    </li>
                </ol>
            </div>
        </template>
    </section>
    <!--// VIEW 랭킹 -->
</template>
<script setup lang='ts'>
import { RankingItem } from '$/@type/ranking';
import MmRankingGoods from '@/components/ranking/Goods.vue';
    
defineProps<{
    rankingView: RankingItem|null
}>();
    
</script>
    