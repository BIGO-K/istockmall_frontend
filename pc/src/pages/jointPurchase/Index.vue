<template>
    <div class="mm_page-content">
        <!-- (D) 실제 내용을 추가하는 부분입니다. -->
        <div class="m_coopbuy-head">
            <div class="mm_inner">
                <h2><b>목표 수량에 도달하면 <strong>공동구매</strong> 성공!</b></h2>
                <p>지금 참여하기 버튼을 누르세요</p>
                <small>목표수량 도달 시 알림톡과 쿠폰이 발송되며 해당 상품을 공동구매가로 구매하실 수 있습니다</small>
                <ol>
                    <li><i class="ico_coopbuy-join" /><b>공동구매 참여</b></li>
                    <li><i class="ico_coopbuy-goal" /><b>목표 달성</b></li>
                    <li><i class="ico_coopbuy-coupon" /><b>쿠폰 발급</b></li>
                    <li><i class="ico_coopbuy-buy" /><b>상품 구매</b></li>
                </ol>
            </div>
        </div>
        <!-- 진행중인 공동구매 -->
        <div class="m_coopbuy-on">
            <div class="mm_inner">
                <ul
                    v-if="isLoading"
                    class="m_coopbuy-list T=skeleton"
                >
                    <li v-for="index in 6" :key="index">
                        <i class="image_product" />
                        <div>
                            <p class="text_progress" />
                            <p class="text_price" />
                            <p class="text_brand" />
                            <p class="text_product" />
                        </div>
                    </li>
                </ul>

                <template v-else>
                    <p
                        v-if="jointPurchaseList.total < 1"
                        class="mm_text-none"
                    >
                        <i class="ico_text-none" />진행중인 공동구매가 없습니다
                    </p>
                    <ul
                        v-else
                        class="m_coopbuy-list"
                    >
                        <!-- (D) 공동구매 목표 달성시 'li' 요소에 'S=coopbuy-complete' 클래스를 추가합니다. -->
                        <li 
                            v-for="jointPurchase in jointPurchaseList.data" 
                            :key="jointPurchase.id" 
                            :class="[jointPurchase.targetAchieveRate >= 100 ? 'S=coopbuy-complete' : '']"
                        >
                            <MMLink
                                :to="
                                    jointPurchase.isOnlyAdult && needCertificateAge
                                        ? { name: pathCertificate, query: { redirect_to_after: `/joint-purchase/detail/${jointPurchase.id}`, is_need_adult_certification: 'Y' } }
                                        : { name: 'JointPurchaseDetail', params: { id: jointPurchase.id } }
                                "                
                            >
                                <figure>
                                    <i
                                        v-lazyload="{ src: jointPurchase.thumbnailUrl }"
                                        class="mm_bg-cover image_product"
                                    />
                                    <p v-if="jointPurchase.isOnlyAdult && needCertificateAge" class="text_adult">
                                        <b class="mm_ir-blind">미성년자 구매불가</b><i class="ico_adult" />
                                    </p>
                                    <figcaption>
                                        <div class="mm_flex m_coopbuy-on-progress">
                                            <Timer
                                                :key="jointPurchase.id"
                                                :joint-purchase="jointPurchase"
                                            />
                                            <div>
                                                <p class="text_goal">
                                                    목표까지
                                                    <b>
                                                        <strong>{{ MMFilters.formatNumber(jointPurchase.participantCount) }}<sub>명</sub></strong>/ 
                                                        {{ MMFilters.formatNumber(jointPurchase.targetCount) }}명
                                                    </b>
                                                </p>
                                                <!-- (D) 'm...progress-bar > i'의 title, width 값에 공동구매 목표 달성율값을 추가합니다. -->
                                                <b class="m...progress-bar">
                                                    <i 
                                                        :style="`width:${ jointPurchase.targetAchieveRate }%;`"
                                                        :title="`${ jointPurchase.targetAchieveRate }%`"
                                                    />
                                                </b>
                                            </div>
                                        </div>
                                        <p class="text_price">
                                            <del><i class="ico_coopbuy-arrow" />{{ MMFilters.formatNumber(jointPurchase.price) }}</del>
                                            공동구매가<strong>{{ MMFilters.formatNumber(jointPurchase.jointPurchasePrice) }}</strong>
                                        </p>
                                        <p class="text_brand">
                                            {{ jointPurchase.brandName }}
                                        </p>
                                        <p class="text_product">
                                            {{ jointPurchase.goodsName }}
                                        </p>
                                    </figcaption>
                                </figure>
                            </MMLink>
                            <div class="mm_btn_box">
                                <div class="mm_block">
                                    <MMLink
                                        :to="{ name: 'JointPurchaseDetail', params: { id: jointPurchase.id } }"
                                        class="mm_btn T=lg btn_coopbuy-entry"
                                    >
                                        <b>공동구매 참여하기</b>
                                    </MMLink>
                                    <button
                                        type="button"
                                        class="mm_btn T=lg T=line T=dark btn_share"
                                        @click="copyPath(jointPurchase.id)"
                                    >
                                        <i class="ico_share" /><b>친구에게 공유하기</b>
                                    </button>
                                </div>
                            </div>
                        </li>
                    </ul>
                </template>
                <!-- 페이지네이션 -->
                <MMPaginator
                    :page-block-type="'group'"
                    :page-block-count="6"
                    :current-page="jointPurchaseList.currentPage"
                    :items-per-page="jointPurchaseList.perPage"
                    :total-count="jointPurchaseList.total"
                    @move-page-to="ongoingMovePage"
                />
                <!--// 페이지네이션 -->
            </div>
        </div>
        <!--// 진행중인 공동구매 -->

        <!-- 종료된 공동구매 -->
        <div class="m_coopbuy-off">
            <div class="mm_inner">
                <ul
                    v-if="isLoading"
                    class="m_coopbuy-list T=skeleton"
                >
                    <li v-for="index in 9" :key="index">
                        <i class="image_product" />
                        <div>
                            <p class="text_progress" />
                            <p class="text_brand" />
                            <p class="text_product" />
                            <p class="text_price" />
                        </div>
                    </li>
                </ul>

                <template v-else>
                    <p
                        v-if="endedList.total < 1"
                        class="mm_text-none"
                    >
                        <i class="ico_text-none" />종료된 공동구매가 없습니다
                    </p>
                    <ul
                        v-else
                        class="m_coopbuy-list"
                    >
                        <li
                            v-for="ended in endedList.data"
                            :key="ended.id"
                        >
                            <MMLink 
                                :to="
                                    ended.isOnlyAdult && needCertificateAge
                                        ? { name: pathCertificate, query: { redirect_to_after: `/joint-purchase/detail/${ended.id}`, is_need_adult_certification: 'Y' } }
                                        : { name: 'JointPurchaseDetail', params: { id: ended.id } }
                                "  
                            >
                                <figure>
                                    <i
                                        v-lazyload="{ src: ended.thumbnailUrl }"
                                        class="mm_bg-cover image_product"
                                    />
                                    <p v-if="ended.isOnlyAdult && needCertificateAge" class="text_adult">
                                        <b class="mm_ir-blind">미성년자 구매불가</b><i class="ico_adult" />
                                    </p>
                                    <figcaption>
                                        <p class="text_state">
                                            {{ ended.isTargetAchieve ? '목표 달성' : '목표 미달성' }}
                                            <span>/</span><strong>{{ ended.participantCount }}</strong>명 참여
                                        </p>
                                        <p class="text_brand">
                                            {{ ended.brandName }}
                                        </p>
                                        <p class="text_product">
                                            {{ ended.goodsName }}
                                        </p>
                                        <p class="text_price">
                                            <del>{{ MMFilters.formatNumber(ended.price) }}</del>공동구매가
                                            <strong>{{ MMFilters.formatNumber(ended.jointPurchasePrice) }}</strong>
                                        </p>
                                    </figcaption>
                                </figure>
                                <i class="ico_coopbuy-more" />
                            </MMLink>
                        </li>
                    </ul>
                </template>

                <!-- 페이지네이션 -->
                <MMPaginator
                    :page-block-type="'group'"
                    :page-block-count="9"
                    :current-page="endedList.currentPage"
                    :items-per-page="endedList.perPage"
                    :total-count="endedList.total"
                    @move-page-to="endedMovePage"
                />
                <!--// 페이지네이션 -->
            </div>
        </div>
    <!--// 종료된 공동구매 -->
    </div>
