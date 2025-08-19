<template>
    <ModalPopup>
        <template #headerTitle>
            <h1><b>리뷰 쓰기</b></h1>
        </template>

        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="m_popup-myreview">
                            <!-- 상품정보 : 선택형 -->
                            <div class="m_popup-myreview-product">
                                <div class="m...product-point S=point-on">
                                    <p>
                                        <i class="ico_review-photo" />
                                        포토 리뷰 등록 시 최대
                                        <b>
                                            <strong>{{ MMFilters.formatNumber(myReviewPointSetting.photoReviewPoint) }}</strong>
                                            <sub>{{ pointLabel.suffix }}</sub>
                                        </b>
                                        적립!
                                    </p>
                                    <div class="m...product-point-inner">
                                        <dl><dt>텍스트 리뷰</dt><dd><strong>{{ MMFilters.formatNumber(myReviewPointSetting.textReviewPoint) }}</strong><sub>{{ pointLabel.suffix }}</sub></dd></dl>
                                        <dl><dt>포토 리뷰</dt><dd><strong>{{ MMFilters.formatNumber(myReviewPointSetting.photoReviewPoint) }}</strong><sub>{{ pointLabel.suffix }}</sub></dd></dl>
                                    </div>
                                </div>
                                <div v-if="orderItems.length" class="mm_product-select">
                                    <div v-dropdown="{ closeIf: reviewForm.orderItem !== undefined }" class="mm_dropdown">
                                        <button type="button" class="btn_dropdown" title="펼쳐보기">
                                            <b>상품을 선택해주세요</b><i class="ico_dropdown T=bold" />
                                        </button>
                                        <div class="mm_dropdown-item">
                                            <div class="mm_dropdown-item-inner">
                                                <div class="mm_scroller">
                                                    <div class="mm_product-list T=xs">
                                                        <ul>
                                                            <li v-for="orderItem in orderItems" :key="`${orderItem.goods.id}_${orderItem.goods.optionId}`">
                                                                <div class="mm_product-item" @click="reviewForm.orderItem = orderItem">
                                                                    <a>
                                                                        <figure>
                                                                            <i v-lazyload="{ src: orderItem.goods.thumbnailUrl }" class="mm_bg-cover image_product" />
                                                                            <figcaption>
                                                                                <p class="text_product">{{ orderItem.goods.name }}</p>
                                                                                <p class="text_option">{{ orderItem.goods.optionName }}</p>
                                                                            </figcaption>
                                                                        </figure>
                                                                    </a>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- (D) 선택된 상품이 노출됩니다. -->
                                    <div class="mm_product-select-complete">
                                        <template v-if="reviewForm.orderItem">
                                            <div class="mm_product-item T=single-xs">
                                                <a>
                                                    <figure>
                                                        <i v-lazyload="{ 'src': reviewForm.orderItem.goods.thumbnailUrl }" class="mm_bg-cover image_product" />
                                                        <figcaption>
                                                            <p class="text_product">{{ reviewForm.orderItem.goods.name }}</p>
                                                            <p class="text_option">{{ reviewForm.orderItem.goods.optionName }}</p>
                                                        </figcaption>
                                                    </figure>
                                                </a>
                                            </div>
                                            <button type="button" class="btn_remove" @click="reviewForm.orderItem = null">
                                                <i class="ico_remove" /><b class="mm_ir-blind">삭제하기</b>
                                            </button>
                                        </template>
                                    </div>
                                </div>
                                <div v-if="orderItem" class="mm_product-select">
                                    <div class="mm_product-item T=single-xs">
                                        <a>
                                            <figure>
                                                <i v-lazyload="{ src: orderItem.goods.thumbnailUrl }" class="mm_bg-cover image_product" />
                                                <figcaption>
                                                    <p class="text_product">{{ orderItem.goods.name }}</p>
                                                    <p class="text_option">{{ orderItem.goods.optionName }} / {{ orderItem.goods.ea }}개</p>
                                                </figcaption>
                                            </figure>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <!--// 상품정보 : 선택형 -->
                            <hr class="mm_line">
                            <!-- 별점 -->
                            <section>
                                <h6><b>상품은 만족하셨나요?</b></h6>
                                <!--
                                    (D) 별점이 선택된 상태일 때는 m_popup-myreview-starscore 태그에 'S=starscore-choice' 클래스가 추가됩니다.
                                    선택된 별점의 li에 'S=starscore-on' 클래스와 button에 '선택됨' 타이틀이 추가되며, input hidden의 value값에 점수가 입력됩니다. (0 선택안됨)
                                -->
                                <div class="m_popup-myreview-starscore" :class="reviewForm.rate ? 'S=starscore-choice' : ''">
                                    <ul>
                                        <li 
                                            v-for="score in 5"
                                            :key="score"
                                            :class="{'S=starscore-on': reviewForm.rate >= score}"
                                        >
                                            <button type="button" :title="reviewForm.rate === score ? '선택됨' : ''" @click="reviewForm.rate = score">
                                                <i class="ico_star-fill" /><b class="mm_ir-blind">5점 만점에 {{ score }}점</b>
                                            </button>
                                        </li>
                                    </ul>
                                    <input type="hidden" :v-model="reviewForm.rate">
                                </div>
                            </section>
                            <!--// 별점 -->
                            <!-- 리뷰선택 항목 -->
                            <template v-if="isUseReviewTemplate">
                                <section v-for="(template, templateIndex) in reviewTemplates" :key="template.id">
                                    <h6><b>{{ MMFilters.applyZosa(`${template.title}(은/는)`) }} 어떤가요?</b></h6>
                                    <div class="mm_radio-list">
                                        <ul class="mm_flex T=equal">
                                            <li v-for="(detail, detailIndex) in template.details" :key="detail.id">
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

                            <div class="mm_inner">
                                <template v-if="hasPersonalization">
                                    <h6 class="mm_text-label">
                                        <b>신체 정보 입력</b><strong class="mm_text-variable">(선택)</strong>
                                    </h6>
                                    <div class="mm_flex T=equal">
                                        <div class="mm_form_mix-linked">
                                            <MMInput
                                                v-model="reviewForm.height"
                                                place-holder-text="키"
                                                data-type="number"
                                            />
                                            <span class="text_linked">cm</span>
                                        </div>
                                        <div class="mm_form_mix-linked">
                                            <MMInput
                                                v-model="reviewForm.weight"
                                                place-holder-text="몸무게"
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
                                </template>
                                <h6 class="mm_text-label">
                                    <b>리뷰 내용</b>
                                </h6>
                                <MMTextarea
                                    v-model="reviewForm.contents"
                                    :max-byte="2000"
                                    :place-holder-text="'최소 10자 이상 입력하세요'"
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
                                        <li>소중한 고객님의 개인 정보 보호를 위해 주민번호, 전화번호 등 개 인 정보는 절대 입력하지 않도록 주의해주세요.</li>
                                        <li>저작권 침해/음란/욕설/비방 글, 개인 정보 유출(전화번호, 주민 번호, 이름, 아이디 등), 판매/광고/홍보성 글을 등록한 경우 임의 로 삭제될 수 있습니다.</li>
                                    </ul>
                                </div>
                                <div class="mm_foot">
                                    <div class="mm_btn_box">
                                        <button type="button" class="mm_btn T=primary" @click.prevent="createReview">
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
        </template>
    </ModalPopup>
