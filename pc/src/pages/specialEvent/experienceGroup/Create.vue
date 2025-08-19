<template>
    <div
        class="mm_product-select"
        :class="currentSelectedItem ? 'S=selected-complete' : ''"
    >
        <div
            :class="['mm_dropdown', { 'S=on': dropdownOn }]"
            data-dropdown
        >
            <button
                type="button"
                class="btn_dropdown"
                :title="dropdownOn ? '접어놓기' : '펼쳐보기'"
                @click="() => { dropdownOn = !dropdownOn }"
            >
                <b>상품을 선택해주세요</b>
                <i class="ico_dropdown T=bold" />
            </button>
            <div
                class="mm_dropdown-item"
                :style="dropdownOn ? { height: 'auto' } : {}"
            >
                <div class="mm_dropdown-item-inner">
                    <div class="mm_scroller">
                        <ul>
                            <template
                                v-for="item in reviewableItems"
                                :key="item.id"
                            >
                                <li
                                    v-for="option in item.optionList"
                                    :key="option.id"
                                >
                                    <div class="mm_product-item T=single ">
                                        <a @click.prevent="selectItem(item, option)">
                                            <figure>
                                                <div class="mm_image-scale"><i
                                                    v-lazyload="{ src: item.thumbnailUrl }"
                                                    class="mm_bg-cover image_product"
                                                /></div>
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
        <!-- (D) 선택된 상품이 노출됩니다. -->
        <div
            v-if="currentSelectedItem"
            class="mm_product-select-complete"
        >
            <div class="mm_product-item T=single">
                <a> 
                    <figure>
                        <div class="mm_image-scale">
                            <i
                                v-lazyload="{ src: currentSelectedItem?.thumbnailUrl }"
                                class="mm_bg-cover image_product"
                            />
                        </div>
                        <figcaption>
                            <p class="text_brand">{{ currentSelectedItem?.brandName }}</p>
                            <p class="text_product">{{ currentSelectedItem?.name }}</p>
                            <p
                                v-if="selectedOption?.name"
                                class="text_option"
                            >{{ selectedOption?.name }}</p>
                        </figcaption>
                    </figure>
                </a>
            </div>
            <button
                type="button"
                class="btn_remove"
                @click="removeSelectedItem"
            >
                <i class="ico_remove" /><b class="mm_ir-blind">삭제하기</b>
            </button>
        </div>
    </div>
    <!--// 상품선택 -->
    <div class="m_modal-experience-value">
        <!-- 별점 -->
        <section>
            <h5><b>상품은 만족하셨나요?</b></h5>
            <div class="m...value-starscore">
                <!--
                            (D) 선택된 별점의 li 요소에 'S=starscore-on' 클래스를 추가하고, button 요소에 '선택됨' 타이틀을 추가합니다.
                            input hidden의 value 값에는 점수가 입력됩니다. (0 선택안됨)
                        -->
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
                            <i
                                class="ico_star"
                                title="별점"
                            />
                            <b class="mm_ir-blind">5점 만점에 {{ score }}점</b>
                        </button>
                    </li>
                </ul>
            </div>
        </section>
        <!--// 별점 -->

        <!-- 리뷰 선택 항목 -->
        <template v-if="currentSelectedItem">
            <section v-for="(template, templateIndex) in reviewTemplates" :key="template.id">
                <h5><b>{{ MMFilters.applyZosa(`${template.title}(은/는)`) }} 어떤가요?</b></h5>
                <div class="mm_radio-list">
                    <ul class="mm_flex T=equal">
                        <li
                            v-for="(detail, detailIndex) in template.details"
                            :key="`detail_${detail.id}`"
                        >
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
    </div>
    <div class="m_modal-experience-info">
        <template v-if="hasPersonalization">
            <!-- 신체 정보 입력 -->
            <h5 class="mm_text-label">
                <b>신체 정보 입력<strong class="mm_text-variable">(선택)</strong></b>
            </h5>
            <div class="mm_form_mix-linked">
                <MMInput
                    v-model="reviewForm.height"
                    placeholder="키"
                    data-type="number"
                />
                <span class="text_linked">cm</span>
                <MMInput
                    v-model="reviewForm.weight"
                    placeholder="몸무게"
                    data-type="number"
                />
                <span class="text_linked">kg</span>
                <MMSelect v-model="reviewForm.shoesSize">
                    <option value="">
                        발 사이즈
                    </option>
                    <option
                        v-for="size in shoesSizeList"
                        :key="size.id"
                        :value="size.value"
                    >
                        {{ size.label }}
                    </option>
                </MMSelect>
                <span class="text_linked">mm</span>
            </div>
            <div class="mm_note">
                <ul>
                    <li>해당 정보는 다른 분들의 사이즈 참고용으로만 사용되고 개인식별정보는 공개되지 않습니다.</li>
                </ul>
            </div>
            <!--// 신체 정보 입력 -->
        </template>

        <!-- 체험단 후기 내용 -->
        <h5 class="mm_text-label">
            <b>체험단 후기 제목</b>
        </h5>
        <MMInput
            v-model="reviewForm.title"
            :maxlength="40"
            :placeholder="'띄어쓰기 포함 최대 40자까지 입력 가능합니다'"
            :use-trim="false"
        />
        <h5 class="mm_text-label">
            <b>리뷰 내용</b>
        </h5>
        <MMTextarea
            v-model="reviewForm.contents"
            :max-byte="2000"
            :place-holder-text="'10자 이상 2,000자 이하로 입력하세요'"
        />
        <MMImage
            v-model="reviewForm.images"
            accept="image/*"
            :max="10"
        />
        <div class="mm_note">
            <ul>
                <li>사진은 jpg, png 파일로 10개까지 업로드 가능합니다.</li>
                <li>첫번째 등록한 사진이 리뷰 대표 이미지로 설정됩니다.</li>
                <li>입력하신 리뷰 위에 등록한 이미지가 노출됩니다.</li>
                <li>동일한 문자 또는 자음/모음은 4회 이상 연속 입력할 수 없습니다.</li>
                <li>소중한 고객님의 개인 정보 보호를 위해 주민번호, 전화번호 등 개인 정보는 절대 입력하지 않도록 주의해주세요.</li>
                <li>저작권 침해/음란/욕설/비방 글, 개인 정보 유출(전화번호, 주민번호, 이름, 아이디 등), 판매/광고/홍보성 글을 등록한 경우 <br>임의로 삭제될 수 있습니다.</li>
            </ul>
        </div>
        <!--// 체험단 후기 내용 -->
    </div>
    <!-- 하단버튼 -->
    <div class="mm_foot">
        <div class="mm_btn_box">
            <button
                type="button"
                class="mm_btn T=primary"
                @click="createReview"
            >
                <b>등록하기</b>
            </button>
        </div>
    </div>
