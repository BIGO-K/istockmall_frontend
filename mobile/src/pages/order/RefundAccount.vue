<template>
    <section>
        <h6 class="mm_strapline">
            <b>환불 계좌 관리</b>
        </h6>
        <!-- (D) 등록된 계좌가 있을 경우 노출합니다. -->
        <template v-if="refundAccount">
            <div class="mm_order-refund">
                <p class="text_bank">
                    {{ refundAccount.bankName }}
                </p>
                <p class="text_name">
                    {{ refundAccount.ownerName }}
                </p>
                <p>{{ refundAccount.accountNumber }}</p>
                <a class="mm_btn T=xs T=dark" href="#REFUND_ACCOUNT"><b>변경하기</b><i class="ico_link T=sm" /></a>
            </div>
        </template>
        <template v-else>
            <!-- (D) 등록된 계좌가 없을 경우 노출합니다. -->
            <div class="mm_order-refund-none">
                <p>환불 계좌를 등록하세요</p>
                <a class="mm_btn T=dark" href="#REFUND_ACCOUNT"><b>환불 계좌 등록하기</b></a>
            </div>
        </template>
        <div class="mm_note">
            <ul>
                <li>입력하신 계좌 정보는 환불 목적으로만 이용되고 있습니다.</li>
            </ul>
        </div>
    </section>
</template>

<script setup lang='ts' inherit-attrs="false">
import { RefundAccount } from '$/@type/member/refundAccount';
import { computed } from 'vue';

const props = defineProps<{
    account: RefundAccount|null
}>();

const refundAccount = computed(() => {
    return props.account
})
</script>