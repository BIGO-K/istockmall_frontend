<template>
    <div class="mm_toolbar T=tb">
        <ul class="mm_flex T=equal">
            <li>
                <MMLink :to="{ name: 'Main' }">
                    <i class="ico_home-full" />
                    <b class="mm_ir-blind">홈</b>
                </MMLink>
            </li>
            <li>
                <MMLink :to="{ name: 'Sidebar' }">
                    <i class="ico_menu" />
                    <b class="mm_ir-blind">카테고리</b>
                </MMLink>
            </li>
            <li>
                <MMLink :to="{ name: 'Search'}">
                    <i class="ico_search" />
                    <b class="mm_ir-blind">검색</b>
                </MMLink>
            </li>
            <li>
                <MMLink :to="{ name: 'Mypage' }">
                    <i class="ico_mypage" />
                    <b class="mm_ir-blind">마이페이지</b>
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
                    <b class="mm_ir-blind">최근본상품</b>
                </MMLink>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">

withDefaults(defineProps<{
    mainThumbnailUrl: string
}>(), {
    mainThumbnailUrl: '',
});

</script>
<style>
:root {
    --toolbar_height_base: 42px;
}
</style>