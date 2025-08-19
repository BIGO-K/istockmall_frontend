<template>   
    <div :class="['mm_view', $route.meta.layouts]">   
        <MMHeader>
            <template #baseHeaderTitle>
                <slot name="headerTitle" />                
            </template>
        </MMHeader>
        <div id="mm_body" class="mm_page">
            <slot name="contents">
                <!-- (D) 실제 내용을 추가하는 부분입니다. -->
            </slot>
            <ScrollTop />
        </div>
    </div>
</template>


