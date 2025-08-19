<template>
    <MMSub>
        <template #headerTitle>
            <h1><b>이벤트</b></h1>
        </template>
        <template #contents>
            <div ref="scroller" v-scroll="{ scrollEventHandler }" class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="mm_event">
                            <!-- 관련정보 -->
                            <div class="mm_event-head">
                                <h2>
                                    <b>{{ specialEvent.title }}</b>
                                </h2>
                                <button
                                    type="button"
                                    class="btn_sns-share"
                                    @click="
                                        (event) => {
                                            snsShare(event, specialEvent)
                                        }
                                    "
                                >
                                    <i class="ico_share" /><b class="mm_ir-blind">공유하기</b>
                                </button>
                            </div>
                            <!--// 관련정보 -->

                            <!-- 이벤트 상세 이미지 -->
                            <div class="m_event-hero">
                                <i v-if="specialEvent.contentsType === 'image'" class="image_banner">
                                    <img
                                        v-lazyload="{ src: specialEvent.contentsImageUrl }"
                                        src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                                        :alt="specialEvent.contentsImageAlt"
                                    >
                                </i>
                                <div
                                    v-else-if="specialEvent.contentsType === 'html'"
                                    v-editor-with-image-tag
                                    class="mm_editor"
                                    v-html="specialEvent.contentsHtml"
                                />
                            </div>
                            <!--// 이벤트 상세 이미지 -->

                            <!-- 상품 그룹 앵커 -->
                            <p v-if="specialEvent.goodsGroups.length === 0" class="mm_text-none">
                                <i class="ico_text-none" />등록된 상품이 없습니다
                            </p>
                            <template v-else>
                                <div ref="anchor" v-fixHeight class="mm_event-anchor">
                                    <div :class="['mm_dropdown', { 'S=on': isDropDown }]" data-dropdown>
                                        <button
                                            ref="btnDropdown"
                                            class="btn_dropdown"
                                            :title="isDropDown ? '접어놓기' : '펼쳐보기'"
                                            @click="isDropDown = !isDropDown"
                                        >
                                            <b>{{ specialEvent.goodsGroups[selectedIndex].title }}</b>
                                            <i class="ico_dropdown" />
                                        </button>
                                        <div class="mm_dropdown-item" :style="{ height: isDropDown ? 'auto' : '' }">
                                            <div class="mm_dropdown-item-inner">
                                                <ul>
                                                    <li v-for="(goodsGroup, index) in specialEvent.goodsGroups" :key="index">
                                                        <a
                                                            :class="{ 'S=anchor-on': selectedIndex === index }"
                                                            :title="selectedIndex === index ? '선택됨' : ''"
                                                            @click.prevent="scrollToSection(index)"
                                                        >
                                                            <b>{{ goodsGroup.title }}</b>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!--// 상품 그룹 앵커 -->

                                <!-- 상품 그룹 목록 -->
                                <div
                                    v-for="(goodsGroup, index) in specialEvent.goodsGroups"
                                    :id="`${index}`"
                                    :key="index"
                                    :ref="(el) => setSections(el)"
                                    v-sectionIob="{ selectSection }"
                                    class="mm_event-list"
                                >
                                    <h3>
                                        <b>{{ goodsGroup.title }}</b>
                                    </h3>
                                    <div class="mm_product-list T=card">
                                        <ul>
                                            <li v-for="(goods) in goodsGroup.goodsList" :key="goods.id" v-goods-iob="{ goodsGroup, goods, goodsOnView, goodsOffView }">
                                                <MmGoods v-if="(onViewGoodsIdsByGroup[goodsGroup.id] ?? []).includes(goods.id)" :goods="goods" :use-liked-button="true" />
                                                <div v-else :style="{ height: `${heightPxPerItem}px` }" />
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <!--// 상품 그룹 목록 -->
                            </template>

                            <template v-if="specialEvent.isCommentable">
                                <!-- 이벤트 댓글 -->
                                <div class="mm_event-reply">
                                    <div v-if="isUser" class="mm_event-reply-write">
                                        <!-- 댓글 작성 -->
                                        <div class="mm_inner">
                                            <MMTextarea
                                                v-model="writingComment.contents"
                                                :place-holder-text="'댓글을 작성하세요'"
                                                :resize="{ isUse: true, min: 4, max: 6 }"
                                                :is-changed="true"
                                                :max-byte="200"
                                            />
                                            <MMCheck v-model="writingComment.isPrivate" :label="'비공개'" />
                                            <div class="mm_btn_box">
                                                <button type="button" class="mm_btn T=primary" @click="writeComment">
                                                    <b>작성완료</b>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="!isUser" class="mm_event-reply-write">
                                        <div class="mm_inner">
                                            <p class="text_login">
                                                로그인을 하셔야 댓글을 등록하실 수 있습니다
                                            </p>
                                            <div class="mm_btn_box">
                                                <div class="mm_inline">
                                                    <MMLink class="mm_btn T=sm T=primary" :to="{ name: 'Login', query: { redirect_to_after: $route.fullPath } }">
                                                        <b>댓글 작성하기</b>
                                                    </MMLink>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- 댓글 목록 -->
                                    <div class="mm_event-reply-list">
                                        <h5>
                                            <b><strong>{{ commentsPaginator.total }}</strong>개의 댓글이 있습니다</b>
                                        </h5>
                                        <p v-if="commentsPaginator.total < 1" class="mm_text-none">
                                            <i class="ico_text-none" />등록된 댓글이 없습니다
                                        </p>
                                        <ul v-else>
                                            <li
                                                v-for="(comment, index) in visibleComments"
                                                :key="comment.id"
                                                class="mm_event-reply-item"
                                                :class="[
                                                    { 'S=switch-on': onCommentId == comment.id },
                                                    comment.isEditable && isUser ? `T=item-my T=level${comment.writerGradeLevel}` : '',
                                                ]"
                                                @click="toggleOnComment(comment.id)"
                                            >
                                                <!--수정가능 댓글(내가쓴 댓글)-->
                                                <template v-if="comment.isEditable">
                                                    <p class="text_user">
                                                        <i v-lazyload="{ src: comment.writerGradeImageUrl, useErrorImage: false }" class="mm_bg-contain image_grade" />
                                                        {{ comment.writerMaskingLoginId }}
                                                        <b class="text_tag">내 댓글</b>
                                                        <i v-if="comment.isPrivate" class="ico_secret" />
                                                    </p>
                                                    <template v-if="editingComment.id !== comment.id">
                                                        <p class="text_reply" title="열기">
                                                            <b v-lineClamp="{ setFlag: setLineClampFlag }" v-html="MMFilters.nlToBr(comment.contents)" />
                                                            <i v-if="lineClampFlags[index]" class="ico_dropdown" />
                                                        </p>
                                                        <p class="text_date">
                                                            {{ MMFilters.formatDate(comment.createdAt, 'YYYY.MM.DD hh:mm:ss') }}
                                                        </p>
                                                        <div class="mm_btn_box">
                                                            <button class="btn_remove" type="button" @click="(event) => { deleteComment(event, comment.id) }">
                                                                <b>삭제</b>
                                                            </button>
                                                            <button type="button" class="btn_modify" @click="switchEditingComment(true, comment)">
                                                                <b>수정</b>
                                                            </button>
                                                        </div>
                                                    </template>
                                                    <!--수정중 댓글-->
                                                    <template v-else>
                                                        <MMTextarea
                                                            v-model="editingComment.contents"
                                                            :place-holder-text="'댓글을 작성하세요'"
                                                            :resize="{ isUse: true, min: 4, max: 6 }"
                                                            :is-changed="true"
                                                            :max-byte="200"
                                                        />
                                                        <MMCheck v-model="editingComment.isPrivate" :label="'비공개'" />
                                                        <div class="mm_btn_box">
                                                            <button type="button" class="btn_remove" @click="resetEditingComment()">
                                                                <b>취소</b>
                                                            </button>
                                                            <button type="button" class="btn_modify" @click="updateComment(index)">
                                                                <b>완료</b>
                                                            </button>
                                                        </div>
                                                    </template>
                                                </template>
                                                <!--수정불가능 댓글-->
                                                <template v-else>
                                                    <p class="text_user">
                                                        <i v-lazyload="{ src: comment.writerGradeImageUrl, useErrorImage: false }" class="mm_bg-contain image_grade" />
                                                        {{ comment.writerMaskingLoginId }}
                                                    </p>
                                                    <p v-if="comment.isPrivate" class="text_reply">
                                                        비공개 댓글입니다<i class="ico_secret" />
                                                    </p>
                                                    <p v-else class="text_reply" title="열기">
                                                        <b v-lineClamp="{ setFlag: setLineClampFlag }" v-html="MMFilters.nlToBr(comment.contents)" />
                                                        <i v-if="lineClampFlags[index]" class="ico_dropdown" />
                                                    </p>
                                                    <p class="text_date">
                                                        {{ MMFilters.formatDate(comment.createdAt, 'YYYY.MM.DD hh:mm:ss') }}
                                                    </p>
                                                </template>
                                            </li>
                                        </ul>
                                    </div>
                                    <!--// 댓글 목록 -->
                                    <div v-if="commentsPaginator.total > 0" class="mm_foot">
                                        <div class="mm_btn_box">
                                            <p
                                                v-if="visibleComments.length === commentsPaginator.total"
                                                class="mm_btn T=sm T=line"
                                            >
                                                마지막 댓글입니다
                                            </p>
                                            <a
                                                v-else-if="!virtualScrollOn"
                                                class="mm_btn T=line T=dark"
                                                href="#"
                                                @click.prevent="addScrollEventHandler"
                                            >
                                                <b>더보기</b>
                                                <i class="ico_more" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <!--// 이벤트 댓글 -->
                            </template>
                        </div>
                    </div>
                    <!--// 본문 -->

                    <!--// 푸터 -->
                    <MMFooter />
                    <!--// 푸터 -->
                </div>
            </div>
            <SharedDim v-if="isShowSharedSns" @close="isShowSharedSns = false" />

            <div data-virtual class="mm_event-list">
                <div class="mm_product-list T=card">
                    <ul>
                        <li ref="virtualGoodsElement">
                            <MmGoods :goods="{ id: 0, name: '상품명', brandName: '브랜드명', thumbnailUrl: '', baseDiscountedPrice: 0, price: 0, sellPrice: 0, saleRate:0, isSoldout:false }" />
                        </li>
                    </ul>
                </div>
            </div>
        </template>
    </MMSub>
