<template>
    <BType 
        v-if="rankingType === 'B'"
        :categories="categories"
    />
    <DType 
        v-else-if="rankingType === 'D'"
        :categories="categories"
    />
    <AType
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
import AType from '@/pages/ranking/item/AType.vue';
import BType from '@/pages/ranking/item/BType.vue';
import DType from '@/pages/ranking/item/DType.vue';


declare module "@vue/runtime-core" { 
    interface ComponentCustomProperties {
        categories: Category[]
        rankingType: InitialSettings['design']['mobileRankingType']
    }
}

export default defineComponent({
    components: {
        AType,
        BType,
        DType,
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
        usePageTitleSetting('아이템 랭킹', ['랭킹']);
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