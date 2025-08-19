<template>
    <MMSub>
        <template #headerTitle>
            <h1><b>기획전</b></h1>
        </template>

        <template #contents>
            <div ref="scroller" class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="mm_event">
                            <!-- 관련정보 -->
                            <div class="mm_event-head">
                                <h2><b>{{ planning.title }}</b></h2>
                                <!-- SNS 공유 -->
                                <button ref="snsButton" type="button" class="btn_sns-share" @click="(event) => { showSnsShared(event) }">
                                    <i class="ico_share" /><b class="mm_ir-blind">공유하기</b>
                                </button>                                
                            </div>
                            <!--// 관련정보 -->

                            <!-- 상세 컨텐츠 -->
                            <div v-for="section in planning.sections" :key="section.id" class="mm_event-content">
                                <!-- 에디터 등록 -->
                                <div class="mm_editor">
                                    <div v-editor class="section1 w750" v-html="section.mobileHtml" />
                                </div>
                                <!--// 에디터 등록 -->

                                <!-- 상품리스트 -->
                                <div v-if="section.goodsList?.length" class="mm_scroller T=x">
                                    <div class="mm_product-list T=card">
                                        <ul>
                                            <li v-for="goods in section.goodsList" :key="goods.id">
                                                <MmGoods
                                                    :goods="goods"
                                                    :use-liked-button="true"
                                                />
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <!--// 상품리스트 -->
                            </div>
                            <!--// 상세 컨텐츠 -->
                            <!-- (D) 기획전 등록시 상품 그룹을 등록한 경우에만 '상품 그룹 앵커(mm_event-anchor)' 및 '상품 그룹 목록(mm_event-list)'을 노출합니다. -->
                            <template v-if="planning.groups.length > 0">
                                <!-- 상품 그룹 앵커 -->
                                <div ref="groupAnchorElement" class="mm_event-anchor">
                                    <div class="mm_dropdown" :class="{ 'S=on' : isDropDown }">
                                        <button class="btn_dropdown" title="펼쳐보기" @click="toggleDropDown()">
                                            <b>{{ onGroupTitle || planning.groups[0].title }}</b><i class="ico_dropdown" />
                                        </button>
                                        <div class="mm_dropdown-item" :style="isDropDown ? { height: 'auto'} : {}">
                                            <div class="mm_dropdown-item-inner">
                                                <ul>
                                                    <li v-for="group in planning.groups" :key="group.id">
                                                        <a :href="`#group_${group.id}`" @click.prevent="moveGroup($event)"><b>{{ group.title }}</b></a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!--// 상품 그룹 앵커 -->
                                <!-- 상품 그룹 목록 -->
                                <!-- (D) 앵커 이동을 위해 id 값을 순서대로 넣어주세요. -->
                                <div 
                                    v-for="group in planning.groups" 
                                    :id="`group_${group.id}`"
                                    :key="group.id"
                                    
                                    v-goods-section="{ setOnGroupTitle: (title: string) => { onGroupTitle = title }}"
                                    class="mm_event-list"
                                >
                                    <h3>
                                        <b v-if="!group.hasMobileImage">{{ group.title }}</b>
                                        <!-- (D) 그룹명 이미지 + 링크를 등록한 경우 타이틀 영역은 아래와 같이 노출됩니다. -->
                                        <a v-else :href="group.mobileLink">
                                            <i>
                                                <img 
                                                    v-lazyload="{ src: group.mobileImageUrl }" 
                                                    src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                                                    :alt="group.mobileAlt"
                                                >
                                            </i>
                                        </a>
                                    </h3>
                                    <div class="mm_product-list T=card">
                                        <ul>
                                            <li v-for="goods in group.goodsList" :key="goods.id" v-goods-iob="{ group, goods, goodsOnView, goodsOffView }">
                                                <MmGoods
                                                    v-if="(onViewGoodsIdsByGroup[group.id] ?? []).includes(goods.id)"
                                                    :goods="goods"
                                                    :use-liked-button="true"
                                                />
                                                <div v-else :style="{ height: `${heightPxPerItem}px` }" />
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <!--// 상품 그룹 목록 -->
                            </template>
                            <!-- 이벤트 댓글 -->
                            <div v-if="planning.isUseComment" ref="goodsGroupSection" class="mm_event-reply">
                                <!-- 댓글 작성 -->
                                <!-- (D) 작성자가 로그인 상태일 경우 -->
                                <div v-if="user" class="mm_event-reply-write">
                                    <div class="mm_inner">
                                        <MMTextarea
                                            v-model="writingComment.contents"
                                            :max-byte="200"
                                            :place-holder-text="'댓글을 작성하세요'"
                                            :resize="{ isUse: true, min: 5, max: 9 }"
                                            :is-changed="true"
                                        />
                                        <MMCheck 
                                            v-model="writingComment.isPrivate"
                                            :label="'비공개'"
                                        />
                                        <div class="mm_btn_box">
                                            <button type="button" class="mm_btn T=primary" @click="writeComment">
                                                <b>작성완료</b>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <!-- (D) 작성자가 비로그인 상태일 경우 -->
                                <div v-else class="mm_event-reply-write">
                                    <div class="mm_inner">
                                        <p class="text_login">
                                            로그인을 하셔야 댓글을 등록하실 수 있습니다
                                        </p>
                                        <div class="mm_btn_box">
                                            <div class="mm_inline">
                                                <MMLink class="mm_btn T=sm T=primary" :to="{ name: 'Login', query: { redirect_to_after: route.fullPath }}">
                                                    <b>댓글 작성하기</b>
                                                </MMLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!--// 댓글 작성 -->

                                <!-- 댓글 목록 -->
                                <div class="mm_event-reply-list">
                                    <h5><b><strong>{{ comments.total }}</strong>개의 댓글이 있습니다</b></h5>
                                    <p v-if="comments.total < 1" class="mm_text-none">
                                        <i class="ico_text-none" />등록된 댓글이 없습니다
                                    </p>
                                    <ul v-else>
                                        <!--
                                            (D) 내가 쓴 댓글일 경우 mm_event-reply-item 요소에 T=item-my 클래스와 회원 등급에 맞는 'T=등급' 클래스를 추가합니다.
                                            등급: level1 ~ level5
                                        -->
                                        <li
                                            v-for="(comment, index) in visibleComments" 
                                            :key="comment.id" 
                                            class="mm_event-reply-item"
                                            :class="[
                                                { 'S=switch-on': onCommentId == comment.id },
                                                comment.isEditable && user ? `T=item-my T=level${user.grade.id}` : '',
                                            ]"
                                            @click="toggleOnComment(comment.id)"
                                        >
                                            <!--수정가능 댓글(내가쓴 댓글)-->
                                            <template v-if="comment.isEditable">
                                                <p class="text_user">
                                                    <i v-lazyload="{ 'src': comment.writerGradeImageUrl, useErrorImage: false }" class="mm_bg-contain image_grade" />
                                                    {{ comment.writerMaskingLoginId }}
                                                    <b class="text_tag">내 댓글</b>
                                                    <i v-if="comment.isPrivate" class="ico_secret" />
                                                </p>
                                                <template v-if="editingComment.id !== comment.id">
                                                    <p class="text_reply" title="열기">
                                                        <b v-line-clamp="{ setFlag: setLineClampFlag }" v-html="comment.contents" />
                                                        <i v-if="lineClampFlags[index]" class="ico_dropdown" />
                                                    </p>
                                                    <p class="text_date">
                                                        {{ MMFilters.formatDate(comment.createdAt, 'YYYY.MM.DD hh:mm:ss') }}
                                                    </p>
                                                    <div class="mm_btn_box">
                                                        <button 
                                                            type="button" 
                                                            class="btn_remove" 
                                                            @click="(event) => {
                                                                deleteComment(event, comment.id)
                                                            }"
                                                        >
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
                                                        :max-byte="200"
                                                        :place-holder-text="'댓글을 작성하세요'"
                                                        :resize="{ isUse: true, min: 4, max: 6 }"
                                                        :is-changed="true"
                                                    />
                                                    <MMCheck
                                                        v-model="editingComment.isPrivate"
                                                        :label="'비공개'"
                                                    />
                                                    <div class="mm_btn_box">
                                                        <button type="button" class="btn_modify" @click="updateComment(index)">
                                                            <b>수정</b>
                                                        </button>
                                                    </div>
                                                </template>
                                            </template>
                                            <!--수정불가능 댓글-->
                                            <template v-else>
                                                <p class="text_user">
                                                    <i 
                                                        v-lazyload="{ 'src': comment.writerGradeImageUrl, useErrorImage: false }"
                                                        class="mm_bg-contain image_grade"
                                                        :title="`level${comment.writerGradeLevel}`"
                                                    />
                                                    {{ comment.writerMaskingLoginId }}
                                                </p>
                                                <p v-if="comment.isPrivate" class="text_reply">
                                                    비공개 댓글입니다<i class="ico_secret" />
                                                </p>
                                                <p v-else class="text_reply" title="열기">
                                                    <b v-line-clamp="{ setFlag: setLineClampFlag }" v-html="comment.contents" />
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
                                <div v-if="comments.total > 0" class="mm_foot">
                                    <div class="mm_btn_box">
                                        <p
                                            v-if="visibleComments.length === comments.total"
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
                        </div>
                    </div>
                    <!--// 본문 -->
                    <!-- 푸터 -->
                    <MMFooter />
                    <!--// 푸터 -->
                </div>
            </div>

            <div data-virtual class="mm_event-list">
                <div class="mm_product-list T=card">
                    <ul>
                        <li ref="virtualGoodsElement">
                            <MmGoods :goods="{ id: 0, name: '상품명', brandName: '브랜드명', thumbnailUrl: '', baseDiscountedPrice: 0, price: 0, sellPrice: 0, saleRate:0, isSoldout:false }" />
                        </li>
                    </ul>
                </div>
            </div>
            <SharedDim v-if="isShowSharedSns" @close="isShowSharedSns = false" />            
        </template>
    </MMSub>
