<template>
    <div class="mm_inner m_ranking-brand">        
        <template v-if="rankingBrand !== null">
            <div class="m_ranking-head">
                <template v-if="rankingBrand.hasRankRange">
                    <!-- (D) 현재 페이지에 맞는 정렬 button에 'S=on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
                    <ul class="m_ranking-head-sort">
                        <li>
                            <button 
                                :class="['btn_sort' , { 'S=on' : selectedRankRange === 'D' }]" 
                                :title="selectedRankRange === 'D' ? '선택됨' : ''" 
                                type="button" 
                                @click="fetchRankingBrand('D')"
                            >
                                <b>일간</b>
                            </button>
                        </li>
                        <li>
                            <button 
                                :class="['btn_sort' , { 'S=on' : selectedRankRange === 'W' }]" 
                                :title="selectedRankRange === 'W' ? '선택됨' : ''" 
                                type="button" 
                                @click="fetchRankingBrand('W')"
                            >
                                <b>주간</b>
                            </button>
                        </li>
                        <li>
                            <button 
                                :class="['btn_sort' , { 'S=on' : selectedRankRange === 'M' }]" 
                                :title="selectedRankRange === 'M' ? '선택됨' : ''" 
                                type="button"
                                @click="fetchRankingBrand('M')" 
                            >
                                <b>월간</b>
                            </button>
                        </li>
                    </ul>
                    <div class="m_ranking-head-update">
                        <!-- (D) btn_help 클릭시 .m...head-update에 'S=switch-on' 클래스가 추가되고 .m...update-tooltip 요소가 노출됩니다. -->
                        <p class="text_update">
                            <span>{{ rankingBrand.targetDate }}</span>기준
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
                            <p>산정기간: {{ rankingBrand.rankPeriod }}</p>
                            <button
                                type="button"
                                class="btn_close"
                                onclick="this.parentElement.previousElementSibling.click();"
                            >
                                <i class="ico_close" /><b class="mm_ir-blind">닫기</b>
                            </button>
                        </div>
                    </div>
                </template>
            </div>
            <!-- 브랜드 리스트 -->
            <div
                v-if="rankingBrand.brandList.length > 0"
                class="m_ranking-brand-list"
            >
                <ol>
                    <li v-for="brand in rankingBrand.brandList" :key="brand.id">
                        <MMLink
                            :to="{ name: 'GoodsBrandIndex', params: { id: brand.id } }"
                            :class="['btn_brand']"
                        >
                            <b class="text_rank">
                                <template v-if="rankingBrand.hasRankRange">
                                    <span
                                        v-if="brand.changeType === 'U'"
                                        class="text_rank-up"
                                    ><i
                                        class="ico_rank-up"
                                        title="상승"
                                    />{{ brand.changeValue }}</span>
                                    <span
                                        v-else-if="brand.changeType === 'D'"
                                        class="text_rank-down"
                                    ><i
                                        class="ico_rank-down"
                                        title="하락"
                                    />{{ brand.changeValue }}</span>
                                    <i
                                        v-else-if="brand.changeType === 'N'"
                                        class="ico_rank-new"
                                        title="신규"
                                    />
                                    <i
                                        v-else
                                        class="ico_rank-unchanged"
                                        title="변동없음"
                                    />
                                </template>
                                <template v-else>
                                    <i class="ico_rank-unchanged" title="변동없음" />
                                </template>
                            </b>
                            <b>{{ brand.name }}</b>
                        </MMLink>
                        <div class="mm_product-list">
                            <ul>
                                <li v-for="goods in (brand.goodsList || [])?.slice(0,4)" :key="goods.id">
                                    <mm-ranking-simple-goods :goods="goods" />
                                </li>
                            </ul>
                        </div>
                    </li>
                </ol>
            </div>
            <p
                v-else
                class="mm_text-none"
            >
                <i class="ico_text-none" />집계된 브랜드가 없습니다
            </p>
            <!--// 브랜드 리스트 -->
        </template>
        <template v-else>
            <div class="m_ranking-head" />
            <div class="m_ranking-brand-list">
                <ol>
                    <li v-for="i in 6" :key="i">
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
        </template>
    </div>
</template>
<script setup lang='ts'>
import { useBrandRanking } from '$/composables/rankingComposable';
import MmRankingSimpleGoods from '@/components/ranking/SimpleGoods.vue';
import { ref } from 'vue';

const {
    rankingBrand,
    selectedRankRange,
    fetchRankingBrand,
} = useBrandRanking();

const isActive = ref(false);

</script>
