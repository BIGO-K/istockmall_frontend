<template>
    <div class="mm_page-content-body">
        <div class="m_my-review">
            <h5 class="mm_heading">
                <b>리뷰 관리</b>
            </h5>
            <!-- 탭메뉴 -->
            <div class="mm_tab_menu">
                <!-- (D) 선택된 탭메뉴에 'S=tab-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
                <ul class="mm_flex T=equal">
                    <li>
                        <MMLink 
                            :to="{ name: 'MypageReviewWritable' }"
                            :class="router.currentRoute.value.name == 'MypageReviewWritable' ? 'S=tab-on' : ''"
                            :title="router.currentRoute.value.name == 'MypageReviewWritable' ? '선택됨' : ''"
                            @click="fetchAggregate"
                        >
                            <b>작성 가능한 리뷰<small>{{ aggregates.writables }}</small></b>
                        </MMLink>
                    </li>
                    <li>
                        <MMLink 
                            :to="{ name: 'MypageReviewWritten' }"
                            :class="router.currentRoute.value.name == 'MypageReviewWritten' ? 'S=tab-on' : ''"
                            :title="router.currentRoute.value.name == 'MypageReviewWritten' ? '선택됨' : ''"
                            @click="fetchAggregate"
                        >
                            <b>작성한 리뷰<small>{{ aggregates.written }}</small></b>
                        </MMLink>
                    </li>
                </ul>
            </div>
            <!--// 탭메뉴 -->
            <router-view @update-aggregate="fetchAggregate" />
        </div>
    </div>
</template>
<script setup lang="ts">
import { defaultCatch } from '$/functions';
import { ReviewAggregates } from '$/@type/member/review';
import { onMounted, ref } from 'vue'
import { reviewRepository } from '$/repository/reviewRepository';
import { useRouter } from 'vue-router';

const router = useRouter()
// 리뷰 집계
const aggregates = ref<ReviewAggregates>({
    writables: 0,
    written: 0,
});

onMounted(async () => {
    await fetchAggregate()
});

// 리뷰 집계 조회
async function fetchAggregate() {
    try {
        aggregates.value = await reviewRepository.getAggregates();
    } catch (e) {
        defaultCatch(e);
    }
}
</script>