</template>

<script setup lang="ts">
import ModalPopup from '@/components/layout/ModalPopup.vue';
import { dropdown as vDropdown } from '$/directives';
import MMTextarea from '@/components/input/Textarea.vue';
import MMImage from '@/components/input/Image.vue';
import { onMounted, ref, watchEffect, onBeforeUnmount } from 'vue';
import { ReviewPointSetting, ShoesSize } from '$/@type/configs';
import { useReviewCreate } from '$/composables/mypage/reviewComposable';
import { ReviewableOrderItem, ReviewTemplate } from '$/@type/member/review';
import { getTargetValue, makeValidator } from '$/validator';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import { useRouter } from 'vue-router';
import { reviewRepository } from '$/repository/reviewRepository';
import { PointLabel } from '$/@type/member/point';
import { useGlobalConfigs, useMyPointRule } from '$/composables/globalConfigComposable';
import MMRadio from '@/components/input/Radio.vue';
import MMSelect from '@/components/input/Select.vue';
import { usePersonalization } from '$/composables/goods/reviewComposable';

const router = useRouter();

const { globalConfigs } = useGlobalConfigs();
const { 
    reviewCreateModalData: {
        orderItem,
        orderItems
    },
    clearReviewCreateModalData
} = useReviewCreate()
const { myPointRule } = useMyPointRule()

const pointLabel = ref<PointLabel>(globalConfigs.value.point.label);

const { 
    getMySize, 
    getShoesSizes, 
    hasPersonalization 
} = usePersonalization();

// 리뷰항목 사용여부
const isUseReviewTemplate = ref<boolean>(globalConfigs.value.paidFeatures.reviewTemplate);
// 리뷰 항목
const reviewTemplates = ref<ReviewTemplate[]>([])
// 신발 사이즈 리스트
const shoesSizeList = ref<ShoesSize[]>([]);

// 리뷰 포인트 설정
const myReviewPointSetting = ref<ReviewPointSetting>(myPointRule.value);

// 리뷰 작성 데이터
const reviewForm = ref<{
    orderItem: ReviewableOrderItem|null
    rate: number
    contents: string
    images: File[]
    height: string
    weight: string
    shoesSize: string
    templateIdPairs: string[]
}>({
    orderItem: orderItem.value,
    rate: 5,
    contents: '',
    images: [],
    height: '',
    weight: '',
    shoesSize : '',
    templateIdPairs: [],
});


onMounted(async() => {
    // 개인화 사용시 신발사이즈 리스트, 마이사이즈 조회
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

    // 리뷰 템플릿 조회
    if (isUseReviewTemplate.value) {
        watchEffect(async () => {
            if (!reviewForm.value.orderItem?.goods.id) {
                reviewTemplates.value = [];
                return;
            }

            try {
                reviewTemplates.value = await reviewRepository.getReviewTemplates(reviewForm.value.orderItem.goods.id);
            } catch (e) {
                defaultCatch(e);
            }
        })
    }
});

onBeforeUnmount(() => {
    clearReviewCreateModalData();
});

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
            ? String(shoesSizeList.value.find((size) => String(size.value) === reviewForm.value.shoesSize)?.value) 
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
            'shoesSize(신발 사이즈)': ['in:'+ shoesSizeList.value.map(size => size.value).join(',')],
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
        .registTester('noRepeat', (param: string, extraValue:string, data:Object) =>  {
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
            router.go(-1)
        })
    } catch (e) {
        defaultCatch(e);
    } finally {
        mmon.loading.hide();
    }
} 

</script>
