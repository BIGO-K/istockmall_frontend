<template>
    <div ref="categoryScroller" class="mm_scroller">
        <div class="mm_accordion m_sidebar-category">
            <ul>
                <li v-for="category in allCategory" :key="category.code">
                    <dl  
                        :class="['mm_dropdown', { 'S=on S=before' : selectedCategory === category } ]"                         
                    >
                        <dt
                            class="btn_dropdown"
                            tabindex="0"
                            title="펼쳐보기"
                            @click.stop="dropDownHandle(category, $event)"
                        >
                            <i v-lazyload="{ src: category.imageUrl }" class="mm_bg-cover image_category" />
                            <b>{{ category.name }}</b>
                            <i class="ico_dropdown T=cross" />
                        </dt>
                        <dd
                            v-if="categoryToggleOpen && selectedCategory === category"
                            :class="['mm_dropdown-item']"		
                            :style="selectedCategory === category ? { height: subCategory === null ? `${depth2HeightPx}px` : 'auto' } : {}"																												
                        >															
                            <div class="mm_dropdown-item-inner">
                                <ul class="m_sidebar-category-sub">
                                    <li>
                                        <MMLink
                                            :to="{
                                                name: 'ExhibitCategoryIndex',
                                                params: { id: category.code }
                                            }"       
                                        >
                                            <b>View All</b>
                                        </MMLink>
                                    </li>
                                    <li v-for="depth2Category in category.childCategoryList" :key="depth2Category.code">
                                        <dl :class="['mm_dropdown', { 'S=on' : subCategory === depth2Category }]">
                                            <dt
                                                class="btn_dropdown"
                                                tabindex="0"
                                                title="펼쳐보기" 
                                                @click.stop="dropDownSecondHandle(depth2Category)"
                                            >
                                                <b>{{ depth2Category.name }}</b><i class="ico_dropdown T=cross" />
                                            </dt>
                                            <dd
                                                class="mm_dropdown-item" 
                                                :style="subCategory === depth2Category ? { height: 'auto' } : {}"                                                                                                                               
                                            >
                                                <div class="mm_dropdown-item-inner">
                                                    <ul>
                                                        <li>
                                                            <MMLink
                                                                :to="{
                                                                    name: 'GoodsCategoryIndex',
                                                                    params: { id: depth2Category.code }
                                                                }"       
                                                            >
                                                                <b>View All</b>
                                                            </MMLink>
                                                        </li>
                                                        <li v-for="depth3Category, depth3Index in depth2Category.childCategoryList"	:key="depth3Category.code">
                                                            <MMLink
                                                                :to="{
                                                                    name: 'GoodsCategoryIndex',
                                                                    params: { id: depth3Category.code }
                                                                }"       
                                                            >
                                                                <b>{{ depth3Category.name }}</b>
                                                                <small>{{ MMFilters.formatNumber(categoriesGoodsCount[depth3Index]) }}</small>
                                                            </MMLink>
                                                        </li>																						
                                                    </ul>
                                                </div>
                                            </dd>
                                        </dl>
                                    </li>
                                </ul>
                            </div>
                        </dd> 
                    </dl>
                </li>											
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Category } from '$/@type/category';
import { mmon } from '$/helper/mmon';
import { categoryRepository } from '$/repository/category/categoryRepository';
import { ref, toRef, nextTick } from 'vue';

const props = defineProps<{
    allCategories: Category[]
}>();

const allCategory = toRef(props, 'allCategories');
const depth2HeightPx = ref<number>(0);
const categoryToggleOpen = ref(false);
const selectedCategory = ref<Category|null>(null);        
const subCategory = ref<Category|null>(null);
const categoriesGoodsCount = ref<number[]>([]);
const categoryScroller = ref<HTMLElement|null>(null);

async function dropDownSecondHandle(category: Category) {
    if (subCategory.value?.code == category.code) {
        return subCategory.value = null;
    }

    const categoryCodes = category.childCategoryList?.map((depth3Category) => {
        return depth3Category.code;
    }) || [];
    categoriesGoodsCount.value = await categoryRepository.categoriesGoodsCount(categoryCodes);
    subCategory.value = category;
}
/**
 * 카테고리 드랍다운 핸들링 함수 
*/
function dropDownHandle(category: Category, event: Event) {            
    categoryToggleOpen.value = !categoryToggleOpen.value;		
    const target = ref<HTMLElement>(event.target as HTMLElement);
    if (target.value.tagName !== 'DL') {
        target.value = target.value.closest('dt') as HTMLElement;
    }            
    
    // 이미열려있는 경우 처리!
    if (selectedCategory.value !== null && selectedCategory.value !== category) {
        categoryToggleOpen.value = true;
        selectedCategory.value = category;
    } else {
        // 현재 선택된 카테고리 처리!			
        selectedCategory.value = categoryToggleOpen.value ? category : null;
    }

    nextTick().then(() => {
        const parentDlElement = target.value.parentElement as HTMLElement;
        const categoryContentElement = parentDlElement.querySelector('.m_sidebar-category-sub') as HTMLElement;
    
        if (categoryContentElement !== null) {
            depth2HeightPx.value = categoryContentElement.offsetHeight;
            if (categoryScroller.value) {
                mmon.scroll.to(parentDlElement, {
                    margin: 99 + 13,
                    scroller: categoryScroller.value
                });
            }
        }
    })
}
</script>