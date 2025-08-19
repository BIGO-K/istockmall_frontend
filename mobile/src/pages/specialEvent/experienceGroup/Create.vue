<template>
    <ModalPopup>
        <template #headerTitle>
            <h1><b>체험단 후기 쓰기</b></h1>
        </template>
        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="m_popup-experience">
                            <!-- 상품정보 : 선택형 -->
                            <div class="m_popup-experience-product">
                                <div class="mm_product-select" :class="selected ? 'S=selected-complete' : ''">
                                    <div :class="['mm_dropdown', { 'S=on': dropdownOn }]" data-dropdown>
                                        <button
                                            type="button"
                                            class="btn_dropdown"
                                            :title="dropdownOn ? '접어놓기' : '펼쳐보기'"
                                            @click="() => { dropdownOn = !dropdownOn }"
                                        >
                                            <b>상품을 선택해주세요</b>
                                            <i class="ico_dropdown T=bold" />
                                        </button>
                                        <div class="mm_dropdown-item" :style="dropdownOn ? { height: 'auto' } : {}">
                                            <div class="mm_dropdown-item-inner">
                                                <div class="mm_scroller">
                                                    <div class="mm_product-list T=xs">
                                                        <ul>
                                                            <template v-for="item in reviewableItems" :key="item.id">
                                                                <li v-for="option in item.optionList" :key="option.id">
                                                                    <div class="mm_product-item">
                                                                        <a @click.prevent="selectItem(item, option)">
                                                                            <figure>
                                                                                <i v-lazyload="{ src: item.thumbnailUrl }" class="mm_bg-cover image_product" />
                                                                                <figcaption>
                                                                                    <p class="text_product">{{ item.name }}</p>
                                                                                    <p class="text_option">{{ option.name }}</p>
                                                                                </figcaption>
                                                                            </figure>
                                                                        </a>
                                                                    </div>
                                                                </li>
                                                            </template>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- (D) 선택된 상품이 노출됩니다. -->
                                    <div v-if="selected" class="mm_product-select-complete">
                                        <div class="mm_product-item T=single-xs">
                                            <a> 
                                                <figure>
                                                    <i v-lazyload="{ src: selected?.thumbnailUrl }" class="mm_bg-cover image_product" />
                                                    <figcaption>
                                                        <p class="text_product">{{ selected?.name }}</p>
                                                        <p v-if="selectedOption?.name" class="text_option">{{ selectedOption?.name }}</p>
                                                    </figcaption>
                                                </figure>
                                            </a>
                                        </div>
                                        <button type="button" class="btn_remove" @click="selected = undefined; selectedOption = undefined; $emit('apply', selected)">
                                            <i class="ico_remove" /><b class="mm_ir-blind">삭제하기</b>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <!--// 상품정보 : 선택형 -->
                            <hr class="mm_line">
                            <!-- 별점 -->
                            <section>
                                <h6><b>상품은 만족하셨나요?</b></h6>
                                <!--
                                    (D) 별점이 선택된 상태일 때는 m_popup-experience-starscore 태그에 'S=starscore-choice' 클래스가 추가됩니다.
                                    선택된 별점의 li에 'S=starscore-on' 클래스와 button에 '선택됨' 타이틀이 추가되며, input hidden의 value값에 점수가 입력됩니다. (0 선택안됨)
                                -->
                                <div class="m_popup-experience-starscore S=starscore-choice">
                                    <ul>
                                        <li
                                            v-for="score in 5"
                                            :key="score"
                                            :class="{ 'S=starscore-on': reviewForm.rate >= score }"
                                        >
                                            <button
                                                type="button"
                                                :title="reviewForm.rate === score ? '선택됨' : ''"
                                                @click="reviewForm.rate = score"
                                            >
                                                <i class="ico_star-fill" title="별점" />
                                                <b class="mm_ir-blind">5점 만점에 {{ score }}점</b>
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </section>
                            <!--// 별점 -->

                            <!-- 리뷰 선택 항목 -->
                            <template v-if="selected">
                                <section v-for="(template, templateIndex) in reviewTemplates" :key="template.id">
                                    <h6><b>{{ MMFilters.applyZosa(`${template.title}(은/는)`) }} 어떤가요?</b></h6>
                                    <div class="mm_radio-list">
                                        <ul class="mm_flex T=equal">
                                            <li v-for="(detail, detailIndex) in template.details" :key="`detail_${detail.id}`">
                                                <MMRadio
                                                    v-model="reviewForm.templateIdPairs[templateIndex]"
                                                    :checked="detailIndex === 1"
                                                    :name="`review_template_${template.id}`"
                                                    :value="`${template.id}_${detail.id}`"
                                                >
                                                    <b class="mm_block">
                                                        <i class="ico_form-radio" />
                                                        <span class="text_label">{{ detail.label }}</span>
                                                    </b>
                                                </MMRadio>
                                            </li>
                                        </ul>
                                    </div>
                                </section>
                            </template>
                            <!--// 리뷰 선택 항목 -->

                            <div class="mm_inner">
                                <h6 class="mm_text-label">
                                    <b>신체 정보 입력</b><strong class="mm_text-variable">(선택)</strong>
                                </h6>
                                <div class="mm_flex T=equal">
                                    <div class="mm_form_mix-linked">
                                        <MMInput
                                            v-model="reviewForm.height"
                                            placeholder="키"
                                            data-type="number"
                                        />
                                        <span class="text_linked">cm</span>
                                    </div>
                                    <div class="mm_form_mix-linked">
                                        <MMInput
                                            v-model="reviewForm.weight"
                                            placeholder="몸무게"
                                            data-type="number"
                                        />
                                        <span class="text_linked">kg</span>
                                    </div>
                                    <div class="mm_form_mix-linked">
                                        <MMSelect v-model="reviewForm.shoesSize">
                                            <option value="">
                                                발 사이즈
                                            </option>
                                            <option v-for="size in shoesSizeList" :key="size.id" :value="size.value">
                                                {{ size.label }}
                                            </option>
                                        </MMSelect>
                                        <span class="text_linked">mm</span>
                                    </div>
                                </div>
                                <div class="mm_note">
                                    <ul>
                                        <li>해당 정보는 다른 분들의 사이즈 참고용으로만 사용되고 개인식별정보는 공개되지 않습니다</li>
                                    </ul>
                                </div>
                                <h6 class="mm_text-label">
                                    <b>체험단 후기 제목</b>
                                </h6>
                                <MMInput
                                    v-model="reviewForm.title"
                                    :maxlength="40"
                                    :placeholder="'띄어쓰기 포함 최대 40자까지 입력 가능합니다'"
                                    :use-trim="false"
                                />
                                <h6 class="mm_text-label">
                                    <b>리뷰 내용</b>
                                </h6>
                                <MMTextarea
                                    v-model="reviewForm.contents"
                                    :max-byte="2000"
                                    :place-holder-text="'10자 이상 2,000자 이하로 입력하세요'"
                                />
                                <MMImage
                                    v-model="reviewForm.images"
                                    accept="image/*"
                                    :max="10"
                                    :is-t-equal="false"
                                />
                                <div class="mm_note">
                                    <ul>
                                        <li>사진은 jpg, png 파일로 10개까지 업로드 가능합니다.</li>
                                        <li>첫번째 등록한 사진이 리뷰 대표 이미지로 설정됩니다.</li>
                                        <li>입력하신 리뷰 위에 등록한 이미지가 노출됩니다.</li>
                                        <li>동일한 문자 또는 자음/모음은 4회 이상 연속 입력할 수 없습니다.</li>
                                        <li>소중한 고객님의 개인 정보 보호를 위해 주민번호, 전화번호 등 개 인 정보는 절대 입력하지 않도록 주의해주세요.</li>
                                        <li>저작권 침해/음란/욕설/비방 글, 개인 정보 유출(전화번호, 주민 번호, 이름, 아이디 등), 판매/광고/홍보성 글을 등록한 경우 임의 로 삭제될 수 있습니다.</li>
                                    </ul>
                                </div>
                                <div class="mm_foot">
                                    <div class="mm_btn_box">
                                        <button type="button" class="mm_btn T=primary" @click="createReview">
                                            <b>등록하기</b>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--// 본문 -->
                </div>
            </div>

            <a class="btn_topmost" href="#mm_app" data-href="{ '_type': 'anchor' }" title="페이지 처음으로"><i class="ico_topmost" /><b>TOP</b></a>
        </template>
    </ModalPopup>
