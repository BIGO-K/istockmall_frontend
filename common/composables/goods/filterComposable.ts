import { 
    FilterBrand, 
    CommonGoodsFilter, 
    CommonFilter,
    PriceTag
} from '$/@type/searchFilter';
import { useDeepClone, useRouteQueryCast } from '$/composables/commonComposable';
import { formatNumber, typeCastNumber } from "$/filters";
import { mmon } from '$/helper/mmon';
import { computed, Ref, ref, watch } from "vue";

export function useBrandFilter(brands: Ref<FilterBrand[]>) {
    /** STORE **/
    /** //STORE **/
    /** VARIABLE **/    
    /**
     * 브랜드 필터를 위한 초성 항목 배열 
    */
    const brandInitials = [
        'ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        '123',
        '전체',
    ];

    const selectedBrandInitials = ref('전체');
    const searchBrandText = ref('');

    const sortingBrands = computed(() => {
        return brands.value.sort((a, b) => {
            return a.name.localeCompare(b.name, 'kor')
        })
    })
    /**
     * 이니셜로 필터링된 브랜드 항목
    */
    const initialsFilterBrands = computed<FilterBrand[]>(() => {
        if (selectedBrandInitials.value === '전체') {
            return sortingBrands.value
        }

        if(selectedBrandInitials.value === '123') {
            return brands.value.filter((brand) => {
                return /^[0-9]/.test(brand.name) ||  (/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/g).test(brand.name);
            }) 
        }

        if (/[a-zA-Z]/.test(selectedBrandInitials.value)) {
            return brands.value.filter((brand) => {
                return new RegExp('^[' + selectedBrandInitials.value.toLowerCase() + selectedBrandInitials.value.toUpperCase() + ']').test(brand.name);
            })
        }

        if (/[ㄱ-ㅎ]/.test(selectedBrandInitials.value)) {
            return sortingBrands.value.filter((brand) => {
                return (new RegExp('^[' + selectedBrandInitials.value + ']')).test(getKoreanInitial(brand.name, true));
            })
        }

        if (searchBrandText.value !== '' && selectedBrandInitials.value === '') {
            return sortingBrands.value.filter((brand) => {
                return brand.name.indexOf(searchBrandText.value) > -1;
            })
        }

        return []
    })

    /** //VARIABLE **/

    /** FUNC **/
    function getKoreanInitial(str: string, noDouble?: boolean /* 된소리 순화 */) {
        noDouble = noDouble || false;
        var initials = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
        var result = '';
        for(var i = 0; i < str.length; i++) {
            var code = str.charCodeAt(i) - 44032;
            var initial = str[i];
            if (code > -1 && code < 11172) {
                initial = initials[Math.floor(code / 588)];
            }

            if (noDouble === true) {
                if (initial == 'ㄲ') {
                    initial = 'ㄱ';
                } else if (initial == 'ㄸ') {
                    initial = 'ㄷ';
                } else if (initial == 'ㅃ') {
                    initial = 'ㅂ';
                } else if (initial == 'ㅆ') {
                    initial = 'ㅅ';
                } else if (initial == 'ㅉ') {
                    initial = 'ㅈ';
                }
            }

            result += initial;
        }
        return result;
    }
    /** //FUNC **/
    
    return {
        searchBrandText,
        selectedBrandInitials,
        brandInitials,
        initialsFilterBrands,
    }
}

