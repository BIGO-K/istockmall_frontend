<template>
    <div class="mm_page-content">
        <!-- (D) 실제 내용을 추가하는 부분입니다. -->

        <div class="mm_inner">
            <h3 class="mm_title">
                <b>브랜드맵</b>
            </h3>
            <!-- 브랜드 카테고리 -->
            <div class="m_brand-category">
                <!-- (D) 선택된 탭메뉴에 'T=category-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
                <ul>
                    <li>
                        <button
                            type="button"
                            :class="{ 'T=category-on': selectedBrandCategoryId === 0 }"
                            :title="selectedBrandCategoryId === 0 ? '선택됨' : ''"
                            @click="selectCategory(0)"
                        >
                            <b>{{ isLoaded ? 'ALL' : '' }}</b>
                        </button>
                    </li>
                    <li v-for="brandCategory in brandCategories" :key="brandCategory.id">
                        <button
                            type="button"
                            :class="{ 'T=category-on': selectedBrandCategoryId === brandCategory.id }"
                            :title="selectedBrandCategoryId === brandCategory.id ? '선택됨' : ''"
                            @click="selectCategory(brandCategory.id)"
                        >
                            <b>{{ brandCategory.name }}</b>
                        </button>
                    </li>
                </ul>
            </div>
            <!--// 브랜드 카테고리 -->

            <!-- 브랜드 검색 -->
            <div class="m_brand-find">
                <!-- (D) 선택된 초성에 'S=sort-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
                <!-- ㄱㄴㄷ -->
                <ul class="m_brand-find-sort T=sort-kr">
                    <li>
                        <a
                            :class="{ 'S=sort-on': selectedInitials === 'ㄱㄴㄷ' }"
                            href="#"
                            title="선택됨"
                            @click.prevent="brandInitialsFilter('ㄱㄴㄷ', 'korean')"
                        >
                            <b>ㄱㄴㄷ</b>
                        </a>
                    </li>
                    <li v-for="koreanInitials in koreanBrandInitials" :key="`kor_${koreanInitials}`">
                        <a
                            :class="{ 'S=sort-on': selectedInitials === koreanInitials && selectedInitialsType === 'korean' }"
                            href="#"
                            @click.prevent="brandInitialsFilter(koreanInitials, 'korean')"
                        >
                            <b>{{ koreanInitials }}</b>
                        </a>
                    </li>
                </ul>
                <!--// ㄱㄴㄷ -->

                <!-- (D) 선택된 초성에 'S=sort-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
                <!-- ABC -->
                <ul class="m_brand-find-sort">
                    <li>
                        <a
                            :class="{ 'S=sort-on': selectedInitials === 'ABC' }"
                            href="#"
                            @click.prevent="brandInitialsFilter('ABC', 'eng')"
                        ><b>ABC</b></a>
                    </li>
                    <li v-for="engInitials in engBrandInitials" :key="`eng_${engInitials}`">
                        <a
                            :class="{ 'S=sort-on': selectedInitials === engInitials && selectedInitialsType === 'eng' }"
                            href="#"
                            @click.prevent="brandInitialsFilter(engInitials, 'eng')"
                        >
                            <b>{{ engInitials }}</b>
                        </a>
                    </li>
                </ul>
                <!--// ABC -->

                <!-- 검색어 -->
                <div class="m_brand-find-search">
                    <MMInput v-model="searchBrandKeyword" maxlength="20" :place-holder-text="'검색어를 입력하세요'" @keyup.enter="searchBrand" />
                    <button type="button" class="btn_search" @click="searchBrand">
                        <i class="ico_search T=sm" /><b class="mm_ir-blind">검색하기</b>
                    </button>
                </div>
                <!--// 검색어 -->
            </div>
            <!--// 브랜드검색 -->
            <template v-if="filteringBrands.length < 1">
                <p class="mm_text-none">
                    <i class="ico_text-none" />검색 결과가 없습니다
                </p>
            </template>
            <template v-else>
                <!-- 브랜드리스트 -->
                <div v-for="filterBrand in filteringBrands" :key="filterBrand.label" class="m_brand-list">
                    <template v-if="filterBrand.type === 'korean'">
                        <h5 class="text_title">
                            <b>{{ filterBrand.label }}</b>
                        </h5>
                        <ul>
                            <li v-for="brand in filterBrand.brands" :key="brand.id">
                                <MMLink :to="{ name: 'GoodsBrandIndex', params: { id: brand.id } }">
                                    <b>{{ brand.korName }}</b><small>{{ brand.engName }}</small>
                                </MMLink>
                            </li>
                        </ul>
                    </template>
                    <template v-else>
                        <h5 class="text_title T=title-en">
                            <b>{{ filterBrand.label }} </b>
                        </h5>
                        <ul>
                            <li v-for="brand in filterBrand.brands" :key="brand.id">
                                <MMLink :to="{ name: 'GoodsBrandIndex', params: { id: brand.id } }">
                                    <b>{{ brand.engName }}</b><small>{{ brand.korName }}</small>
                                </MMLink>
                            </li>
                        </ul>
                    </template>
                </div>
                <!--// 브랜드리스트 -->
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { brandShopRepository } from '$/repository/goods/brandShopRepository'
import { Brand, BrandCategories } from '$/@type/brand'
import { computed, onMounted, ref } from 'vue'
import { useBrandInitialsFilters } from '$/composables/goods/brandComposable'
import MMLink from '@/components/MMLink.vue'
import { mmon } from '$/helper/mmon'
import { useRoute, useRouter } from 'vue-router'
import { typeCastNumber } from '$/filters'
import { makePath } from '$/services/http'
import { usePageTitleSetting } from '$/composables/seoComposable';