</template>

<script setup lang="ts">
import { SelectableReviewTemplate, ReviewableItem, Option } from '$/@type/experienceGroup';
import { ref, onMounted } from 'vue';
import { makeValidator, getTargetValue } from '$/validator';
import { experienceGroupRepository } from '$/repository/experienceGroupRepository';
import { reviewRepository } from '$/repository/reviewRepository';
import { defaultCatch } from '$/functions';
import { useGlobalConfigs } from '$/composables/globalConfigComposable';
import { ShoesSize } from '$/@type/configs';
import { mmon } from '$/helper/mmon';
import MMTextarea from '@/components/input/Textarea.vue';
import MMSelect from '@/components/input/Select.vue';
import MMRadio from '@/components/input/Radio.vue';
import MMImage from '@/components/input/Image.vue';
import ModalPopup from '@/components/layout/ModalPopup.vue';
import router from '@/router';
import { usePersonalization } from '$/composables/goods/reviewComposable';

const emit = defineEmits(['apply'])
const { globalConfigs } = useGlobalConfigs();

/** // VARIABLE */
// 후기 작성 가능한 상품 리스트
const reviewableItems = ref<ReviewableItem[]>([]);

const selected = ref<ReviewableItem>();
const selectedOption = ref<Option>();

const { 
    getMySize, 
    getShoesSizes, 
    hasPersonalization 
} = usePersonalization();

