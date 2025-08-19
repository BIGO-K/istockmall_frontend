<template>
    <!-- 찜 랭킹 -->
    <section id="m_ranking-like" class="mm_inner m_ranking-like">
        <template v-if="rankingLike !== null">
            <div class="m_ranking-head">
                <h3><b>찜 랭킹</b></h3>
                <!-- (D) btn_help 클릭시 .m_ranking-head-update에 'S=switch-on' 클래스가 추가되고 .m...update-tooltip 요소가 노출됩니다. -->
                <div v-if="rankingLike.hasRankRange" class="m_ranking-head-update">
                    <p class="text_update">
                        <span>{{ rankingLike.targetDate }}</span>기준
                    </p>
                    <button 
                        :class="['btn_help', { 'S=switch-on' : isActive}]" 
                        data-switch="{ '_isParent': true }" 
                        type="button"
                        @click="isActive = !isActive" 
                    >
                        <i class="ico_tooltip" />
                    </button>
                    <div
                        class="m...update-tooltip" 
                        :style="isActive ? { display: 'block'} : {}"
                    >
                        <p>전일 기준으로 랭킹 산정(매일 0시 기준, 일 1회 집계)</p>
                        <p>한 브랜드당 최대 10개의 상품만 노출됩니다.</p>
                        <p>산정기간: {{ rankingLike.rankPeriod }}</p>
                        <button
                            type="button"
                            class="btn_close"
                            onclick="this.parentElement.previousElementSibling.click();"
                        >
                            <i class="ico_close" /><b class="mm_ir-blind">닫기</b>
                        </button>
                    </div>
                </div>
            </div>
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
                                :is-show-price="false"
                                :use-wish-count-round="index > 2"
                                :is-show-nearly-soldout="false"
                                :is-show-icon="false"
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
            <div class="m_ranking-head">
                <h3><b>찜 랭킹</b></h3>
            </div>
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
import { ref } from 'vue';
    
defineProps<{
    rankingLike: RankingItem|null
}>();
const isActive = ref(false);
    
</script>
    