export function useFilterForm() {
    /** STORE **/

    /** //STORE **/
    const {
        toNumberArray,
        toNumber,
        toBoolean,
        toString,
        toArray
    } = useRouteQueryCast();

    /** VARIABLE **/
    const searchForm = ref<CommonGoodsFilter>({
        page: toNumber('page', 1),
        perPage: toNumber('perPage', 100),
        sorting: toString('sorting', 'selling'),
        categoryCodes: toArray('categoryCodes[]', []),
        brandIds: toNumberArray('brandIds[]', []),
        minPrice: toNumber('minPrice', 0),
        maxPrice: toNumber('maxPrice', 0),
        reviewRates: toNumberArray('reviewRates[]', []),
        fitIds: toNumberArray('fitIds[]', []),
        shoesSizeIds: toNumberArray('shoesSizeIds[]', []),
        colorIds: toNumberArray('colorIds[]', []),
        onlyFreeDelivery: toBoolean('onlyFreeDelivery', false),
        onlySale: toBoolean('onlySale', false),
        exceptSoldout: toBoolean('exceptSoldout', false)
    });

    const filters = ref<CommonFilter>({
        categories: [],
        brands: [],
        fitSizes: [],
        shoesSizes: [],
        colors: [],            
        gender: 'N'    
    })

    /** //VARIABLE **/

    /** FUNC **/
   
    /** //FUNC **/

    return {
        searchForm,
        filters,
    }
}

