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
    <!--// 찜 랭킹 -->
</template>

<script lang="ts">
import { Category } from '$/@type/category';
import { categoryRepository } from '$/repository/category/categoryRepository';
import { computed, defineComponent, ref } from 'vue'
import TypeA from '@/pages/ranking/like/TypeA.vue';
import TypeB from '@/pages/ranking/like/TypeB.vue';
import TypeD from '@/pages/ranking/like/TypeD.vue';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { InitialSettings } from "$/@type/configs";
import { useGlobalConfigStore } from '$/store/globalConfig';

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
            return next()
        } 
    },
    setup() {
        usePageTitleSetting('찜 랭킹', ['랭킹']);
        const { globalConfigs } = useGlobalConfigStore();
        const rankingType = computed<InitialSettings['design']['pcRankingType']>(() => globalConfigs.design.pcRankingType);
        const categories = ref<Category[]>([]);

        return {
            categories,
            rankingType,
        }
    }
});
</script>