</template>
<script setup lang="ts">
import MMPaginator from '@/components/Paginator.vue';
import MMLink from '@/components/MMLink.vue';
import Timer from '@/pages/jointPurchase/Timer.vue';
import { ref, onMounted } from 'vue';
import { jointPurchaseRepository } from '$/repository/jointPurchaseRepository';
import { typeCastNumber } from '$/filters';
import { JointPurchase } from '$/@type/jointPurchase';
import { Paginator } from '$/@type';
import { mmon } from '$/helper/mmon';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { usePageContext } from '$/composables/pageHandler/contextComposable';

usePageTitleSetting('공동구매');

const { 
    route, 
    router, 
    isUser, 
    needCertificateAge 
} = usePageContext();        


const pathCertificate = isUser.value ? 'AdultCertification' : 'Login'

const isLoading = ref<boolean>(false);  // 로딩 중인지 체크

const ongoingPage = ref<number>(1);
const ongoingPerPage = 6;

const endedPage = ref<number>(1);
const endedPerPage = 9;

const jointPurchaseList = ref<Paginator<JointPurchase>>({
    currentPage: 1,
    perPage: 6,
    total: 0,
    data: [],            
});

const endedList = ref<Paginator<JointPurchase>>({
    currentPage: 1,
    perPage: 9,
    total: 0,
    data: [],            
});

