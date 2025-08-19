<template>
    <div ref="scrollerElement" class="mm_scroller">
        <div class="m_sidebar-brand">
            <!-- 브랜드 검색 -->
            <div class="m_sidebar-brand-find T=find-category">
                <div class="m...find-inner">
                    <!-- 검색어 -->
                    <div class="mm_inner">
                        <MMInput 
                            v-model="searchBrandKeyword"
                            :place-holder-text="'브랜드를 검색하세요'"
                            @keypress="isBrandSearchProcessFished = false"
                            @keyup="isBrandSearchProcessFished = true"
                            @keyup.enter="searchBrand"
                        >
                            <template #extraTopButton>
                                <button 
                                    type="button" 
                                    class="btn_search"																	
                                    @click="searchBrand"
                                >
                                    <i class="ico_search T=sm" /><b class="mm_ir-blind">검색하기</b>
                                </button>    
                            </template>
                        </MMInput>
                    </div>

                    <!-- 브랜드 분류 -->
                    <div class="m...find-category">
                        <div ref="categoryScroller" class="mm_scroller T=x">
                            <!-- (D) 선택된 탭메뉴에 'S=category-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
                            <ul>
                                <li>
                                    <button
                                        type="button"
                                        :class="{ 'S=category-on': selectedBrandCategoryId === 0 }"
                                        :title="selectedBrandCategoryId === 0 ? '선택됨' : ''"
                                        @click="selectCategory(0)"
                                    >
                                        <b>ALL</b>
                                    </button>
                                </li>
                                <li v-for="brandCategory in brandCategories" :key="brandCategory.id">
                                    <button 
                                        type="button"
                                        :class="{ 'S=category-on': selectedBrandCategoryId === brandCategory.id }"
                                        :title="selectedBrandCategoryId === brandCategory.id ? '선택됨' : ''"
                                        @click="selectCategory(brandCategory.id)"
                                    >
                                        <b>{{ brandCategory.name }}</b>
                                    </button>
                                </li>                                
                            </ul>
                        </div>
                    </div>
                    <!--// 검색어 -->
                    <div ref="initialScroller" class="mm_scroller T=x">
                        <!-- 정렬 -->
                        <ul class="m...find-rank">
                            <!-- (D) 선택된 카테고리에 'S=sort-on' 클래스와 '선택됨' 타이틀이 추가됩니다. -->
                            <li>
                                <button
                                    type="button"
                                    selectedBrandInitials
                                    :class="{ 'S=sort-on': selectedBrandInitials === '' }"
                                    :title="selectedBrandInitials === '' ? '선택됨' : ''"
                                    @click="setContext('', '')"
                                >
                                    <b>전체</b>
                                </button>
                            </li>
                        </ul>
                        <!-- 초성 정렬 -->
                        <div :class="['m...find-sort', { 'S=sort-switch': brandInitialType === 'eng' }]">
                            <!-- ㄱㄴㄷ -->
                            <div class="m...find-sort-menu">
                                <!-- (D) 선택된 초성에 'S=sort-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
                                <ul>
                                    <!-- :class="['btn_sort', {'S=sort-switch' : brandInitialType === 'ㄱㄴㄷ' }]"  -->
                                    <li>
                                        <button 
                                            type="button" 
                                            class="btn_sort"
                                            @click="setContext('eng', '')"
                                        >
                                            <i class="ico_switch" /><b>ABC</b>
                                        </button>
                                    </li>
                                    <li v-for="initial in koreanBrandInitials" :key="`kor_${initial}`">
                                        <!-- class="S=sort-on" href="#" title="선택됨" -->
                                        <a
                                            href="#"
                                            :class="{'S=sort-on' : selectedBrandInitials === initial}" 
                                            @click.prevent="setContext('korean', selectedBrandInitials === initial ? '' : initial)" 
                                        >	
                                            <b>{{ initial }}</b>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <!--// ABC -->
                            <div class="m...find-sort-menu">
                                <ul>
                                    <li>
                                        <button 
                                            type="button" 
                                            class="btn_sort"
                                            @click.prevent="setContext('korean', '')"
                                        >
                                            <i class="ico_switch" /><b>ㄱㄴㄷ</b>
                                        </button>
                                    </li>
                                    <li v-for="engInitial in engBrandInitials" :key="`eng_${engInitial}`">
                                        <!-- class="S=sort-on" href="#" title="선택됨" -->
                                        <a
                                            href="#"
                                            :class="{'S=sort-on' : selectedBrandInitials === engInitial}" 
                                            @click.prevent="setContext('eng', selectedBrandInitials === engInitial ? '' : engInitial)"
                                        >
                                            <b>{{ engInitial }}</b>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <!--// 초성 정렬 -->
                    </div>
                </div>
            </div>
            <!--// 브랜드 검색 -->

            <!-- 브랜드 리스트 -->
            <div v-if="!isBrandSearchProcessFished" class="m_sidebar-brand-list T=skeleton">
                <ul>
                    <li v-for="i in 10" :key="i">
                        <p />
                    </li>
                </ul>
            </div>
											
            <div v-else class="m_sidebar-brand-list">
                <p v-if="filteringBrands.length < 1" class="mm_text-none">
                    <i class="ico_text-none" />검색된 브랜드가 없습니다
                </p>
                <ul v-else>
                    <template v-for="filterBrand in filteringBrands" :key="filterBrand.label">
                        <template v-if="brandInitialType === 'korean'">
                            <li v-for="brand in filterBrand.brands" :key="brand.id">
                                <a href="#" @click.prevent="goBrandShop(brand.id)">
                                    <b>{{ brand.korName }}</b><small>{{ brand.engName }}</small>
                                </a>
                                <!-- <MMLink :to="{ name: 'GoodsBrandIndex', params: { id: brand.id}}" @click="goBrandShop">
                                    <b>{{ brand.korName }}</b><small>{{ brand.engName }}</small>
                                </MMLink> -->
                            </li>
                        </template>
                        <template v-else>
                            <li v-for="brand in filterBrand.brands" :key="brand.id">
                                <a href="#" @click.prevent="goBrandShop(brand.id)">
                                    <b>{{ brand.engName }}</b><small>{{ brand.korName }}</small>
                                </a>
                                <!-- <MMLink :to="{ name: 'GoodsBrandIndex', params: { id: brand.id}}" @click="goBrandShop">
                                    <b>{{ brand.engName }}</b><small>{{ brand.korName }}</small>
                                </MMLink> -->
                            </li>
                        </template>
                    </template>
                </ul>
            </div>
            <!--// 브랜드 리스트 -->
        </div>
    </div>
