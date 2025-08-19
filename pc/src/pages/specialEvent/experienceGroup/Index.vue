<template>
    <div class="mm_page-content">
        <!-- (D) 실제 내용을 추가하는 부분입니다. -->
        <div class="mm_inner">
            <!-- 체험단 후기 상단 -->
            <div class="m_experience-head">
                <h3 class="mm_title">
                    <b>체험단 후기</b>
                </h3>
                <MMLink :to="{ name: 'SpecialEvent' }" class="btn_back">
                    <i class="ico_back-arrow" />
                    <b>Event Main</b>
                </MMLink>
                <!-- (D) 회원일 경우만 노출합니다. -->
                <a
                    v-if="isUser && reviewableItems.length > 0"
                    href="#"
                    class="mm_btn T=xs T=line T=dark btn_register"
                    @click.prevent="openReviewWriteModal"
                >
                    <i class="ico_experience-write" />
                    <b>체험단 후기 작성</b>
                </a>
            </div>
            <!--// 체험단 후기 상단 -->

            <!-- 체험단 후기 목록 -->
            <ul v-if="isLoading" class="m_experience-list T=skeleton">
                <li v-for="i in 20" :key="i">
                    <i class="image_banner" />
                    <p class="text_user" />
                    <p class="text_title" />
                    <p class="text_date" />
                </li>
            </ul>

            <template v-else>
                <ul v-if="experienceReviewsPaginator.total > 0 && recommendationRelations.length > 0" class="m_experience-list">
                    <li v-for="(experienceGroup, index) in experienceReviewsPaginator.data" :key="experienceGroup.id">
                        <ExperienceReview :experience-group="experienceGroup" :recommendation-info="recommendationRelations[index]" />
                    </li>
                </ul>
                <p v-else class="mm_text-none">
                    <i class="ico_text-none" />등록된 체험단 후기가 없습니다
                </p>
            </template>
            <!--// 체험단 후기 목록 -->

            <!-- 페이지네이션 -->
            <MMPaginator
                v-if="experienceReviewsPaginator.total > 0"
                :page-block-type="'group'"
                :page-block-count="20"
                :current-page="experienceReviewsPaginator.currentPage"
                :items-per-page="experienceReviewsPaginator.perPage"
                :total-count="experienceReviewsPaginator.total"
                @move-page-to="movePage"
            />
            <!--// 페이지네이션 -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue';
import { ExperienceGroup, Recommendation, ReviewableItem } from '$/@type/experienceGroup';
import { experienceGroupRepository } from '$/repository/experienceGroupRepository'
import { Paginator } from '$/@type'
import MMPaginator from '@/components/Paginator.vue'
import { usePageContext } from '$/composables/pageHandler/contextComposable';
import ReviewWriteModal from '@/pages/specialEvent/experienceGroup/Create.vue'
import { useModal } from '$/composables/pageHandler/modalComposable';
import { usePersonalization } from '$/composables/goods/reviewComposable';

const { 
    route,
    router,
    isUser,
    usePageTitleSetting
} = usePageContext();

usePageTitleSetting('체험단 후기', ['이벤트']);

const ExperienceReview = defineAsyncComponent(() => import('@/pages/specialEvent/experienceGroup/ReviewItem.vue'))
const experienceReviewsPaginator = ref<Paginator<ExperienceGroup>>({
    currentPage: 1,
    perPage: 20,
    total: 0,
    data: [],
});
const recommendationRelations = ref<Recommendation[]>([]);
const reviewableItems = ref<ReviewableItem[]>([]);
const isLoading = ref<boolean>(true);

(async () => {
    try {
        experienceReviewsPaginator.value = await experienceGroupRepository.getExperienceGroups(Number.parseInt(`${route.query.page || 1}`), 20);
    
        if (experienceReviewsPaginator.value.data.length > 0) {
            const reviewIds = experienceReviewsPaginator.value.data.map(review => review.id)
            recommendationRelations.value = await experienceGroupRepository.getRelationRecommendation(reviewIds)
        }

        reviewableItems.value = await experienceGroupRepository.reviewableItems()
    } catch (e) {
        console.log(e)
    } finally {
        isLoading.value = false;
    }
})();

async function movePage(nextPage: number) {
    isLoading.value = true;

    try {
        experienceReviewsPaginator.value = await experienceGroupRepository.getExperienceGroups(
            nextPage,
            experienceReviewsPaginator.value.perPage
        )
        if (experienceReviewsPaginator.value.data.length > 0) {
            const reviewIds = experienceReviewsPaginator.value.data.map(review => review.id)
            recommendationRelations.value = await experienceGroupRepository.getRelationRecommendation(reviewIds)
        }

        router.replace({
            name: 'ExperienceGroup',
            query: {
                page: nextPage,
            },
        });
    } catch (e) {
        console.log(e);
    } finally {
        isLoading.value = false;
    }
}

function openReviewWriteModal() {
    const { 
        getShoesSizes,  
        getMySize, 
        hasPersonalization,
    } = usePersonalization();

    return useModal().open(ReviewWriteModal, {
        name: 'experience-review',
        itemClass: 'm_modal-experience',
        title: '체험단 후기 작성',
        props: async() => {
            const[ shoesSizes, mySize ] = await Promise.all([
                getShoesSizes(),
                getMySize()
            ])
            
            return {
                reviewableItems : reviewableItems.value,
                shoesSizeList: shoesSizes,
                mySizeInfo: mySize,
                hasPersonalization
            }
        },     
    })
}
</script>