</template>


<script setup lang='ts'>
import { ref, computed } from 'vue';
import { SelectableReviewTemplate, ReviewableItem, Option } from '$/@type/experienceGroup';
import { experienceGroupRepository } from '$/repository/experienceGroupRepository';
import { reviewRepository } from '$/repository/reviewRepository';
import { makeValidator, getTargetValue } from '$/validator';
import { defaultCatch } from '$/functions';
import { ShoesSize } from '$/@type/configs';
import { mmon } from '$/helper/mmon';
import MMTextarea from '@/components/input/Textarea.vue';
import MMSelect from '@/components/input/Select.vue';
import MMRadio from '@/components/input/Radio.vue';
import MMImage from '@/components/input/Image.vue';
import { MySize } from '$/@type/member/info';
import { ModalCloseHandler } from '$/@type/Modal';
import { useGlobalConfigs } from '$/composables/globalConfigComposable';

const props = defineProps<{
    hasPersonalization: boolean,
    reviewableItems: ReviewableItem[],
    shoesSizeList: ShoesSize[],
    mySizeInfo: MySize|null,
    closer: ModalCloseHandler<void>
}>();
/** VARIABLE */
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
        ],
    },
    rate: 5,
    title: '',
    contents: '',
    images: [],
    height: `${props.mySizeInfo?.height || ''}`,
    weight: `${props.mySizeInfo?.weight || ''}`,
    shoesSize : `${(props.shoesSizeList || []).find((size) => size.id == props.mySizeInfo?.shoesSizeId)?.value || ''}`,
    templateIdPairs: [],
});
const { globalConfigs } = useGlobalConfigs();
const isUseReviewTemplate= ref<boolean>(globalConfigs.value.paidFeatures.reviewTemplate);
const selectedOption = ref<Option|undefined>(undefined);
// 리뷰 항목
const reviewTemplates = ref<SelectableReviewTemplate[]>([]);
const dropdownOn = ref(false);

const currentSelectedItem = computed(() => {
    if (reviewForm.value.selectItem.id === 0 ) {
        return null
    }

    return reviewForm.value.selectItem;
})
/** FUNCTION */

function removeSelectedItem() {
    reviewForm.value.selectItem = {
        id: 0,
        name: '',
        brandName: '',
        thumbnailUrl: '',
        optionList: [
            {
                id: 0,
                name: '',
            }
        ],
    };
    selectedOption.value = undefined
}
/**
 * 상품 선택 시
*/
async function selectItem(item: ReviewableItem, option: Option) {
    reviewForm.value.selectItem = item;
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
}

/**
 * 리뷰 등록하기
*/
async function createReview() {
    const formData = new FormData();
    formData.append('goods_id', reviewForm.value.selectItem?.id ? String(reviewForm.value.selectItem?.id) : '');
    formData.append('option_id', selectedOption.value?.id ? String(selectedOption.value?.id) : '');
    formData.append('rate', reviewForm.value.rate ? String(reviewForm.value.rate) : '');
    formData.append('title', reviewForm.value.title);
    formData.append('contents', reviewForm.value.contents);
    formData.append('height', reviewForm.value.height);
    formData.append('weight', reviewForm.value.weight);
    formData.append('shoes_size', reviewForm.value.shoesSize);
                
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
            'shoes_size(발 사이즈)': ['in:' + props.shoesSizeList.map(size => size.value).join(',')],
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
                props.closer();
                // x                emit('close');
            }
        });
    } catch (e) {
        defaultCatch(e);
    }
}
/** VUE LIFE CYCLE */

</script>