export function useFilterHandler(searchForm: CommonGoodsFilter) {
    /** STORE **/
    /** //STORE **/    

    /** VARIABLE **/
    const selectedFilters = ref<CommonGoodsFilter>(useDeepClone<CommonGoodsFilter>(searchForm));
    
    const tempSelectedCategories = ref<{[key: string] :{
        code: string,
        label: string,
        childCount: number,
        selectedDepth3Codes: {
            label: string,
            code: string
        }[]
    }}>({});


    const selectedPrices = ref<PriceTag[]>([]);
    const minPriceText = ref('');
    const maxPriceText = ref('');
    const customPriceLabel = ref('');

    /**
     * 필터 관련 상수항목 처리 
     */
    const reviewRates = [5, 4, 3, 2, 1];
    const priceFilters: PriceTag[] = [
        {
            label:  '~ 5만원',
            value: '0~50000',
            min: 0,
            max: 50000
        },
        {
            label:  '5만원 ~ 10만원',
            value: '50000~100000',
            min: 50000,
            max: 100000
        },
        {
            label:  '10만원 ~ 50만원',
            value: '100000~500000',
            min: 100000,
            max: 500000
        },
        {
            label:  '50만원 ~ 100만원',
            value: '500000~1000000',
            min: 500000,
            max: 1000000
        },
        {
            label:  '100만원~',
            value: '1000000~0',
            min: 1000000,
            max: 0
        }
    ]

    if (selectedFilters.value.minPrice > 0 || selectedFilters.value.maxPrice > 0) {
        const selectedPriceFilter = priceFilters.find((pr) => pr.max === selectedFilters.value.maxPrice && pr.min === selectedFilters.value.minPrice);
        if (selectedPriceFilter) {
            selectedPrices.value = [selectedPriceFilter];
        } else {
            customPriceLabel.value = `${formatNumber(selectedFilters.value.minPrice)}원 ~ ${ formatNumber(selectedFilters.value.maxPrice )}원`;

            if (selectedFilters.value.maxPrice === 0) {
                customPriceLabel.value = `${formatNumber(selectedFilters.value.minPrice)}원 ~`;    
            }

            if (selectedFilters.value.minPrice === 0) {
                customPriceLabel.value = `~ ${ formatNumber(selectedFilters.value.maxPrice )}원`;
            }
            
        }
    }
    
    /** //VARIABLE **/

    /** FUNC **/
    /**
     * 선택된 필터 삭제 처리 
     * @param type 필터 타입
     * @param value  필터 값
     * @param key 필터 키
    */
    function removeSelectedLabel (type: string, value: string, key: string) {
        switch (type) {
            case 'categories': 
                if (tempSelectedCategories.value[key]) {
                    if (tempSelectedCategories.value[key].code === value) {
                        tempSelectedCategories.value[key].selectedDepth3Codes = []
                    }  else {
                        tempSelectedCategories.value[key].selectedDepth3Codes = tempSelectedCategories.value[key].selectedDepth3Codes.filter((depth3) => {
                            return depth3.code !== value
                        })
                    }
                }
                break;
            case 'brand':
                selectedFilters.value.brandIds = selectedFilters.value.brandIds.filter((brandId) => {
                    return `${brandId}` !== value
                })
                break;
            case 'price':
                selectedPrices.value = [];
                minPriceText.value = '';
                maxPriceText.value = '';
                customPriceLabel.value = '';
                break;
            case 'reviewRate':
                selectedFilters.value.reviewRates = selectedFilters.value.reviewRates.filter((rate) => {
                    return `${rate}` !== value
                })
            case 'free_delivery': 
                selectedFilters.value.onlyFreeDelivery = false;
                break;
            case 'sale': 
                selectedFilters.value.onlySale = false;
                break;
            case 'except_sold_out': 
                selectedFilters.value.exceptSoldout = false;
                break;
            case 'fit': 
                selectedFilters.value.fitIds = selectedFilters.value.fitIds.filter((fitId) => {
                    return `${fitId}` !== value
                })
                break;
            case 'shoes':
                selectedFilters.value.shoesSizeIds = selectedFilters.value.shoesSizeIds.filter((shoesId) => {
                    return `${shoesId}` !== value
                })
                break;
            case 'color' :
                selectedFilters.value.colorIds = selectedFilters.value.colorIds.filter((colorId) => {
                    return `${colorId}` !== value
                })
            default:
                break;
        }
    }

    function resetAllFilter() {        
        selectedFilters.value = {            
            categoryCodes: [],
            brandIds: [],
            minPrice: 0,
            maxPrice: 0,
            reviewRates: [],
            fitIds: [],
            shoesSizeIds: [],
            colorIds: [],
            onlyFreeDelivery: false,
            onlySale: false,
            exceptSoldout: false,
            sorting: selectedFilters.value.sorting,
            page: 1,
            perPage: selectedFilters.value.perPage,
        }
        // 가격 관련 초기화 처리
        selectedPrices.value = []; 
        maxPriceText.value = '';
        minPriceText.value = '';
        customPriceLabel.value = '';
        // 카테고리 관련 추가 초기화 처리 
        tempSelectedCategories.value = {};
    }

    watch(selectedPrices, (current) => {
        if (current.length === 1) {
            if (customPriceLabel.value) {
                customPriceLabel.value = '';
            }            
            return;
        }            
        // 단일선택이기 때문에 이전꺼를 삭제해준다
        selectedPrices.value.reverse().pop();
    })

    function applyCustomPriceFilter() {
        const minPrice = typeCastNumber(minPriceText.value, 0);
        const maxPrice = typeCastNumber(maxPriceText.value, 0);

        if (minPrice === 0 && maxPrice === 0) {
            return 
        }

        selectedPrices.value = [];     
        
        if (
            minPrice !== 0 
            && maxPrice !== 0
            && minPrice >= maxPrice
        ) {
            return mmon.bom.alert('최대 금액을 최소 금액보다 크게 입력 해주세요.');
        }

        selectedFilters.value.minPrice = minPrice;
        selectedFilters.value.maxPrice = maxPrice;

        if (maxPrice === 0) {
            customPriceLabel.value = `${formatNumber(minPriceText.value)}원 ~`;    
            return
        }

        if (minPrice === 0) {
            customPriceLabel.value = `~ ${ formatNumber(maxPriceText.value )}원`;
            return 
        }

        customPriceLabel.value = `${formatNumber(minPriceText.value)}원 ~ ${ formatNumber(maxPriceText.value )}원`;
    }
    /** //FUNC **/

    return {        
        tempSelectedCategories,
        selectedFilters,
        selectedPrices,
        reviewRates,
        priceFilters,
        customPriceLabel,
        minPriceText,
        maxPriceText,
        //func 
        removeSelectedLabel,
        resetAllFilter,
        applyCustomPriceFilter
    }
}