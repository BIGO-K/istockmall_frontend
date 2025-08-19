<template>
    <!-- 랭킹gnb -->
    <div class="m_ranking-gnb">
        <!-- (D) 선택된 메뉴에 'S:gnb-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
        <ul class="mm_flex T=auto">
            <li>
                <MMLink 
                    :to="{ name: 'Ranking' }"
                    :class="$route.name == 'RankingMain' ? 'S=gnb-on' : ''"
                    :title="$route.name == 'RankingMain' ? '선택됨' : ''"
                >
                    <b>메인</b>
                </MMLink>
            </li>
            <li>
                <MMLink 
                    :to="{ name: 'RankingItem' }"
                    :class="$route.name == 'RankingItem' ? 'S=gnb-on' : ''"
                    :title="$route.name == 'RankingItem' ? '선택됨' : ''"
                >
                    <b>아이템</b>
                </MMLink>
            </li>
            <li>
                <MMLink 
                    :to="{ name: 'RankingBrand' }"
                    :class="$route.name == 'RankingBrand' ? 'S=gnb-on' : ''"
                    :title="$route.name == 'RankingBrand' ? '선택됨' : ''"
                >
                    <b>브랜드</b>
                </MMLink>
            </li>
            <li>
                <MMLink 
                    :to="{ name: 'RankingView' }"
                    :class="$route.name == 'RankingView' ? 'S=gnb-on' : ''"
                    :title="$route.name == 'RankingView' ? '선택됨' : ''"
                >
                    <b>View</b>
                </MMLink>
            </li>
            <li>
                <MMLink 
                    :to="{ name: 'RankingLike' }"
                    :class="$route.name == 'RankingLike' ? 'S=gnb-on' : ''"
                    :title="$route.name == 'RankingLike' ? '선택됨' : ''"
                >
                    <b>찜</b>
                </MMLink>
            </li>
        </ul>
    </div>
    <!--// 랭킹gnb -->
</template>

<script setup lang='ts'>

</script>