</template>

<script lang="ts">
import MMTextarea from '@/components/input/Textarea.vue'
import MMCheck from '@/components/input/Check.vue'
import MMFooter from '@/components/Footer.vue'
import MMSub from '@/components/layout/Sub.vue'
import { onMounted, ref, defineComponent, DirectiveBinding, defineAsyncComponent } from 'vue'
import { specialEventRepository } from '$/repository/specialEventRepository'
import { shoppingRepository } from '$/repository/shoppingRepository'
import { Comment, EditableComment, SpecialEvent, WritableComment } from '$/@type/specialEvent'
import { Paginator } from '$/@type'
import { editorWithImageTag } from '$/directives'
import { defaultCatch, pluck } from '$/functions'
import { mmon } from '$/helper/mmon'
import { getTargetValue, makeValidator } from '$/validator'
import { useSnsShared } from '$/composables/shoppingComposable'
import { typeCastNumber } from '$/filters'
import { usePageTitleSetting } from '$/composables/seoComposable';
import { usePageContext } from '$/composables/pageHandler/contextComposable';

declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        specialEvent: SpecialEvent,
        commentsPaginator: Paginator<Comment>
    }
}

export default defineComponent({
    directives: {
        editorWithImageTag,
        // 콘텐츠 말줄임 처리 custom directive
        lineClamp: {
            mounted(el, binding) {
                if (el.scrollHeight > el.clientHeight) {
                    return binding.value.setFlag(true)
                }
                binding.value.setFlag(false)
            },
        },
        scroll: {
            mounted(element: HTMLElement, binding: DirectiveBinding) {
                element.addEventListener('scroll', binding.value.scrollEventHandler)
            },
            beforeUnmount(element: HTMLElement, binding: DirectiveBinding) {
                element.removeEventListener('scroll', binding.value.scrollEventHandler)
            },
        },
        sectionIob: {
            mounted(element: HTMLElement, binding: DirectiveBinding) {
                // Iob 등록 (스크롤이 영역 내에 들어오면 상단 anchor title을 바꿈)
                const sectionObserver = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (!entry.isIntersecting) {
                                return
                            }

                            element.classList.remove('S=anchor-on')
                            element.setAttribute('title', '')
                            binding.value.selectSection(Number(element.id))
                        })
                    },
                    {
                        rootMargin: '-35% 0px -65% 0px', // 요소의 상단이 스크롤 높이의 35%
                        threshold: [0, 1], // 요소의 시작과 끝 모두 감지
                    },
                )

                sectionObserver.observe(element)
            },
        },
        goodsIob: {
            mounted(element: HTMLElement, binding: DirectiveBinding) {
                const goodsObserver = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting || entry.intersectionRect.height > 0 || entry.intersectionRect.width > 0) {
                                binding.value.goodsOnView(binding.value.goodsGroup.id, binding.value.goods.id)
                            } else {
                                binding.value.goodsOffView(binding.value.goodsGroup.id, binding.value.goods.id)
                            }
                        })
                    },
                    {
                        // rootMargin: '-50% 0px -50% 0px', // 요소의 상단이 스크롤 높이의 35%
                        threshold: [0, 1], // 요소의 시작과 끝 모두 감지
                    },
                )

                goodsObserver.observe(element)
            },
        },
        fixHeight: {
            mounted(element: HTMLElement, binding: DirectiveBinding) {
                // 높이 고정
                element.style.height = getComputedStyle(element)['height']
            },
        },
    },
    components: {        
        MMTextarea,
        MMCheck,
        MMFooter,
        MMSub,
        SharedDim: defineAsyncComponent(() => import('@/components/SharedDim.vue')),
    },
    async beforeRouteEnter(to, from, next) {
        try {
            const specialEventId = typeCastNumber(to.params.id)
            const specialEvent = await specialEventRepository.getSpecialEvent(specialEventId)

            const goodsInGroups = await Promise.all(
                specialEvent.goodsGroups.map(group => specialEventRepository.getGroupGoods(specialEventId, group.id).then(goodsList => {
                    return {
                        groupId: group.id,
                        goodsList,
                    }
                }))
            )

            specialEvent.goodsGroups = specialEvent.goodsGroups.map(group => {
                group.goodsList = goodsInGroups.find(goodsInGroup => goodsInGroup.groupId == group.id)?.goodsList || []
                return group
            })

            let comments: Paginator<Comment> = {
                currentPage: 1,
                total: 0,
                perPage: 0,
                data: [],
            }
            if (specialEvent.isCommentable) {
                comments = await specialEventRepository.getComments(specialEventId, typeCastNumber(`${to.query.page || '1'}`), 10);
            }

            next(vm => {
                vm.specialEvent = specialEvent
                if (comments) {
                    vm.commentsPaginator = comments
                }
            })
        } catch (e) {
            defaultCatch(e, {
                404: '존재하지 않는 이벤트 입니다.',
            });
            if (from.path === '/') {
                return next('/');
            } else {
                return next(false);
            }
        }
    },
    setup() {
        const {
            route,
            router,
            user,
            isUser,
            currentPageContextTop
        } = usePageContext();
        
        const scroller = ref<HTMLElement|null>(null)

        // 이벤트 상세 정보
        const specialEventId = ref<number>(Number(route.params.id))
        const specialEvent = ref<SpecialEvent>({
            id: 0,
            title: '',
            description: '',
            imageUrl: '',
            startAt: '',
            endAt: '',
            isUseDetailUrl: false,
            detailUrl: '',
            contentsType: '',
            contentsHtml: '',
            contentsImageUrl: '',
            contentsImageAlt: '',
            isCommentable: false,
            goodsGroups: [],
            alt: '',
        })

        // 이벤트 댓글 페이지네이터
        const commentsPaginator = ref<Paginator<Comment>>({
            total: 0,
            currentPage: 1,
            perPage: 10,
            data: [] as Comment[],
        })

        // 수정중인 댓글
        const editingComment = ref<EditableComment>({
            id: 0,
            contents: '',
            isPrivate: false,
        })
        // 작성중인 댓글
        const writingComment = ref<WritableComment>({
            contents: '',
            isPrivate: false,
        })

        //콘텐츠 말줄임 처리 flag 리스트
        const lineClampFlags = ref<boolean[]>([])
        const onCommentId = ref<number>(0)

        // 상품 그룹 anchor
        const anchor = ref<HTMLDivElement | null>(null)

        // anchor -> dropdown 버튼
        const btnDropdown = ref<HTMLButtonElement | null>(null)
        const isDropDown = ref<boolean>(true) // default: 메뉴 노출

        // 상품 그룹 section 목록
        let sections: Element[] = []
        // 선택된 section 순서
        const selectedIndex = ref<number>(0)

        const classList = {
            anchorSticky: 'S=anchor-sticky',
            anchorOn: 'S=anchor-on',
        }
        // sns 공유 영역 노출 여부
        const isShowSharedSns = ref<boolean>(false)
        // 공유 버튼 클릭시 보이는 SNS 공유 Top 위치
        const snsPositionTop = ref<number>(0)

        const virtualGoodsElement = ref<HTMLElement|null>(null)
        const heightPxPerItem = ref(334)
        const onViewGoodsIdsByGroup = ref<(number[])[]>([])
        function goodsOnView(groupId: number, goodsId: number) {
            if (!onViewGoodsIdsByGroup.value[groupId]) {
                onViewGoodsIdsByGroup.value[groupId] = []
            }

            onViewGoodsIdsByGroup.value[groupId].push(goodsId)
        }
        function goodsOffView(groupId: number, offGoodsId: number) {
            if (!onViewGoodsIdsByGroup.value[groupId]) {
                return
            }

            onViewGoodsIdsByGroup.value[groupId] = onViewGoodsIdsByGroup.value[groupId].filter(goodsId => goodsId !== offGoodsId)
        }

        // 보여지는 댓글
        const visibleComments = ref<Comment[]>([]);
        // 댓글에서 사용하는 페이지 번호
        const commentsPage = ref<number>(1);
        // 댓글 더보기 버튼 노출여부
        const virtualScrollOn = ref<boolean>(false);
        const scrollEl = ref<Element|null>();

        /**
         * 더보기 버튼 클릭
         */
        async function fetchComments() {
            mmon.loading.show();
            try {
                const comments = await specialEventRepository.getComments(
                    Number(route.params.id),
                    ++commentsPaginator.value.currentPage,
                    commentsPaginator.value.perPage
                )
                visibleComments.value = visibleComments.value.concat(comments.data);
            } catch (e) {
                defaultCatch(e);
            } finally {
                mmon.loading.hide();
            }
        }

        /**
         * 댓글추가 스크롤 이벤트 추가
         *
         * @param {Event} event
         */
        async function addScrollEventHandler(event: Event) {
            if (visibleComments.value.length === commentsPaginator.value.total) {
                return;
            }
            const target = event.target as HTMLElement;
            // 더보기 버튼과 가까운 scroll 요소
            scrollEl.value = target.closest('.mm_scroller') as HTMLElement;
            if (scrollEl.value !== null && virtualScrollOn.value === false) {
                // 해당 요소에 스크롤 이벤트 리스터 추가
                scrollEl.value.addEventListener('scroll', scrollHandler);
                virtualScrollOn.value = true;
            }
        }

        /**
         * 스크롤 핸들러 제거
         */
        function removeHandleScroll() {
            if (scrollEl.value instanceof Element) {
                scrollEl.value.removeEventListener('scroll', scrollHandler)
            }
        }
        /**
         * 스크롤시 댓글 추가 노출을 위한 핸들러
         *
         * @param {Event} event
         */
        async function scrollHandler(event: Event) {
            if (!scrollEl.value) return;
            // 페이지에 노출된 리뷰 개수와 총 개수가 같다면 스크롤 핸들러 제거
            if (visibleComments.value.length === commentsPaginator.value.total) {
                removeHandleScroll();
            }
            // 스크롤 위치가 페이지 하단에까지 내려올 때, 댓글 추가노출
            if (scrollEl.value.scrollTop + window.innerHeight > scrollEl.value.scrollHeight - 50) {
                await fetchComments();
            }
        }

        /**
         * Life Cycle
         */
        onMounted(async () => {
            try {
                if (scroller.value) {
                    const contents$ = scroller.value.querySelector('.mm_page-content') as HTMLElement
                    if (contents$) {
                        contents$.style.minHeight = `${currentPageContextTop.value + window.innerHeight}px`
                        scroller.value.scrollTo(0, currentPageContextTop.value)
                        contents$.style.minHeight = ''
                    }
                }

                if (virtualGoodsElement.value) {
                    heightPxPerItem.value = virtualGoodsElement.value.clientHeight
                }
                
                if (user.value) {
                    await shoppingRepository.getRelationLikedGoods(
                        pluck(specialEvent.value.goodsGroups, 'goodsList.id')
                    );
                }
                // 댓글기능 사용시 이벤트에 등록된 댓글 조회
                if (specialEvent.value.isCommentable) {
                    fetchComments()
                    await initCommentsPaginator();
                }
            } catch (e) {
                defaultCatch(
                    e,
                    {
                        404: '존재하지 않는 기획전 입니다.',
                    },
                    () => {
                        router.go(-1)
                    },
                )
            } finally {
                mmon.loading.hide()
            }

            usePageTitleSetting(specialEvent.value.title);
        })

        /**
         * 상품그룹 섹션 목록 추가
         *
         * @param section: any
         */
        const setSections = (section: any) => {
            if (section instanceof Element) sections.push(section)
        }

        /**
         * 섹션 선택
         *
         * @param index: number
         */
        function selectSection(index: number) {
            selectedIndex.value = index
        }

        /**
         * 스크롤 이벤트
         */
        function scrollEventHandler() {
            if (anchor.value === null || anchor.value === null) return
            if (btnDropdown.value === null || btnDropdown.value === null) return

            const header = document.querySelector('.mm_header') as HTMLElement
            const lastAnchorItem = sections[sections.length - 1] as HTMLElement

            // 스크롤 위치에 따라 앵커 숨김, 보임처리
            if (
                anchor.value.getBoundingClientRect().top + parseFloat(anchor.value.style['height']) 
                < header.offsetHeight - header.style['padding-top'] 
                && lastAnchorItem.offsetHeight + lastAnchorItem.getBoundingClientRect().top > btnDropdown.value.offsetHeight
            ) {
                anchor.value.classList.add(classList.anchorSticky)
                isDropDown.value = false
            } else {
                anchor.value.classList.remove(classList.anchorSticky)
                isDropDown.value = true
            }
        }

        const { shareDimOpen } = useSnsShared()

        /**
     * 공유버튼 클릭 EVENT
     *
     * @param event: Event
     */
        function snsShare(event: MouseEvent, specialEvent: SpecialEvent) {
            isShowSharedSns.value = true
            shareDimOpen(
                event, 
                specialEvent.title, 
                specialEvent.description, 
                specialEvent.imageUrl
            )
        }

        /**
         * 상품그룹 클릭시 해당 상품으로 스크롤
         *
         * @param index: number
         */
        function scrollToSection(index: number) {
            // 선택한 타겟에 section
            const target = sections[index]
            const header = document.querySelector('.mm_header') as HTMLElement
            selectedIndex.value = index

            // scroll 처리
            mmon.scroll.to(target, {
                margin: header.offsetHeight + (btnDropdown.value?.offsetHeight || 0),
                direction: 'vertical',
                time: 0.2,
            })
        }

        // 리뷰 콘텐츠 말줄임 처리 flag 세팅
        function setLineClampFlag(flag: boolean) {
            lineClampFlags.value = [...lineClampFlags.value, flag]
        }
        function toggleOnComment(commentId: number) {
            onCommentId.value = onCommentId.value === commentId ? 0 : commentId
        }

        /**
     * 수정상태 전환
     *
     * @param isEditing: boolean
     * @param comment: PlanningComment|null
     */
        function switchEditingComment(isEditing = false, comment?: Comment) {
            editingComment.value =
        isEditing && comment
            ? {
                id: comment.id,
                contents: comment.contents,
                isPrivate: comment.isPrivate,
            }
            : {
                id: 0,
                contents: '',
                isPrivate: false,
            }
        }

        /**
     * 댓글 조회
     *
     * @param page: number
     */
        async function initCommentsPaginator() {
            try {
                mmon.loading.show()

                commentsPaginator.value = await specialEventRepository.getComments(specialEventId.value, 1, commentsPaginator.value.perPage)
                visibleComments.value = commentsPaginator.value.data
                virtualScrollOn.value = false;
            } catch (e) {
                defaultCatch(e)
            } finally {
                mmon.loading.hide()
            }
        }

        /**
     * 댓글 작성
     *
     */
        async function writeComment() {
            const validator = makeValidator(writingComment.value)
                .setRules({
                    'contents(내용)': ['required', 'blank'],
                })
                .setMessages({
                    'contents.required': ':param(을/를) 입력해주세요.',
                    'contents.blank': ':param(을/를) 입력해주세요.',
                })
                .registTester('blank', (paramName, extraValue, data) => {
                    const target = getTargetValue(data, paramName);
                    if (target && !target.replace(/\s/g, '').length) {
                        // 작성중 댓글 초기화
                        writingComment.value = {
                            contents: '',
                            isPrivate: false,
                        };
                        return false;
                    }
                    return true
                });

            try {
                mmon.loading.show()

                await validator.run()

                //댓글 작성 처리
                mmon.bom.confirm('댓글을 작성하시겠습니까?', async (flag: boolean) => {
                    if (!flag) {
                        return
                    }

                    await specialEventRepository.writeComment(specialEventId.value, writingComment.value)

                    // 작성중 댓글 초기화
                    writingComment.value = {
                        contents: '',
                        isPrivate: false,
                    }

                    //댓글 리스트 최신화
                    await initCommentsPaginator();
                })
            } catch (e) {
                defaultCatch(e)
            } finally {
                mmon.loading.hide()
            }
        }

        /**
         * 댓글 삭제
         *
         * @param commentId: number
         */
        async function deleteComment(event: MouseEvent, commentId: number) {
            try {
                mmon.loading.show()

                mmon.bom.confirm('댓글을 삭제하시겠습니까?', async (flag: boolean) => {
                    if (!flag) {
                        return
                    }

                    await specialEventRepository.deleteComment(specialEventId.value, commentId)

                    if (virtualScrollOn.value === false) {
                        await initCommentsPaginator();
                        return;
                    }

                    --commentsPaginator.value.total

                    visibleComments.value = visibleComments.value.filter(comment => {
                        return comment.id !== commentId
                    })

                    const target = event.target as Element;
                    const targetComment = target.closest("[class*='mm_event-reply-item']") as Element;
                    targetComment.remove();

                })
            } catch (e) {
                defaultCatch(e)
            } finally {
                mmon.loading.hide()
            }
        }

        /**
     * 댓글 수정
     *
     */
        async function updateComment(index: number) {
            const validator = makeValidator(editingComment.value)
                .setRules({
                    'contents(내용)': ['required', 'blank'],
                })
                .setMessages({
                    'contents.required': ':param(을/를) 입력해주세요.',
                    'contents.blank': ':param(을/를) 입력해주세요.',
                })
                .registTester('blank', (paramName, extraValue, data) => {
                    const target = getTargetValue(data, paramName);
                    if (target && !target.replace(/\s/g, '').length) {
                        // 작성중 댓글 초기화
                        editingComment.value = {
                            id: editingComment.value.id,
                            contents: '',
                            isPrivate: editingComment.value.isPrivate,
                        };
                        return false;
                    }
                    return true
                });


            try {
                mmon.loading.show()

                await validator.run()

                mmon.bom.confirm('댓글을 수정하시겠습니까?', async (flag: boolean) => {
                    if (!flag) {
                        return
                    }

                    //댓글 수정 처리
                    await specialEventRepository.updateComment(specialEventId.value, editingComment.value);
                    visibleComments.value[index].contents = editingComment.value.contents;
                    visibleComments.value[index].isPrivate = editingComment.value.isPrivate;

                    // 수정중인 댓글 초기화
                    resetEditingComment()
                })
            } catch (e) {
                defaultCatch(e)
            } finally {
                mmon.loading.hide()
            }
        }

        /**
     * 수정중인 댓글 초기화
     */
        function resetEditingComment() {
            editingComment.value = {
                id: 0,
                contents: '',
                isPrivate: false,
            }
        }

        /**
     * 링크 복사
     */
        function copyPath() {
            mmon.copy(location.href)
        }

        return {
            isUser,
            anchor,
            specialEvent,
            writingComment,
            editingComment,
            onCommentId,
            commentsPaginator,
            lineClampFlags,
            isDropDown,
            btnDropdown,
            selectedIndex,
            isShowSharedSns,
            snsPositionTop,
            virtualGoodsElement,
            heightPxPerItem,
            onViewGoodsIdsByGroup,
            goodsOnView,
            goodsOffView,
            scrollEventHandler,
            resetEditingComment,
            switchEditingComment,
            snsShare,
            selectSection,
            fetchComments,
            writeComment,
            deleteComment,
            updateComment,
            setLineClampFlag,
            toggleOnComment,
            setSections,
            scrollToSection,
            copyPath,
            visibleComments,
            addScrollEventHandler,
            virtualScrollOn,
        }
    },
})
</script>

<style>
[data-virtual] {
    margin-left: 100vw;
    width: 100vw;
}
.mm_editor .w750 {
  max-width: 750px;
}
.mm_editor .section1 {
  text-align: center;
}
.mm_event .mm_editor .item {
  padding: 30px 0;
}
</style>
