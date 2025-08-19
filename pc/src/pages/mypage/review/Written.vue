<template>
    <!-- 작성한 리뷰 -->
    <p v-if="reviews.total < 1" class="mm_text-none">
        <i class="ico_text-none" />작성한 리뷰가 없습니다
    </p>
    <div v-else class="m_my-review-list T=written">
        <!-- (D) 리뷰 내용이 3줄 이상이거나 포토리뷰가 포함된 경우 'm_my-review-item' 요소에 T=item-toggle 클래스를 추가합니다. -->
        <ul>
            <li v-for="review, index in reviews.data" :key="review.id">
                <div 
                    class="m_my-review-item" 
                    :class="{ 
                        'S=switch-on' : selectedReview?.id === review.id, 
                        'T=item-toggle' : review.imageUrls.length || reviewContentsSwitchFlags[index] === 'true'
                    }"
                >
                    <p class="text_date">
                        {{ MMFilters.formatDate(review.createdAt, 'YYYY.MM.DD') }}
                    </p>
                    <MMSimpleGoods
                        class="T=single T=sm"
                        :goods="review.orderItem.goods"
                    />
                    <p class="text_star">
                        <i class="ico_star" /><span>{{ review.rate }}</span>
                    </p>
                    <p 
                        class="mm_switch text_review" 
                        :tabindex="reviewContentsSwitchFlags[index] === 'true' ? '0' : undefined" 
                        data-switch="" 
                        :title="selectedReview?.id === review.id ? '열기' : ''"
                        @click="reviewContentsSwitchFlags[index] === 'true' ? toggleLineClamp(review) : () => {}"
                    >
                        <b
                            v-contentsLineClamp="{ switchFlagSet : reviewContentsSwitchFlagSet, isPersonalization : isUsePersonalization }"
                            v-html="MMFilters.nlToBr(review.contents)"
                        />
                        <span
                            v-if="reviewContentsSwitchFlags[index] === 'true'"
                            class="mm_btn T=xs T=line T=light"
                        >
                            <i class="ico_toggle T=round" />
                        </span>
                    </p>

                    <div v-if="isUsePersonalization" class="mm_satisfy">
                        <dl v-for="template in review.templates" :key="template.id">
                            <dt>{{ template.title }}</dt>
                            <dd>{{ template.selectedLabel }}</dd>
                        </dl>
                    </div>
                    
                    <ul v-if="review.imageUrls.length" class="m...item-image">
                        <li v-for="imageUrl in review.imageUrls" :key="imageUrl">
                            <a href="#" @click.prevent="openImageModal(review.imageUrls, imageUrl)">
                                <i class="image_review">
                                    <img
                                        v-lazyload="{ src: imageUrl, isRatio: true }"
                                        alt="포토리뷰 이미지"
                                    >
                                </i>
                            </a>
                        </li>
                    </ul>
                    <!-- (D) 등록 리뷰의 사진 미등록시에만 '.text_tooltip' 요소를 노출합니다. -->
                    <p v-if="!review.isPhotoReview" class="text_tooltip">
                        포토 등록 시 
                        <strong>
                            {{ MMFilters.formatNumber(myReviewPointSetting.photoReviewPoint - myReviewPointSetting.textReviewPoint) }}
                            {{ pointLabel.suffix }}
                        </strong>
                        추가
                    </p>
                    
                    <a
                        class="mm_btn T=xs T=primary btn_modify"
                        href="#"
                        @click.prevent="reviewEditModalOpen(review)"
                    >
                        <i class="ico_review-write" />
                        <b>리뷰 수정</b>
                    </a>
                </div>
            </li>
        </ul>
    </div>
    <!--// 작성한 리뷰 -->

    <!-- 페이지네이션 -->
    <!-- (D) 현재 페이지의 메뉴에 'S=page-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
    <MMPaginator
        :page-block-type="'group'"
        :page-block-count="20"
        :current-page="reviews.currentPage"
        :items-per-page="reviews.perPage"
        :total-count="reviews.total"
        @move-page-to="movePage"
    />
    <!--// 페이지네이션 -->
</template>

<script setup lang="ts" inherit-attrs="false">
import { onMounted, ref, Directive } from 'vue';
import MMSimpleGoods from '@/components/goods/SimpleGoods.vue';
import MMPaginator from '@/components/Paginator.vue';
import { Review } from '$/@type/member/review';
import { ExtractComponentProps, Paginator } from '$/@type';
import { reviewRepository } from '$/repository/reviewRepository';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import ReviewEditModal from '@/components/modal/review/Edit.vue';
import { useMyPointRule } from '$/composables/globalConfigComposable';
import ReviewImageModal from '@/components/modal/review/Image.vue';
import { useModal } from '$/composables/pageHandler/modalComposable';
import { usePersonalization } from '$/composables/goods/reviewComposable';
import { usePageContext } from '$/composables/pageHandler/contextComposable';

