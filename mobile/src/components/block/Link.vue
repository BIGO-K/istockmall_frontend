<template>
    <MMLink v-if="link" :to="link" class="btn_link">
        <b>{{ label || '더보기' }}</b><i class="uico_link" />
    </MMLink>
</template>

<script setup lang='ts'>

defineProps<{
    link: string
    label: string
}>();

</script>
