<template>
    <!-- 상품선택 -->
    <div class="m_modal-myreview-product">
        <!--
            (D) 단일/묶음상품에 따라 노출되는 'mm_product-select(상품정보)'의 형태가 다릅니다.
            1. 상품정보 자동노출 형태 : 단일 상품 주문건, '마이페이지 > MY리뷰'에서 리뷰수정 버튼 클릭 시
            2. 상품 선택 형태 : 주문관리 페이지에서 한 셀러에게 2개 이상 구매한 상품 주문건
        -->
        <!-- 상품정보 : 선택형 -->
        <div class="m...product-point S=point-on">
            <p>
                <i class="ico_photo" />
                포토 리뷰 등록 시 최대
                <b>
                    <strong>{{ MMFilters.formatNumber(myReviewPointSetting.photoReviewPoint) }}</strong>
                    <sub>{{ pointLabel.suffix }}</sub>
                </b>
                적립!
            </p>
            <div
                class="mm_dropdown"
                :class="{'S=on': showReviewPointInfo }"
                data-dropdown
                @click="showReviewPointInfo = !showReviewPointInfo"
            >
                <button
                    type="button"
                    class="btn_dropdown"
                    :title="showReviewPointInfo ? '펼쳐보기' : ''"
                >
                    <b>텍스트 리뷰<strong>{{ MMFilters.formatNumber(myReviewPointSetting.textReviewPoint) }}</strong><sub>{{ pointLabel.suffix }}</sub></b>
                    <b>포토 리뷰<strong>{{ MMFilters.formatNumber(myReviewPointSetting.photoReviewPoint) }}</strong><sub>{{ pointLabel.suffix }}</sub></b>
                    <i class="ico_dropdown" />
                </button>
                <div
                    class="mm_dropdown-item"
                    :style="showReviewPointInfo ? { height: 'auto' } : {}"
                >
                    <div class="mm_dropdown-item-inner">
                        <div class="mm_table-point">
                            <table>
                                <thead>
                                    <tr>
                                        <th scope="row">
                                            <b>적립금 지급</b>
                                        </th>
                                        <th scope="col">
                                            <b>텍스트 리뷰</b>
                                        </th>
                                        <th scope="col">
                                            <b>포토 리뷰</b>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                        v-for="pointSetting in gradeReviewPointSetting"
                                        :key="pointSetting.gradeId"
                                    >
                                        <th scope="row">
                                            <b>{{ pointSetting.gradeName }}</b>
                                        </th>
                                        <td><b><strong>{{ MMFilters.formatNumber(pointSetting.textReviewPoint) }}</strong><sub>{{ pointLabel.suffix }}</sub></b></td>
                                        <td><b><strong>{{ MMFilters.formatNumber(pointSetting.photoReviewPoint) }}</strong><sub>{{ pointLabel.suffix }}</sub></b></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 상품정보 : 자동노출 -->
        <div
            v-if="orderItem"
            class="mm_product-select"
        >
            <div class="mm_product-item T=single T=sm">
                <a>
                    <figure>
                        <div class="mm_image-scale">
                            <i
                                v-lazyload="{ src: orderItem.goods.thumbnailUrl }"
                                class="mm_bg-cover image_product"
                            />
                        </div>
                        <figcaption>
                            <p class="text_product">{{ orderItem.goods.name }}</p>
                            <p class="text_option">{{ orderItem.goods.optionName }} / {{ orderItem.goods.ea }}개</p>
                        </figcaption>
                    </figure>
                </a>
            </div>
        </div>
        <!--// 상품정보 : 자동노출 -->
        <!-- 상품정보 : 선택형 -->
        <OrderItemGoodsSelect
            v-else-if="selectableOrderItems.length > 0"
            :order-items="selectableOrderItems"
            @apply="(orderItem: ReviewableOrderItem) => reviewForm.orderItem = orderItem"
        />
        <!--// 상품정보 : 선택형 -->
    </div>
    <!--// 상품선택 -->
    <div class="m_modal-myreview-value">
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
                        :class="{'S=starscore-on': reviewForm.rate >= score}"
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
        <!-- 리뷰선택 항목 -->
        <template v-if="isUseReviewTemplate">
            <section
                v-for="(template, templateIndex) in reviewTemplates" 
                :key="template.id"
            >
                <h5><b>{{ MMFilters.applyZosa(`${template.title}(은/는)`) }} 어떤가요?</b></h5>
                <div class="mm_radio-list">
                    <ul class="mm_flex T=equal">
                        <li
                            v-for="(detail, detailIndex) in template.details"
                            :key="detail.id"
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
        <!--// 리뷰선택 항목 -->
    </div>
    <div class="m_modal-myreview-info">
        <template v-if="hasPersonalization">
            <h5 class="mm_text-label">
                <span>신체 정보 입력</span><span class="mm_text-primary">(선택)</span>
            </h5>
            <div class="mm_form_mix-linked">
                <MMInput
                    v-model="reviewForm.height"
                    place-holder-text="키"
                    data-type="number"
                />
                <span class="text_linked">cm</span>
                <MMInput
                    v-model="reviewForm.weight"
                    place-holder-text="몸무게"
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
                    <li>해당 정보는 다른 분들의 사이즈 참고용으로만 사용되고 개인식별정보는 공개되지 않습니다</li>
                </ul>
            </div>
        </template>
        <!-- 리뷰내용 -->
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
        />
        <div class="mm_note">
            <ul>
                <li>사진은 jpg, png 파일로 3개까지 업로드 가능합니다.</li>
                <li>첫번째 등록한 사진이 리뷰 대표 이미지로 설정됩니다.</li>
                <li>입력하신 리뷰 위에 등록한 이미지가 노출됩니다.</li>
                <li>동일한 문자 또는 자음/모음은 4회 이상 연속 입력할 수 없습니다.</li>
                <li>소중한 고객님의 개인 정보 보호를 위해 주민번호, 전화번호 등 개인 정보는 절대 입력하지 않도록 주의해주세요.</li>
                <li>저작권 침해/음란/욕설/비방 글, 개인 정보 유출(전화번호, 주민번호, 이름, 아이디 등), 판매/광고/홍보성 글을 등록한 경우 <br>임의로 삭제될 수 있습니다.</li>
            </ul>
        </div>
        <!--// 리뷰내용 -->
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
    <!--// 하단버튼 -->
