<template>
    <!-- 찜 랭킹 -->
    <section id="m_ranking-like" class="mm_inner m_ranking-like">
        <h3><b><strong>찜</strong>랭킹</b></h3>
        <template v-if="rankingLike !== null">
            <!-- 상품리스트 -->
            <template v-if="rankingLike.goodsList && rankingLike.goodsList.length > 0">
                <!-- 아이템 랭킹 상품 -->
                <div class="mm_product-list">
                    <ol>
                        <li v-for="(goods, index) in rankingLike.goodsList.slice(0,7)" :key="goods.id">
                            <mm-ranking-goods
                                :goods="goods" 
                                :has-rank-range="rankingLike.hasRankRange" 
                                :is-show-wish-count="true"
                                :use-wish-count-round="index > 2"
                            />                         
                        </li>
                    </ol>
                </div>
                <div class="mm_foot">
                    <div class="mm_btn_box">
                        <div class="mm_inline">
                            <MMLink 
                                :to="{ name: 'RankingLike' }" 
                                :class="'mm_btn T=sm T=line btn_more'"
                            >
                                <b>BEST 찜 더보기</b><i class="ico_link" />
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
            <div class="mm_product-list T=skeleton">
                <ol>
                    <li v-for="i in 7" :key="i">
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
    <!--// 찜 랭킹 -->
</template>
<script setup lang='ts'>
import { RankingItem } from '$/@type/ranking';
import MmRankingGoods from '@/components/ranking/Goods.vue';
    
defineProps<{
    rankingLike: RankingItem|null
}>();
    
</script>
    