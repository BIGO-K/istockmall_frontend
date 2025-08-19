<template>
    <div class="mm_page-content">
        <!-- (D) 실제 내용을 추가하는 부분입니다. -->
        <div class="mm_inner">
            <h3 class="mm_title">
                <b>베스트</b>
            </h3>
            <!-- 카테고리 -->
            <div class="m_best-category">
                <!-- (D) 선택된 카테고리에 'S=category-on' 클래스와 '선택됨' 타이틀을 추가합니다.  -->
                <Slider :items="categories" :use-control="true">
                    <template #additionalItem>
                        <li class="mm_slider-item">
                            <button
                                type="button"
                                :class="{ 'S=category-on': selectedCategoryCode === '' }"
                                :title="selectedCategoryCode === '' ? '선택됨' : ''"
                                @click="fetchCategoryGoodsWithRelationLikeGoods('')"
                            >
                                <i class="ico_category-all" /><b>전체</b>
                            </button>
                        </li>
                    </template>
                    <template #item="{ item }">
                        <button
                            :class="{ 'S=category-on': selectedCategoryCode === item.code }"
                            :title="selectedCategoryCode === item.code ? '선택됨' : ''"
                            type="button"
                            @click="fetchCategoryGoodsWithRelationLikeGoods(item.code)"
                        >
                            <i v-lazyload="{ src: item.imageUrl }" class="mm_bg-cover image_category" /><b>{{ item.name }}</b>
                        </button>
                    </template>
                </Slider>
            </div>
            <!--// 카테고리 -->
            <template v-if="goodsList.length === 0 && goodsFetchLoad">
                <p class="mm_text-none">
                    <i class="ico_text-none" />집계된 상품이 없습니다
                </p>
            </template>
            <template v-else>
                <!-- 베스트 상품 -->
                <div v-if="goodsFetchLoad" class="mm_product-list m_best-list">
                    <ol>
                        <li v-for="goods in goodsList" :key="goods.id">
                            <MmGoods :use-rank-tag="true" :goods="goods" :use-liked-button="true" />
                        </li>
                    </ol>
                </div>
                <div v-else class="mm_product-list T=skeleton m_best-list">
                    <ol>
                        <li v-for="i in 20" :key="i">
                            <div class="mm_product-item">
                                <i class="image_product" />
                                <div class="mm_product-item-info">
                                    <p class="text_brand" />
                                    <p class="text_product" />
                                    <p class="text_price" />
                                </div>
                            </div>
                        </li>
                    </ol>
                </div>
                <!--// 베스트 상품 -->
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import { Category } from '$/@type/category'
import { categoryRepository } from '$/repository/category/categoryRepository'
import { defineComponent, onMounted, ref, defineAsyncComponent } from 'vue'
import { defaultCatch } from '$/functions'
import { goodsRepository } from '$/repository/goodsRepository'
import { BaseGoods } from '$/@type/goods'
import { LikedGoods } from '$/@type/shopping'
import { shoppingRepository } from '$/repository/shoppingRepository'
import { useRoute, useRouter } from 'vue-router'
import { makePath } from '$/services/http'
import { usePageTitleSetting } from '$/composables/seoComposable'

export default defineComponent({
    components: {        
        Slider: defineAsyncComponent(() => import('@/components/Slider.vue')),
    },
    async beforeRouteEnter(to, from, next) {
        try {
            const categories = await categoryRepository.getAllCategoryList()
            next((vm) => (vm.categories = categories))
        } catch(e) {
            next()
        }
    },
    setup() {
        const route = useRoute()
        const router = useRouter()
        usePageTitleSetting('베스트');

        const selectedCategoryCode = ref(`${route.query.category_code || ''}`)
        const categories = ref<Category[]>([])
        const goodsFetchLoad = ref(false)
        const goodsList = ref<BaseGoods[]>([])
        const likedGoodsRelations = ref<LikedGoods[]>([])
        const categoryBestGoods = ref<{
            [key: string]: {
                bestGoods: BaseGoods[]
                likedGoodsRelations: LikedGoods[]
            }
        }>({})

        async function fetchCategoryGoodsWithRelationLikeGoods(categoryCode: string) {
            goodsFetchLoad.value = false
            selectedCategoryCode.value = categoryCode
            
            router.replace(makePath(route.path, {
                category_code: categoryCode,
            }))

            if (!categoryBestGoods.value[categoryCode]) {
                const { bestGoods } = await goodsRepository.getMainBestCategoryGoods(`${categoryCode}`)
                goodsList.value = bestGoods
                likedGoodsRelations.value = await shoppingRepository.getRelationLikedGoods(
                    bestGoods.map((goods) => {
                        return goods.id
                    })
                    , true
                )
                categoryBestGoods.value[categoryCode] = {
                    bestGoods: goodsList.value,
                    likedGoodsRelations: likedGoodsRelations.value,
                }
            } else {
                goodsList.value = categoryBestGoods.value[categoryCode].bestGoods
                likedGoodsRelations.value = categoryBestGoods.value[categoryCode].likedGoodsRelations
            }
            goodsFetchLoad.value = true
        }

        onMounted(async () => {
            try {
                await fetchCategoryGoodsWithRelationLikeGoods(selectedCategoryCode.value)
            } catch (e) {
                defaultCatch(e)
            }
        })

        return {
            selectedCategoryCode,
            categories,
            goodsList,
            goodsFetchLoad,
            categoryBestGoods,
            likedGoodsRelations,
            fetchCategoryGoodsWithRelationLikeGoods,
        }
    },
})
</script>
