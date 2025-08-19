<template>
    <div :class="['mm_view', $route.meta.layouts]" :data-path="$route.path">   
        <MMHeader>
            <template #baseHeaderTitle>
                <slot name="headerTitle" />                
            </template>
        </MMHeader>
        <div id="mm_body" class="mm_page">
            <PullToRefresh />
            <slot name="contents">
                <!-- (D) 실제 내용을 추가하는 부분입니다. -->
            </slot>
            <ScrollTop :use-recent-goods="$route.meta.useRecentGoodsButton" />
        </div>  
        <MMToolbar v-if="!$route.meta.isHideToolbar" />               
        <slot name="telePortContents" />
    </div>    
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import PullToRefresh from '@/components/PullToRefresh.vue';
import ScrollTop from '@/components/ScrollTop.vue';
const MMToolbar = defineAsyncComponent(() => import('@/components/Toolbar.vue'))
</script>