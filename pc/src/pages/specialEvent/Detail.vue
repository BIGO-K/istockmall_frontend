<template>
    <!-- 본문 -->
    <div class="mm_page-content">
        <h3 class="mm_title">
            <b>이벤트</b>
        </h3>
        <!-- 상세 타이틀 -->
        <div class="mm_event-head">
            <div class="mm_inner">
                <h4><b>{{ specialEvent.title }}</b></h4>
                <a
                    href="#"
                    class="btn_home"
                    @click.prevent="$router.go(-1)"
                >
                    <i class="ico_back" />
                    <b>이전 페이지</b>
                </a>
                <button
                    type="button"
                    class="btn_sns-share"
                    @click="copyPath"
                >
                    <i class="ico_share" />
                    <b class="mm_ir-blind">클립보드 복사하기</b>
                </button>
            </div>
        </div>
        <!--// 상세 타이틀 -->

        <!-- 상세 내용 -->
        <div class="mm_event-content">
            <!-- 상세 이미지 -->
            <div
                v-if="specialEvent.contentsType === 'image'"
                class="mm_editor"
            >
                <img
                    v-lazyload="{ src: specialEvent.contentsImageUrl }"
                    src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                    :alt="specialEvent.contentsImageAlt"
                >
            </div>
            <div
                v-else-if="specialEvent.contentsType === 'html'"
                v-editorWithImageTag
                class="mm_editor"
                v-html="specialEvent.contentsHtml"
            />
            <!--// 상세 이미지 -->
        </div>
        <!--// 상세 내용 -->

        <div class="mm_inner">
            <!-- 상품 그룹 -->
            <template v-if="specialEvent.goodsGroups.length > 0">
                <!-- 상품 그룹 앵커 -->
                <div
                    v-stickyAnchor="{ anchorTargetListSelector: '.mm_event-list', hideArea: '.mm_event-reply' }"
                    class="mm_event-anchor"
                >
                    <div class="mm_event-anchor-inner">
                        <ul data-horizon>
                            <li
                                v-for="(group, index) in specialEvent.goodsGroups"
                                :key="index"
                            >
                                <a :href="`#group_${index}`"><b>{{ group.title }}</b></a>
                            </li>
                        </ul>
                    </div>
                </div>
                <!--// 상품 그룹 앵커 -->

                <!-- 상품 그룹 목록 -->
                <section
                    v-for="(goodsGroup, index) in specialEvent.goodsGroups"
                    :id="`group_${index}`"
                    :key="index"
                    v-goodsSection
                    class="mm_event-list"
                >
                    <h5><b>{{ goodsGroup.title }}</b></h5>
                    <div class="mm_product-list">
                        <ul>
                            <li
                                v-for="(goods, index) in goodsGroup.goodsList"
                                :key="index"
                            >
                                <MmGoods
                                    :goods="goods"
                                    :use-liked-button="true"
                                    :use-react-tag="true"
                                />
                            </li>
                        </ul>
                    </div>
                </section>
                <!--// 상품 그룹 목록 -->
            </template>
            <!--// 상품 그룹 -->
            <p
                v-else
                class="mm_text-none"
            >
                <i class="ico_text-none" />등록된 상품이 없습니다
            </p>

            <!-- 이벤트 댓글 -->
            <div
                v-if="specialEvent.isCommentable"
                ref="commentsEl"
                class="mm_event-reply"
            >
                <!-- 댓글 작성 영역-->
                <div
                    v-if="isUser"
                    class="mm_event-reply-write"
                >
                    <MMCheck
                        v-model="writingComment.isPrivate"
                        :label="'비공개'"
                    />
                    <MMTextarea
                        v-model="writingComment.contents"
                        :max-byte="200"
                        :place-holder-text="'댓글을 작성하세요'"
                        :resize="{ isUse: true, min: 3, max: 9 }"
                    />
                    <div class="mm_btn_box">
                        <div class="mm_lside">
                            <button
                                type="button"
                                class="mm_btn T=sm T=primary btn_write"
                                @click="writeComment()"
                            >
                                <b>작성완료</b>
                            </button>
                        </div>
                    </div>
                </div>
                <div
                    v-else
                    class="mm_event-reply-write"
                >
                    <p>로그인을 하셔야 댓글을 등록하실 수 있습니다</p>
                    <div class="mm_btn_box">
                        <MMLink
                            class="mm_btn T=sm T=primary"
                            :to="{ name: 'Login', query: { redirect_to_after: $route.fullPath }}"
                        >
                            <b>댓글 작성하기</b>
                        </MMLink>
                    </div>
                </div>
                <!--// 댓글 작성 영역-->

                <!-- 댓글 목록 -->
                <div class="mm_event-reply-list">
                    <p class="text_state">
                        {{ commentsPaginator.total }}개의 댓글이 있습니다
                    </p>
                    <p
                        v-if="commentsPaginator.total === 0"
                        class="mm_text-none"
                    >
                        <i class="ico_text-none" />등록된 댓글이 없습니다
                    </p>
                    <ul v-else>
                        <li
                            v-for="comment in commentsPaginator.data"
                            :key="comment.id"
                            class="mm_event-reply-item"
                            :class="comment.isEditable && user ? `T=item-my T=level${comment.writerGradeLevel}` : ''"
                        >
                            <p class="text_user">
                                <i 
                                    v-lazyload="{ src: comment.writerGradeImageUrl, useErrorImage: false }" 
                                    class="mm_bg-contain image_grade" 
                                    :title="`level${comment.writerGradeLevel}`"
                                />
                                {{ comment.writerMaskingLoginId }}
                            </p>
                            <!--내가 쓴 댓글-->
                            <template v-if="comment.isEditable">
                                <template v-if="editingComment.id !== comment.id">
                                    <b class="text_tag">내 댓글</b>
                                    <b v-if="comment.isPrivate" class="text_secret">비공개<i class="ico_lock" /></b>
                                    <p class="text_reply" v-html="MMFilters.nlToBr(comment.contents)" />
                                    <p class="text_date" v-html="MMFilters.formatDate(comment.createdAt, 'YYYY.MM.DD<\\sp\\an>HH:mm:ss</\\sp\\an>')" />
                                    <div class="mm_btn_box">
                                        <button type="button" class="btn_remove" @click="deleteComment(comment.id)">
                                            <b>삭제</b>
                                        </button>
                                        <button type="button" class="mm_btn T=xs T=line T=light btn_modify" @click="switchEditingComment(true, comment)">
                                            <i class="ico_reply-write" /><b>수정</b>
                                        </button>
                                    </div>
                                </template>
                                <template v-else>
                                    <MMCheck v-model="editingComment.isPrivate" :label="'비공개'" />
                                    <MMTextarea
                                        v-model="editingComment.contents"
                                        :max-byte="200"
                                        :place-holder-text="'댓글을 작성하세요'"
                                        :resize="{ isUse: true, min: 3, max: 9 }"
                                    />
                                    <div class="mm_btn_box">
                                        <button type="button" class="mm_btn T=xs T=line T=lighter" @click="resetEditingComment()">
                                            <b>취소</b>
                                        </button>
                                        <button type="button" class="mm_btn T=xs T=line T=primary btn_complete" @click="updateComment">
                                            <i class="ico_reply-complete" /><b>완료</b>
                                        </button>
                                    </div>
                                </template>
                            </template>

                            <template v-else>
                                <p v-if="comment.isPrivate" class="text_reply">
                                    비공개 댓글입니다<i class="ico_lock" />
                                </p>
                                <template v-else>
                                    <p class="text_reply" v-html="comment.contents" />
                                    <p class="text_date" v-html="MMFilters.formatDate(comment.createdAt, `YYYY.MM.DD<\\sp\\an>HH:mm:ss</\\sp\\an>`)" />
                                </template>
                            </template>
                        </li>
                    </ul>
                </div>
                <!--// 댓글 목록 -->
            </div>
            <!--// 이벤트 댓글 -->

            <!-- 페이지네이션 -->
            <MMPaginator
                :page-block-type="'group'"
                :page-block-count="10"
                :current-page="commentsPaginator.currentPage"
                :items-per-page="commentsPaginator.perPage"
                :total-count="commentsPaginator.total"
                :scroll-y-target="commentsEl"
                @move-page-to="fetchComments"
            />
            <!--// 페이지네이션 -->
        </div>
    </div>
    <!--// 본문 -->
