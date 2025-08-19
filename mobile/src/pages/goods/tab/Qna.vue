<template>
    <div class="m_prodetail-tab-qna">
        <div ref="qnaListEl" class="m...qna-head">
            <p>판매자에게 상품, 배송, 취소, 교환, 반품 등<br> 궁금한 내용을 문의하세요</p>
            <a class="mm_btn T=sm T=line T=dark" href="#GOODS_DETAIL_QNA_CREATE" @click="qnaWrite">
                <b>상품 문의하기</b>
            </a>            
        </div>
        <!-- 문의 목록 -->
        <template v-if="qnaPaginator.total < 1 && !qnaFilters.onlyAnswered">
            <p class="mm_text-none">
                <i class="ico_text-none" />
                등록된 문의가 아직 없습니다
            </p>
        </template>
        <template v-else>            
            <div class="mm_qna">
                <label class="mm_form-check">
                    <input v-model="qnaFilters.onlyAnswered" type="checkbox" data-check @change="fetchQna">
                    <b class="mm_block">
                        <i class="ico_form-check" />
                        <span class="text_label">답변완료만 보기</span>
                    </b>
                </label>
                <p v-if="qnaPaginator.total < 1" class="mm_text-none">
                    <i class="ico_text-none" />
                    등록된 문의가 아직 없습니다
                </p>
                <ul v-else>
                    <li v-for="qna in qnaPaginator.data" :key="`qna_${qna.id}`">
                        <template v-if="!qna.isPrivate || (qna.isPrivate && qna.isReadAble)">
                            <dl 
                                :class="['mm_dropdown', { 'S=on' : selectedQnaId === qna.id }]" 
                                data-dropdown="{ '_group': 'dev_qna' }"
                                @click="() => { selectedQnaId = selectedQnaId === qna.id ? 0 : qna.id }"
                            >
                                <dt class="btn_dropdown" tabindex="0" title="펼쳐보기">
                                    <strong v-if="qna.isAnswered" class="mm_text-variable text_state">답변완료</strong>
                                    <strong v-else class="text_state">답변대기</strong>
                                    <p>
                                        <span class="text_title">{{ qna.isPrivate && !qna.isReadAble ? '비밀글입니다' : qna.title }}</span>
                                        <span class="text_date">{{ qna.createdAt }}</span>
                                    </p>
                                    <i class="ico_dropdown" />
                                </dt>
                                <dd class="mm_dropdown-item" :style="selectedQnaId === qna.id ? { height: 'auto' } : {}">
                                    <div class="mm_dropdown-item-inner">
                                        <div class="mm_qna-qustion">
                                            <p v-html="MMFilters.nlToBr(qna.contents)" />
                                            <div v-if="qna.isEditAble" class="mm_btn_box">
                                                <div class="mm_inline">
                                                    <button type="button" class="mm_btn T=2xs T=line T=lighter" @click="(event) => qnaRemove(event, qna.id)">
                                                        <b>삭제</b>
                                                    </button>
                                                    <a class="mm_btn T=2xs T=line T=lighter" href="#GOODS_DETAIL_QNA_EDIT" @click="setQnaId(qna.id)"><b>수정</b></a>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-if="qna.answer" class="mm_qna-answer">
                                            <p v-html="MMFilters.nlToBr(qna.answer.contents)" />
                                            <span class="text_date">답변일: {{ qna.answer.createdAt }}</span>
                                        </div>
                                    </div>
                                </dd>
                            </dl>
                        </template>
                        <template v-else>
                            <div class="mm_qna-secret">
                                <strong v-if="qna.isAnswered" class="mm_text-variable text_state">답변완료</strong>
                                <strong v-else class="text_state">답변대기</strong>
                                <p>
                                    <span class="text_title">{{ qna.isPrivate ? '비밀글입니다' : qna.title }}</span>
                                    <span class="text_date">{{ qna.createdAt }}</span>
                                    <i class="ico_secret" />
                                </p>
                            </div>
                        </template>
                    </li>
                </ul>
            </div>
            <!--// 문의 목록 -->

            <!-- 페이지네이션 -->
            <MmPaginator
                :page-block-type="'group'"
                :page-block-count="10"
                :current-page="qnaPaginator.currentPage"
                :items-per-page="qnaPaginator.perPage"
                :total-count="qnaPaginator.total"
                :scroll-y-target="qnaListEl"
                @move-page-to="movePage"
            />
        </template>
    </div>
</template>


<script setup lang="ts">
import { QnaPaginator } from '$/@type/goods';
import { defineAsyncComponent, onMounted, ref, onBeforeUnmount, toRefs } from 'vue';
import { goodsRepository } from '$/repository/goodsRepository';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import { useQnaDetail } from '$/composables/goods/detailComposable';
import { usePageContext } from '$/composables/pageHandler/contextComposable';

const props = defineProps<{
    goodsId: number
}>();
const {
    isUser,
    router
} = usePageContext();

const MmPaginator = defineAsyncComponent(() => import('@/components/Paginator.vue'));

const { goodsId } = toRefs(props)
const selectedQnaId = ref(0);
const qnaListEl = ref<HTMLElement>();

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

const { setQnaId, setGoodsId } = useQnaDetail();

async function hashChangeEvent(event: HashChangeEvent) {
    const before = event.oldURL.split('#')[1] ?? '';
    if (before.includes('QNA')) {
        await fetchQna();
    }
}

async function movePage(page: number) {
    qnaFilters.value.page = page;
    await fetchQna();
}

async function fetchQna() {
    qnaPaginator.value = await goodsRepository.goodsQnaList(goodsId.value, qnaFilters.value);
}

/**
 * 상품 문의 삭제
 *
 * @param {number} qnaId
 */
async function qnaRemove(event: Event, qnaId: number) {
    try {
        mmon.loading.show()

        await goodsRepository.removeQna(qnaId, goodsId.value)
        await fetchQna();

        mmon.bom.alert('문의가 삭제되었습니다')

        const target = event.target as Element
        target.closest('li')?.remove()
    } catch (error) {
        defaultCatch(error);
    } finally {
        mmon.loading.hide();
    }
}

/**
 * 상품 문의하기 > 등록 모달 오픈
 *
 * @param {Event} event
 */
function qnaWrite(event: Event) {
    if (!isUser.value) {
        event.preventDefault();
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

    setGoodsId(goodsId.value);
}

onBeforeUnmount(() => {
    window.removeEventListener('hashchange', hashChangeEvent)
}),

onMounted(async() => {
    window.addEventListener('hashchange', hashChangeEvent);
    await fetchQna(); 
})
</script>