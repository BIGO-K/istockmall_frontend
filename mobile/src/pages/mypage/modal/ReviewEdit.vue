<template>
    <ModalPopup>
        <template #headerTitle>
            <h1><b>리뷰 쓰기</b></h1>
        </template>

        <template #contents>
            <div v-if="originReview" class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="m_popup-myreview">
                            <!-- 상품정보 : 자동노출 -->
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
                                <div class="mm_product-item T=single-sm">
                                    <figure>
                                        <i v-lazyload="{ src: originReview.orderItem.goods.thumbnailUrl }" class="mm_bg-cover image_product" />
                                        <figcaption>
                                            <p class="text_brand">
                                                {{ originReview.orderItem.goods.brandName }}
                                            </p>
                                            <p class="text_product">
                                                {{ originReview.orderItem.goods.name }}
                                            </p>
                                            <p class="text_option">
                                                {{ originReview.orderItem.goods.optionName }} / {{ originReview.orderItem.goods.ea }}개
                                            </p>
                                        </figcaption>
                                    </figure>
                                </div>
                            </div>
                            <!--// 상품정보 : 자동노출 -->
                            <hr class="mm_line">
                            <!-- 별점 -->
                            <section>
                                <h6><b>상품은 만족하셨나요?</b></h6>
                                <!--
                                    (D) 별점이 선택된 상태일 때는 m_popup-myreview-starscore 태그에 'S=starscore-choice' 클래스가 추가됩니다.
                                    선택된 별점의 li에 'S=starscore-on' 클래스와 button에 '선택됨' 타이틀이 추가되며, input hidden의 value값에 점수가 입력됩니다. (0 선택안됨)
                                -->
                                <div class="m_popup-myreview-starscore" :class="rate ? 'S=starscore-choice' : ''">
                                    <ul>
                                        <li 
                                            v-for="score in 5"
                                            :key="score"
                                            :class="{'S=starscore-on': rate >= score}"
                                        >
                                            <button type="button" :title="rate === score ? '선택됨' : ''" @click="rate = score">
                                                <i class="ico_star-fill" /><b class="mm_ir-blind">5점 만점에 {{ score }}점</b>
                                            </button>
                                        </li>
                                    </ul>
                                    <input type="hidden" :v-model="rate">
                                </div>
                            </section>
                            <!--// 별점 -->
                            <!-- 리뷰선택 항목 -->
                            <template v-if="isUseReviewTemplate">
                                <section v-for="template,templateIndex in reviewTemplates" :key="template.id">
                                    <h6><b>{{ MMFilters.applyZosa(`${template.title}(은/는)`) }} 어떤가요?</b></h6>
                                    <div class="mm_radio-list">
                                        <ul class="mm_flex T=equal">
                                            <li v-for="detail in template.details" :key="detail.id">
                                                <MMRadio 
                                                    v-model="templateIds[templateIndex]"
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
                                                v-model="height"
                                                place-holder-text="키"
                                                data-type="number"
                                            />
                                            <span class="text_linked">cm</span>
                                        </div>
                                        <div class="mm_form_mix-linked">
                                            <MMInput
                                                v-model="weight"
                                                place-holder-text="몸무게"
                                                data-type="number"
                                            />
                                            <span class="text_linked">kg</span>
                                        </div>
                                        <div class="mm_form_mix-linked">
                                            <MMSelect v-model="shoesSize">
                                                <option value="">
                                                    발 사이즈
                                                </option>
                                                <option v-for="size in shoesSizeList" :key="size.value" :value="size.value">
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
                                    v-model="contents"
                                    :max-byte="2000"
                                    :place-holder-text="'최소 10자 이상 입력하세요'"
                                />
                                <MMImage
                                    v-model="images"
                                    :image-urls="originReview?.imageUrls"
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
                                        <button type="button" class="mm_btn T=primary" @click="editReview">
                                            <b>수정하기</b>
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
import MMTextarea from '@/components/input/Textarea.vue';
import MMImage from '@/components/input/Image.vue';
import { onMounted, ref } from 'vue';
import { ReviewPointSetting, ShoesSize } from '$/@type/configs';
import { useReviewEdit } from '$/composables/mypage/reviewComposable';
import { EditableReview, ReviewTemplate } from '$/@type/member/review';
import { getTargetValue, makeValidator } from '$/validator';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import { useRouter } from 'vue-router';
import { reviewRepository } from '$/repository/reviewRepository';
import { PointLabel } from '$/@type/member/point';
import { useGlobalConfigs, useMyPointRule } from '$/composables/globalConfigComposable';
import { mySizeRepository } from '$/repository/member/mySizeRepository';
import MMRadio from '@/components/input/Radio.vue';
import MMSelect from '@/components/input/Select.vue';
import { usePersonalization } from '$/composables/goods/reviewComposable';