</template>

<script lang="ts">

import { onMounted, ref, defineComponent } from 'vue';
import { specialEventRepository } from '$/repository/specialEventRepository';
import { shoppingRepository } from '$/repository/shoppingRepository';
import { Comment, EditableComment, SpecialEvent, WritableComment } from '$/@type/specialEvent';
import { Paginator } from '$/@type';
import { editorWithImageTag } from '$/directives';
import { defaultCatch, pluck } from '$/functions';
import { getTargetValue, makeValidator } from '$/validator';
import { mmon } from '$/helper/mmon'
import MMPaginator from '@/components/Paginator.vue';
import MMTextarea from '@/components/input/Textarea.vue';
import MMCheck from '@/components/input/Check.vue';
import gsap from 'gsap';
import { typeCastNumber } from '$/filters';
import { usePageTitleSetting } from '$/composables/seoComposable'
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
        stickyAnchor: {
            mounted(element, binding) {
                const anchorHeight:number = parseFloat(getComputedStyle(element.getElementsByTagName('ul')[0]).height);
                const header:HTMLElement|null = document.querySelector('.mm_header');
                const anchorBtns = element.querySelectorAll('a');
                const scroller = document.querySelector('.mm_page > .mm_scroller');

                element.style['height'] = getComputedStyle(element.getElementsByTagName('ul')[0]).height;

                const anchor: HTMLElement = element as HTMLElement
                const classList = {
                    sticky: 'S=anchor-sticky',
                    on: 'S=anchor-on',
                }

                element.clickEventHandler = () => {
                    const offsetTop = element.getBoundingClientRect().top || 0
                    const headerOffsetTop = header?.getBoundingClientRect().top || 0
                    const lastListBottom:number = Array.from(document.getElementsByClassName('mm_event-list')).pop()?.getBoundingClientRect().bottom || 0;

                    if (offsetTop - anchorHeight - headerOffsetTop < 0) {
                        anchor.classList.add(classList.sticky);
                    } else {
                        anchor.classList.remove(classList.sticky);
                    }

                    if (lastListBottom <= element.offsetHeight) {
                        gsap.to(element.querySelector('.mm_event-anchor-inner'), { duration: 0.2, translateY: '-100%' });
                    } else {
                        gsap.to(element.querySelector('.mm_event-anchor-inner'), { duration: 0.2, translateY: 0 });
                    }
                }

                // sticky anchor 처리
                window.addEventListener('scroll', element.clickEventHandler);

                // 앵커 스크롤 모션 처리
                anchorBtns.forEach((btn) => {
                    btn.clickEventHandler = (e: MouseEvent) => {
                        e.preventDefault();

                        const target:HTMLElement|null = document.querySelector(btn.getAttribute('href') || '')
                        if (!target) {
                            return;
                        }

                        const targetRect = target.getBoundingClientRect();
                        const scrollerRect = !scroller ? { top: 0, left: 0 } : scroller.getBoundingClientRect();

                        // 스크롤 위치
                        const scrollerPosition = !scroller ? { top: window.pageYOffset, left: window.pageXOffset } : { top: scroller.scrollTop, left: scroller.scrollLeft };
                        // 스크롤 내 타겟 위치
                        const targetPosition = {
                            top: scrollerPosition.top + targetRect.top - scrollerRect.top,
                            left: scrollerPosition.left + targetRect.left - scrollerRect.left
                        }

                        gsap.to(document.documentElement, {
                            delay: 0,
                            duration: 0.2,
                            ease: 'sine.out',
                            overwrite: false,
                            scrollTop: targetPosition.top - anchorHeight
                        })
                    };

                    btn.addEventListener('click', btn.clickEventHandler);
                })
            },
            beforeUnmount(element) {
                window.removeEventListener('scroll', element.clickEventHandler);
                element.querySelectorAll('a').forEach(btn => {
                    btn.removeEventListener('click', btn.clickEventHandler)
                });
            }
        },
        goodsSection: {
            mounted(element) {
                const config = {
                    rootMargin: '-35% 0px -60% 0px',// 요소의 상단이 스크롤 높이의 35%
                    threshold: [0, 1],// 요소의 시작과 끝 모두 감지
                }
                const tabElementObserverEvent = new IntersectionObserver((entries, observer) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting)  {
                            document.querySelectorAll('.mm_event-anchor-inner > ul > li > a').forEach((btn) => {
                                btn.classList.remove('S=anchor-on');
                                btn.setAttribute('title', '');
                                const btnAttribute = btn.getAttribute('href');
                                if (btnAttribute == `#${entry.target.id}`) {
                                    btn.classList.add('S=anchor-on')
                                }
                            });
                        }
                    });
                }, config);

                tabElementObserverEvent.observe(element);
            },
        },
    },
    components: {        
        MMPaginator,
        MMTextarea,
        MMCheck
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

            let comments: null | Paginator<Comment> = null
            if (specialEvent.isCommentable) {
                comments = await specialEventRepository.getComments(specialEventId, typeCastNumber(`${to.query.page || '1'}`), 15);
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
        // 회원정보
        const { route, router, user, isUser } = usePageContext();
        // 이벤트 상세 정보
        const specialEventId = ref<number>(Number(route.params.id));
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
        });

        const commentsEl = ref<HTMLElement>();
        // 이벤트 댓글 페이지네이터
        const commentsPaginator = ref<Paginator<Comment>>({
            total: 0,
            currentPage: 1,
            perPage: 15,
            data: [] as Comment[],
        });

        // 수정중인 댓글
        const editingComment = ref<EditableComment>({
            id: 0,
            contents: '',
            isPrivate: false,
        });

        // 작성중인 댓글
        const writingComment = ref<WritableComment>({
            contents: '',
            isPrivate: false,
        });

        /**
         * onMounted
         */
        onMounted(async() => {
            try {
                mmon.loading.show();
                if (user && user.value) {
                    await shoppingRepository.getRelationLikedGoods(
                        pluck(specialEvent.value.goodsGroups, 'goodsList.id')
                    );
                }
            } catch (e) {
                const catchs = defaultCatch(e, {
                    404: '존재하지 않는 이벤트 입니다.',
                }, () => {
                    router.go(-1)
                });
            } finally {
                mmon.loading.hide();
            }

            usePageTitleSetting(specialEvent.value.title);
        });

        /**
         * 댓글 조회
         *
         * @param page: number
         */
        async function fetchComments(page = 1) {
            try {
                mmon.loading.show();

                commentsPaginator.value = await specialEventRepository.getComments(specialEventId.value, page, commentsPaginator.value.perPage);
            } catch (e) {
                defaultCatch(e)
            } finally {
                mmon.loading.hide();
            }
        }

        /**
         * 수정상태 전환
         *
         * @param isEditing: boolean
         * @param comment: PlanningComment|null
         */
        function switchEditingComment(isEditing = false, comment?: Comment) {
            editingComment.value = isEditing && comment ? {
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
         * 댓글 작성
         */
        async function writeComment() {
            const validator = makeValidator(writingComment.value)
                .setRules({
                    'contents(내용)': ['required', 'blank']
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
                mmon.loading.show();

                await validator.run();

                mmon.bom.confirm('댓글을 작성하시겠습니까?', async (flag: boolean) => {
                    if (!flag) return;

                    await specialEventRepository.writeComment(specialEventId.value, validator.data);

                    // 작성중 댓글 초기화
                    writingComment.value = {
                        contents: '',
                        isPrivate: false,
                    };

                    //댓글 리스트 최신화
                    fetchComments();
                });
            } catch (e) {
                defaultCatch(e)
            } finally {
                mmon.loading.hide();
            }
        }

        /**
         * 댓글 삭제
         *
         * @param {number} commentId
         */
        async function deleteComment(commentId: number) {
            try {
                mmon.loading.show();

                mmon.bom.confirm('댓글을 삭제하시겠습니까?', async (flag: boolean) => {
                    if (!flag) return;

                    //댓글 삭제 처리
                    await specialEventRepository.deleteComment(specialEventId.value, commentId);

                    //댓글 리스트 최신화
                    fetchComments();
                });
            } catch (e) {
                defaultCatch(e)
            } finally {
                mmon.loading.hide();
            }
        }

        /**
         * 댓글 수정
         */
        async function updateComment() {
            const validator = makeValidator(editingComment.value)
                .setRules({
                    'contents(내용)': ['required', 'blank']
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
                mmon.loading.show();

                await validator.run();
                
                mmon.bom.confirm('댓글을 수정하시겠습니까?', async (flag: boolean) => {
                    if (!flag) return;

                    //댓글 수정 처리
                    await specialEventRepository.updateComment(specialEventId.value, validator.data);

                    // 수정중인 댓글 초기화
                    resetEditingComment();

                    //댓글 리스트 최신화
                    fetchComments();
                })
            } catch (e) {
                defaultCatch(e)
            } finally {
                mmon.loading.hide();
            }
        }

        /**
         * 수정중인 댓글 초기화
         */
        function resetEditingComment() {
            editingComment.value = {
                id: 0,
                contents: '',
                isPrivate: false
            }
        }

        /**
         * 링크 복사
         */
        function copyPath() {
            mmon.copy(location.href);
        }

        return {
            user,
            isUser,
            specialEvent,
            writingComment,
            editingComment,
            commentsPaginator,
            commentsEl,
            resetEditingComment,
            fetchComments,
            switchEditingComment,
            writeComment,
            deleteComment,
            updateComment,
            copyPath,
        }
    },
})
</script>