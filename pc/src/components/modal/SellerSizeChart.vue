<template>
    <p
        v-if="isAllImageEmpty || sizeModelImageList.length === 0"
        class="mm_text-none T=sm"
    >
        <i class="ico_text-none" />
        등록된 사이즈 차트가 없습니다
    </p>
    <i v-for="image in sizeModelImageList" :key="image">
        <img
            v-lazyload="{ src: image, errorCallback: errorHandle }"
            src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
            alt=""
        >
    </i>
</template>

<script setup lang='ts'>
import { ref } from 'vue';
import { ModalCloseHandler } from '$/@type/Modal';

const props = defineProps<{
    sizeModelImageList: string[]
    closer: ModalCloseHandler<void>
}>();

const errorImageCount = ref(0);
const isAllImageEmpty = ref<boolean>(props.sizeModelImageList.length < 1)
/** VARIABLE */

/** FUNCTION */
function errorHandle() {
    errorImageCount.value = ++errorImageCount.value;
    if (errorImageCount.value === props.sizeModelImageList.length) {
        isAllImageEmpty.value = true;
    }
}
/** VUE LIFE CYCLE */

</script>
