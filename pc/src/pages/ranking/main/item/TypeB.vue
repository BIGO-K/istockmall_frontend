<template>
    <section class="mm_inner m_ranking-item">
        <h3><b><strong>아이템</strong>랭킹</b></h3>
        <template v-if="rankingItem !== null">
            <p
                v-if="rankingItem.hasRankRange"
                class="text_update"
            >
                <span>{{ rankingItem.targetDate }}</span>기준
            </p>
            <!-- 상품리스트 -->
            <template v-if="rankingItem.goodsList && rankingItem.goodsList.length > 0">
                <!-- 아이템 랭킹 상품 -->
                <div class="mm_product-list">
                    <ol>
                        <li
                            v-for="goods in rankingItem.goodsList.slice(0, 6)"
                            :key="goods.id"
                        >
                            <mm-ranking-goods 
                                class="T=pa"
                                :goods="goods" 
                                :has-rank-range="rankingItem.hasRankRange" 
                                :use-liked-button="true" 
                            />                         
                        </li>
                    </ol>
                </div>
                <div class="mm_foot">
                    <div class="mm_btn_box">
                        <MMLink 
                            :to="{ name: 'RankingItem' }" 
                            :class="'mm_btn T=line btn_more'"
                        >
                            <b>BEST 아이템 더보기</b><i class="ico_link" />
                        </MMLink>
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
                    <li v-for="i in 6" :key="i">
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
</template>
<script setup lang='ts'>
import { RankingItem } from '$/@type/ranking';
import MmRankingGoods from '@/components/ranking/Goods.vue';

defineProps<{
    rankingItem: RankingItem|null
}>();

</script>
