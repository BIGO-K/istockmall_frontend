<template>
    <MMLink v-if="link" :to="link" class="btn_link">
        <b>{{ label || '더보기' }}</b><i class="uico_link" />
    </MMLink>
</template>

<script setup lang='ts'>
import { toRefs } from 'vue';

const props = defineProps<{
    link: string
    label: string
}>();

const { link, label } = toRefs(props);

</script>
