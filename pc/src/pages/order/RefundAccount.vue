<template>
    <div class="mm_order-form m...method-account-refund">
        <table>
            <tbody>
                <tr>
                    <th scope="row">
                        <b>환불 계좌 관리</b>
                    </th>
                    <td>
                        <template v-if="refundAccount !== null">
                            <p>{{ refundAccount.bankName }}</p>
                            <p>{{ refundAccount.ownerName }}</p>
                            <p>
                                {{ refundAccount.accountNumber }} 
                                <a
                                    class="mm_btn T=xs"
                                    href="#"
                                    @click.prevent="refundModalOpen()"
                                >
                                    <b>변경하기</b><i class="ico_link T=xs" />
                                </a>
                            </p>
                        </template>

                        <template v-else>
                            <p>
                                환불 계좌를 등록해 주세요.
                                <a
                                    class="mm_btn T=xs"
                                    href="#"
                                    @click.prevent="refundModalOpen()"
                                >
                                    <b>등록하기</b><i class="ico_link T=xs" />
                                </a>
                            </p>
                        </template>
                        <div
                            v-once
                            class="mm_note"
                        >
                            <ul>
                                <li>입력하신 계좌 정보는 환불 목적으로만 이용되고 있습니다.</li>
                            </ul>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>    
</template>

<script setup lang='ts'>
import { computed } from 'vue';
import { RefundAccount } from '$/@type/member/refundAccount';
import RefundAccountModal from '@/components/modal/RefundAccount.vue';
import { useModal } from '$/composables/pageHandler/modalComposable';
import { useBankCodes } from '$/composables/globalConfigComposable';

/** VARIABLE */
const props = defineProps<{
    account: RefundAccount|null
}>();

const emit = defineEmits<{
    (e: 'fetchRefundAccount'): void
}>();

const refundAccount = computed(() => {
    return props.account
})

/** FUNCTION */
function refundModalOpen() {
    useModal().open(RefundAccountModal, {
        title: refundAccount.value ? '환불 계좌 변경' : '환불 계좌 등록',
        name: 'RefundAccountModal',
        props: async() => {
            const { bankCodes } = useBankCodes();
            return {
                refundAccount: refundAccount.value === null ? undefined : refundAccount.value,
                bankCodes
            }
        },
        onClose: () => {
            emit('fetchRefundAccount');
        }
    })
}
/** VUE LIFE CYCLE */
</script>