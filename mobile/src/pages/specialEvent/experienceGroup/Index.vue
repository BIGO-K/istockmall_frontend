<template>
    <MMSub>
        <template #headerTitle>
            <h1><b>체험단 후기</b></h1>
        </template>
        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="mm_inner">
                            <!-- 체험단 후기 목록 -->
                            <div :class="['m_experience-list', { 'T=skeleton': isLoading }]">
                                <!-- (D) 회원일 경우에만 체험단 후기 작성 버튼을 노출합니다. -->
                                <a v-if="isUser && reviewableItems.length > 0" href="#EXPERIENCEGROUP_REVIEW_CREATE" class="mm_btn T=xs T=line T=dark btn_register">
                                    <i class="ico_review-write" />
                                    <b>체험단 후기 작성</b>
                                </a>

                                <ul v-if="isLoading">
                                    <li v-for="i in 20" :key="i">
                                        <i class="image_banner" />
                                        <p class="text_user" />
                                        <p class="text_title" />
                                        <p class="text_date" />
                                        <p class="text_view" />
                                    </li>
                                </ul>

                                <template v-else>
                                    <p v-if="experienceReviewsPaginator.total < 1" class="mm_text-none">
                                        <i class="ico_text-none" />등록된 체험단 후기가 없습니다
                                    </p>
                                    <ul v-else>
                                        <li v-for="experienceGroup, index in experienceReviewsPaginator.data" :key="experienceGroup.id">
                                            <ExperienceReview :experience-group="experienceGroup" :recommendation-info="recommendationRelations[index]" />
                                        </li>
                                    </ul>
                                </template>
                            </div>
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
                    <!--// 본문 -->

                    <!-- 푸터 -->
                    <MMFooter />
                    <!--// 푸터 -->
                </div>
            </div>
        </template>
    </MMSub>
</template>

<script lang="ts">
import { defineComponent, ref, defineAsyncComponent, onMounted } from 'vue';
import { ExperienceGroup, Recommendation, ReviewableItem } from '$/@type/experienceGroup'
import { experienceGroupRepository } from '$/repository/experienceGroupRepository'
import { Paginator } from '$/@type'
import { usePageContext } from '$/composables/pageHandler/contextComposable';

declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        experienceReviewsPaginator: Paginator<ExperienceGroup>,
        recommendationRelations: Recommendation[]
    }
}

export default defineComponent({
    components: {
        MMPaginator: defineAsyncComponent(() => import('@/components/Paginator.vue')),
        MMFooter: defineAsyncComponent(() => import('@/components/Footer.vue')),
        MMSub: defineAsyncComponent(() => import('@/components/layout/Sub.vue')),
        ExperienceReview: defineAsyncComponent(() => import('@/pages/specialEvent/experienceGroup/ReviewItem.vue'))
    },
    async beforeRouteEnter (to, from, next) {
        try {
            const experienceGroup = await experienceGroupRepository.getExperienceGroups(Number.parseInt(`${to.query.page || 1}`));

            next(async vm => {
                vm.experienceReviewsPaginator = experienceGroup
                if (experienceGroup.data.length > 0) {
                    const reviewIds = experienceGroup.data.map(review => review.id)
                    vm.recommendationRelations = await experienceGroupRepository.getRelationRecommendation(reviewIds)
                }
            })
        } catch (error) {
            next();
        }
    },
    setup() {
        const { 
            router,
            isUser,
            usePageTitleSetting
        } = usePageContext();
        usePageTitleSetting('체험단 후기', ['이벤트']);

        /** VARIABLE */
        const isLoading = ref<boolean>(false);
        const experienceReviewsPaginator = ref<Paginator<ExperienceGroup>>({
            currentPage: 1,
            perPage: 20,
            total: 0,
            data: [],
        });

        const recommendationRelations = ref<Recommendation[]>([]);
        const reviewableItems = ref<ReviewableItem[]>([]);
        /** // VARIABLE */

        /** FUNCTION */
        async function movePage(page = 1) {
            isLoading.value = true
            try {
                experienceReviewsPaginator.value = await experienceGroupRepository.getExperienceGroups(
                    page,
                    experienceReviewsPaginator.value.perPage
                )
                if (experienceReviewsPaginator.value.data.length > 0) {
                    const reviewIds = experienceReviewsPaginator.value.data.map(review => review.id)
                    recommendationRelations.value = await experienceGroupRepository.getRelationRecommendation(reviewIds)
                }

                router.replace({
                    name: 'ExperienceGroup',
                    query: {
                        page
                    },
                });
            } catch (e) {
                console.log(e);
            } finally {
                isLoading.value = false;
            }
        }
        /** // FUNCTION */
        
        onMounted(async () => {
            try {
                reviewableItems.value = await experienceGroupRepository.reviewableItems()
            } catch (e) {
                console.log(e);
            }
        })

        return {
            experienceReviewsPaginator,
            recommendationRelations,
            reviewableItems,
            isLoading,
            isUser,
            movePage,
            fetch,
        }
    },
})
</script>