const router = useRouter();
const { 
    reveiwEditModalData: {
        originReview
    }
} = useReviewEdit()


const { globalConfigs } = useGlobalConfigs();
const { myPointRule } = useMyPointRule()

const { 
    getShoesSizes, 
    hasPersonalization 
} = usePersonalization();

// 리뷰항목 사용여부
const isUseReviewTemplate = ref<boolean>(globalConfigs.value.paidFeatures.reviewTemplate);
// 리뷰 항목
const reviewTemplates = ref<ReviewTemplate[]>([])
// 신발 사이즈 리스트
const shoesSizeList = ref<ShoesSize[]>([]);
const myReviewPointSetting = ref<ReviewPointSetting>(myPointRule.value);
const pointLabel = ref<PointLabel>(globalConfigs.value.point.label);


// 리뷰 작성 데이터
const rate = ref<number>(originReview.value?.rate || 0);
const contents = ref<string>(originReview.value?.contents || '');
const images = ref<File[]>([]);
const height = ref<string>('');
const weight = ref<string>('');
const shoesSize = ref<string>('');
const templateIds = ref<string[]>([]);


onMounted(async() => {
    if (!originReview.value) {
        return router.go(-1);
    }

    await fetchReview()

    if (hasPersonalization.value) {
        await getShoesSizes();
    }

    if (isUseReviewTemplate.value) {
        await fetchReviewTemplates();
    }
});

// 리뷰 템플릿 조회
async function fetchReviewTemplates() {
    try {
        reviewTemplates.value = originReview.value.orderItem?.goods.id ? 
            await reviewRepository.getReviewTemplates(originReview.value.orderItem?.goods.id) 
            : [];
    } catch (e) {
        // defaultCatch(e);
    }
}

// 리뷰 상세 조회
async function fetchReview() {
    try {
        if (!originReview.value) {
            return router.go(-1);
        }
        const review:EditableReview = await reviewRepository.get(originReview.value.id);

        rate.value = review.rate;
        contents.value = review.contents;
        height.value = String(review.height || '');
        weight.value = String(review.weight || '');
        shoesSize.value = String(review.shoesSize || '');
        reviewTemplates.value = review.templates;
        
        review.selectedTemplates.forEach((selected, index) => {
            templateIds.value[index] = `${selected.templateId}_${selected.detailId}`;
        });
    } catch (e) {
        defaultCatch(e)
        router.go(-1);
    }
}

// 리뷰 수정 처리
async function editReview() {
    mmon.loading.show();
    try {
        const formData = new FormData();
        formData.append('rate', rate.value === 0 ? '' : String(rate.value));
        formData.append('contents', contents.value);
        formData.append('height', height.value);
        formData.append('weight', weight.value);
        formData.append('shoes_size', shoesSize.value);
        images.value.forEach((image) => {
            if (!image) {
                return;
            }
            formData.append('images[]', image);
        });

        // 리뷰템플릿별 선택값
        templateIds.value.forEach((selected, index) => {
            const selectedPair = selected.split('_');
            formData.append(`selected_review_templates[${index}][template_id]`, selectedPair[0]);
            formData.append(`selected_review_templates[${index}][template_detail_id]`, selectedPair[1]);
        });

        const validator = makeValidator(formData)
            .setRules({
                'rate(별점)': ['required'],
                'height(키)': ['number'],
                'weight(몸무게)': ['number'],
                'shoesSize(신발 사이즈)': ['in:'+ shoesSizeList.value.map(size => size.value).join(',')],
                'contents(내용)': ['required', 'minLength:10', 'maxLength:2000', 'blank', 'noRepeat'],
                'images.*(사진)': ['mimes'],
            })
            .setMessages({
                'rate.required': ':param(을/를) 선택해주세요.',
                'contents.required': ':param(을/를) 입력해주세요.',
                'contents.blank': ':param(을/를) 입력해주세요.',
                'contents.noRepeat': '동일한 문자 또는 자음/모음은\n4회 이상 연속 입력할 수 없습니다.',
                'images.*.mimes': "파일 확장자를 확인해주세요."
            })
            .registTester('mimes', function (param: string, extraValue:string, data:Object) {
                const file = getTargetValue(data, param) as any
                if (file instanceof File === false && file instanceof Blob === false) {
                    return true;
                }
                
                if (file?.type?.includes('image')) {
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

        await validator.run();
        await reviewRepository.update(originReview.value.id, formData);
        mmon.bom.alert('리뷰가 수정되었습니다.', () => {
            router.go(-1);
        })
    } catch (e) {
        defaultCatch(e);
    } finally {
        mmon.loading.hide();
    }
} 
</script>