</template>

<script lang="ts">
import MMSub from '@/components/layout/Sub.vue';
import { Paginator } from '$/@type';
import { Planning, PlanningComment, EditablePlanningComment, WritablePlanningComment } from '$/@type/planning';
import { defaultCatch, pluck } from '$/functions';
import { planningRepository } from '$/repository/planningRepository';
import { shoppingRepository } from '$/repository/shoppingRepository';
import { makeValidator } from '$/validator';
import { ref, onMounted, defineComponent, DirectiveBinding, defineAsyncComponent, watch, nextTick, computed, onUpdated } from 'vue';
import { editorWithImageTag, editor } from '$/directives';
import { typeCastNumber } from '$/filters';
import { useSnsShared } from '$/composables/shoppingComposable';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { usePageContext } from '$/composables/pageHandler/contextComposable';
import { mmon } from '$/helper/mmon';
import { useElementBounding, useScroll, useToggle, useIntervalFn } from '@vueuse/core';

declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        planning: Planning,
        comments: Paginator<PlanningComment>,
        visibleComments: PlanningComment[]
    }
}

export default defineComponent({
    components: {
        MMSub,
        MMTextarea: defineAsyncComponent(() => import('@/components/input/Textarea.vue')),
        MMCheck: defineAsyncComponent(() => import('@/components/input/Check.vue')),        
        MMFooter : defineAsyncComponent(() => import('@/components/Footer.vue')),
        SharedDim: defineAsyncComponent(() => import('@/components/SharedDim.vue'))
    },
    directives: {
        editorWithImageTag,
        editor,
        goodsSection: {
            mounted(element, binding) {
                const config = {
                    rootMargin: '-35% 0px -60% 0px',// 요소의 상단이 스크롤 높이의 35%
                    threshold: [0, 1],// 요소의 시작과 끝 모두 감지
                }
                const tabElementObserverEvent = new IntersectionObserver((entries, observer) => {                        
                    entries.forEach((entry) => {                  
                        if (entry.isIntersecting)  {
                            document.querySelectorAll('.mm_dropdown-item-inner > ul > li > a').forEach((btn) => {
                                btn.classList.remove('S=anchor-on');
                                btn.setAttribute('title', '');
                                const btnAttribute = btn.getAttribute('href');
                                if (btnAttribute == `#${entry.target.id}`) {
                                    btn.classList.add('S=anchor-on')
                                    binding.value.setOnGroupTitle(btn.textContent || '');
                                }                                
                            });
                        }
                    });
                }, config);
                tabElementObserverEvent.observe(element);
            },
        },
        goodsIob: {
            mounted(element: HTMLElement, binding: DirectiveBinding) {
                const goodsObserver = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting || entry.intersectionRect.height > 0 || entry.intersectionRect.width > 0) {
                                binding.value.goodsOnView(binding.value.group.id, binding.value.goods.id)
                            } else {
                                binding.value.goodsOffView(binding.value.group.id, binding.value.goods.id)
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
        lineClamp: {
            mounted(el, binding) {
                if (el.scrollHeight > el.clientHeight) {
                    return binding.value.setFlag(true);
                }
                binding.value.setFlag(false);
            },
        }
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
            // if (planning.isUseComment) {
            //     comments = await planningRepository.getComments(planningId, typeCastNumber(`${to.query.page || '1'}`), 10);
            // }

            next(vm => {
                vm.planning = planning
                if (comments) {
                    vm.comments = comments
                    vm.visibleComments = comments.data
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
            currentPageContextTop,
            router,
            route,
            user,
            isUser,
            mmon
        } = usePageContext();

        const isDropDown = ref(true)
        const toggleDropDown = useToggle(isDropDown)

        //콘텐츠 말줄임 처리 flag 리스트
        const lineClampFlags = ref<boolean[]>([]);
        const onCommentId = ref<number>(0);
        // 리뷰 콘텐츠 말줄임 처리 flag 세팅
        function setLineClampFlag(flag: boolean) {
            lineClampFlags.value = [...lineClampFlags.value, flag];
        }
        function toggleOnComment(commentId: number) {
            onCommentId.value = onCommentId.value === commentId ? 0 : commentId;
        }
        const scroller = ref<HTMLElement|null>();
        const groupAnchorElement = ref<HTMLElement|null>(null);
        const goodsGroupSection  = ref<HTMLElement|null>(null);
        
        const { bottom } = useElementBounding(groupAnchorElement);
        const anchorSticky = computed(() => {
            if (bottom.value < 0 && sectionTop.value > 100) {
                return true
            }
            return false;
        })

        const sectionTop = ref<number>(101);


        watch(anchorSticky, (to) => {
            
            if (!groupAnchorElement.value) {
                return;
            }
            if(to) {
                groupAnchorElement.value.classList.add('S=anchor-sticky');
                return toggleDropDown(false)
            } 

            groupAnchorElement.value.classList.remove('S=anchor-sticky');
            toggleDropDown(true)
            
        })

        const { y } = useScroll(scroller);
        

        watch(y, () => {
            if (!goodsGroupSection.value) {
                return
            }

            sectionTop.value = goodsGroupSection.value.getBoundingClientRect().top 
        })
        
        // SNS공유버튼 element
        const isShowSharedSns = ref(false);
        const { shareDimOpen } = useSnsShared();
        
        const planning = ref<Planning>({
            id: 0,
            title: '',
            isUseComment: false,
            sections: [],
            groups: [],
        });

        const onGroupTitle = ref<string>('');        

        // 기획전 댓글 페이지네이터
        const comments = ref<Paginator<PlanningComment>>({
            total: 0,
            currentPage: 1,
            perPage: 10,
            data: [],
        });

        // 보여지는 댓글
        const visibleComments = ref<PlanningComment[]>([]);

        // 수정/작성중 댓글
        const editingComment = ref<EditablePlanningComment>({
            id: 0,
            contents: '',
            isPrivate: false,
        });

        const writingComment = ref<WritablePlanningComment>({
            contents: '',
            isPrivate: false,
        });

        
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

        // 댓글 더보기 버튼 노출여부
        const virtualScrollOn = ref<boolean>(false);
        const scrollAreas = ref<Element|null>();
        const initialScroll = watch(y, (to) => {
            if (to > currentPageContextTop.value ) {
                y.value = currentPageContextTop.value;
                initialScroll();
            }            
        })

        // 기획전상세, 댓글페이지네이터 조회
        onMounted(async () => {
            try {
                if (scroller.value) {
                    const contents$ = scroller.value.querySelector('.mm_page-content') as HTMLElement
                    if (contents$) {                        
                        nextTick().then(() => {
                            y.value = currentPageContextTop.value;
                        })
                    }
                }

                if (virtualGoodsElement.value) {
                    heightPxPerItem.value = virtualGoodsElement.value.clientHeight
                    virtualGoodsElement.value.remove()
                }

                if (isUser.value) {
                    Promise.all([
                        shoppingRepository.addRecentViewPlanning(planning.value.id),
                        shoppingRepository.getRelationLikedGoods(
                            pluck(planning.value.sections, 'goodsList.id')
                                .concat(
                                    pluck(planning.value.groups, 'goodsList.id')
                                )
                        )
                    ])
                }                

                if (planning.value.isUseComment) {
                    await initCommentsPaginator();
                }                
            } catch (e) {                
                defaultCatch(e, {
                    404: '존재하지 않는 기획전 입니다.',
                }, () => { 
                    router.go(-1) 
                });
            }     

            usePageTitleSetting(planning.value.title);
        });

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


        /**
         * 댓글 리스트 초기화
         */
        async function initCommentsPaginator() {
            mmon.loading.show();
            try {
                comments.value = await planningRepository.getComments(Number(route.params.id), 1, comments.value.perPage);
                visibleComments.value = comments.value.data;
                virtualScrollOn.value = false;
            } catch (e) {
                defaultCatch(e)
            } finally {    
                mmon.loading.hide();
            }
        }

        /**
         * 더보기 버튼 클릭
         */
        async function fetchComments() {
            mmon.loading.show();
            try {
                const addComments = await planningRepository.getComments(
                    Number(route.params.id),
                    ++comments.value.currentPage,
                    comments.value.perPage
                )
                visibleComments.value = visibleComments.value.concat(addComments.data);
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
            if (visibleComments.value.length === comments.value.total) {
                return;
            }
            const target = event.target as HTMLElement;
            // 더보기 버튼과 가까운 scroll 요소
            scrollAreas.value = target.closest('.mm_scroller') as HTMLElement;
            if (scrollAreas.value !== null && virtualScrollOn.value === false) {
                // 해당 요소에 스크롤 이벤트 리스터 추가
                scrollAreas.value.addEventListener('scroll', scrollHandler);
                virtualScrollOn.value = true;
            }

            fetchComments();
        }

        /**
         * 스크롤 핸들러 제거
         */
        function removeHandleScroll() {
            if (scrollAreas.value instanceof Element) {
                scrollAreas.value.removeEventListener('scroll', scrollHandler)
            }
        }

        /**
         * 스크롤시 댓글 추가 노출을 위한 핸들러
         *
         * @param {Event} event
         */
        async function scrollHandler(event: Event) {
            if (!scrollAreas.value) return;
            // 페이지에 노출된 리뷰 개수와 총 개수가 같다면 스크롤 핸들러 제거
            if (visibleComments.value.length === comments.value.total) {
                removeHandleScroll();
            }
            // 스크롤 위치가 페이지 하단에까지 내려올 때, 댓글 추가노출
            if (scrollAreas.value.scrollTop + window.innerHeight > scrollAreas.value.scrollHeight - 50) {
                await fetchComments();
            }
        }

        /**
         * 수정상태 전환
         */
        function switchEditingComment(isEditing = false, comment?: PlanningComment) {
            editingComment.value = isEditing && comment ? {
                id: comment.id,
                contents: comment.contents,
                isPrivate: comment.isPrivate
            } : {
                id: 0,
                contents: '',
                isPrivate: false,
            };
        }

        /**
         * 댓글 작성
         */
        async function writeComment() {
            const validator = makeValidator(writingComment.value)
                .setRules({
                    'contents(내용)': ['required']
                })
                .setMessages({
                    'contents.required': ':param(을/를) 입력해주세요.'
                });
            try {
                mmon.loading.show();
                await validator.run();
                mmon.bom.confirm('댓글을 작성하시겠습니까?', async (flag: boolean) => {
                    if(!flag) {
                        return;
                    }
                    //댓글 작성 처리
                    await planningRepository.writeComment(planning.value.id, writingComment.value);
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
                mmon.loading.hide();
            }
        }

        /**
         * 댓글 수정
         */
        async function updateComment(index: number) {
            const validator = makeValidator(editingComment.value)
                .setRules({
                    'contents(내용)': ['required']
                })
                .setMessages({
                    'contents.required': ':param(을/를) 입력해주세요.'
                });

            mmon.loading.show();
            try {
                await validator.run();

                mmon.bom.confirm('댓글을 수정하시겠습니까?', async (isConfirm: boolean) => {
                    if (!isConfirm) {
                        return;
                    }
                    //댓글 수정 처리
                    await planningRepository.updateComment(planning.value.id, editingComment.value);
                    visibleComments.value[index].contents = editingComment.value.contents;
                    visibleComments.value[index].isPrivate = editingComment.value.isPrivate;
                    // 수정중인 댓글 초기화
                    editingComment.value = {
                        id: 0,
                        contents: '',
                        isPrivate: false,
                    };
                })
            } catch (e) {
                defaultCatch(e)
            } finally {
                mmon.loading.hide();
            }
        }

        /**
        * 댓글 삭제
        */
        async function deleteComment(event: MouseEvent, commentId: number) {
            mmon.bom.confirm('댓글을 삭제하시겠습니까?', async (flag: boolean) => {
                if (!flag) {
                    return
                }
                try {
                    mmon.loading.show()
                    await planningRepository.deleteComment(planning.value.id, commentId);
                    if (virtualScrollOn.value === false) {
                        await initCommentsPaginator();
                        return;
                    }
                    const target = event.target as Element;
                    const targetComment = target.closest("[class*='mm_event-reply-item']") as Element;
                    targetComment.remove();
                } catch (e) {
                    defaultCatch(e)
                } finally {
                    mmon.loading.hide()
                }
            })
        }
        /**
         * 
         * 공유버튼 클릭시 SNS 공유영역 노출
         *
         * @param event: Event
         */
        function showSnsShared(event: MouseEvent) {
            let imageUrl = '';
            const firstImageEl:HTMLElement|null = document.querySelector('.mm_event img');
            const firstGoodsImageEl:HTMLElement|null = document.querySelector('.mm_product-item i.S\\:loaded');
            const openGraphImageMetaEl:HTMLMetaElement|null = document.querySelector('meta[property="og:image"]');
            if (
                firstImageEl
            && firstImageEl.clientWidth / firstImageEl.clientHeight > 0.85
            && firstImageEl.clientWidth / firstImageEl.clientHeight < 1.15
            ) {
                // 최상단 이미지가 정사각형에 가까운 이미지인경우 사용
                imageUrl = firstImageEl.getAttribute('src') || '';
            } else if (firstGoodsImageEl) {
                // 첫번째 상품 이미지가 있으면 사용
                imageUrl = firstGoodsImageEl.style.backgroundImage
            } else if (openGraphImageMetaEl && openGraphImageMetaEl.content
            ) {
                // 오픈그래프 이미지가 있으면 사용
                imageUrl = openGraphImageMetaEl.content;
            } else {
                // 기본이미지 사용
            }
            shareDimOpen(event, planning.value.title, `#기획전#${planning.value.title}`, imageUrl);
            isShowSharedSns.value = true;
        }

        function moveGroup(event: MouseEvent) {
            const target  = event.currentTarget as HTMLElement;
            const header:HTMLElement|null = document.querySelector('.mm_header');            
           
            if (!target || !scroller.value || !header) {
                return;
            }

            const moveTarget:HTMLElement|null = document.querySelector(target.getAttribute('href') || '')
            if (!moveTarget) {
                return;
            }

            if (isDropDown.value && bottom.value < 0) {
                toggleDropDown(false);
            }
            
            mmon.scroll.to(moveTarget, {
                margin: (header?.offsetHeight || 0) + target.offsetHeight,
                scroller: scroller.value
            });

        }

        return {
            showSnsShared,
            route,
            scroller,
            groupAnchorElement,
            planning,            
            onGroupTitle,
            isDropDown,
            toggleDropDown,
            goodsGroupSection,
            user,
            writingComment,
            writeComment,
            comments,
            visibleComments,
            onCommentId,
            editingComment,
            setLineClampFlag,
            lineClampFlags,
            deleteComment,
            switchEditingComment,
            updateComment,
            anchorSticky,
            virtualGoodsElement,
            heightPxPerItem,
            onViewGoodsIdsByGroup,
            goodsOnView,
            goodsOffView,
            isShowSharedSns,                        
            toggleOnComment,
            addScrollEventHandler,
            virtualScrollOn,
            moveGroup
        }
    }
})
</script>

<style lang="scss">
    [data-virtual] {
        margin-left: 100vw;
        width: 100vw;
    }

    .mm_editor .w750 {max-width: 750px;}
    .mm_editor .section1 {text-align:center;}										
</style>