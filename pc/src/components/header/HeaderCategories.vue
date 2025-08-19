<template>
    <!-- 카테고리메뉴 -->
    <div
        class="mm_gnb-cate"
        :class="{ 'S=switch-on': isCategoryOpen }"
        @mouseleave="categoryHandler.mouseLeave"
    >
        <button
            type="button"
            class="btn_catemenu"
            :title="isCategoryOpen ? '접어놓기' : '펼쳐보기'"
            @click="() => toggleCategoryOpen()"
        >
            <i>								
                <i class="ico_menu" />
            </i>
            <b>전체 카테고리</b>
        </button>
        <div
            v-show="isCategoryOpen"
            class="mm_gnb-cate-item"
        >
            <nav ref="categoryNavBox">
                <ul ref="categoryUlBox">
                    <li
                        v-for="category in categories"
                        :key="category.code"                        
                    >
                        <MMLink
                            :class="{ 'S=catemenu-on' : selectedCategoryCode == category.code }"
                            :to="{
                                name : 'ExhibitCategoryIndex',
                                params: { id: category.code }
                            }"        
                            @click="toggleCategoryOpen(false)"                    
                            @mouseover="categoryHandler.mouseOver"
                            @mousemove="categoryHandler.mouseMove"
                        >
                            <i
                                v-lazyload="{ src: category.imageUrl }"
                                class="mm_bg-cover image_category"
                            />
                            <b>{{ category.name }}</b>
                        </MMLink>
                        <div class="mm_gnb...depth">
                            <div class="mm_scroller">
                                <h3>
                                    <b>{{ category.name }}</b>
                                    <MMLink
                                        class="mm_btn T=2xs T=square T=line T=light btn_all"
                                        :class="{'S=on' : $route.name === 'ExhibitCategoryIndex' && $route.params.id === category.code }"
                                        :to="{ name: 'ExhibitCategoryIndex', params: { id: category.code}}"
                                        @click="toggleCategoryOpen(false)"
                                    >
                                        <b>전체보기</b>
                                        <i class="ico_link T=xs" />
                                    </MMLink>
                                </h3>
                                <template
                                    v-for="depth2Category in category.childCategoryList || []"
                                    :key="depth2Category.code"
                                >
                                    <section>
                                        <h4>
                                            <MMLink
                                                :to="{
                                                    name : 'GoodsCategoryIndex',
                                                    params: { id: depth2Category.code }
                                                }"
                                                @click="toggleCategoryOpen(false)"
                                            >
                                                <b>{{ depth2Category?.name }}</b>
                                            </MMLink>
                                        </h4>
                                        <ul>
                                            <li
                                                v-for="depth3Category in depth2Category.childCategoryList || []"
                                                :key="depth3Category.code"
                                            >
                                                <MMLink                                                    
                                                    :to="{
                                                        name : 'GoodsCategoryIndex',
                                                        params: { id: depth3Category.code }
                                                    }"
                                                    @click="toggleCategoryOpen(false)"
                                                >
                                                    <b>{{ depth3Category.name }}</b>
                                                </MMLink>
                                            </li>
                                        </ul>
                                    </section>
                                    <wbr>
                                </template>
                            </div>
                        </div>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
    <!--// 카테고리메뉴 -->
</template>

<script setup lang='ts'>
import { useToggle } from '@vueuse/shared';
import { ref } from 'vue';
import { useCategories } from '$/composables/goods/categoryComposable';
import gsap from 'gsap';


/** VARIABLE */

const isCategoryOpen = ref(false)
const toggleCategoryOpen = useToggle(isCategoryOpen)
const { categories } = useCategories();        

// 카테고리 nav
const categoryNavBox = ref<HTMLElement|null>(null)
const categoryUlBox =  ref<HTMLElement|null>(null)
// 선택된 카테고리 코드
const selectedCategoryCode = ref<string>('')


const categoryHandler = {
    mouseLeave: () => {
        if (!categoryNavBox.value) {
            return
        }
        gsap.to(categoryNavBox.value, {
            width: 181,
            duration: 0.2,
            delay: 0.1,
            ease: 'sine.inOut',
            overwrite: true,
            onComplete: () => {
                categoryUlBox.value?.querySelectorAll('li > a').forEach(el => el.classList.remove('S=catemenu-on')) ;    
                setTimeout(() => {
                    toggleCategoryOpen(false);                    
                }, 300);
                
            }
        })
    },
    mouseOver: (event: MouseEvent) => {
        const itemBox = (event.target as HTMLElement).closest('li')
        if (!itemBox) {
            return
        }

        categoryUlBox.value?.querySelectorAll('li > a').forEach(el => el.classList.remove('S=catemenu-on')) ;
        
        const titleElement = itemBox.querySelector('a') as HTMLElement
        const childrenBox = itemBox.querySelector('.mm_gnb\\.\\.\\.depth') as HTMLElement

        if (!titleElement || !childrenBox || !categoryNavBox.value) {
            return
        }

        titleElement.classList.add('S=catemenu-on')

        gsap.to(categoryNavBox.value, {
            width: titleElement.offsetWidth + childrenBox.offsetWidth,
            duration: 0.4,
            ease: 'sine.inOut',
            overwrite: true,
        });        
    },
    mouseMove: (event: MouseEvent) => {

        if (!categoryUlBox.value || !categoryNavBox.value) {
            return
        }

        const cateLimit = categoryUlBox.value.querySelector('li')?.offsetHeight || 0;
        const cateMoveHeight = categoryNavBox.value.offsetHeight - categoryUlBox.value.offsetHeight;

        if (cateMoveHeight > 0) {
            return;
        }

        let ratioY = (event.clientY - categoryNavBox.value.getBoundingClientRect().top - cateLimit) / (categoryNavBox.value.offsetHeight - cateLimit * 2);
        ratioY = Math.max(0, Math.min(ratioY, 1));

        gsap.to(categoryUlBox.value, {
            'margin-top':  cateMoveHeight * ratioY, 
            duration: 0.4,
            ease: 'quad.out' 
        });
    }
}


/** FUNCTION */

/** VUE LIFE CYCLE */

</script>