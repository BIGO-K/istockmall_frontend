<template>
    <div class="mm_page-content">
        <!-- (D) 실제 내용을 추가하는 부분입니다. -->
        <h3 class="mm_title">
            <b>기획전</b>
        </h3>
        <!-- 상세 타이틀 -->
        <div class="mm_event-head">
            <div class="mm_inner">
                <h4>
                    <b>{{ planning.title }}</b>
                </h4>
                <a class="btn_home" href="#" @click.prevent="$router.go(-1)"><i class="ico_back" /><b>이전 페이지</b></a>
                <button type="button" class="btn_sns-share" @click="copyPath">
                    <i class="ico_share" /><b class="mm_ir-blind">클립보드 복사하기</b>
                </button>
            </div>
        </div>
        <!--// 상세 타이틀 -->

        <!-- 상세 컨텐츠 -->
        <div v-for="section in planning.sections" :key="section.id" class="mm_event-content">
            <!-- 에디터 등록 -->
            <div v-editor class="mm_editor" v-html="section.pcHtml" />
            <!--// 에디터 등록 -->

            <!-- 상품리스트 -->  
            <div v-if="section.goodsList?.length" class="mm_inner">
                <div class="mm_product-list">
                    <Slider :items="section.goodsList" :use-control="true">
                        <template #item="{ item }">
                            <MmGoods :goods="item" :use-liked-button="true" :use-react-tag="true" />
                        </template>
                    </Slider>
                </div>
            </div>
            <!--// 상품리스트 --> 
        </div>
        <!--// 상세 컨텐츠-->

        <!-- 상품 그룹/기획전 댓글 -->
        <div class="mm_inner">
            <template v-if="planning.groups.length > 0">
                <!-- 상품 그룹 앵커 -->
                <!-- (D) 기획전 등록시 상품 그룹을 등록한 경우에만 '상품 그룹 앵커(mm_event-anchor)', '상품 그룹 목록(mm_event-list)'을 노출합니다. -->
                <div v-stickyAnchor="{ anchorTargetListSelector: '.mm_event-list', hideArea: '.mm_event-reply' }" class="mm_event-anchor">
                    <div class="mm_event-anchor-inner">
                        <ul>
                            <li v-for="group in planning.groups" :key="group.id">
                                <a :href="`#group_${group.id}`">
                                    <b>{{ group.title }}</b>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <!--// 상품 그룹 앵커 -->
                <!-- 상품 그룹 목록-->
                <section v-for="group in planning.groups" :id="`group_${group.id}`" :key="group.id" v-goodsSection class="mm_event-list">
                    <h5>
                        <!-- 이미지형 그룹명 -->
                        <b v-if="!group.hasPcImage">{{ group.title }}</b>
                        <a v-else :href="group.pcLink">
                            <i>
                                <img
                                    v-lazyload="{ src: group.pcImageUrl }"
                                    src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                                    :alt="group.pcAlt"
                                >
                            </i>
                        </a>
                    </h5>

                    <div class="mm_product-list">
                        <ul>
                            <li v-for="goods in group.goodsList" :key="goods.id">
                                <MmGoods :goods="goods" :use-liked-button="true" :use-react-tag="true" />
                            </li>
                        </ul>
                    </div>
                </section>
                <!--// 상품 그룹 목록 -->
            </template>

            <!-- 기획전 댓글 -->
            <!-- (D) 댓글 기능 사용시에만 .mm_evet-reply 영역을 노출합니다 -->
            <div v-if="planning.isUseComment" ref="commentsElement" class="mm_event-reply">
                <!-- 댓글 작성 -->
                <!-- (D) 회원 로그인 상태 -->
                <div v-if="isUser" class="mm_event-reply-write">
                    <MMCheck v-model="writingComment.isPrivate" :label="'비공개'" />
                    <MMTextarea
                        v-model="writingComment.contents"
                        :max-byte="200"
                        :place-holder-text="'댓글을 작성하세요'"
                        :resize="{ isUse: true, min: 3, max: 9 }"
                    />
                    <div class="mm_btn_box">
                        <div class="mm_lside">
                            <button type="button" class="mm_btn T=sm T=primary btn_write" @click="writeComment">
                                <b>작성완료</b>
                            </button>
                        </div>
                    </div>
                </div>
                <!-- (D) 비회원 상태 -->
                <div v-else class="mm_event-reply-write">
                    <p>로그인을 하셔야 댓글을 등록하실 수 있습니다</p>
                    <div class="mm_btn_box">
                        <MMLink class="mm_btn T=sm T=primary" :to="{ name: 'Login', query: { redirect_to_after: route.fullPath } }">
                            <b>댓글 작성하기</b>
                        </MMLink>
                    </div>
                </div>
                <!-- 댓글 작성 -->

                <!-- 댓글 리스트 -->
                <div class="mm_event-reply-list">
                    <p class="text_state">
                        {{ comments.total }}개의 댓글이 있습니다
                    </p>
                    <p v-if="comments.total < 1" class="mm_text-none">
                        <i class="ico_text-none" />등록된 댓글이 없습니다
                    </p>
                    <ul v-else>
                        <li
                            v-for="comment in comments.data"
                            :key="comment.id"
                            class="mm_event-reply-item"
                            :class="comment.isEditable && user ? `T=item-my T=level${user.grade.id}` : ''"
                        >
                            <p class="text_user">
                                <i v-lazyload="{ src: comment.writerGradeImageUrl, useErrorImage: false }" class="mm_bg-contain image_grade" />
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
                                        <button type="button" class="mm_btn T=xs T=line T=lighter" @click="switchEditingComment()">
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
                <!--// 댓글 리스트 -->
            </div>
            <!--// 기획전 댓글 -->

            <!-- 페이지네이션 -->
            <!-- (D) 현재 페이지의 메뉴에 'S=page-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
            <MMPaginator
                :page-block-type="'group'"
                :page-block-count="10"
                :current-page="comments.currentPage"
                :items-per-page="comments.perPage"
                :total-count="comments.total"
                :scroll-y-target="commentsElement"
                @move-page-to="fetchComments"
            />
            <!--// 페이지네이션 -->
        </div>
    <!--// 상품 그룹/기획전 댓글 -->
    </div>
