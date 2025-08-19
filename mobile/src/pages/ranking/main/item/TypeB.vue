<template>
    <!-- 아이템 랭킹 -->
    <section id="m_ranking-item" class="mm_inner m_ranking-item">
        <h3><b>아이템 랭킹</b></h3>
        <template v-if="rankingItem !== null">
            <!-- 상품리스트 -->
            <template v-if="rankingItem.goodsList && rankingItem.goodsList.length > 0">
                <!-- 아이템 랭킹 상품 -->
                <div class="mm_product-list T=card">
                    <ol>
                        <li v-for="goods in rankingItem.goodsList.slice(0,5)" :key="goods.id">     
                            <mm-ranking-goods
                                :has-rank-range="rankingItem.hasRankRange" 
                                :goods="goods" 
                                :use-liked-button="true" 
                                :use-react-tag="true"
                                :is-show-price="false"
                            />
                        </li>
                    </ol>
                </div>
                <div class="mm_foot">
                    <div class="mm_btn_box">
                        <div class="mm_inline">
                            <MMLink 
                                :to="{ name: 'RankingItem' }" 
                                :class="'mm_btn T=sm T=line btn_more'"
                            >
                                <b>BEST 아이템 더보기</b><i class="ico_link" />
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
                    <li v-for="i in 5" :key="i">
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
    <!--// 아이템 랭킹 -->
</template>
<script setup lang='ts'>
import { RankingItem } from '$/@type/ranking';
import MmRankingGoods from '@/components/ranking/Goods.vue';
    
defineProps<{
    rankingItem: RankingItem|null
}>();
    
</script>
    