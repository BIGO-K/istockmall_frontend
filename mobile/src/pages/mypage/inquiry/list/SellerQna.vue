<template>
    <p v-if="sellerQnaList.total < 1" class="mm_text-none">
        <i class="ico_text-none" />문의 내역이 없습니다
    </p>
    <div v-else class="mm_qna m_myinquiry">
        <ul>
            <li v-for="qna in sellerQnaList.data" :key="qna.id">
                <div v-if="qna.topGoods" class="mm_product-item T=single-sm">
                    <figure>
                        <i v-lazyload="{ 'src': qna.topGoods.thumbnailUrl }" class="mm_bg-cover image_product" />
                        <figcaption>
                            <p class="text_brand">
                                {{ qna.topGoods.brandName }}
                            </p>
                            <p class="text_product">
                                {{ qna.topGoods.name }}
                            </p>
                            <span v-if="qna.goodsCount > 1">외 <strong>{{ qna.goodsCount - 1 }}</strong>건</span>
                            <p class="text_option">
                                {{ qna.topGoods.optionName }}
                            </p>
                        </figcaption>
                    </figure>
                </div>
                <dl v-dropdown="{ groupName: 'seller-qna'}" class="mm_dropdown">
                    <dt class="btn_dropdown" tabindex="0" title="펼쳐보기">
                        <strong v-if="qna.answer" class="mm_text-variable text_state">답변완료</strong>
                        <strong v-else class="text_state">답변대기</strong>
                        <p>
                            <span class="text_title">{{ qna.title }}</span>
                            <span class="text_date">{{ MMFilters.formatDate(qna.createdAt, 'YYYY.MM.DD') }}</span>
                            <i v-if="qna.isPrivate" class="ico_secret" />
                        </p>
                        <i class="ico_dropdown" />
                    </dt>
                    <dd class="mm_dropdown-item">
                        <div class="mm_dropdown-item-inner">
                            <div class="mm_qna-qustion">
                                <p v-html="MMFilters.nlToBr(qna.contents)" />
                                <div v-if="!qna.answer" class="mm_btn_box">
                                    <div class="mm_inline">
                                        <button type="button" class="mm_btn T=2xs T=line T=lighter" @click="deleteSellerQna(qna.id)">
                                            <b>삭제</b>
                                        </button>
                                        <a 
                                            class="mm_btn T=2xs T=line T=lighter"
                                            href="#SELLER_QNA_EDIT" 
                                            @click.capture="setSellerQnaModalData(qna.id)"
                                        >
                                            <b>수정</b>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div v-if="qna.answer" class="mm_qna-answer">
                                <p v-html="MMFilters.nlToBr(qna.answer.contents)" />
                                <span class="text_date">답변일: {{ MMFilters.formatDate(qna.answer.createdAt, 'YYYY.MM.DD') }}</span>
                            </div>
                        </div>
                    </dd>
                </dl>
            </li>
        </ul>
    </div>
    <!-- 페이지네이션 -->
    <MMPaginator
        v-if="sellerQnaList.total > 0"
        :page-block-type="'group'"
        :page-block-count="20"
        :current-page="sellerQnaList.currentPage"
        :items-per-page="sellerQnaList.perPage"
        :total-count="sellerQnaList.total"
        @move-page-to="movePage"
    />
    <!--// 페이지네이션 -->
</template>

<script setup lang='ts'>
import { dropdown as vDropdown } from '$/directives';
import MMPaginator from '@/components/Paginator.vue';
import { useEventListener } from '@vueuse/core';
import { useSellerQnaDelete, useSellerQnaList, useSellerQnaEditModalPopup } from '$/composables/mypage/sellerQnaComposable';
import { usePageContext } from '$/composables/pageHandler/contextComposable';

const { 
    router, 
    usePageTitleSetting 
} = usePageContext();
usePageTitleSetting('판매자 문의', ['문의 관리', '마이페이지']);
const { setSellerQnaModalData } = useSellerQnaEditModalPopup();

const props = defineProps<{
    page: number
}>();

/** 판매자 문의 리스트 */
const {
    sellerQnaList,
    fetchSellerQnaList
} = useSellerQnaList(props.page);

/** 판매자 문의 삭제 */
const { deleteSellerQna } = useSellerQnaDelete(async () => {
    await fetchSellerQnaList(props.page);
});

/**
 * 페이지 이동
 * @param nextPage 
 */
async function movePage(nextPage: number) {
    await fetchSellerQnaList(nextPage);
    router.replace({
        name: 'MypageInquirySellerQnaList',
        query: {
            page: nextPage,
        }
    });     
}

/**
 * 문의수정 팝업모달 닫힘 후 리스트 새로조회
 * @param event 해시변경event
 */
useEventListener(window, 'hashchange', async (event: HashChangeEvent) => {
    const before = event.oldURL.split('#')[1] ?? '';
    const after = event.newURL.split('#')[1] ?? '';

    if (before == 'SELLER_QNA_EDIT' && after === '') {
        await fetchSellerQnaList(props.page);
    }
});
</script>
