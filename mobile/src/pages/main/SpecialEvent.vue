<template>
    <section class="mm_inner">
        <h2 class="m_event-title">
            <b>기획전</b>
        </h2>
        <!-- 이벤트 메뉴 -->
        <div class="m_event-menu">
            <ul>
                <li v-for="tab in tabs" :key="tab.code">
                    <a
                        href="#"
                        :class="{ 'S=menu-on': tabType === tab.code }"
                        @click.prevent="selectTab(tab)"
                    >
                        {{ tab.label }}
                    </a>
                </li>
            </ul>
            <MMLink :to="{ name: 'ExperienceGroup' }" class="btn_experience">
                <b>체험단 후기</b><i class="ico_link T=sm" />
            </MMLink>
        </div>
        <!--// 이벤트 메뉴 -->

        <!-- 이벤트 리스트 -->
        <template v-if="isCompleteLoading">
            <p v-if="specialEventPaginator.total === 0" class="mm_text-none">
                <i class="ico_text-none" />등록된 이벤트가 없습니다
            </p>
            <ul v-else class="m_event-list">
                <li v-for="specialEvent in specialEventPaginator.data" :key="specialEvent.id">
                    <MMLink :to="specialEventDetailUrl(specialEvent)">
                        <figure>
                            <i v-lazyload="{ src: specialEvent.imageUrl }" class="mm_bg-cover image_banner" />
                            <figcaption>
                                <p class="text_main">
                                    {{ specialEvent.title }}
                                </p>
                                <p class="text_sub">
                                    {{ specialEvent.description }}
                                </p>
                                <p class="text_period">
                                    {{ MMFilters.formatDate(specialEvent.startAt, 'yyyy.MM.DD') }} ~
                                    {{ MMFilters.formatDate(specialEvent.endAt, 'yyyy.MM.DD') }}
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
            v-if="specialEventPaginator.total > specialEventPaginator.perPage"
            :page-block-type="'group'"
            :page-block-count="5"
            :current-page="specialEventPaginator.currentPage"
            :items-per-page="specialEventPaginator.perPage"
            :total-count="specialEventPaginator.total"
            @movePageTo="movePageTo"
        />
    <!--// 페이지네이션 -->
    </section>
</template>
\
<script lang="ts">
import { ref, defineComponent } from 'vue';
import { specialEventRepository } from '$/repository/specialEventRepository'
import { SimpleSpecialEvent } from '$/@type/specialEvent'
import { Paginator } from '$/@type'
import { defaultCatch } from '$/functions'
import MMPaginator from '@/components/Paginator.vue'
import MMLink from '@/components/MMLink.vue'
import { useRoute, useRouter } from 'vue-router'
import { makePath } from '$/services/http'
import { usePageTitleSetting } from '$/composables/seoComposable';

declare module "@vue/runtime-core" { 
    interface ComponentCustomProperties {
      specialEventPaginator: Paginator<SimpleSpecialEvent>
    }
}
export default defineComponent({
    components: {
        MMPaginator,
        MMLink,
    },
    async beforeRouteEnter(to, from, next) {
        try {
            const specialEvents = await specialEventRepository.getSimpleSpecialEventPaginator(`${to.query.tab || 'all'}`, 1)

            next(vm => {
                vm.specialEventPaginator = specialEvents
            })
        } catch (e) {
            next();
        }
    },
    setup() {
        const route = useRoute()
        const router = useRouter()
        usePageTitleSetting('이벤트');

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
        const tabType = ref<string>(`${route.query.tab || 'all'}`)
        const specialEventPaginator = ref<Paginator<SimpleSpecialEvent>>({
            total: 0,
            currentPage: 1,
            perPage: 15,
            data: [] as SimpleSpecialEvent[],
        })

        // 이벤트 목록 로딩 완료 여부
        const isCompleteLoading = ref<boolean>(true)
        
        /**
         * 이벤트 상세 페이지 url
         *
         * @param specialEvent: SimpleSpecialEvent
         * @return any
         */
        function specialEventDetailUrl(specialEvent: SimpleSpecialEvent) {
            // 상세 URL 사용시 해당 URL로 이동
            if (specialEvent.isUseDetailUrl) {
                return specialEvent.detailUrl
            }

            // 그 외는 이벤트 상세 페이지로 이동
            return { name: 'SpecialEventDetail', params: { id: specialEvent.id } }
        }

        async function selectTab(tab: Tab) {
            try {
                tabType.value = tab.code
                isCompleteLoading.value = false
                specialEventPaginator.value = await specialEventRepository.getSimpleSpecialEventPaginator(tab.code, 1)

                router.replace(makePath(route.path, {
                    tab: tab.code,
                }))
            } catch (error) {
                defaultCatch(error)
            } finally {
                isCompleteLoading.value = true
            }
        }

        /**
         * 페이지 이동시 데이터 조회
         *
         * @param {number} page
         */
        async function movePageTo(page = 1) {
            try {
                isCompleteLoading.value = false;
                specialEventPaginator.value = await specialEventRepository.getSimpleSpecialEventPaginator(selectedTabCode.value, page);

                router.replace(makePath(route.path, {
                    tab: tabType.value,
                    page
                }))
            } catch (error) {
                defaultCatch(error);
            } finally {
                isCompleteLoading.value = true;
            }
        }

        return {
            isCompleteLoading,
            tabs,
            specialEventPaginator,
            tabType,
            movePageTo,
            specialEventDetailUrl,
            selectTab,
        }
    },
})
</script>
