<template>
    <div v-if="experienceReview" class="mm_page-content">
        <!-- (D) 실제 내용을 추가하는 부분입니다. -->
        <h3 class="mm_title">
            <b>체험단 후기</b>
        </h3>
        <!-- 상세 타이틀 -->
        <div class="mm_event-head">
            <div class="mm_inner">
                <h4><b>{{ experienceReview.title }}</b></h4>
                <MMLink :to="{ name: 'ExperienceGroup' }" class="btn_home">
                    <i class="ico_back" />
                    <b>메인으로</b>
                </MMLink>
            </div>
        </div>
        <!--// 상세 타이틀 -->
        <div class="mm_inner">
            <div class="m_experience-detail">
                <!-- 체험단 정보 -->
                <div class="m_experience-detail-info">
                    <b class="text_user">{{ experienceReview.writer }}</b>
                    <b class="text_date">{{ MMFilters.formatDate(experienceReview.createdAt!, 'YYYY.MM.DD') }}</b>
                    <b class="text_view">조회수<strong>{{ MMFilters.formatNumber(experienceReview.viewCount) }}</strong></b>
                    <div class="mm_product-item T=single">
                        <MMLink :to="{ name: 'GoodsDetail', params: { id: `${experienceReview.goodsId}` } }">
                            <figure>
                                <div class="mm_image-scale">
                                    <i v-lazyload="{ src: experienceReview.goodsThumbnailUrl }" class="mm_bg-cover image_product" />
                                </div>
                                <figcaption>
                                    <p class="text_brand">
                                        {{ experienceReview.brandName }}
                                    </p>
                                    <p class="text_product">
                                        {{ experienceReview.goodsName }}
                                    </p>
                                    <p class="text_price">
                                        <strong>{{ MMFilters.formatNumber(experienceReview.baseDiscountedPrice) }}</strong>
                                    </p>
                                </figcaption>
                            </figure>
                        </MMLink>
                    </div>
                </div>
                <!--// 체험단 정보 -->

                <!-- 체험단 리뷰 사진 -->
                <div class="m_experience-detail-photo">
                    <ul>
                        <li v-for="image, index in experienceReview.imageUrlList" :key="index">
                            <i class="image_review">
                                <img
                                    v-lazyload="{ src: image }"
                                    src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                                >
                            </i>
                        </li>
                    </ul>
                </div>
                <!--// 체험단 리뷰 사진 -->

                <!-- 체험단 리뷰 -->
                <div class="m_experience-detail-content">
                    <b class="text_star">
                        <i class="ico_star" title="별점" />
                        <span>{{ experienceReview.grade }}</span>
                    </b>
                    <b class="text_size">{{ physicalInformation }}</b>
                    <p class="text_review">
                        {{ experienceReview.contents }}
                    </p>
                    <div class="mm_satisfy">
                        <dl v-for="template in experienceReview.templates" :key="template.id">
                            <dt>{{ template.title }}</dt>
                            <dd>{{ template.selectedLabel }}</dd>
                        </dl>
                    </div>
                    <p class="text_thumb">
                        이 리뷰가 도움이 되었다면 <strong>클릭!</strong>
                        <button
                            type="button"
                            :class="['btn_thumb', { 'S=switch-on': isRecommendation }]"
                            :title="isRecommendation ? '선택됨' : ''"
                            data-switch
                            @click="toggleRecommendation"
                        >
                            <i class="ico_thumb" />
                            <b>{{ MMFilters.formatNumber(Number(recommendationCount)) }}</b>
                        </button>
                    </p>
                </div>
                <!--// 체험단 리뷰 -->
                <div class="mm_foot">
                    <div class="mm_btn_box">
                        <MMLink :to="{ name: 'ExperienceGroup' }" class="mm_btn T=line T=dark">
                            <b>목록으로</b>
                        </MMLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { experienceGroupRepository } from '$/repository/experienceGroupRepository'
import { ExperienceGroupDetail } from '$/@type/experienceGroup';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import { usePageTitleSetting } from '$/composables/seoComposable'
import { usePageContext } from '$/composables/pageHandler/contextComposable';

const { route, router, isUser } = usePageContext();

const experienceReviewId = ref(Number(route.params.id))
const isRecommendation = ref<boolean>(false);

// 체험단 후기 상세
const experienceReview = ref<ExperienceGroupDetail>();
const recommendationCount = ref<number>(0);

// 신체 정보
const physicalInformation = ref('');
const physicalInformationArray: string[] = [];

async function fetch() {
    mmon.loading.show();
    try {
        experienceReview.value = await experienceGroupRepository.getExperienceGroupDetails(Number(route.params.id));

        // 입력된 신체 정보만 노출되도록
        if (experienceReview.value.height) {
            physicalInformationArray.push(experienceReview.value.height + 'cm');
        }

        if (experienceReview.value.weight) {
            physicalInformationArray.push(experienceReview.value.weight + 'kg');
        }

        if (experienceReview.value.shoesSize) {
            physicalInformationArray.push(experienceReview.value.shoesSize + 'mm');
        }

        physicalInformation.value = physicalInformationArray.join('/');
        recommendationCount.value = experienceReview.value.recommendationCount;

        isRecommendation.value = (await experienceGroupRepository.getRelationRecommendation([experienceReview.value.id]))[0].isRecommendation;
    } catch (e) {
        console.log(e);
    } finally {
        mmon.loading.hide();
    }
}

/**
 * 추천 처리
 */
async function toggleRecommendation() {
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
            await experienceGroupRepository.addRecommendation(experienceReviewId.value)
            isRecommendation.value = true
            ++recommendationCount.value
        } else {
            // 추천 취소
            await experienceGroupRepository.cancelRecommendation(experienceReviewId.value)
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
    usePageTitleSetting(experienceReview.value?.title);
});
</script>