</template>
<script lang="ts">
import { Planning, PlanningComment, EditablePlanningComment, WritablePlanningComment } from '$/@type/planning'
import { defaultCatch, pluck } from '$/functions'
import { defineComponent, onMounted, ref, defineAsyncComponent, nextTick } from 'vue'
import { planningRepository } from '$/repository/planningRepository'
import { editorWithImageTag, editor } from '$/directives'
import { Paginator } from '$/@type'
import MMPaginator from '@/components/Paginator.vue'
import MMTextarea from '@/components/input/Textarea.vue'
import MMCheck from '@/components/input/Check.vue'
import { makeValidator } from '$/validator'
import { shoppingRepository } from '$/repository/shoppingRepository'
import gsap from 'gsap'
import { typeCastNumber } from '$/filters'
import { usePageContext } from '$/composables/pageHandler/contextComposable'
import { mmon } from '$/helper/mmon'
import { useIntervalFn } from '@vueuse/core'

declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        planning: Planning,
        comments: Paginator<PlanningComment>
    }
}

export default defineComponent({
    directives: {
        editorWithImageTag,
        editor,
        stickyAnchor: {
            mounted(element) {
                const anchorHeight: number = parseFloat(getComputedStyle(element.getElementsByTagName('ul')[0]).height)
                const header: HTMLElement | null = document.querySelector('.mm_header')
                const anchorBtns = element.querySelectorAll('a')

                element.style['height'] = getComputedStyle(element.getElementsByTagName('ul')[0]).height

                const anchor: HTMLElement = element as HTMLElement
                const classList = {
                    sticky: 'S=anchor-sticky',
                    on: 'S=anchor-on',
                }

                element.func = () => {
                    const offsetTop = element.getBoundingClientRect().top || 0
                    const headerOffsetTop = header?.getBoundingClientRect().top || 0
                    const lastListBottom: number =
                    Array.from(document.getElementsByClassName('mm_event-list')).pop()?.getBoundingClientRect().bottom || 0

                    if (offsetTop - anchorHeight - headerOffsetTop < 0) {
                        anchor.classList.add(classList.sticky)
                    } else {
                        anchor.classList.remove(classList.sticky)
                    }

                    if (lastListBottom <= element.offsetHeight) {
                        gsap.to(element.querySelector('.mm_event-anchor-inner'), { duration: 0.2, translateY: '-100%' })
                    } else {
                        gsap.to(element.querySelector('.mm_event-anchor-inner'), { duration: 0.2, translateY: 0 })
                    }
                }

                // sticky anchor 처리
                window.addEventListener('scroll', element.func)

                // 앵커 스크롤 모션 처리
                anchorBtns.forEach((btn: HTMLElement) => {
                    btn.addEventListener('click', (e: MouseEvent) => {
                        e.preventDefault()

                        const target: HTMLElement | null = document.querySelector(btn.getAttribute('href') || '')
                        if (!target) {
                            return
                        }

                        mmon.scroll.to(target, {
                            margin: anchorHeight,
                        })
                    })
                })
            },
            unmounted(element) {
                window.removeEventListener('scroll', element.func)
            },
        },
        goodsSection: {
            mounted(element) {
                const config = {
                    rootMargin: '-35% 0px -60% 0px', // 요소의 상단이 스크롤 높이의 35%
                    threshold: [0, 1], // 요소의 시작과 끝 모두 감지
                }
                const tabElementObserverEvent = new IntersectionObserver((entries, observer) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            document.querySelectorAll('.mm_event-anchor-inner > ul > li > a').forEach((btn) => {
                                btn.classList.remove('S=anchor-on')
                                btn.setAttribute('title', '')
                                const btnAttribute = btn.getAttribute('href')
                                if (btnAttribute == `#${entry.target.id}`) {
                                    btn.classList.add('S=anchor-on')
                                }
                            })
                        }
                    })
                }, config)

                tabElementObserverEvent.observe(element)
            },
        },
    },
    components: {        
        MMPaginator,
        MMTextarea,
        MMCheck,
        Slider: defineAsyncComponent(() => import('@/components/Slider.vue')),
    },
    async beforeRouteEnter(to, from, next) {
        const planningId = typeCastNumber(to.params.id)
        try {
            mmon.loading.show()
            const planning = await planningRepository.get(planningId)
            
            const goodsInGroups = await Promise.all(
                planning.groups.map(group => planningRepository.getGroupGoods(group.id, planningId).then(goodsList => {
                    return {
                        groupId: group.id,
                        goodsList,
                    }
                }))
            )

            planning.groups = planning.groups.map(group => {
                group.goodsList = goodsInGroups.find(goodsInGroup => goodsInGroup.groupId == group.id)?.goodsList || []
                return group
            })

            let comments: null | Paginator<PlanningComment> = null
            if (planning.isUseComment) {
                comments = await planningRepository.getComments(planningId, typeCastNumber(`${to.query.page || '1'}`), 15);
            }
            
            next(vm => {
                vm.planning = planning
                if (comments) {
                    vm.comments = comments
                }
            })
        } catch (e) {
            defaultCatch(e, {
                404: '존재하지 않는 기획전 입니다.',
            });
            if (from.path === '/') {
                return next('/');
            } else {
                return next(false);
            }
        } finally {
            mmon.loading.hide()
        }
    },
    setup() {
        const {
            route,
            router,
            isUser,
            user,
            usePageTitleSetting,
            applyPosition,
            mmon,
        } = usePageContext();

        // 기획전 상세
        const planning = ref<Planning>({
            id: 0,
            title: '',
            isUseComment: false,
            sections: [],
            groups: [],
        })

        // 기획전 댓글 페이지네이터
        const comments = ref<Paginator<PlanningComment>>({
            total: 0,
            currentPage: 1,
            perPage: 15,
            data: [],
        })

        // 수정/작성중 댓글
        const defaultComment: EditablePlanningComment = {
            id: 0,
            contents: '',
            isPrivate: false,
        }
        const editingComment = ref<EditablePlanningComment>(defaultComment)
        const writingComment = ref<WritablePlanningComment>({
            contents: '',
            isPrivate: false,
        })
        

        // 댓글 영역
        const commentsElement = ref<HTMLElement>();

        // 기획전상세, 댓글페이지네이터 조회
        onMounted(async () => {

            if (planning.value.id === 0) {
                const planningId = typeCastNumber(route.params.id.toString());
                try {
                    mmon.loading.show()
                    const planningInfo = await planningRepository.get(planningId)
                    
                    const goodsInGroups = await Promise.all(
                        planningInfo.groups.map(group => planningRepository.getGroupGoods(group.id, planningId).then(goodsList => {
                            return {
                                groupId: group.id,
                                goodsList,
                            }
                        }))
                    )

                    planningInfo.groups = planningInfo.groups.map(group => {
                        group.goodsList = goodsInGroups.find(goodsInGroup => goodsInGroup.groupId == group.id)?.goodsList || []
                        return group
                    })

                    let commentInfo: null | Paginator<PlanningComment> = null
                    if (planningInfo.isUseComment) {
                        commentInfo = await planningRepository.getComments(planningId, typeCastNumber(`${route.query.page || '1'}`), 15);
                        if (commentInfo) {
                            comments.value = commentInfo;
                        }
                    }

                    planning.value = planningInfo;

                    
                } catch (e) {
                    defaultCatch(e);
                } finally {
                    mmon.loading.hide()
                }
            }
            
            try {
                mmon.loading.show()
                if (isUser.value) {
                    Promise.all([
                        shoppingRepository.addRecentViewPlanning(Number(route.params.id)),
                        shoppingRepository.getRelationLikedGoods(
                            pluck(planning.value.sections, 'goodsList.id')
                                .concat(
                                    pluck(planning.value.groups, 'goodsList.id')
                                )
                        )
                    ])
                }
                await nextTick();
                applyPosition();                
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

            usePageTitleSetting(planning.value.title);
        })

        /**
     * 댓글 페이지네이터 조회
     */
        async function fetchComments(page: number) {
            try {
                mmon.loading.show()
                comments.value = await planningRepository.getComments(Number(route.params.id), page, comments.value.perPage)
            } catch (e) {
                defaultCatch(e)
            }
            mmon.loading.hide()
        }

        /**
     * 수정상태 전환
     */
        function switchEditingComment(isEditing = false, comment?: PlanningComment) {
            editingComment.value = isEditing && comment
                ? {
                    id: comment.id,
                    contents: comment.contents,
                    isPrivate: comment.isPrivate,
                }
                : defaultComment
        }

        /**
     * 댓글 작성
     */
        async function writeComment() {
            const validator = makeValidator(writingComment.value)
                .setRules({
                    'contents(내용)': ['required'],
                })
                .setMessages({
                    'contents.required': ':param(을/를) 입력해주세요.',
                })

            try {
                mmon.loading.show()
                await validator.run()
                mmon.bom.confirm('댓글을 작성하시겠습니까?', async (flag: boolean) => {
                    if (!flag) return

                    //댓글 작성 처리
                    await planningRepository.writeComment(planning.value.id, validator.data)

                    // 작성중 댓글 초기화
                    writingComment.value = {
                        contents: '',
                        isPrivate: false,
                    }

                    //댓글 리스트 최신화
                    fetchComments(1)
                })
            } catch (e) {
                defaultCatch(e)
            } finally {
                mmon.loading.hide()
            }
        }

        /**
     * 댓글 수정
     */
        async function updateComment() {
            const validator = makeValidator(editingComment.value)
                .setRules({
                    'contents(내용)': ['required'],
                })
                .setMessages({
                    'contents.required': ':param(을/를) 입력해주세요.',
                })

            mmon.loading.show()
            try {
                await validator.run()

                mmon.bom.confirm('댓글을 수정하시겠습니까?', async (isConfirm: boolean) => {
                    if (!isConfirm) {
                        return
                    }

                    //댓글 작성 처리
                    await planningRepository.updateComment(planning.value.id, validator.data)

                    // 작성중 댓글 초기화
                    editingComment.value = defaultComment

                    //댓글 리스트 최신화
                    fetchComments(1)
                })
            } catch (e) {
                defaultCatch(e)
            } finally {
                mmon.loading.hide()
            }
        }

        /**
     * 댓글 삭제
     */
        async function deleteComment(commentId: number) {
            mmon.loading.show()
            try {
                mmon.bom.confirm('댓글을 삭제하시겠습니까?', async (flag: boolean) => {
                    if (!flag) return

                    await planningRepository.deleteComment(planning.value.id, commentId)

                    //댓글 리스트 최신화
                    fetchComments(1)
                })
            } catch (e) {
                defaultCatch(e)
            } finally {
                mmon.loading.hide()
            }
        }

        function copyPath() {
            mmon.copy(location.href)
        }

        /** START 에디터  IMAGE MAP  */
        const { pause } = useIntervalFn(() => {        
            const imageMap = document.querySelectorAll<HTMLImageElement>('[usemap]');
            if (imageMap) {
                imageMap.forEach((el) => {
                    if (!el) {
                        return;
                    }
                    const imageNaturalWidth = el.naturalWidth;
                    const imageNaturalHeight = el.naturalHeight;

                    if (imageNaturalWidth == 0 || imageNaturalHeight == 0) {
                        return;
                    }

                    const widthRatio = el.width / 100
                    const heightRatio = el.height / 100
                    const mapId = el.useMap;    
                    const map = document.querySelector(`[name=${mapId.replace('#', '')}]`);                
                    if (map) {
                        const areaElements = map.querySelectorAll('area:not([data-coords])');
                        if (areaElements.length < 1) {
                            pause();
                        }

                        areaElements.forEach((el) => {
                            const originElPositions = (el as HTMLAreaElement).coords.split(',');
                            const x1Rate = typeCastNumber(originElPositions[0], 0) / imageNaturalWidth;                            
                            const y1Rate = typeCastNumber(originElPositions[1], 0) / imageNaturalHeight;
                            const x2Rate = typeCastNumber(originElPositions[2], 0)/ imageNaturalWidth;
                            const y2Rate = typeCastNumber(originElPositions[3], 0)/ imageNaturalHeight;
                        
                            el.setAttribute('coords', [
                                ((x1Rate * 100) * widthRatio).toFixed(),
                                ((y1Rate * 100) * heightRatio).toFixed(),
                                ((x2Rate * 100) * widthRatio).toFixed(),
                                ((y2Rate * 100) * heightRatio).toFixed(),
                            ].join(','))
                            el.setAttribute('data-coords', 'true');
                        })
                    }
                });
            }           
        }, 1000);
        // END 에디터  IMAGE MAP


        return {
            route,
            user,
            planning,
            comments,
            isUser,            
            editingComment,
            writingComment,
            commentsElement,
            fetchComments,
            switchEditingComment,
            writeComment,
            updateComment,
            deleteComment,
            copyPath,
        }
    },
})
</script>