<template>
    <MMBlock
        :block-name="'coop_p_n=w6Xh12_s1_link'"
        :required="{
            requiredValueList: [jointPurchase, block.title1, block.title2],
        }"
    >
        <MMTitle 
            :title1="block.title1"
            :title2="block.title2"
            :design-class-name="block.designTitleClassName"
        />
        <div v-if="jointPurchase" class="mui_inner">
            <div class="m_coop" :class="[jointPurchase.targetAchieveRate >= 100 ? 'S=coop-complete' : '']">
                <MMLink
                    :to="
                        jointPurchase.goods.isOnlyAdult && needCertificateAge
                            ? { name: pathCertificate, query: { redirect_to_after: `/joint-purchase/detail/${jointPurchase.id}`, is_need_adult_certification: 'Y' } }
                            : { name: 'JointPurchaseDetail', params: { id: jointPurchase.id } }
                    "                
                >
                    <figure>
                        <i
                            v-lazyload="{ src: jointPurchase.goods.thumbnailUrl }"
                            class="mui_bg-cover image_product"
                        />
                        <p v-if="jointPurchase.goods.isOnlyAdult && needCertificateAge" class="text_adult">
                            <b class="mui_ir-blind">미성년자 구매불가</b><i class="uico_adult" />
                        </p>
                        <figcaption>
                            <div class="m_coop-progress">
                                <p class="text_state">
                                    <b>
                                        <MMTimer :target-at="jointPurchase.targetAt" :show-day="true" />
                                    </b>
                                    <strong>{{ jointPurchase.isTargetAchieve ? '공동구매 목표 달성' : '공동구매 진행 중' }}</strong>
                                </p>
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
                            <p class="text_price">
                                <del><i class="uico_coop-arrow" />{{ MMFilters.formatNumber(jointPurchase.goods.price) }}</del>
                                공동구매가<strong>{{ MMFilters.formatNumber(jointPurchase.jointPurchasePrice) }}</strong>
                            </p>
                            <p class="text_brand">
                                {{ jointPurchase.goods.brandName }}
                            </p>
                            <p class="text_product">
                                {{ jointPurchase.goods.name }}
                            </p>
                        </figcaption>
                    </figure>
                </MMLink>
                <MMLink
                    :to="{ name: 'JointPurchaseDetail', params: { id: jointPurchase.id } }"
                    class="btn_coop-entry"
                >
                    <b>공동구매 참여하기</b>
                </MMLink>
            </div>
            <MMBlockLink :link="block.link || ''" :label="'전체보기'" />
        </div>
    </MMBlock>
</template>
<script setup lang="ts">
import { Block } from "$/@type/block"
import MMBlock from "@/components/block/Block.vue";
import { computed, toRefs } from "vue";
import MMTimer from "@/components/block/special/Timer.vue";
import MMBlockLink from '@/components/block/Link.vue'
import MMTitle from '@/components/block/Title.vue'
import { JointPurchasePartition } from "$/@type/block/partition";
import { useUserState } from "$/composables/auth/userComposable";

const props = defineProps<{ block: Block }>();
const { block } = toRefs(props);
const jointPurchase = computed<JointPurchasePartition['jointPurchaseList'][number]|null>(() => {
    return block.value?.jointPurchasePartition?.jointPurchaseList[0] || null;
});

// 회원 정보
const { isUser, needCertificateAge } = useUserState();
const pathCertificate = computed(() => {
    return isUser.value ? 'AdultCertification' : 'Login'
})
</script>
<style>
    @import "@publish/css/block/feature/coop_p_n=w6Xh12_s1_link.css";
</style>