</template>



<script setup lang='ts'>
// modules & helpers
import { ref, computed, watch } from 'vue'
import { getTargetValue, makeValidator } from '$/validator';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
// types & repos
import { ReviewableOrderItem, ReviewTemplate } from '$/@type/member/review';
import { ShoesSize, GradeReviewPointSetting } from '$/@type/configs';
import { reviewRepository } from '$/repository/reviewRepository';
// components
import MMRadio from '@/components/input/Radio.vue';
import MMTextarea from '@/components/input/Textarea.vue';
import MMImage from '@/components/input/Image.vue';
import MMSelect from '@/components/input/Select.vue';
import OrderItemGoodsSelect from '@/components/OrderItemGoodsSelect.vue';
import { MySize } from '$/@type/member/info';
import { useGlobalConfigs, useMyPointRule } from '$/composables/globalConfigComposable';
import { PointLabel } from '$/@type/member/point';
import { ModalCloseHandler } from '$/@type/Modal';


const props = defineProps<{
    hasPersonalization: boolean,
    orderItems: ReviewableOrderItem[],
    closer: ModalCloseHandler<void>,
    shoesSizeList: ShoesSize[],
    mySizeInfo: MySize|null,
}>();

/** VARIABLE */
const orderItem = computed(() => {
    if (props.orderItems.length === 1) {
        return props.orderItems[0];
    }

    return null;
})
/** FUNCTION */

/** VUE LIFE CYCLE */
const { globalConfigs } = useGlobalConfigs();
// 내 등급의 리뷰 포인트 설정
const { myPointRule: myReviewPointSetting } = useMyPointRule();
// 리뷰항목 사용여부
const isUseReviewTemplate = ref<boolean>(globalConfigs.value.paidFeatures.reviewTemplate);
// 리뷰 항목
const reviewTemplates = ref<ReviewTemplate[]>([])
// 등급별 리뷰 포인트 설정
const gradeReviewPointSetting = ref<GradeReviewPointSetting[]>(globalConfigs.value.point.gradeRules)
// 등급별 리뷰 포인트 안내 영역 노출
const showReviewPointInfo = ref<boolean>(false);
// 포인트 명칭
const pointLabel = ref<PointLabel>(globalConfigs.value.point.label);