</template>

<script setup lang='ts'>
import { Brand, BrandCategories } from '$/@type/brand';
import { useBrandInitialsFilters } from '$/composables/goods/brandComposable';
import { typeCastNumber } from '$/filters';
import { brandShopRepository } from '$/repository/goods/brandShopRepository';
import { computed, onMounted, ref, watch, nextTick, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as MMFilters from '$/filters';
import { useScroll } from '@vueuse/core';
import { horizontalScrollMove } from '$/functions';
import { mmon } from '$/helper/mmon';

/** VARIABLE */
const route = useRoute()
const router = useRouter()
const brandCategories = ref<BrandCategories[]>();
const scrollerElement = ref<HTMLElement|null>(null)
const categoryScroller = ref<HTMLElement|null>(null)
const initialScroller = ref<HTMLElement|null>(null)

const { y: scrollY, isScrolling } = useScroll(scrollerElement);
const hashMatch = route.hash.match(/^#([^:]*):([^@]*)#([^:]*):([^@]*)/)
const brandInitialType = ref(hashMatch ? hashMatch[1] : 'korean');
const selectedBrandInitials = ref(hashMatch ? hashMatch[2] : '');
const selectedBrandCategoryId = ref(hashMatch ? MMFilters.typeCastNumber(hashMatch[4], 0) : 0);
const searchBrandKeyword = ref('');	
const allBrands = ref<Brand[]>([]);
const isBrandSearchProcessFished = ref(false)

const { koreanBrandInitials, engBrandInitials, getKoreanInitial } = useBrandInitialsFilters();

const filteredBrandCategories = computed(() => {
    if (selectedBrandCategoryId.value === 0) {
        return allBrands.value
    }

    return allBrands.value.filter((brand) => {
        return brand.brandCategoryIds.includes(selectedBrandCategoryId.value)
    })
})

const koreanBrands = computed(() => {
    return koreanBrandInitials.map((korean) => {
        const filteredInitials = filteredBrandCategories.value.filter((brand) => {
            return korean === '123' 
                ? /^[a-z|0-9|A-Z|\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/.test(brand.korName)
                : new RegExp('^[' + korean + ']').test(getKoreanInitial(brand.korName, true))
        }).sort((a, b) => {
            return a.korName.localeCompare(b.korName, 'kor');		
        });

        return {
            label: korean,
            type: 'korean',
            brands: filteredInitials,
        }
    })
})

const engBrands = computed(() => {
    return engBrandInitials.map((eng) => {
        const filteredInitials = filteredBrandCategories.value.filter((brand) => {
            return eng === '123' 
                ? /^[0-9|ㄱ-ㅎ|가-힣|\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/.test(brand.engName) 
                : new RegExp('^[' + eng.toLowerCase() + eng.toUpperCase() + ']').test(brand.engName)
        }).sort((a, b) => {
            return a.engName.localeCompare(b.engName, 'en');		
        });
        
        return {
            label: eng,
            type: 'eng',
            brands: filteredInitials,
        }
    })
})

const filteringBrands = computed(() => {	
    if (selectedBrandInitials.value === '' && searchBrandKeyword.value === '') {
        if (brandInitialType.value === 'korean') {
            return koreanBrands.value.filter((filter) => {
                return filter.type = 'korean'
            }) 
        } else { 
            return engBrands.value.filter((filter) => {
                return filter.type = 'eng'
            });
        } 
    } else if (searchBrandKeyword.value !== '') {
			
        const filteredBrands = allBrands.value.filter((brand) => {
            return brand.korName.toUpperCase().indexOf(searchBrandKeyword.value.toUpperCase()) !== -1 
            || brand.engName.toUpperCase().indexOf(searchBrandKeyword.value.toUpperCase()) !== -1;
        })

        return filteredBrands.reduce((acc: {
            label: string,
            type: string,
            brands: {
                id: number;
                korName: string;
                engName: string;
                brandCategoryIds: number[]
            }[]
        }[], curr) => {
            const initial = getSearchBrandInitial(curr.korName);

            const findBrand = acc.find((acc) => {
                return acc.label === initial
            });

            if (!findBrand) {
                acc.push({
                    label: initial,
                    type: 'korean',
                    brands: [ curr ]

                })
            } else {
                if (findBrand.label === initial) {
                    findBrand.brands.push(curr);
                }
            }
            return acc;
        }, [])
    } else if (selectedBrandInitials.value === '123') {

        if (brandInitialType.value === 'korean') {
            return koreanBrands.value.filter((filter) => {
                return filter.label === '123'
            })
        }

        return engBrands.value.filter((filter) => {
            return filter.label === '123'
        })
    } else {
        return (koreanBrands.value.concat(engBrands.value)).filter((filtered) => {
            return filtered.label === selectedBrandInitials.value
        }).filter((result) => result.brands.length > 0)
    }
})

function getSearchBrandInitial(brandKoreanName: string) {
    const initial = getKoreanInitial(brandKoreanName, true).charAt(0);

    if (koreanBrandInitials.includes(initial)) {
        return initial
    }

    if (engBrandInitials.includes(initial)) {
        return initial
    }

    return '123';
}


function searchBrand() {
    isBrandSearchProcessFished.value = true;
}

function scrollMove() {
    if (categoryScroller.value) {
        const element = categoryScroller.value.querySelector('.S\\=category-on');
        horizontalScrollMove(categoryScroller.value, element);
    }

    if (initialScroller.value) {
        const element = initialScroller.value.querySelector('.S\\=sort-on');
        horizontalScrollMove(initialScroller.value, element);
    }
}

onMounted(async()=> {
    const [categories, allBrand] = await Promise.all([
        brandShopRepository.brandCategories(), 
        brandShopRepository.allBrands()
    ])
    brandCategories.value = categories
    allBrands.value = allBrand

    

    const matchResult = route.hash.match(/^#([^:]*):([^@]*)#([^:]*):([^@]*)@([0-9]*)/)
    if (matchResult) {
        const initialType = matchResult[1]
        const initial = matchResult[2]
        const scrollTop = matchResult[5]

        brandInitialType.value = initialType
        selectedBrandInitials.value = initial
        nextTick().then(() => {
            scrollY.value = typeCastNumber(scrollTop, 0)
        })
    }

    scrollMove()
    isBrandSearchProcessFished.value = true;
})


function setContext(initialType: string, initial: string) {
    brandInitialType.value = initialType === '' ? 'korean' : initialType;
    searchBrandKeyword.value = '';
    selectedBrandInitials.value = initial;
    
    if (!route.name) {
        return
    }

    router.replace({
        name: route.name,
        query: route.query,
        hash: `#${initialType}:${initial}#category:${selectedBrandCategoryId.value}`
    });

    nextTick().then(() => {
        scrollY.value = 0;
    })
}



const scrollWatcher = watch(([scrollY, isScrolling]), () => {
    if (!isBrandSearchProcessFished.value || isScrolling.value) {
        return;
    }   
    
    router.replace({
        name: route.name,
        query: route.query,
        hash: `#${brandInitialType.value}:${selectedBrandInitials.value}#category:${selectedBrandCategoryId.value}@${scrollY.value}`
    })
})

function goBrandShop(brandId: number) {
    scrollWatcher();
    mmon.loading.show();    
    router.replace({
        name: route.name,
        query: route.query,
        hash: `#${brandInitialType.value}:${selectedBrandInitials.value}#category:${selectedBrandCategoryId.value}@${scrollY.value}`
    }).then(() => {
        router.push({
            name: 'GoodsBrandIndex',
            params: {
                id: brandId
            }
        });
    })
    // isBrandSearchProcessFished.value = false;
}

onBeforeUnmount(() => {
    mmon.loading.hide();
})

function selectCategory(categoryId: number) {
    selectedBrandCategoryId.value = categoryId
    router.replace({
        name: route.name,
        query: route.query,
        hash: `#${brandInitialType.value}:${selectedBrandInitials.value}#category:${selectedBrandCategoryId.value}`
    });

    nextTick().then(() => {
        scrollY.value = 0;
    })
}
/** FUNCTION */

/** VUE LIFE CYCLE */

</script>