const route = useRoute()
const router = useRouter()
usePageTitleSetting('브랜드맵');

const isLoaded = ref(false)
const brandCategories = ref<BrandCategories[]>()
const selectedBrandCategoryId = ref(typeCastNumber(`${route.query.category_id || '0'}`))
const selectedInitials = ref(`${route.query.initial || 'ㄱㄴㄷ' }`)
const { koreanBrandInitials, engBrandInitials, getKoreanInitial } = useBrandInitialsFilters()
const selectedInitialsType = ref(`${route.query.initial_type || 'korean'}`)
const searchBrandKeyword = ref(`${route.query.search || ''}`)
const allBrands = ref<Brand[]>([])


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
    }).filter((koreanBrandInitial) => koreanBrandInitial.brands.length > 0)
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
    }).filter((engBrandInitial) => engBrandInitial.brands.length > 0)
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

const filteringBrands = computed(() => {
    if (selectedInitials.value === 'ㄱㄴㄷ') {
        return koreanBrands.value;
    } else if (selectedInitials.value === 'ABC') {
        return engBrands.value
    } else if (selectedInitialsType.value === 'search') {
        const filteredBrands = allBrands.value.filter((brand) => {
            return brand.korName.toUpperCase().indexOf(selectedInitials.value.toUpperCase()) !== -1 
            || brand.engName.toUpperCase().indexOf(selectedInitials.value.toUpperCase()) !== -1;
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

    } else if (selectedInitials.value === '123') {

        if (selectedInitialsType.value === 'korean') {
            return koreanBrands.value.filter((filter) => {
                return filter.label === '123'
            })
        }

        return engBrands.value.filter((filter) => {
            return filter.label === '123'
        })
       
    } else {
        
        return (koreanBrands.value.concat(engBrands.value)).filter((filtered) => {
            return filtered.label === selectedInitials.value
        })
    }
})

function searchBrand() {
    if (searchBrandKeyword.value === '') {
        return mmon.bom.alert('검색어를 입력하세요')
    }

    brandInitialsFilter(searchBrandKeyword.value, 'search')
}

onMounted(async () => {
    const [categories, allBrand] = await Promise.all([
        brandShopRepository.brandCategories(), 
        brandShopRepository.allBrands()
    ])

    brandCategories.value = categories
    allBrands.value = allBrand
    isLoaded.value = true
})

function selectCategory(categoryId: number) {
    selectedBrandCategoryId.value = categoryId
    router.replace(makePath(route.path, {
        category_id: categoryId,
        initial: selectedInitials.value,
        initial_type: selectedInitialsType.value,
        search: searchBrandKeyword.value,
    }))
}

function brandInitialsFilter(Initials: string, InitialsType: string) {    
    if (InitialsType !== 'search') {
        searchBrandKeyword.value  = '';
    }
    selectedInitials.value = Initials
    selectedInitialsType.value = InitialsType
    router.replace(makePath(route.path, {
        category_id: selectedBrandCategoryId.value,
        initial: selectedInitials.value,
        initial_type: selectedInitialsType.value,
        search: searchBrandKeyword.value,
    }))
}
</script>
