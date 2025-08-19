<template>
    <TypeB 
        v-if="rankingType === 'B'"
        :categories="categories"
    />
    <TypeD
        v-if="rankingType === 'D'"
        :categories="categories"
    />
    <TypeA
        v-else
        :categories="categories"
    />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { Category } from '$/@type/category';
import { categoryRepository } from '$/repository/category/categoryRepository';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { useGlobalConfigStore } from '$/store/globalConfig';
import { InitialSettings } from '$/@type/configs';
import TypeA from '@/pages/ranking/like/TypeA.vue';
import TypeB from '@/pages/ranking/like/TypeB.vue';
import TypeD from '@/pages/ranking/like/TypeD.vue';

declare module "@vue/runtime-core" { 
    interface ComponentCustomProperties {
        categories: Category[]
        rankingType: InitialSettings['design']['mobileRankingType']
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
            return next()
        } 
    },
    setup() {
        usePageTitleSetting('찜 랭킹', ['랭킹']);
        const { globalConfigs } = useGlobalConfigStore();
        const rankingType = computed<InitialSettings['design']['mobileRankingType']>(() => globalConfigs.design.mobileRankingType);
        const categories = ref<Category[]>([]);
        return {
            categories,
            rankingType,
        }
    }
});
</script>