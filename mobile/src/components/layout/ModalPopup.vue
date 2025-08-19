<template>
    <div :class="['mm_view', 'L=popup']">
        <MMHeader :is-popup="true">
            <template #baseHeaderTitle>
                <slot name="headerTitle" />
            </template>
        </MMHeader>
        <div class="mm_page">
            <slot name="contents">
                <!-- (D) 실제 내용을 추가하는 부분입니다. -->
            </slot>
            <ScrollTop />
        </div>
    </div>
</template>
<script setup lang="ts">

</script>


