<template>
    <div class="m_prodetail-thumbnail">
        <i class="image_thumbnail">
            <img
                v-lazyload="{ 'src': currentSelectedImageUrl }"
                src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                alt=""
            >
        </i>
        <div class="m_prodetail-thumbnail-list">
            <ul class="mm_flex T=equal">
                <li
                    v-for="imageUrl in imageUrls"
                    :key="imageUrl"
                >
                    <button 
                        type="button" 
                        :class="['btn_thumbnail', {'S=thumbnail-on' : currentSelectedImageUrl === imageUrl } ]" 
                        @click="() => { currentSelectedImageUrl = imageUrl }"
                    >
                        <i
                            v-lazyload="{ src : imageUrl }"
                            class="mm_bg-cover"
                        />
                    </button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { ModalCloseHandler } from '$/@type/Modal';
import { ref } from 'vue';

const props = defineProps<{
    imageUrls: string[],
    selectedImageUrl: string,
    closer: ModalCloseHandler<void>,
}>();

/** VARIABLE */
const currentSelectedImageUrl = ref<string>(props.selectedImageUrl);

/** FUNCTION */

/** VUE LIFE CYCLE */

</script>