const isUseReviewTemplate= ref<boolean>(globalConfigs.value.paidFeatures.reviewTemplate);

// 리뷰 항목
const reviewTemplates = ref<SelectableReviewTemplate[]>([]);

// 신발 사이즈 리스트
const shoesSizeList = ref<ShoesSize[]>([]);

// 리뷰 작성 데이터
const reviewForm = ref<{
    selectItem: ReviewableItem
    rate: number
    title: string
    contents: string
    images: File[]
    height: string
    weight: string
    shoesSize: string
    templateIdPairs: string[]
}>({
    selectItem: {
        id: 0,
        name: '',
        brandName: '',
        thumbnailUrl: '',
        optionList: [
            {
                id: 0,
                name: '',
            }
        ]
    },
    rate: 5,
    title: '',
    contents: '',
    images: [],
    height: '',
    weight: '',
    shoesSize : '',
    templateIdPairs: [],
});

const dropdownOn = ref(false);
/** // VARIABLE */

/** FUNCTION */
/**
 * 상품 선택
 */
async function selectItem(item: ReviewableItem, option: Option) {
    reviewForm.value.selectItem = item;
    selected.value = item;
    dropdownOn.value = false;
    selectedOption.value = option;

    if (!isUseReviewTemplate.value) {
        return;
    }

    // 리뷰 템플릿 조회
    reviewTemplates.value = item.id ? await reviewRepository.getReviewTemplates(item.id) : [];

    if (reviewTemplates.value.length === 0) {
        reviewForm.value.templateIdPairs = [];
    }     

    emit('apply', item);
}

/**
 * 리뷰 등록하기
 */
