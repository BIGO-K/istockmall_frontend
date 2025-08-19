<template>
    <div 
        v-if="title1 || title2"
        class="mui_title"
        :class="[
            designClassName,
            positionClass
        ]"
    >
        <h3 v-if="title1" class="title_main">
            <b>{{ title1 }}</b>
        </h3>
        <h4 v-if="title2" class="title_sub">
            <b>{{ title2 }}</b>
        </h4>
    </div>
</template>

<script setup lang='ts'>
import { computed } from 'vue';

const props = defineProps<{
    title1?: string
    title2?: string
    designClassName?: string
    position?: 'default'|'center'|'right'|''
}>();

const positionClass = computed<string>(() => {
    let className = '';
    switch (props.position) {
    case 'center':
        className = 'T=center';
        break;
    case 'right':
        className = 'T=right';
        break;
    }
    return className;
})

</script>
