<template>
    <div class="mm_page-content-body">
        <!-- 자주 찾는 메뉴 -->
        <div class="mm_flex m_cs-quick">
            <h4><small>QUICK MENU</small><b>바로가기</b></h4>
            <ul class="mm_flex mm_flex-equal T=equal">
                <li>
                    <MMLink :to="{ name: 'MypageInquiryQnaCreate' }">
                        <i class="ico_cs-qna" /><b>1:1 고객상담</b>
                    </MMLink>
                </li>
                <li>
                    <MMLink :to="{ name: 'MypageInquiryQnaList' }">
                        <i class="ico_cs-answer" /><b>상담/답변확인</b>
                    </MMLink>
                </li>
                <li>
                    <MMLink :to="{ name: 'MypageOrderList' }">
                        <i class="ico_cs-ship" /><b>주문배송조회</b>
                    </MMLink>
                </li>
                <li>
                    <MMLink :to="{ name: 'MypageBenefit' }">
                        <i class="ico_cs-coupon" /><b>쿠폰/적립금</b>
                    </MMLink>
                </li>
            </ul>
        </div>
        <!--// 자주 찾는 메뉴 -->

        <!-- 자주하는 질문 -->
        <div class="m_cs-faq">
            <!-- 검색 -->
            <div class="m_cs-faq-search">
                <div class="mm_form_mix-linked">
                    <h5 class="text_linked">
                        <b>자주하는 질문</b>
                    </h5>
                    <MMInput
                        v-model="searchWord"
                        :place-holder-text="'검색어를 입력하세요'"
                        max-length="30"
                        :use-trim="false"
                        @keyup.enter="search"
                    />
                    <button
                        type="button"
                        class="mm_btn T=dark"
                        @click="search"
                    >
                        <b>검색하기</b>
                    </button>
                </div>
                <h4
                    v-if="searchedWord !== ''"
                    class="text_searched"
                >
                    <strong>‘{{ searchedWord }}’</strong> 으로 검색한 결과 <strong>{{ faqs.total }}개</strong>
                </h4>
            </div>
            
            <!--// 검색 -->

            <!-- 탭메뉴 -->
            <div class="mm_tab_menu T=square">
                <!-- (D) 선택된 탭메뉴에 'S=tab-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
                <ul class="mm_flex T=equal">
                    <li
                        v-for="faqType in faqTypes"
                        :key="faqType.id"
                    >
                        <MMLink 
                            :to="{ name: 'CsCenterMain', query: { faqTypeId: faqType.id } }"
                            :replace="true"
                            :class="{ 'S=tab-on': faqTypeId == faqType.id }"
                            :title="faqTypeId == faqType.id ? '선택됨' : ''" 
                        >
                            <b>{{ faqType.name }}</b>
                        </MMLink>
                    </li>
                </ul>
            </div>
            <!--// 탭메뉴 -->
            <p
                v-if="faqs.total < 1"
                class="mm_text-none"
            >
                <i class="ico_text-none" />검색 결과가 없습니다
            </p>
            <div
                v-else
                class="mm_accordion"
            >
                <ul>
                    <li
                        v-for="faq in faqs.data"
                        :key="faq.id"
                    >
                        <dl 
                            v-dropdown="{ groupName: 'faq' }" 
                            class="mm_dropdown"
                            data-dropdown="{ '_group': 'dev_accrodion' }"
                        >
                            <dt
                                class="btn_dropdown"
                                tabindex="0"
                                title="펼쳐보기"
                            >
                                <p><span v-html="MMFilters.wrap(faq.title, searchedWord, '<strong>', '</strong>')" /></p>
                                <i class="ico_dropdown" />
                            </dt>
                            <dd class="mm_dropdown-item">
                                <div class="mm_dropdown-item-inner">
                                    <p
                                        v-if="searchedWord !== ''"
                                        v-html="MMFilters.wrap(faq.contents, searchedWord, '<strong>', '</strong>')"
                                    />
                                    <p
                                        v-else
                                        v-html="faq.contents"
                                    />
                                </div>
                            </dd>
                        </dl>
                    </li>
                </ul>
            </div>
            <!--// 리스트 -->
            <MMPaginator
                :page-block-type="'group'"
                :page-block-count="10"
                :current-page="faqs.currentPage"
                :items-per-page="faqs.perPage"
                :total-count="faqs.total"
                @move-page-to="movePage"
            />
            <!--// 페이지네이션 -->
        </div>
        <!-- 자주하는 질문 -->

        <!-- 공지사항 -->
        <div class="m_cs-notice">
            <h5 class="mm_strapline">
                <b>공지사항</b>
            </h5>
            <p
                v-if="notices.length < 1"
                class="mm_text-none"
            >
                <i class="ico_text-none" />등록된 공지사항이 없습니다
            </p>
            <div
                v-else
                class="mm_list"
            >
                <ul>
                    <li
                        v-for="notice in notices"
                        :key="notice.id"
                    >
                        <MMLink :to="{ name: 'CsCenterNoticeDetail', params: { id: notice.id } }">
                            <b>{{ notice.title }}</b><small>{{ MMFilters.formatDate(notice.createdAt, 'yyyy.MM.DD') }}</small>
                        </MMLink>
                    </li>
                </ul>
            </div>
            <MMLink
                :to="{ name: 'CsCenterNoticeIndex' }"
                class="btn_more"
            >
                <b>더보기</b><i class="ico_more" />
            </MMLink>
        </div>
    <!--// 공지사항 -->
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { faqRepository } from '$/repository/cs/faqRepository';
import { noticeRepository } from '$/repository/cs/noticeRepository';
import { FaqType, Faq } from '$/@type/cs/faq';
import { Notice } from '$/@type/cs/notice';
import { Paginator } from '$/@type';
import { dropdown as vDropdown } from '$/directives';
import MMPaginator from '@/components/Paginator.vue';
import { mmon } from '$/helper/mmon';
import { usePageTitleSetting } from '$/composables/seoComposable';