async function fetch() {
    isLoading.value = true;

    try {
        ongoingPage.value = route.query.ongoingPage ? typeCastNumber(route.query.ongoingPage?.toString()) : 1;
        endedPage.value = route.query.endedPage ? typeCastNumber(route.query.endedPage?.toString()) : 1;

        const [ ongoing, ended ] = await Promise.all([
            jointPurchaseRepository.getJointPurchases(ongoingPage.value, ongoingPerPage, false),
            jointPurchaseRepository.getJointPurchases(endedPage.value, endedPerPage, true)
        ]);

        jointPurchaseList.value = ongoing;
        endedList.value = ended;

        if (ongoingPage.value !== 1 || endedPage.value !== 1) {
            router.replace({
                name: 'JointPurchase',
                query: {
                    ongoingPage: ongoingPage.value,
                    endedPage: endedPage.value,
                },
            });
        }
    } catch (e) {
        console.log(e);
    } finally {
        isLoading.value = false;
    }
}

// 진행 중인 페이지 이동
async function ongoingMovePage(page: number) {
    isLoading.value = true;
    ongoingPage.value = page;

    try {
        jointPurchaseList.value = await jointPurchaseRepository.getJointPurchases(ongoingPage.value, ongoingPerPage, false);

        router.replace({
            name: 'JointPurchase',
            query: {
                ongoingPage: ongoingPage.value,
                endedPage: endedPage.value,
            },
        });
    } catch (e) {
        console.log(e);
    } finally {
        isLoading.value = false;
    }
}

// 종료된 페이지 이동
async function endedMovePage(page: number) {
    isLoading.value = true;
    endedPage.value = page;

    try {
        endedList.value = await jointPurchaseRepository.getJointPurchases(endedPage.value, endedPerPage, true);

        router.replace({
            name: 'JointPurchase',
            query: {
                ongoingPage: ongoingPage.value,
                endedPage: endedPage.value,
            },
        });
    } catch (e) {
        console.log(e);
    } finally {
        isLoading.value = false;
    }
}

// URL 복사
function copyPath(id: number) {
    mmon.copy(location.href + '/detail/' + id);
}

onMounted(async() => {
    fetch();
});
</script>