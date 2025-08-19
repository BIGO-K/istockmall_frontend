<template>
    <MMSub>
        <template #headerTitle>
            <h1><b>공지사항</b></h1>
        </template>
        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <div class="mm_page-content">
                        <p v-if="noticeList.total < 1 && importantNotices.length < 1" class="mm_text-none">
                            <i class="ico_text-none" />등록된 공지사항이 없습니다
                        </p>
                        <div v-else class="mm_accordion">
                            <ul>
                                <li v-for="important in importantNotices" :key="important.id">
                                    <dl 
                                        :class="['mm_dropdown', { 'S=on' : selectedNoticeId === important.id }]"
                                        @click="() => { selectedNoticeId = selectedNoticeId === important.id ? 0 : important.id }"
                                    >
                                        <dt 
                                            class="btn_dropdown" 
                                            tabindex="0" 
                                            :title="selectedNoticeId === important.id ? '접어보기' : '펼쳐보기'"
                                        >
                                            <p>
                                                <b class="text_important">중요</b>
                                                <b>{{ important.title }}</b>
                                            </p>
                                            <i class="ico_dropdown" />
                                        </dt>
                                        <dd 
                                            class="mm_dropdown-item" 
                                            :style="selectedNoticeId === important.id ? { height: 'auto' } : {}"
                                        >
                                            <div class="mm_dropdown-item-inner">
                                                <p v-html="MMFilters.nlToBr(important.contents || '')" />
                                            </div>
                                        </dd>
                                    </dl>
                                </li>
                                <li v-for="notice in noticeList.data" :key="notice.id">
                                    <dl 
                                        :class="['mm_dropdown', { 'S=on' : selectedNoticeId === notice.id}]"
                                        @click="() => { selectedNoticeId = selectedNoticeId === notice.id ? 0 : notice.id }"
                                    >
                                        <dt 
                                            class="btn_dropdown" 
                                            tabindex="0" 
                                            :title="selectedNoticeId === notice.id ? '접어보기' : '펼쳐보기'"
                                        >
                                            <p>
                                                <b>{{ notice.title }}</b>
                                            </p>
                                            <i class="ico_dropdown" />
                                        </dt>
                                        <dd 
                                            class="mm_dropdown-item" 
                                            :style="selectedNoticeId === notice.id ? { height: 'auto' } : {}"
                                        >
                                            <div class="mm_dropdown-item-inner">
                                                <p v-html="MMFilters.nlToBr(notice.contents || '')" />
                                            </div>
                                        </dd>
                                    </dl>
                                </li>
                            </ul>
                        </div>
                        <!-- 페이지네이션 -->
                        <MMPaginator 
                            :page-block-type="'group'"
                            :page-block-count="10"
                            :current-page="noticeList.currentPage"
                            :items-per-page="noticeList.perPage"
                            :total-count="noticeList.total"
                            @move-page-to="movePage"
                        />
                        <!--// 페이지네이션 -->
                    </div>

                    <!-- 푸터 -->
                    <MMFooter />
                    <!--// 푸터 -->
                </div>
            </div>
        </template>
    </MMSub>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { noticeRepository } from '$/repository/cs/noticeRepository';
import { Paginator } from '$/@type';
import { Notice } from '$/@type/cs/notice';
import MMPaginator from '@/components/Paginator.vue';
import MMFooter from '@/components/Footer.vue';
import MMSub from '@/components/layout/Sub.vue';
import { typeCastNumber } from '$/filters';
import { useRoute, useRouter } from 'vue-router';
import { makePath } from '$/services/http';
import { mmon } from '$/helper/mmon';
import { usePageTitleSetting } from '$/composables/seoComposable';

declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        importantNotices: Notice[],
        noticeList: Paginator<Notice>,
    }
}

export default defineComponent({
    components: {
        MMPaginator,
        MMSub,
        MMFooter,
    },
    async beforeRouteEnter(to, from, next) {
        try {
            const [importantNotices, paginator] = await Promise.all([
                noticeRepository.getImportantNotices(), 
                noticeRepository.getNotices(typeCastNumber(`${to.query.page || '1'}`)),
            ])

            next(vm => {
                vm.importantNotices = importantNotices
                vm.noticeList = paginator
            })
        } catch (e) {
            next();
        }
    },
    setup() {
        const route = useRoute()
        const router = useRouter()
        usePageTitleSetting('공지사항', ['고객센터']);

        const importantNotices = ref<Notice[]>([]); // 중요 공지 리스트 초기화
        const noticeList = ref<Paginator<Notice>>({ // 중요 공지 제외한 공지 리스트 초기화
            total: 0,
            data: [],
            currentPage: 1,
            perPage: 10,
        });
        const selectedNoticeId = ref(0);    // 선택된 공지 사항 (dropdown에서 사용)

        async function movePage(page: number) {
            mmon.loading.show();
            try {
                noticeList.value = await noticeRepository.getNotices(page)
                router.replace(makePath(route.path, {
                    page,
                }))
            } catch (e) {
                console.log(e);
            } finally {
                mmon.loading.hide();
            }
        }

        return {
            noticeList,
            importantNotices,
            selectedNoticeId,
            movePage,
        }
    },
})
</script>