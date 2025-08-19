<template>
    <div v-for="group in groups" :key="group.id" class="m_showcase-detail-product">
        <i class="image_banner">
            <img 
                v-lazyload="{ src: group.mobileImageUrl }" 
                src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                :alt="group.mobileImageAlt"
            >
        </i>
        <div class="mm_scroller T=x">
            <div class="mm_product-list T=card">
                <ul>
                    <li v-for="goods in group.goodsList" :key="goods.id">
                        <MmGoods
                            :goods="goods"
                            :use-react-tag="false"
                            :use-liked-button="true"
                        />
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ShowcaseGoodsGroup } from '$/@type/showcase';

withDefaults(defineProps<{
    groups: ShowcaseGoodsGroup[]
}>(), {
    groups: () => []
})

</script>
