<template>
    <div class="mm_toolbar T=ta">
        <ul class="mm_flex T=equal">           
            <li>
                <MMLink :to="{ name: 'Sidebar' }">
                    <i class="ico_menu" />
                    <b>카테고리</b>
                </MMLink>
            </li>
            <li>
                <MMLink :to="{ name: 'Search'}">
                    <i class="ico_search" />
                    <b>검색</b>
                </MMLink>
            </li>
            <li>
                <a href="#" @click.prevent="goMain()">
                    <i class="ico_home" />
                    <b class="mm_ir-blind">홈</b>
                </a>
            </li>
            <li>
                <MMLink :to="{ name: 'Mypage' }">
                    <i class="ico_mypage" />
                    <b>마이페이지</b>
                </MMLink>
            </li>
            <li>
                <MMLink :to="{ name: 'RecentViewGoods' }">
                    <!-- (D) 최근본상품이 있을 때 노출합니다. -->
                    <i
                        v-if="mainThumbnailUrl !== ''" 
                        class="mm_bg-cover image_recent" 
                        :style="`background-image:url('${mainThumbnailUrl}')`"
                    />
                    <i v-else class="ico_recent" />
                    <b>최근본상품</b>
                </MMLink>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

withDefaults(defineProps<{
    mainThumbnailUrl: string
}>(), {
    mainThumbnailUrl: '',
});

const router = useRouter();

function goMain() {
    if (router.currentRoute.value.path === '/') {
        router.go(0);
    }

    router.push('/');
}

</script>

<style>
:root {
    --toolbar_height_base: 51px;
}
</style>