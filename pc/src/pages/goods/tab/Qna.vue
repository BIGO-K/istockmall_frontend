<template>
    <div class="m_prodetail-tab-qna">
        <p ref="qnaListEl" class="text_qna">
            판매자에게 상품,배송,취소,교환,반품 등<br>궁금한 내용을 문의하세요
        </p>
        <div class="mm_btn_box">
            <a
                class="mm_btn T=line T=primary"
                href="#"
                @click.prevent="qnaWrite"
            ><b>상품 문의하기</b></a>
        </div>
        <!-- Q&A 리스트 -->
        <template v-if="qnaPaginator.total < 1 && !qnaFilters.onlyAnswered">
            <p class="mm_text-none">
                <i class="ico_text-none" />등록된 문의가 아직 없습니다
            </p>
        </template>
        <template v-else>
            <div class="mm_qna">
                <label class="mm_form-check">
                    <input
                        v-model="qnaFilters.onlyAnswered"
                        type="checkbox"
                        data-check
                        @change="fetchQna"
                    >
                    <b class="mm_block">
                        <i class="ico_form-check" />
                        <span class="text_label">답변완료만 보기</span>
                    </b>
                </label>

                <!-- 내용없음 -->
                <!-- (D) '답변완료만 보기' 체크박스 선택 시 노출되는 내용없음이며, 아래 table 및 pagination 미노출합니다. -->
                <p
                    v-if="qnaPaginator.total < 1"
                    class="mm_text-none"
                >
                    <i class="ico_text-none" />등록된 문의가 아직 없습니다
                </p>
                <!--// 내용없음 -->
                <table v-else>
                    <colgroup>
                        <col style="width:136px;">
                        <col>
                        <col style="width:153px;">
                    </colgroup>
                    <tbody
                        v-for="qna in qnaPaginator.data"
                        :key="`qna_${qna.id}`"
                        :class="[
                            { 'mm_dropdown' : !qna.isPrivate || (qna.isPrivate && qna.isReadAble) },
                            { 'S=on' : selectedQnaId === qna.id }]"
                        @click="() => { selectedQnaId = selectedQnaId === qna.id ? 0 : qna.id }"
                    >
                        <tr
                            class="btn_dropdown"
                            title="펼쳐보기"
                        >
                            <td>
                                <strong
                                    v-if="qna.isAnswered"
                                    class="mm_text-variable text_state"
                                >답변완료</strong>
                                <strong
                                    v-else
                                    class="text_state"
                                >답변대기</strong>                              
                            </td>
                            <td v-if="qna.isPrivate && !qna.isReadAble">
                                <p>비밀글입니다<i class="ico_lock" /></p>
                            </td>
                            <td v-else>
                                <p>{{ qna.title }}</p>
                            </td>
                            <td>{{ qna.createdAt }}</td>
                        </tr>
                        <tr class="mm_dropdown-item">
                            <td
                                class="mm_dropdown-item-inner"
                                colspan="3"
                            >
                                <div class="mm_qna-qustion">
                                    <p v-html="qna.contents" />
                                    <div
                                        v-if="qna.isEditAble"
                                        class="mm_btn_box"
                                    >
                                        <button
                                            type="button"
                                            class="mm_btn T=xs T=line T=lightest"
                                            @click="qnaRemove(qna.id)"
                                        >
                                            <b>삭제</b>
                                        </button>
                                        <a
                                            class="mm_btn T=xs T=darker"
                                            href="#"
                                            @click.prevent="qnaEdit"
                                        ><b>수정</b></a>
                                    </div>
                                </div>
                                <div
                                    v-if="qna.isAnswered"
                                    class="mm_qna-answer"
                                >
                                    <p v-html="qna.answer?.contents" />
                                    <span class="text_date">답변일: {{ qna.answer?.createdAt }}</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!--// Q&A 리스트 -->

            <!-- 페이지네이션 -->
            <!-- (D) 현재 페이지의 메뉴에 'S=page-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
            <MMPaginator
                :page-block-type="'group'"
                :page-block-count="10"
                :current-page="qnaPaginator.currentPage"
                :items-per-page="qnaPaginator.perPage"
                :total-count="qnaPaginator.total"
                :scroll-y-target="qnaListEl"
                @move-page-to="movePage"
            />
            <!--// 페이지네이션 -->
        </template>
    </div>
</template>

<script setup lang="ts">
import { QnaPaginator } from '$/@type/goods';
import { onMounted, ref } from 'vue';
import { goodsRepository } from '$/repository/goodsRepository';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import GoodsQnaEditModal from '@/components/modal/qna/GoodsQnaEdit.vue';
import GoodsQnaModal from '@/components/modal/qna/GoodsQna.vue';
import { useModal } from '$/composables/pageHandler/modalComposable';
import { sellerQnaRepository } from '$/repository/cs/sellerQnaRepository';
import { usePageContext } from '$/composables/pageHandler/contextComposable';
import MMPaginator from '@/components/Paginator.vue';

const props = defineProps<{
    goodsId: number,
}>();

const selectedQnaId = ref(0);
const qnaListEl = ref<HTMLElement>();
// 회원 정보 
const { router, isUser } = usePageContext();

const qnaPaginator = ref<QnaPaginator>({
    total: 0,
    currentPage: 1,
    perPage: 10,
    data: []
}); 

const qnaFilters = ref({
    page: 1,
    perPage: 20,
    onlyAnswered: false
})

async function movePage(page: number) {
    qnaFilters.value.page = page;
    await fetchQna();
}

async function fetchQna() {
    try {
        qnaPaginator.value = await goodsRepository.goodsQnaList(props.goodsId, qnaFilters.value);
    } catch(e) {
        
    }
}

function qnaWrite() {
    if (!isUser.value) {
        return mmon.bom.confirm("로그인이 필요합니다 \n로그인 페이지로 이동하시겠습니까?", (flag: boolean) => {
            if (flag) {
                router.push({
                    name: "Login",
                    query: {
                        redirect_to_after: router.currentRoute.value.path,
                    },
                });
            }
        });
    }
    
    useModal().open(GoodsQnaModal, {
        title: '상품 문의하기',
        name: 'GoodsQnaModal',
        itemClass: 'm_modal-inquiry',
        props: async() => { 
            const [ qnaInformation, qnaTypes ] = await Promise.all([
                goodsRepository.goodsQnaInfo(props.goodsId),
                sellerQnaRepository.getTypes(true)
            ])

            return {
                goodsId: props.goodsId,
                qnaInfo: qnaInformation,
                qnaTypes: qnaTypes
            }
        },
        onClose: () => {
            fetchQna();
        }
    })  
}

async function qnaRemove(qnaId: number) {
    try {
        mmon.loading.show();
        await goodsRepository.removeQna(qnaId, props.goodsId);
        await fetchQna();
        mmon.bom.alert('문의가 삭제되었습니다');               
    } catch (error) {
        defaultCatch(error);
    } finally {
        mmon.loading.hide(); 
    }
}

async function qnaEdit() {
    useModal().open(GoodsQnaEditModal, {
        title: '상품 문의하기',
        name: 'GoodsQnaModal',
        itemClass: 'm_modal-inquiry',
        props: async() => { 
            const qna = await goodsRepository.showQna(props.goodsId, selectedQnaId.value)
            return {
                goodsId: props.goodsId,
                qna: qna,
            }
        },
        onClose: () => {
            fetchQna();
        }
    })  
}

onMounted(async() => {            
    await fetchQna();
})
</script>