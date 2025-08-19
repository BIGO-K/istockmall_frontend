<template>
    <div class="mm_page-content-body">
        <h3 class="mm_heading">
            <b>공지사항</b>
        </h3>
        <div class="mm_table">
            <p
                v-if="noticeList.total < 1 && importantNotices.length < 1"
                class="mm_text-none"
            >
                <i class="ico_text-none" />등록된 공지사항이 없습니다
            </p>
            <table v-else>
                <colgroup>
                    <col style="width:90px;">
                    <col>
                    <col style="width:200px;">
                </colgroup>
                <thead>
                    <tr>
                        <th scope="col" />
                        <th scope="col">
                            <b>제목</b>
                        </th>
                        <th scope="col">
                            <b>등록일</b>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="important in importantNotices"
                        :key="important.id"
                        class="T=table-notice"
                    >
                        <td>공지</td>
                        <td>
                            <p>
                                <MMLink :to="{ name: 'CsCenterNoticeDetail', params: { id: important.id } }">
                                    <b>{{ important.title }}</b>
                                    <strong class="text_important">중요</strong>
                                </MMLink>
                            </p>
                        </td>
                        <td>{{ MMFilters.formatDate(important.createdAt, 'yyyy.MM.DD') }}</td>
                    </tr>
                    <tr
                        v-for="(notice, index) in noticeList.data"
                        :key="notice.id"
                    >
                        <td>{{ topNumbering - index }}</td>
                        <td>
                            <p>
                                <MMLink :to="{ name: 'CsCenterNoticeDetail', params: { id: notice.id } }">
                                    <b>{{ notice.title }}</b>
                                </MMLink>
                            </p>
                        </td>
                        <td>{{ MMFilters.formatDate(notice.createdAt, 'yyyy.MM.DD') }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- 페이지네이션 -->
        <!-- (D) 현재 페이지의 메뉴에 'S=page-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
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
</template>
<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { Notice } from '$/@type/cs/notice';
import { Paginator } from '$/@type';
import { noticeRepository } from '$/repository/cs/noticeRepository';
import MMPaginator from '@/components/Paginator.vue';
import { mmon } from '$/helper/mmon';
import { useRoute, useRouter } from 'vue-router';
import { usePageTitleSetting } from '$/composables/seoComposable';

const route = useRoute();
const router = useRouter();
usePageTitleSetting('공지사항', ['고객센터']);

const noticeList = ref<Paginator<Notice>>({
    total: 0,
    data: [],
    currentPage: 1,
    perPage: 10,
});
const importantNotices = ref<Notice[]>([]);

// 리스트 시작 넘버링
const topNumbering = computed<number>(() => {
    const currentPage : number = noticeList.value.currentPage || 1;
    const perPage : number = noticeList.value.perPage || 10;
    return noticeList.value.total - ((currentPage - 1) * perPage);
});

const page = ref<number>(1);

onMounted(async () => {
    try {
        page.value = route.query.page ? Number(route.query.page) : 1;

        const [important] = await Promise.all([
            noticeRepository.getImportantNotices(),
            fetch(),
        ]);

        importantNotices.value = important;
    } catch (e) {
        console.log(e)
    }
});

async function fetch() {
    mmon.loading.show();

    try {
        noticeList.value = await noticeRepository.getNotices(page.value);

        router.replace({
            name: 'CsCenterNoticeIndex',
            query: {
                page: page.value,
            },
        });
    } catch (e) {
        console.log(e);
    } finally {
        mmon.loading.hide();
    }
}

async function movePage(nextPage: number) {
    page.value = nextPage;
    fetch();
}
</script>