const vContentsLineClamp: Directive<HTMLElement, { isPersonalization: boolean; switchFlagSet: (flag: boolean) => void }> = {
    mounted: (el, binding) => {
        if (binding.value.isPersonalization) {
            return binding.value.switchFlagSet(true);
        }

        if (el.scrollHeight > el.clientHeight) {
            return binding.value.switchFlagSet(true);
        }

        binding.value.switchFlagSet(false);
    }
}

/** VARIABLE */
const { router, route, globalConfigs, usePageTitleSetting } = usePageContext();
usePageTitleSetting('작성한 리뷰', ['리뷰 관리', '마이페이지']);
const shopName = ref<string>(globalConfigs.value.shop.name);
const { myPointRule: myReviewPointSetting } = useMyPointRule(); // 등급별 리뷰 포인트 설정
const pointLabel = globalConfigs.value.point.label;
const isUsePersonalization = ref<boolean>(globalConfigs.value.paidFeatures.personalization); // 개인화 사용 여부

// 리뷰내용 TOGGLE 리스트
const reviewContentsSwitchFlags = ref<string[]>([]);
            
// 작성한 리뷰 목록
const reviews = ref<Paginator<Review>>({
    total: 0,
    currentPage: 1,
    perPage: 20,
    data: []
});
// 선택한 리뷰(자세히보기)
const selectedReview = ref<Review>();
// 현재 페이지
const page = ref(1);
/** //VARIABLE */
        
/** FUNCTION */
/**
 * 작성된 리뷰리스트 조회
 */
async function fetch() {
    mmon.loading.show()
    try {
        reviews.value = await reviewRepository.getList(page.value);

        router.replace({
            path: route.path,
            query: { page: page.value },
        });
    } catch (e) {
        defaultCatch(e);
    } finally {
        mmon.loading.hide();
    }
}
/**
 * 페이지 이동
 */
async function movePage(nextPage: number) {
    page.value = nextPage;
    await fetch();
}

/**
 * 리뷰내용 TOGGLE 리스트 추가
 * @param flag 
 */
function reviewContentsSwitchFlagSet (flag: boolean) {
    reviewContentsSwitchFlags.value.push(`${flag}`);
}

/**
 * 리뷰내용 TOGGLE
 * @param review 
 */
function toggleLineClamp(review: Review) {
    selectedReview.value === review ? selectedReview.value = undefined : selectedReview.value = review
}

/**
 * 이미지 모달 open
 * @param imageUrls 
 * @param targetImageUrl 
 */
function openImageModal(imageUrls: string[], targetImageUrl: string) {
    useModal().open(ReviewImageModal, {
        title: '포토리뷰',
        name: 'ReviewImageModal',
        itemClass: 'prodetail-zoom',
        props: {
            selectedImageUrl: targetImageUrl,
            imageUrls: imageUrls
        }          
    })
}

/**
 * 리뷰 수정 모달 open
 * @param review 
 */
function reviewEditModalOpen(review: Review) {
    if (!review.isEditable) {
        return mmon.bom.alert(`기존 ${shopName.value}에서 작성하신 \n 리뷰는 수정 할 수 없습니다.`)
    }
    const { getShoesSizes, hasPersonalization } = usePersonalization();
    useModal().open(ReviewEditModal, {
        title: '리뷰쓰기',
        name: 'ReviewEditModal',
        itemClass: 'm_modal-myreview',
        props: async() => {
            const editReview = await reviewRepository.get(review.id);
            
            const propData: Omit<ExtractComponentProps<typeof ReviewEditModal>, 'closer'>= {
                hasPersonalization: hasPersonalization.value,
                review: editReview,
                writtenReview: review,
                shoesSizeList: []
            } 

            if (hasPersonalization.value) {
                const[ shoesSizes ] = await Promise.all([                            
                    getShoesSizes(),
                ]);

                propData.shoesSizeList = shoesSizes
            }
            return propData
        },
        onClose: () => {
            fetch();
        }
    })
}

/** VUE LIFE CYCLE */
onMounted(async () => {            
    page.value = Number(route.query.page) || 1;
    await fetch();
});
/** // VUE LIFE CYCLE */
</script>