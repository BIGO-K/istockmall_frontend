<template>
    <div class="m_best">
        <!-- 카테고리 -->
        <!-- (D) 카테고리 선택 시 새로고침 되지 않고 페이지 내에서 카테고리 아래로 내용만 변경됩니다 -->
        <div ref="categoryHeader" class="m_product-category m_best-category">
            <div class="m_product-category-list m_best-category-list">
                <div ref="categoryScroller" class="mm_scroller T=x">
                    <!-- (D) 선택된 카테고리에 'S=category-on' 클래스와 '선택됨' 타이틀을 추가합니다 -->
                    <ul>
                        <li>
                            <a
                                href="#" 
                                :class="{ 'S=category-on' : selectedCategoryCode === '' }" 
                                :title="selectedCategoryCode === '' ? '선택됨' : ''" 
                                @click.prevent="setCategory('')"
                            >
                                <b>전체</b>
                            </a>
                        </li>
                        <li v-for="category in categories" :key="category.code">
                            <a
                                href="#" 
                                :class="{ 'S=category-on' : selectedCategoryCode === category.code }" 
                                :title="selectedCategoryCode === category.code ? '선택됨' : ''" 
                                @click.prevent="setCategory(category.code)"
                            >
                                <b>{{ category.name }}</b>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <template v-if="goodsFetchLoad">
            <div v-if="goodsList.length > 0" class="mm_product-list T=card">
                <!--
                        (D) 찜한 아이템의 .btn_like 버튼에 'S=switch-on' 클래스와 '선택됨' 타이틀이 추가됩니다.
                        data-switch 속성에 onChange(1번째 파라미터로 true/false 전달) 값으로 콜백을 설정할 수 있습니다.
                    -->
                <ol>
                    <li v-for="goods in goodsList" :key="goods.id">
                        <MmGoods 
                            :use-rank-tag="true" 
                            :goods="goods" 
                            :use-liked-button="true" 
                        />                         
                    </li>
                </ol>
            </div>
            <p v-else class="mm_text-none">
                <i class="ico_text-none" />데이터가 없습니다
            </p>
        </template>
        <template v-else>
            <div class="mm_product-list T=card T=skeleton">
                <ol>
                    <li v-for="i in 10" :key="i">
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
        </template>
        <!--// 카테고리 -->
    </div>
</template>


<script lang="ts">
import { Category } from '$/@type/category';
import { BaseGoods } from '$/@type/goods';
import { defaultCatch } from '$/functions';
import { categoryRepository } from '$/repository/category/categoryRepository';
import { goodsRepository } from '$/repository/goodsRepository';
import { shoppingRepository } from '$/repository/shoppingRepository';
import { ref, onMounted, nextTick, computed, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { makePath } from '$/services/http';
import { defineComponent } from 'vue';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { horizontalScrollMove } from '$/functions';

declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        categories: Category[]
        goodsList: BaseGoods[]
    }
}
export default defineComponent({
    async beforeRouteEnter (to, from, next) {
        try {
            const categories = await categoryRepository.getAllCategoryList()
            const { bestGoods } = await goodsRepository.getMainBestCategoryGoods(`${to.query.category_code || ''}`);
            await shoppingRepository.getRelationLikedGoods(   
                bestGoods.map((goods) => {
                    return goods.id
                }), 
                false
            )

            next(vm => {
                vm.categories = categories
                vm.goodsList = bestGoods
            });
        } catch (e) {
            next();
        }
    },
    setup() {
        const route = useRoute()
        const router = useRouter()
        usePageTitleSetting('베스트');
        
        const selectedCategoryCode = ref(`${route.query.category_code || ''}`);
        const categories = ref<Category[]>([]);
        const goodsFetchLoad = ref(true);
        const goodsList = ref<BaseGoods[]>([]);
        const pageScroller = ref<HTMLElement|null>(null);
        const categoryHeader = ref<HTMLElement|null>(null);
        const categoryScroller = ref<HTMLElement|null>(null);

        async function setCategory(categoryCode: string) {
            goodsFetchLoad.value = false;
            selectedCategoryCode.value = categoryCode;

            await scrollMove();

            try {
                const { bestGoods } = await goodsRepository.getMainBestCategoryGoods(`${categoryCode}`);
                await shoppingRepository.getRelationLikedGoods( 
                    bestGoods.map((goods) => {
                        return goods.id
                    })
                )
                goodsList.value = bestGoods
                router.replace(makePath(route.path, {
                    category_code: categoryCode,
                }))


                if (pageScroller.value) {
                    pageScroller.value.scrollTop = 0;
                }
            } catch (error) {
                defaultCatch(error)
            } finally {
                goodsFetchLoad.value = true;
            }
        }

        onBeforeUnmount(() => {
            if (pageScroller.value) {
                pageScroller.value.removeEventListener('scroll', pageScrollHandler, { passive : true });
            }
        });

        onMounted(async () => {
            pageScroller.value = document.querySelector(`[data-path="/best"] #mm_body > .mm_scroller`)
            if (pageScroller.value) {
                pageScroller.value.addEventListener('scroll', pageScrollHandler, { passive : true });
            }    
            
            await scrollMove();
        });

        async function scrollMove() {
            await nextTick();

            if (categoryScroller.value) {
                const element = categoryScroller.value.querySelector('.S\\=category-on');
                horizontalScrollMove(categoryScroller.value, element);
            }
        }


        const stickyClassName = 'S=sticky-on';
        const categoryHeight = computed<number>(() => {

            if (!categoryHeader.value) {
                return 0
            }
            return categoryHeader.value.offsetHeight;
        });

        const headerHeight = computed<number>(() => {
            const header:HTMLElement|null = document.querySelector('.mm_header');

            if (header === null) {
                return 0;
            }

            return header.getBoundingClientRect().top;
        })

        function pageScrollHandler() {
            if (!categoryHeader.value) {
                return;
            }
            const offsetTop = categoryHeader.value.getBoundingClientRect().top || 0            

            if (offsetTop - categoryHeight.value - headerHeight.value < 0) {
                categoryHeader.value.classList.add(stickyClassName);
            } else {
                categoryHeader.value.classList.remove(stickyClassName);
            }
        }
        return {
            categories,
            goodsList,
            goodsFetchLoad,
            selectedCategoryCode,
            setCategory,
            pageScroller,
            categoryScroller,
            categoryHeader
        }
    }
})
</script>