async function createReview() {
    const formData = new FormData();
    formData.append('goods_id', reviewForm.value.selectItem?.id ? String(reviewForm.value.selectItem?.id) : '');
    formData.append('option_id', selectedOption.value?.id ? String(selectedOption.value?.id) : '');
    formData.append('rate', reviewForm.value.rate ? String(reviewForm.value.rate) : '');
    formData.append('title', reviewForm.value.title || '');
    formData.append('contents', reviewForm.value.contents || '');
    formData.append('height', reviewForm.value.height ? String(reviewForm.value.height) : '');
    formData.append('weight', reviewForm.value.weight ? String(reviewForm.value.weight) : '');
    formData.append(
        'shoes_size', 
        reviewForm.value.shoesSize 
            ? String(shoesSizeList.value.find((size) => String(size.value) === reviewForm.value.shoesSize)?.value) 
            : ''
    );
                
    reviewForm.value.images.forEach((image) => {
        if (!image) {
            return;
        }
                    
        formData.append('images[]', image);
    });

    // 리뷰 템플릿별 선택 값
    reviewForm.value.templateIdPairs.forEach((selected, index) => {
        const selectedPair = selected.split('_');
        formData.append(`selected_review_templates[${index}][template_id]`, selectedPair[0]);
        formData.append(`selected_review_templates[${index}][template_detail_id]`, selectedPair[1]);
    });

    const validator = makeValidator(formData)
        .setRules({
            'goods_id(상품)': ['required'],
            'option_id(상품)': ['required'],
            'rate(평점)': ['required'],
            'title(제목)': ['required', 'maxLength:40'],
            'contents(체험단 내용)': ['required', 'minLength:10', 'maxLength:2000', 'blank', 'noRepeat'],
            'height(키)': ['number'],
            'weight(몸무게)': ['number'],
            'shoes_size(발 사이즈)': ['in:' + shoesSizeList.value.map(size => size.value).join(',')],
            'images.*(사진)': ['mimes'],
        })
        .setMessages({
            'goods_id.required': ':param(을/를) 선택해 주세요.',
            'option_id.required': ':param(을/를) 선택해 주세요.',
            'rate.required': ':param(을/를) 선택해 주세요.',
            'title.required': ':param(을/를) 입력해 주세요.',
            'contents.required': ':param(을/를) 입력해 주세요.',
            'contents.minLength': ':param(은/는) 10자 이상 입력해주세요.',
            'contents.blank': ':param(을/를) 입력해 주세요.',
            'contents.noRepeat': '동일한 문자 또는 자음/모음은\n4회 이상 연속 입력할 수 없습니다.',
            'images.*.mimes': "파일 확장자를 확인해주세요."
        })
        .registTester('mimes', function (param: string, extraValue:string, data:Object) {
            const file: File = getTargetValue(data, param);

            if (file instanceof File === false && file instanceof Blob === false) {
                return true;
            }

            if (file.type.includes('image')) {
                return true;
            }

            return false;
        })
        .registTester('blank', (param, extraValue, data) => {
            const target = getTargetValue(data, param);
            if (target && !target.replace(/\s/g, '').length) {
                return false;
            }
            return true
        })
        .registTester('noRepeat', function (param: string, extraValue:string, data:Object) {
            const target = getTargetValue(data, param);

            if (target) {
                // 동일한 문자/숫자 4자 이상 사용 제한 (문자)
                if (/(\w|\W)\1\1\1/.test(target) || /([^가-힣\x20])\1\1\1/i.test(target)) {
                    return false;
                }
            }

            return true;
        });

    try {
        await validator.run();
        mmon.bom.confirm('작성하신 체험단 후기는<br>관리자 확인을 통해 최종<br>반영됩니다.', async(flag: boolean) => {
            if (flag) {
                await experienceGroupRepository.create(formData);
                router.go(-1);
            }
        });
    } catch (e) {
        defaultCatch(e);
    }
}
/** // FUNCTION */

/** VUE LIFE CYCLE */
onMounted(async() => {
    reviewableItems.value = await experienceGroupRepository.reviewableItems();
    if (hasPersonalization.value) {
        const [ shoesSizes, mySizeInfo ] = await Promise.all([
            getShoesSizes(),
            getMySize(),
        ]);
        
        shoesSizeList.value = shoesSizes;
        // 리뷰 form 개인화 관련 정보 초기화
        reviewForm.value.height = mySizeInfo?.height ? String(mySizeInfo.height) : '';
        reviewForm.value.weight = mySizeInfo?.weight ? String(mySizeInfo.weight) : '';
        reviewForm.value.shoesSize = mySizeInfo?.shoesSizeId ? 
            `${shoesSizeList.value.find((size) => size.id === mySizeInfo.shoesSizeId)?.value || ''}` 
            : '';
    }
});
/** // VUE LIFE CYCLE */
</script>