<template>
    <h3 class="mm_title">
        <strong>브랜드 </strong><b>랭킹</b>
    </h3>
    <div class="mm_inner m_ranking-brand">        
        <template v-if="rankingBrand !== null">
            <div class="m_ranking-head">
                <template v-if="rankingBrand.hasRankRange">
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
                </template>
            </div>
            <!-- 브랜드 리스트 -->
            <div
                v-if="rankingBrand.brandList.length > 0"
                class="m_ranking-brand-list"
            >
                <ol>
                    <li v-for="brand in rankingBrand.brandList" :key="brand.id">
                        <mm-ranking-brand 
                            :brand="brand" 
                            :has-rank-range="rankingBrand.hasRankRange"
                        />
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
                    <li v-for="i in 4" :key="i">
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
        </template>
    </div>
</template>
<script setup lang='ts'>
import { useBrandRanking } from '$/composables/rankingComposable';
import MmRankingBrand from '@/components/ranking/Brand.vue';
import { ref } from 'vue';

const {
    rankingBrand,
    selectedRankRange,
    fetchRankingBrand,
} = useBrandRanking();

const isActive = ref(false);

</script>
