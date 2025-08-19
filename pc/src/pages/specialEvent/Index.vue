<template>
    <div class="mm_page-content">
        <div class="mm_inner m_event">
            <h3 class="mm_title">
                <b>기획전</b>
            </h3>
            <!-- 탭메뉴 -->
            <div class="mm_tab_menu">
                <ul class="mm_flex T=equal">
                    <li v-for="tab in tabs" :key="tab.code">
                        <a
                            href="#"
                            :class="{ 'S=tab-on': selectedTabCode === tab.code }"
                            @click.prevent="selectTab(tab)"
                        >
                            {{ tab.label }}
                        </a>
                    </li>
                    <li>
                        <MMLink :to="{ name: 'ExperienceGroup' }">
                            체험단 후기
                        </MMLink>
                    </li>
                </ul>
            </div>
            <!--// 탭메뉴 -->

            <!-- 이벤트 리스트 -->
            <template v-if="isCompleteLoading">
                <p
                    v-if="specialEventPaginator.total === 0"
                    class="mm_text-none"
                >
                    <i class="ico_text-none" />등록된 이벤트가 없습니다
                </p>
                <ul
                    v-else
                    class="m_event-list"
                >
                    <li v-for="event in specialEventPaginator.data" :key="event.id">
                        <MMLink :to="getEventDetailLink(event)">
                            <figure>
                                <i
                                    v-lazyload="{ src: event.imageUrl }"
                                    class="mm_bg-cover image_banner"
                                />
                                <figcaption>
                                    <p class="text_main">
                                        {{ event.title }}
                                    </p>
                                    <p class="text_sub">
                                        {{ event.description }}
                                    </p>
                                    <p class="text_period">
                                        {{ `${MMFilters.formatDate(event.startAt, 'yyyy.MM.DD')} ~ ${MMFilters.formatDate(event.endAt, 'yyyy.MM.DD')}` }}
                                    </p>
                                </figcaption>
                            </figure>
                        </MMLink>
                    </li>
                </ul>
            </template>
            <ul v-else class="m_event-list T=skeleton">
                <!-- skeleton -->
                <li v-for="index in 6" :key="index">
                    <i class="image_banner" />
                    <p class="text_main" />
                    <p class="text_sub" />
                    <p class="text_period" />
                </li>
            </ul>
            <!--// 이벤트 리스트 -->

            <!-- 페이지네이션 -->
            <MMPaginator
                :page-block-type="'group'"
                :page-block-count="10"
                :current-page="specialEventPaginator.currentPage"
                :items-per-page="specialEventPaginator.perPage"
                :total-count="specialEventPaginator.total"
                @movePageTo="movePageTo"
            />
        <!--// 페이지네이션 -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { specialEventRepository } from '$/repository/specialEventRepository';
import { SimpleSpecialEvent } from '$/@type/specialEvent';
import { Paginator } from '$/@type';
import { defaultCatch } from '$/functions';
import MMPaginator from '@/components/Paginator.vue';
import MMLink from '@/components/MMLink.vue';
import { useRoute, useRouter } from 'vue-router';
import { makePath } from '$/services/http';
import { typeCastNumber } from '$/filters';
import { usePageTitleSetting } from '$/composables/seoComposable'

usePageTitleSetting('이벤트');
const route = useRoute();
const router = useRouter()
const specialEventPaginator = ref<Paginator<SimpleSpecialEvent>>({
    total: 0,
    currentPage: 1,
    perPage: 15,
    data: [],
})

const selectedTabCode = ref(`${route.query.tab || 'all'}`);
const page = ref(typeCastNumber(route.query.page, 1));

// 이벤트 목록 로딩 완료 여부
const isCompleteLoading = ref<boolean>(true);

// 상단에 [전체/진행중/종료] 탭 타입
interface Tab {
    code: string
    label: string
}

const tabs = ref<Tab[]>([
    {
        code: 'all',
        label: '전체'
    },
    {
        code: 'progress',
        label: '진행중'
    },
    {
        code: 'end',
        label: '종료'
    }
])

fetchSpecialEvent(true);

async function fetchSpecialEvent(init = false) {
    try {
        isCompleteLoading.value = false;
        specialEventPaginator.value = await specialEventRepository.getSimpleSpecialEventPaginator(selectedTabCode.value, page.value);
        if (!init) {
            router.replace(makePath(route.path, {
                tab: selectedTabCode.value,
                page: page.value
            }))
        }
    } catch (error) {
        defaultCatch(error);
    } finally {
        isCompleteLoading.value = true;
    }
}
/**
 * 페이지 이동시 데이터 조회
 *
 * @param {number} page
 */
function movePageTo(movePage = 1) {
    page.value = movePage;
    fetchSpecialEvent();
}

/**
 * 이벤트 상세 페이지 url
 *
 * @param {SimpleSpecialEvent} event
 * @return any
 */
const getEventDetailLink = (event: SimpleSpecialEvent) => {
    // 상세 URL 사용시 해당 URL로 이동
    if (event.isUseDetailUrl) {
        return event.detailUrl;
    }
    // 그 외는 이벤트 상세 페이지로 이동
    return { name: 'SpecialEventDetail', params: { id: event.id } };
};

/**
 * 탭메뉴 선택시 데이터 조회
 *
 * @param {Tab} tab
 */
async function selectTab(tab: Tab) {
    selectedTabCode.value = tab.code
    page.value = 1
    fetchSpecialEvent();
}
</script>