// 주문상품 리스트 (동일옵션 묶음처리)
const selectableOrderItems = computed<ReviewableOrderItem[]>(() => {
    const grouped: {[key: number]: ReviewableOrderItem} = props.orderItems.reduce((
        accumulator: {[key: number]: ReviewableOrderItem}, 
        currentValue: ReviewableOrderItem
    ) => {
        const key = currentValue.optionId;
        if (!accumulator[key]) {
            accumulator[key] = currentValue;                
        } else {
            accumulator[key].goods.ea++;
        }
        return accumulator;
    }, {});
    return Object.values(grouped);
});

// 리뷰 작성 데이터
const reviewForm = ref<{
    orderItem: ReviewableOrderItem|undefined
    rate: number
    contents: string
    images: File[]
    height: string
    weight: string
    shoesSize: string
    templateIdPairs: string[]
}>({
    orderItem: undefined,
    rate: 5,
    contents: '',
    images: [],
    height: `${props.mySizeInfo?.height || ''}`,
    weight: `${props.mySizeInfo?.weight || ''}`,
    shoesSize : `${props.shoesSizeList.find(size => size.id === props.mySizeInfo?.shoesSizeId)?.value || ''}`,
    templateIdPairs: [],
});

if (props.orderItems.length === 1 && orderItem.value) {
    reviewForm.value.orderItem = orderItem.value;
}

/**
 * 리뷰 작성
*/
async function createReview() {
    mmon.loading.show();
    const formData = new FormData();
    formData.append('order_id', reviewForm.value.orderItem?.orderId || '');
    formData.append('option_id', String(reviewForm.value.orderItem?.optionId) || '');
    formData.append('ea', String(reviewForm.value.orderItem?.goods.ea) || '');
    formData.append('rate', reviewForm.value.rate === 0 ? '' : String(reviewForm.value.rate));
    formData.append('contents', reviewForm.value.contents);
    formData.append('height', reviewForm.value.height);
    formData.append('weight', reviewForm.value.weight);
    formData.append(
        'shoes_size', 
        reviewForm.value.shoesSize 
            ? String(props.shoesSizeList.find((size) => String(size.value) === reviewForm.value.shoesSize)?.value) 
            : ''
    );
    reviewForm.value.images.forEach((image) => {
        if (!image) {
            return;
        }
        formData.append('images[]', image);
    });

    // 리뷰템플릿별 선택값
    reviewForm.value.templateIdPairs.forEach((selected, index) => {
        const selectedPair = selected.split('_');
        formData.append(`selected_review_templates[${index}][template_id]`, selectedPair[0]);
        formData.append(`selected_review_templates[${index}][template_detail_id]`, selectedPair[1]);
    });

    const validator = makeValidator(formData)
        .setRules({
            'order_id(주문상품)': ['required'],
            'option_id(주문상품)': ['required'],
            'rate(별점)': ['required'],
            'height(키)': ['number'],
            'weight(몸무게)': ['number'],
            'shoesSize(신발 사이즈)': ['in:'+ props.shoesSizeList.map(size => size.value).join(',')],
            'contents(내용)': ['required', 'minLength:10', 'maxLength:2000', 'blank', 'noRepeat'],
            'images.*(사진)': ['mimes'],
        })
        .setMessages({
            'order_id.required': ':param(을/를) 선택해주세요.',
            'option_id.required': ':param(을/를) 선택해주세요.',
            'rate.required': ':param(을/를) 선택해주세요.',
            'contents.required': '내용을 입력해주세요.',
            'contents.blank': '내용을 입력해주세요.',
            'contents.noRepeat': '동일한 문자 또는 자음/모음은\n4회 이상 연속 입력할 수 없습니다.',
            'images.*.mimes': "파일 확장자를 확인해주세요."
        })
        .registTester('mimes', function (param: string, extraValue:string, data:Object) {
            const file: File = getTargetValue(data, param)
            if (file instanceof File === false && file instanceof Blob === false) {
                return true;
            }

            if(file.type.includes('image')) {
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
            return true
        });

    try {
        await validator.run();
        await reviewRepository.create(formData);
        mmon.bom.alert('리뷰가 등록되었습니다.', () => {
            props.closer();
        })
    } catch (e) {
        defaultCatch(e);
    } finally {
        mmon.loading.hide();
    }
} 

watch(() => reviewForm.value.orderItem, async() => {
    if (!isUseReviewTemplate.value || !reviewForm.value.orderItem) {
        return reviewTemplates.value = [];
    }

    try {
        reviewTemplates.value = await reviewRepository.getReviewTemplates(reviewForm.value.orderItem.goods.id);
    } catch (e) {
        defaultCatch(e)
    }
}, {
    immediate: true
}) 
</script>