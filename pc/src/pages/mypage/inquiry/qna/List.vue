<template>
    <div class="mm_page-content-body">
        <div class="m_my-inquiry">
            <h5 class="mm_heading">
                <b>1:1 문의</b>
            </h5>
            <!-- 탭메뉴 -->
            <div class="mm_tab_menu">
                <!-- (D) 선택된 탭메뉴에 'S=tab-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
                <ul class="mm_flex T=equal">
                    <li>
                        <MMLink
                            class="S=tab-on"
                            title="선택됨"
                            :to="{ name: 'MypageInquiryQnaList' }"
                        >
                            <b>1:1 문의</b>
                        </MMLink>
                    </li>
                    <li>
                        <MMLink :to="{ name: 'MypageInquirySellerQnaList' }">
                            <b>상품 Q&A</b>
                        </MMLink>
                    </li>
                </ul>
            </div>
            <!--// 탭메뉴 -->

            <!-- 1:1 문의 -->
            <div class="mm_qna">
                <table>
                    <colgroup>
                        <col style="width:144px;">
                        <col style="width:430px;">
                        <col>
                        <col style="width:153px;">
                    </colgroup>
                    <thead>
                        <tr>
                            <th scope="col">
                                <b>답변 여부</b>
                            </th>
                            <th scope="col">
                                <b>문의 상품</b>
                            </th>
                            <th scope="col">
                                <b>문의 제목</b>
                            </th>
                            <th scope="col">
                                <b>작성일</b>
                            </th>
                        </tr>
                    </thead>
                    <tbody v-if="qnaList.total < 1">
                        <tr>
                            <td colspan="4">
                                <p class="mm_text-none">
                                    <i class="ico_text-none" />등록된 문의가 없습니다
                                </p>
                            </td>
                        </tr>
                    </tbody>
                    <tbody
                        v-for="qna in qnaList.data" 
                        v-else 
                        :key="qna.id" 
                        v-dropdown="{ groupName: 'qna' }" 
                        class="mm_dropdown" 
                    >
                        <tr class="btn_dropdown">
                            <td v-if="qna.answer">
                                <strong class="mm_text-variable text_state">답변완료</strong>
                            </td>
                            <td v-else>
                                <strong class="text_state">답변대기</strong>
                            </td>
                            <td>
                                <div v-if="qna.topGoods" class="mm_product-item T=single T=sm">
                                    <figure>
                                        <div class="mm_image-scale">
                                            <i
                                                v-lazyload="{ src: qna.topGoods.thumbnailUrl }"
                                                class="mm_bg-cover image_product"
                                            />
                                        </div>
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
                            </td>
                            <td><p>{{ qna.title }}</p></td>
                            <td><b>{{ MMFilters.formatDate(qna.createdAt, 'YYYY.MM.DD') }}</b></td>
                        </tr>
                        <tr class="mm_dropdown-item">
                            <td
                                class="mm_dropdown-item-inner"
                                colspan="4"
                            >
                                <div class="mm_qna-qustion">
                                    <p v-html="MMFilters.nlToBr(qna.contents)" />
                                    <div
                                        v-if="!qna.answer"
                                        class="mm_btn_box"
                                    >
                                        <button
                                            type="button"
                                            class="mm_btn T=xs T=line T=lightest"
                                            @click="deleteQna(qna.id)"
                                        >
                                            <b>삭제</b>
                                        </button>
                                        <a
                                            class="mm_btn T=xs T=darker"
                                            href="#"
                                            @click.prevent="editQnaModalOpen(qna.id)"
                                        ><b>수정</b></a>
                                    </div>
                                </div>
                                <div
                                    v-if="qna.answer"
                                    class="mm_qna-answer"
                                >
                                    <p v-html="MMFilters.nlToBr(qna.answer?.contents)" />
                                    <span class="text_date">답변일: {{ MMFilters.formatDate(qna.answer?.createdAt, 'YYYY.MM.DD') }}</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!--// 1:1 문의 -->

            <!-- 페이지네이션 -->
            <!-- (D) 현재 페이지의 메뉴에 'S=page-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
            <MMPaginator
                :page-block-type="'group'"
                :page-block-count="10"
                :current-page="qnaList.currentPage"
                :items-per-page="qnaList.perPage"
                :total-count="qnaList.total"
                @move-page-to="movePage"
            />
            <!--// 페이지네이션 -->
        </div>
    </div>
</template>
<script setup lang="ts">
import MMPaginator from '@/components/Paginator.vue';
import EditModal from '@/components/modal/EditQna.vue'
import { useModal } from '$/composables/pageHandler/modalComposable';
import { dropdown as vDropdown } from '$/directives';
import { useQnaDelete, useQnaList } from '$/composables/mypage/qnaComposable';
import { usePageContext } from '$/composables/pageHandler/contextComposable';

const { 
    router, 
    usePageTitleSetting 
} = usePageContext();

usePageTitleSetting('1:1 문의', ['문의 관리', '1:1 문의', '마이페이지']);
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

/**
 * 1:1 문의 수정 모달 open
 * @param qnaId 
 */
function editQnaModalOpen(qnaId: number) {
    useModal().open(EditModal, {
        title: '1:1 문의 수정',
        name: 'EditQna',
        itemClass: 'm_modal-my-inquiry',
        props: async() => {
            return {
                qnaId,
            }
        },
        onClose: async () => {
            await fetchQnaList(props.page);
        }
    })
}
</script>