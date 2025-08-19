<template>
    <MMPopup>
        <template #headerTitle>
            <h1><b>체험단 후기 상세</b></h1>
        </template>
        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="m_popup-experience-detail">
                            <!-- 체험단 후기 상단 -->
                            <div class="m...detail-head">
                                <h3 class="text_title">
                                    {{ detail?.title }}
                                </h3>
                                <b class="text_user">{{ detail?.writer }}</b>
                                <b class="text_date">{{ MMFilters.formatDate(detail?.createdAt!, 'YYYY.MM.DD') }}</b>
                                <b class="text_view">조회수 <strong>{{ MMFilters.formatNumber(detail?.viewCount) }}</strong></b>
                            </div>
                            <hr class="mm_line">
                            <!--// 체험단 후기 상단 -->
                            <!-- 체험단 후기 상품 -->
                            <div class="mm_product-item T=single-sm">
                                <MMLink :to="{ name: 'GoodsDetail', params: { id: `${detail?.goodsId}` } }">
                                    <figure>
                                        <i v-lazyload="{ src: detail?.goodsThumbnailUrl }" class="mm_bg-cover image_product" />
                                        <figcaption>
                                            <p class="text_brand">
                                                {{ detail?.brandName }}
                                            </p>
                                            <p class="text_product">
                                                {{ detail?.goodsName }}
                                            </p>
                                            <p class="text_price">
                                                <strong>{{ MMFilters.formatNumber(detail?.baseDiscountedPrice) }}</strong>
                                            </p>
                                        </figcaption>
                                    </figure>
                                </MMLink>
                            </div>
                            <!--// 체험단 후기 상품 -->
                            <div class="mm_inner">
                                <!-- 체험단 후기 -->
                                <div class="m...detail-content">
                                    <b class="text_star"><i class="ico_star-fill" title="별점" /><span>{{ detail?.grade }}</span></b>
                                    <b class="text_size">{{ physicalInformation }}</b>
                                    <p class="text_review">
                                        {{ detail?.contents }}
                                    </p>
                                </div>
                                <!--// 체험단 후기 -->
                                <!-- 체험단 후기 사진 -->
                                <div class="m...detail-photo">
                                    <ul>
                                        <li v-for="image, index in detail?.imageUrlList" :key="`image_${index}`">
                                            <i class="image_review">
                                                <img
                                                    v-lazyload="{ src: image }"
                                                    src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                                                >
                                            </i>
                                        </li>
                                    </ul>
                                </div>
                                <!--// 체험단 후기 사진 -->
                                <div class="mm_satisfy">
                                    <dl v-for="template in detail?.templates" :key="template.id">
                                        <dt>{{ template.title }}</dt>
                                        <dd>{{ template.selectedLabel }}</dd>
                                    </dl>
                                </div>
                                <p class="text_thumb">
                                    이 리뷰가 도움이 되었다면 <strong>클릭!</strong>
                                </p>
                                <button
                                    type="button"
                                    :class="['btn_thumb', isRecommendation ? 'S=switch-on' : '']"
                                    :title="isRecommendation ? '선택됨' : ''"
                                    data-switch
                                    @click="toggleRecommendation(Number(detail?.id))"
                                >
                                    <i class="ico_thumb" />
                                    <b>{{ MMFilters.formatNumber(Number(recommendationCount)) }}</b>
                                </button>
                            </div>
                            <!-- 하단버튼 -->
                            <div class="mm_foot">
                                <div class="mm_btn_box">
                                    <a
                                        href="#"
                                        class="mm_btn T=primary"
                                        @click.prevent="router.go(-1)"
                                    >
                                        <b>목록으로</b>
                                    </a>
                                </div>
                            </div>
                            <!--// 하단버튼 -->
                        </div>
                    </div>
                    <!--// 본문 -->
                </div>
            </div>

            <a class="btn_topmost" href="#mm_app" data-href="{ '_type': 'anchor' }" title="페이지 처음으로"><i class="ico_topmost" /><b>TOP</b></a>
        </template>
    </MMPopup>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { experienceGroupRepository } from '$/repository/experienceGroupRepository'
import { ExperienceGroupDetail } from '$/@type/experienceGroup';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import MMLink from '@/components/MMLink.vue';
import MMPopup from '@/components/layout/Popup.vue';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { usePageContext } from '$/composables/pageHandler/contextComposable';

const { 
    route,
    router,
    isUser,
} = usePageContext();

const experienceReviewId = Number(route.params.id);

// 후기의 추천 여부
const isRecommendation = ref<boolean>(false);

// 체험단 후기 상세
const detail = ref<ExperienceGroupDetail>();
const recommendationCount = ref<number>(0);

// 신체 정보
const physicalInformation = ref('');
const physicalInformationArray: string[] = [];


async function fetch() {
    mmon.loading.show();
    try {
        detail.value = await experienceGroupRepository.getExperienceGroupDetails(experienceReviewId);

        // 입력된 신체 정보만 노출되도록
        if (detail.value.height) {
            physicalInformationArray.push(detail.value.height + 'cm');
        }

        if (detail.value.weight) {
            physicalInformationArray.push(detail.value.weight + 'kg');
        }

        if (detail.value.shoesSize) {
            physicalInformationArray.push(detail.value.shoesSize + 'mm');
        }

        physicalInformation.value = physicalInformationArray.join('/');
        recommendationCount.value = detail.value.recommendationCount;

        isRecommendation.value = (await experienceGroupRepository.getRelationRecommendation([experienceReviewId]))[0].isRecommendation;
    } catch (e) {
        console.log(e);
    } finally {
        mmon.loading.hide();
    }
}

/**
 * 추천 처리
 */
async function toggleRecommendation(id: number) {
    if (!isUser.value) {
        return mmon.bom.confirm("로그인이 필요합니다 \n로그인 페이지로 이동하시겠습니까?", (flag: boolean) => {
            if (flag) {
                router.push({
                    name: "Login",
                    query: {
                        redirect_to_after: route.path,
                    },
                });
            }
        });
    }

    mmon.loading.show();

    try {
        // 추천
        if (isRecommendation.value === false) {
            await experienceGroupRepository.addRecommendation(experienceReviewId)
            isRecommendation.value = true
            ++recommendationCount.value
        } else {
            // 추천 취소
            await experienceGroupRepository.cancelRecommendation(experienceReviewId)
            isRecommendation.value = false
            --recommendationCount.value
        }

    } catch (e) {
        defaultCatch(e);
    } finally {
        mmon.loading.hide();
    }
}


onMounted(async() => {
    await fetch();
    usePageTitleSetting(detail.value?.title);
});
</script>