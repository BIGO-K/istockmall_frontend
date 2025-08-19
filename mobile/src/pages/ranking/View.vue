<template>
    <TypeB 
        v-if="rankingType === 'B'"
        :categories="categories"
    />
    <TypeD 
        v-else-if="rankingType === 'D'"
        :categories="categories"
    />
    <TypeA
        v-else
        :categories="categories"
    />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Category } from '$/@type/category';
import { categoryRepository } from '$/repository/category/categoryRepository';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { useGlobalConfigStore } from '$/store/globalConfig';
import { InitialSettings } from '$/@type/configs';
import TypeA from '@/pages/ranking/view/TypeA.vue';
import TypeB from '@/pages/ranking/view/TypeB.vue';
import TypeD from '@/pages/ranking/view/TypeD.vue';

declare module "@vue/runtime-core" { 
    interface ComponentCustomProperties {
        categories: Category[]
    }
}

export default defineComponent({
    components: {
        TypeA,
        TypeB,
        TypeD,
    },
    async beforeRouteEnter(to, from, next) {
        try {
            const categories = await categoryRepository.getAllCategoryList();
            return next((vm) => {
                vm.categories = categories;
            })
        } catch (e) {
            return next();
        } 
    },
    setup() {
        usePageTitleSetting('VIEW 랭킹', ['랭킹']);
        const { globalConfigs } = useGlobalConfigStore();
        const rankingType = ref<InitialSettings['design']['mobileRankingType']>(globalConfigs.design.mobileRankingType);
        const categories = ref<Category[]>([]);
        return {
            categories,
            rankingType,
        }
    }
});
</script>