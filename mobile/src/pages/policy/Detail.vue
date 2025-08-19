<template>
    <ModalPopup>
        <template #headerTitle>
            <h1><b>{{ policyName }}</b></h1>
        </template>
        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="mm_term">
                            <!-- 약관 내용 -->
                            <div class="mm_term-inner" v-html="displayPolicyContents" />
                            <div class="mm_term-info">
                                <ul v-if="policyType === 'privacy'">
                                    <li>개인정보처리방침 버전번호: {{ policyVersion }}</li>
                                    <li>개인정보처리방침 시행일자: 2023-04-05</li>
                                    <li>개인정보처리방침 변경일자: {{ MMFilters.formatDate(privacyChangeDate, 'YYYY-MM-DD') }}</li>
                                </ul>
                                <MmSelect
                                    v-model="selectedPolicyId"
                                    @change="policyChange"
                                >
                                    <option value="-1">
                                        현재 {{ policyName }} 보기
                                    </option>
                                    <option
                                        v-for="policy in prevPolices"
                                        :key="policy.id" 
                                        :value="policy.id"
                                    >
                                        {{ policy.title }}
                                    </option>
                                </MmSelect>
                            </div>
                        </div>
                    </div>
                    <!--// 본문 -->                  
                </div>
            </div>
        </template>
    </ModalPopup>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import ModalPopup from '@/components/layout/ModalPopup.vue';
import MmSelect from '@/components/input/Select.vue';
import { usePolicyModal } from '$/composables/policyComposable';
import { PrevPolicy } from '$/@type/policy';
import { policyRepository } from '$/repository/policyRepository';
import { mmon } from '$/helper/mmon';
const { policyContents, policyName, policyType } = usePolicyModal();
const displayPolicyContents = ref<string>(policyContents.value);
const prevPolices = ref<PrevPolicy[]>([]);
const selectedPolicyId = ref(0);
const privacyChangeDate = ref<string>('');
const policyVersion = computed(() => {
    if (policyType.value === 'privacy') {
        const version = 1.0
        if (prevPolices.value.length > 0) {
            return `v${(version + (prevPolices.value.length * 0.1)).toFixed(1)}`;
        } else {
            return `v${version.toFixed(1)}`;
        }
    }
    return '';
})
async function policyChange() {
    if (selectedPolicyId.value == 0) {
        return;
    }
    if (selectedPolicyId.value == -1) {				
        return displayPolicyContents.value = policyContents.value;
    }
    mmon.loading.show();			
    displayPolicyContents.value = await policyRepository.getDetail(policyType.value, selectedPolicyId.value);
    mmon.scroll.to(document.querySelector('#app') as Element, { margin: 0 });
    mmon.loading.hide();
}
onMounted(async() => {
    const { prevPolicies: prev, nowPolicy } = await policyRepository.getNowDisplayAndPrevPolices(policyType.value);
    prevPolices.value = prev;
    privacyChangeDate.value = nowPolicy.displayDate;
});
</script>
