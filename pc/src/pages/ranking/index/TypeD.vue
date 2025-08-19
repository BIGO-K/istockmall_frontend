<template>
    <div class="m_ranking T=rd">
        <!-- 타이틀 -->
        <h3 class="mm_title">
            <b>Ranking</b>
        </h3>
        <!--// 타이틀 -->
        <!-- 랭킹 gnb -->
        <div
            v-stickyRankingGnb
            class="m_ranking-gnb"
        >
            <div class="m_ranking-gnb-inner" data-horizon>
                <!-- (D) 선택된 메뉴에 'S=gnb-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
                <ul>
                    <li>
                        <MMLink 
                            :to="{ name: 'Ranking' }"
                            :class="$route.name == 'RankingMain' ? 'S=gnb-on' : ''"
                            :title="$route.name == 'RankingMain' ? '선택됨' : ''"
                        >
                            <b>랭킹 메인</b>
                        </MMLink>
                    </li>
                    <li>
                        <MMLink 
                            :to="{ name: 'RankingItem' }"
                            :class="$route.name == 'RankingItem' ? 'S=gnb-on' : ''"
                            :title="$route.name == 'RankingItem' ? '선택됨' : ''"
                        >
                            <b>아이템 랭킹</b>
                        </MMLink>
                    </li>
                    <li>
                        <MMLink 
                            :to="{ name: 'RankingBrand' }"
                            :class="$route.name == 'RankingBrand' ? 'S=gnb-on' : ''"
                            :title="$route.name == 'RankingBrand' ? '선택됨' : ''"
                        >
                            <b>브랜드 랭킹</b>
                        </MMLink>
                    </li>
                    <li>
                        <MMLink 
                            :to="{ name: 'RankingView' }"
                            :class="$route.name == 'RankingView' ? 'S=gnb-on' : ''"
                            :title="$route.name == 'RankingView' ? '선택됨' : ''"
                        >
                            <b>View 랭킹</b>
                        </MMLink>
                    </li>
                    <li>
                        <MMLink 
                            :to="{ name: 'RankingLike' }"
                            :class="$route.name == 'RankingLike' ? 'S=gnb-on' : ''"
                            :title="$route.name == 'RankingLike' ? '선택됨' : ''"
                        >
                            <b>찜 랭킹</b>
                        </MMLink>
                    </li>
                </ul>
            </div>
        </div>
        <!--// 랭킹 gnb -->
        <router-view />
    </div>
</template>

<script setup lang='ts'>
import { stickyRankingGnb as vStickyRankingGnb } from '$/directives';
import { useRoute } from 'vue-router';
import { watch } from 'vue';

const route = useRoute();
watch(route, () => {
    window.scrollTo(0,0);
})
</script>