// FAQ
const faqTypes = ref<FaqType[]>([]);
const route = useRoute()
usePageTitleSetting('고객센터');

const faqs = ref<Paginator<Faq>>({
    total: 0,
    currentPage: 1,
    perPage: 20,
    data: [],
});
const searchWord = ref<string>('');
const searchedWord = ref<string>('');
const faqTypeId = ref<number>(0);

//공지사항
const notices = ref<Notice[]>([]);

/**
 * faq 조회
 * 
 * @param  {number} typeId
 * @param  {string=''} searchWord
 * @param  {number=1} page
 * @param  {number=10} perPage
 */
async function fetchFaqs(
    typeId: number, 
    searchWord = '', 
    page = 1, 
    perPage = 10
) {
    try {
        faqs.value = await faqRepository.getFaqs(typeId, searchWord, page, perPage);
    } catch (e) {
        //
    }
}

/**
 * faq 분류 조회
 */
async function fetchFaqTypes() {
    try {
        faqTypes.value = await faqRepository.getTypes();
    } catch (e) {
        //
    }
}

async function fetchTopNotices() {
    try {
        notices.value = await noticeRepository.getTopNotices();
    } catch (e) {
        //
    }
}

async function movePage(page: number) {
    fetchFaqs(faqTypeId.value, '', page);
}

async function search() {
    if (!searchWord.value) {
        return mmon.bom.alert('검색어를 입력해주세요.');
    }
    searchedWord.value = searchWord.value;
    faqTypeId.value = 0;
}

onMounted(async () => {
    mmon.loading.show();
    try {
        await Promise.all([fetchFaqTypes(), fetchTopNotices()]);
        if (faqTypeId.value === 0) {
            faqTypeId.value = faqTypes.value[0]?.id;
        }
    } catch (e) {
        console.log(e)
    } finally {
        mmon.loading.hide();
    }
});

watch([faqTypeId, searchedWord], async () => {
    if (faqTypeId.value) {
        searchWord.value = '';
        searchedWord.value = '';
    }
    
    await fetchFaqs(faqTypeId.value, searchedWord.value, 1);
})

watch(() => route.query.faqTypeId, (to) => {      
    faqTypeId.value = Number(to) || 0;
}, {
    immediate: true
})
</script>