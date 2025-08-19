<template>
    <nav class="mm_gnb-menu">
        <div class="mm_gnb-inner">
            <!-- (D) 현재페이지의 a 요소에 "S=on" 클래스와 "선택됨" 타이틀을 추가합니다. -->
            <ul class="mm_flex">
                <!-- (D) 텍스트 볼드 스타일이 필요한 메뉴는 a태그 안에 strong태그로 감싸줍니다. -->
                <li v-if="isUseRanking">
                    <MMLink
                        :class="{'S=on' : $route.name?.toString().startsWith('Ranking')}"
                        :to="{ name: 'RankingItem'}"
                    >
                        <strong>랭킹</strong>
                    </MMLink>
                </li>
                <li v-else>
                    <MMLink
                        :class="{'S=on' : $route.name === 'Best' }"
                        :to="{ name: 'Best' }"
                    >
                        <strong>베스트</strong>
                    </MMLink>                                
                </li>
                <li v-for="spotTheme in spotThemes" :key="spotTheme.id">
                    <MMLink
                        v-if="!spotTheme.isUseUrl"
                        class="T=gnb-highlight"
                        :class="{'S=on' : $route.name === 'SpotTheme' && $route.params.id === `${spotTheme.id}` }"
                        :to="{ name: 'SpotTheme', params: { id: spotTheme.id } }"
                    >
                        <strong>{{ spotTheme.name }}</strong>
                    </MMLink>
                    <MMLink
                        v-else
                        :class="spotTheme.url === $route.path ? 'S=on' : ''"
                        :to="spotTheme.url"
                    >
                        <strong>{{ spotTheme.name }}</strong>
                    </MMLink>
                </li>                           
            </ul>
        </div>
    </nav>
    <!--// 메뉴 -->

    <!-- 사이드메뉴 -->
    <div class="mm_gnb-side">
        <ul class="mm_flex">
            <!-- 
                <li><a href="#" data-href="{ '_type': 'link' }"><strong>추가메뉴4</strong></a></li>
                <li><a href="#" data-href="{ '_type': 'link' }"><strong>추가메뉴5</strong></a></li> 
            -->
        </ul>
    </div>
    <!--// 사이드메뉴 -->
</template>

<script setup lang='ts'>
import { useGnbMenu } from '$/composables/globalConfigComposable';

/** VARIABLE */

const {
    isUseCodyShot,
    isUseShowcase,
    isUseSpecialEvent,
    isUseRanking,
    isUseRaffle,
    isUseJointPurchase,
    spotThemes,
} = useGnbMenu();
        
/** FUNCTION */

/** VUE LIFE CYCLE */

</script>