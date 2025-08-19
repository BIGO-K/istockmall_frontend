<template>
    <!-- 브레드크럼 -->
    <div class="m_prodetail-head-breadcrumb">
        <ol>
            <li><a href="#"><b>홈</b></a><i class="ico_depth" /></li>
            <li>
                <div :class="['mm_dropdown', { 'S=on' : depth1CategoryOn }]">
                    <button 
                        type="button" 
                        class="btn_dropdown" 
                        :title="depth1CategoryOn ? '접어놓기' : '펼쳐보기'" 
                        @click="depth1CategoryToggle()"
                    >
                        <b>{{ categoryLabel.depth1 }}</b><i class="ico_dropdown T=bold" />
                    </button>
                    <div class="mm_dropdown-item" :style="depth1CategoryOn ? { height: 'auto'} : {}">
                        <div class="mm_dropdown-item-inner">
                            <ul>
                                <li v-for="cate in categories" :key="cate.code">
                                    <MMLink
                                        :to="{ name: 'GoodsCategoryIndex', params: { id : cate.code }}"
                                    >
                                        <b>{{ cate.name }}</b>
                                    </MMLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <i class="ico_depth" />
            </li>
            <li>
                <div :class="['mm_dropdown', { 'S=on' : depth2CategoryOn }]">
                    <button 
                        type="button" 
                        class="btn_dropdown"
                        :title="depth2CategoryOn ? '접어놓기' : '펼쳐보기'" 
                        @click="depth2CategoryToggle()"
                    >
                        <b>{{ categoryLabel.depth2 }}</b><i class="ico_dropdown T=bold" />
                    </button>
                    <div class="mm_dropdown-item" :style="depth2CategoryOn ? { height: 'auto'} : {}">
                        <div class="mm_dropdown-item-inner">
                            <ul>
                                <li v-for="depth2 in (currentCategory1?.childCategoryList || [])" :key="depth2.code"> 
                                    <MMLink
                                        :to="{ name: 'GoodsCategoryIndex', params: { id : depth2.code }}"
                                    >
                                        <b>{{ depth2.name }}</b>
                                    </MMLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <i class="ico_depth" />
            </li>
            <li>
                <div :class="['mm_dropdown', { 'S=on' : depth3CategoryOn }]">
                    <button
                        type="button" 
                        class="btn_dropdown"
                        :title="depth3CategoryOn ? '접어놓기' : '펼쳐보기'" 
                        @click="depth3CategoryToggle()"
                    >
                        <b>{{ categoryLabel.depth3 }}</b><i class="ico_dropdown T=bold" />
                    </button>
                    <div class="mm_dropdown-item" :style="depth3CategoryOn ? { height: 'auto'} : {}">
                        <div class="mm_dropdown-item-inner">
                            <ul>
                                <li v-for="depth3 in currentCategory2Child" :key="depth3.code">
                                    <MMLink
                                        :to="{ name: 'GoodsCategoryIndex', params: { id : depth3.code }}"
                                    >
                                        <b>{{ depth3.name }}</b>
                                    </MMLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </li>
        </ol>
    </div>
    <!--// 브레드크럼 -->
</template>

<script setup lang='ts'>
import { GoodsBasicInfo } from '$/@type/goods';
import { useCategories } from '$/composables/goods/categoryComposable';
import { ref, computed } from 'vue';

const props = defineProps<{
    goodsInfo : GoodsBasicInfo
}>();

const depth1CategoryOn = ref<boolean>(false);
const depth1CategoryToggle = () => {
    depth2CategoryOn.value = false;
    depth3CategoryOn.value = false;
    depth1CategoryOn.value = !depth1CategoryOn.value;
};
const depth2CategoryOn = ref<boolean>(false);
const depth2CategoryToggle = () => {
    depth1CategoryOn.value = false;
    depth3CategoryOn.value = false;
    depth2CategoryOn.value = !depth2CategoryOn.value;
}
const depth3CategoryOn = ref<boolean>(false);
const depth3CategoryToggle = () => {
    depth1CategoryOn.value = false;
    depth2CategoryOn.value = false;
    depth3CategoryOn.value = !depth3CategoryOn.value;
}

// 카테고리 리스트
const { categories } = useCategories();        
/** VARIABLE */
const currentCategory1 = computed(() => {
    return categories.value.find(category1 => category1.code == props.goodsInfo.goods.category.depth1Code)
});

const currentCategory2Child = computed(() => {
    if (!currentCategory1.value) {
        return;
    }
    return currentCategory1.value.childCategoryList?.find((cate2) => cate2.code === props.goodsInfo.goods.category.depth2Code)?.childCategoryList || []
})

const categoryLabel = computed(() => {
    const fullLabelSplit = props.goodsInfo.goods.category.fullLabel.split('>');

    return {
        depth1: fullLabelSplit[0] || '',
        depth2: fullLabelSplit[1] || '',
        depth3: fullLabelSplit[2] || ''
    }
})
/** FUNCTION */

/** VUE LIFE CYCLE */

</script>