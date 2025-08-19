<template>
    <p v-if="qnaList.total < 1" class="mm_text-none">
        <i class="ico_text-none" />문의 내역이 없습니다
    </p>
    <div v-else class="mm_qna m_myinquiry">
        <ul>
            <li v-for="qna in qnaList.data" :key="qna.id">
                <div v-if="qna.topGoods" class="mm_product-item T=single-sm">
                    <figure>
                        <i v-lazyload="{ src: qna.topGoods.thumbnailUrl }" class="mm_bg-cover image_product" />
                        <figcaption>
                            <p class="text_brand">
                                {{ qna.topGoods.brandName }}
                            </p>
                            <p class="text_product">
                                {{ qna.topGoods.name }}
                            </p>
                            <span v-if="qna.goodsCount > 1">외 <strong>{{ qna.goodsCount - 1 }}</strong>건</span>
                        </figcaption>
                    </figure>
                </div>
                <dl v-dropdown="{ groupName: 'qna' }" class="mm_dropdown">
                    <dt class="btn_dropdown" tabindex="0" title="펼쳐보기">
                        <strong v-if="qna.answer" class="mm_text-variable text_state">답변완료</strong>
                        <strong v-else class="text_state">답변대기</strong>
                        <p>
                            <span class="text_title">{{ qna.title }}</span>
                            <span class="text_date">
                                {{ MMFilters.formatDate(qna.createdAt,"YYYY.MM.DD") }}
                            </span>
                        </p>
                        <i class="ico_dropdown" />
                    </dt>
                    <dd class="mm_dropdown-item">
                        <div class="mm_dropdown-item-inner">
                            <div class="mm_qna-qustion">
                                <p v-html="MMFilters.nlToBr(qna.contents)" />
                                <div v-if="!qna.answer" class="mm_btn_box">
                                    <div class="mm_inline">
                                        <button
                                            type="button"
                                            class="mm_btn T=2xs T=line T=ligher"
                                            @click="deleteQna(qna.id)"
                                        >
                                            <b>삭제</b>
                                        </button>
                                        <a
                                            class="mm_btn T=2xs T=line T=ligher"
                                            href="#QNA_EDIT"
                                            @click.capture="setQnaIdToEdit(qna.id)"
                                        >
                                            <b>수정</b>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div v-if="qna.answer" class="mm_qna-answer">
                                <p v-html="MMFilters.nlToBr(qna.answer.contents)" />
                                <span class="text_date">
                                    답변일: {{ MMFilters.formatDate(qna.answer.createdAt,"YYYY.MM.DD") }}
                                </span>
                            </div>
                        </div>
                    </dd>
                </dl>
            </li>
        </ul>
    </div>
    <!-- 페이지네이션 -->
    <MMPaginator
        v-if="qnaList.total > 0"
        :page-block-type="'group'"
        :page-block-count="20"
        :current-page="qnaList.currentPage"
        :items-per-page="qnaList.perPage"
        :total-count="qnaList.total"
        @move-page-to="movePage"
    />
    <!--// 페이지네이션 -->
</template>

<script setup lang="ts">
import { useQnaDelete, useQnaEditModal, useQnaList } from "$/composables/mypage/qnaComposable";
import { usePageContext } from "$/composables/pageHandler/contextComposable";
import { dropdown as vDropdown } from '$/directives';
import MMPaginator from '@/components/Paginator.vue';
import { useEventListener } from '@vueuse/core';

const { 
    router, 
    usePageTitleSetting 
} = usePageContext();

usePageTitleSetting('1:1 문의', ['문의 관리', '마이페이지']);
const props = defineProps<{
    page: number
}>();

// 1:1 문의 리스트
const {
    qnaList,
    fetchQnaList
} = useQnaList(props.page);

// 1:1 문의 삭제
const { deleteQna } = useQnaDelete(async () => {
    await fetchQnaList(props.page);
});

// 1:1문의 수정 modal
const { setQnaIdToEdit } = useQnaEditModal();

/**
 * 페이지 이동
 * @param nextPage 
 */
async function movePage(nextPage: number) {
    await fetchQnaList(nextPage);
    router.replace({
        name: 'MypageInquiryQnaList',
        query: {
            page: nextPage,
        }
    });     
}

// 문의 수정 완료 후처리
useEventListener(window, 'hashchange', async (event: HashChangeEvent) => {
    const before = event.oldURL.split('#')[1] ?? '';
    const after = event.newURL.split('#')[1] ?? '';
    if (before === "QNA_EDIT" && after === "") {
        fetchQnaList(props.page);
    }
});
</script>
