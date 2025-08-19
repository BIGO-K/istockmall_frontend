<!-- @format -->

<template>
    <div class="m_coopbuy">
        <div class="m_coopbuy-head">
            <h3>
                <b>
                    목표 수량에 도달하면
                    <br>
                    <strong>공동구매</strong>
                    성공!
                </b>
            </h3>
            <strong>지금 참여하기 버튼을 누르세요</strong>
            <p>
                목표수량 도달 시 알림톡과 쿠폰이 발송되며 해당 상품을
                <br>
                공동구매가로 구매하실 수 있습니다.
            </p>
            <ol>
                <li>
                    <i class="ico_coopbuy-join" />
                    <b>공동구매 참여</b>
                </li>
                <li>
                    <i class="ico_coopbuy-goal" />
                    <b>목표 달성</b>
                </li>
                <li>
                    <i class="ico_coopbuy-coupon" />
                    <b>쿠폰 발급</b>
                </li>
                <li>
                    <i class="ico_coopbuy-buy" />
                    <b>상품 구매</b>
                </li>
            </ol>
        </div>
        <div class="mm_inner">
            <div class="mm_tab" data-tab="{ '_isToggle': true }">
                <div class="mm_tab_menu T=full">
                    <!-- (D) 선택된 탭메뉴에 'S=tab-on' 클래스와 '선택됨' 타이틀이 추가됩니다. -->
                    <ul class="mm_flex T=equal">
                        <li>
                            <a
                                :class="['btn_tab', jointPurchaseTab === 'ongoing' ? 'S=tab-on': '']"
                                :title="jointPurchaseTab === 'ongoing' ? '선택됨' : ''"
                                @click="setTab('ongoing')"
                            >
                                <b>진행중</b>
                            </a>
                        </li>
                        <li>
                            <a
                                :class="['btn_tab', jointPurchaseTab === 'ended' ? 'S=tab-on': '']"
                                :title="jointPurchaseTab === 'ended' ? '선택됨' : ''"
                                @click="setTab('ended')"
                            >
                                <b>마감</b>
                            </a>
                        </li>
                    </ul>
                </div>

                <!-- 공동 구매 리스트(진행 중/ 종료) -->
                <div class="mm_tab-item S=tab-on">
                    <div :class="jointPurchaseTab === 'ongoing'? 'm_coopbuy-on' : 'm_coopbuy-off'">
                        <component
                            :is="OnGoing"
                            v-if="jointPurchaseTab === 'ongoing'"
                            @sns-share="snsShare"                            
                        />
                        <component
                            :is="Ended"
                            v-if="jointPurchaseTab === 'ended'"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref, onBeforeMount } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { useSnsShared } from "$/composables/shoppingComposable";
import { JointPurchase } from "$/@type/jointPurchase";
import { usePageTitleSetting } from '$/composables/seoComposable';

const emit = defineEmits(['snsSharedToggle']);
const { shareDimOpen } = useSnsShared();

const route = useRoute();
const router = useRouter();
usePageTitleSetting('공동구매');

/** VARIABLE */
const jointPurchaseTab = route.params.sort === "ongoing" ? ref("ongoing") : ref("ended");
const OnGoing = defineAsyncComponent(() => import("@/pages/jointPurchase/list/Ongoing.vue"));
const Ended = defineAsyncComponent(() => import("@/pages/jointPurchase/list/Ended.vue"));
/** // VARIABLE */

/** FUNCTION */
// 공유하기 버튼 클릭 시
function snsShare(event: MouseEvent, jointPurchase: JointPurchase) {
    shareDimOpen(event, `#공동구매`, jointPurchase.goodsName, jointPurchase.thumbnailUrl);
    emit("snsSharedToggle");
}

function setTab(tab: string) {
    jointPurchaseTab.value = tab;
    router.replace({ name: 'JointPurchase', params: { sort: tab } })
}
/** // FUNCTION */
       
/** VUE LIFE CYCLE */ 
onBeforeMount(async () => {
    if (route.params.sort !== '') {
        return
    }
    jointPurchaseTab.value = 'ongoing';

    router.replace({
        name: 'JointPurchase',
        params: {
            sort: 'ongoing',
        },
    });
})
/** // VUE LIFE CYCLE */
</script>
