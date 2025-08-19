<template>
    <MMSub>
        <template #headerTitle>
            <h1><b>자주하는 질문</b></h1>
        </template>
        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="m_cs-faq">
                            <!-- 검색 -->
                            <div class="m_cs-faq-search">
                                <div class="mm_form-text">
                                    <MMInput
                                        v-model="keyword"
                                        maxlength="30"
                                        :use-trim="false"
                                        :place-holder-text="'검색어를 입력하세요'"
                                        @keyup.enter="search"
                                    >
                                        <template #extraTopButton>
                                            <button
                                                type="button"
                                                class="btn_search"
                                                @click="search"
                                            >
                                                <i class="ico_search" />
                                                <b class="mm_ir-blind">검색하기</b>
                                            </button>
                                        </template>
                                    </MMInput>
                                </div>
                            </div>
                            <!--// 검색 -->

                            <!-- 자주하는 질문 키워드 -->
                            <div class="mm_inner m_cs-faq-menu">
                                <ul>
                                    <li v-for="faqType in faqTypes" :key="faqType.id">
                                        <MMLink
                                            :class="{ 'S=menu-on': selectedFaqTypeId === faqType.id && searchedType === 'faqId' }"
                                            :to="{ name: 'CsCenterFaq', params: { faqTypeId: faqType.id } }"
                                            replace
                                            @click="() => {
                                                keyword = '';
                                                searchedWord = '';
                                                fetchFaqs(faqType.id, '');
                                                searchedType = 'faqId';
                                            }"
                                        >
                                            <b>{{ faqType.name }}</b>
                                        </MMLink>
                                    </li>
                                </ul>
                            </div>
                            <!--// 자주하는 질문 키워드 -->

                            <!-- 자주하는 질문 내용 목록 -->
                            <div class="m_cs-faq-result">
                                <h3 v-if="searchedType === 'keyword'" class="mm_heading">
                                    <b><strong class="text_search">{{ searchedWord }}</strong>(으)로 검색한 결과</b>
                                    <strong class="mm_text-variable">{{ faqList.length }}개</strong>
                                </h3>
                                <p v-if="faqList.length < 1" class="mm_text-none">
                                    <i class="ico_text-none" />검색결과가 없습니다
                                </p>
                                <div v-else class="mm_accordion">
                                    <ul>
                                        <li v-for="faq in faqList" :key="faq.id">
                                            <dl
                                                :class="['mm_dropdown', { 'S=on': selectedFaqId === faq.id }]"
                                                @click="() => { selectedFaqId = selectedFaqId === faq.id ? 0 : faq.id }"
                                            >
                                                <dt class="btn_dropdown" tabindex="0" :title="selectedFaqId === faq.id ? '펼쳐보기' : '접어보기'">
                                                    <p>
                                                        <span v-html="MMFilters.wrap(faq.title, searchedWord, '<strong>', '</strong>')" />
                                                    </p>
                                                    <i class="ico_dropdown" />
                                                </dt>
                                                <dd class="mm_dropdown-item" :style="selectedFaqId === faq.id ? { height: 'auto' } : {}">
                                                    <div 
                                                        v-if="keyword !== ''"
                                                        class="mm_dropdown-item-inner"
                                                        v-html="MMFilters.wrap(faq.contents, searchedWord, '<strong>', '</strong>')"
                                                    />
                                                    <div v-else class="mm_dropdown-item-inner" v-html="faq.contents" />
                                                </dd>
                                            </dl>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <!--// 자주하는 질문 내용 목록 -->
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
import { defineComponent, ref, computed } from 'vue';
import { useRoute, } from 'vue-router';
import { faqRepository } from '$/repository/cs/faqRepository';
import { FaqType, Faq } from '$/@type/cs/faq';
import { mmon } from '$/helper/mmon';
import MMSub from '@/components/layout/Sub.vue';
import MMFooter from '@/components/Footer.vue';
import { typeCastNumber } from '$/filters';
import { usePageTitleSetting } from '$/composables/seoComposable';

declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        faqTypes: FaqType[],
        faqList: Faq[]
    }
}

export default defineComponent({
    components: {
        MMSub,
        MMFooter,
    },
    async beforeRouteEnter(to, from, next) {
        const [faqTypes, faqList] = await Promise.all([
            faqRepository.getTypes(), // faq 분류 목록 조회
            faqRepository.getFaqList(typeCastNumber(`${to.params.faqTypeId || '1'}`), '')
        ]);

        next(vm => {
            vm.faqTypes = faqTypes
            vm.faqList = faqList
        })
    },
    setup() {
        const route = useRoute();
        usePageTitleSetting('자주하는 질문', ['고객센터']);
        
        const keyword = ref<string>(''); // MMInput에 입력한 검색어
        const selectedFaqId = ref<number>(0); // 사용자가 선택한 faq 목록 아이템의 id
        const searchedWord = ref<string>(''); // 검색 버튼을 눌렀을 때 검색어
        const searchedType = ref<string>('faqId'); // type: faqId, keyword (keyword로 검색시 전체 검색(faqId 무시))
        const faqList = ref<Faq[]>([]); // 조회 결과 목록
        const faqTypes = ref<FaqType[]>([]);
        const selectedFaqTypeId = computed(() => {
            return Number(route.params.faqTypeId) || 1;
        });


        /**
         * faq 조회
         *
         * @param  {number} typeId
         * @param  {string=''} searchWord
         * @param  {number=1} page
         * @param  {number=100} perPage
         */
        async function fetchFaqs(
            typeId = 1,
            searchWord = ''
        ) {
            try {
                faqList.value = await faqRepository.getFaqList(typeId, searchWord);
            } catch (e) {
                console.log(e);
            }
        }

        /**
         * 키워드 검색
         */
        async function search() {
            if(keyword.value === '') {
                return mmon.bom.alert('검색어를 입력해주세요.');
            }
            mmon.loading.show();
            searchedType.value = 'keyword';
            // 사용한 검색어는 따로 보관해서 검색어 노출할 때 사용
            searchedWord.value = keyword.value;
            // 검색 처리
            fetchFaqs(1, keyword.value);
            mmon.loading.hide();
        }

        return {
            route,
            faqList,
            faqTypes,
            keyword,
            searchedWord,
            searchedType,
            selectedFaqId,
            selectedFaqTypeId,
            search,
            fetchFaqs,
        }
    }
})
</script>