<template v-if="experienceGroup">
    <MMLink :to="{ name: 'ExperienceGroupDetail', params: { id: experienceGroup.id } }">
        <figure>
            <i v-lazyload="{ src: experienceGroup.thumbnailUrl }" class="mm_bg-cover image_banner" />
            <figcaption>
                <b class="text_star">
                    <i class="ico_star-fill" title="별점" />
                    <span>{{ experienceGroup.grade }}</span>
                </b>
                <p class="text_title">
                    {{ experienceGroup.title }}
                </p>
                <b class="text_user">{{ experienceGroup.writer }}</b>
                <b class="text_date">{{ MMFilters.formatDate(experienceGroup.createdAt, 'YYYY.MM.DD') }}</b>
            </figcaption>
        </figure>
    </MMLink>
    <button
        type="button"
        :class="['btn_thumb', { 'S=switch-on': recommendationInfo.isRecommendation }]"
        :title="recommendationInfo.isRecommendation ? '선택됨' : ''"
        data-switch
        @click="toggleRecommendation"
    >
        <i class="ico_thumb" />
        <b>{{ MMFilters.formatNumber(experienceGroup.recommendationCount) }}</b>
    </button>
    <b class="text_view">조회 <strong>{{ MMFilters.formatNumber(experienceGroup.viewCount) }}</strong></b>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import { experienceGroupRepository } from '$/repository/experienceGroupRepository'
import { ExperienceGroup, Recommendation } from '$/@type/experienceGroup';
import { defaultCatch } from '$/functions'
import { mmon } from '$/helper/mmon'
import { usePageContext } from '$/composables/pageHandler/contextComposable';

const props = withDefaults(defineProps<{
    experienceGroup: ExperienceGroup
    recommendationInfo: Recommendation
}>(), {
    experienceGroup: () => {
        return {}
    },
    recommendationInfo: () => {
        return {}
    },
});
const { experienceGroup, recommendationInfo } = toRefs(props)
const { 
    route,
    router,
    isUser,
} = usePageContext();

/**
 * 추천 처리
 */
async function toggleRecommendation() {
    if (!isUser.value) {
        return mmon.bom.confirm('로그인이 필요합니다 \n로그인 페이지로 이동하시겠습니까?', (flag: boolean) => {
            if (flag) {
                router.push({
                    name: 'Login',
                    query: {
                        redirect_to_after: route.path,
                    },
                })
            }
        })
    }

    try {
        // 추천
        if (recommendationInfo.value.isRecommendation === false) {
            await experienceGroupRepository.addRecommendation(props.experienceGroup.id)
            recommendationInfo.value.isRecommendation = true
            ++experienceGroup.value.recommendationCount
            return
        }

        // 추천 취소
        await experienceGroupRepository.cancelRecommendation(props.experienceGroup.id)
        recommendationInfo.value.isRecommendation = false
        --experienceGroup.value.recommendationCount
    } catch (e) {
        defaultCatch(e)
    }
}
</script>
