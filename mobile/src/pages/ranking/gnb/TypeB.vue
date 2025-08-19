<template>
    <!-- 랭킹gnb -->
    <div
        ref="rankingGnb"
        class="m_ranking-gnb"
        :class="isStickyGnb ? 'S=gnb-sticky' : ''"
    >
        <div class="m_ranking-gnb-inner">
            <!-- (D) 선택된 메뉴에 'S:gnb-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
            <ul>
                <li>
                    <MMLink 
                        :to="{ name: 'Ranking' }"
                        :class="$route.name == 'RankingMain' ? 'S=gnb-on' : ''"
                        :title="$route.name == 'RankingMain' ? '선택됨' : ''"
                    >
                        <i class="ico_ranking-home" />
                        <b class="mm_ir-blind">메인</b>
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
    </div>
    <!--// 랭킹gnb -->
</template>

<script setup lang='ts'>
import { usePageContext } from '$/composables/pageHandler/contextComposable';
import { mmon } from '$/helper/mmon';
import { useEventListener } from '@vueuse/core';
import { onMounted, ref } from 'vue';

const { header } = usePageContext();
const gnb = ref<HTMLElement|null>(document.querySelector('.mm_gnb'))
const rankingGnb = ref<HTMLElement|null>();
const isStickyGnb = ref<boolean>(false);

function scrollHandler() {
    if (!rankingGnb.value) {
        return
    }

    if (!gnb.value) {
        return gnb.value = document.querySelector('.mm_gnb');
    }

    if (header.element.value == null) {
        return header.refresh();
    }

    const offsetTop = mmon.scroll.position(header.element.value).top + header.element.value.offsetHeight + gnb.value.offsetHeight;
    const position = rankingGnb.value.getBoundingClientRect().top + rankingGnb.value.offsetHeight;
    isStickyGnb.value = position < offsetTop;
}

onMounted(() => {
    const scroller = mmon.scroll.find();
    scrollHandler();
    useEventListener(scroller, 'scroll', scrollHandler)
})
</script>
