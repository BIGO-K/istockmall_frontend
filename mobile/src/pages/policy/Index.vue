<template>
    <MMPopup>
        <template #headerTitle>
            <h1><b>{{ policyName }}</b></h1>
        </template>
        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="mm_term">
                            <div class="mm_term-inner" v-html="policy.contents" />
                            <!-- 약관 정보 -->
                            <div class="mm_term-info">
                                <MmSelect
                                    v-if="prevPolices.length > 0"
                                    v-model="selectedPolicyId"
                                    @change="policyChange"
                                >
                                    <option value="-1">
                                        현재 {{ policyName }} 보기
                                    </option>
                                    <option v-for="policy in prevPolices" :key="policy.id" :value="policy.id">
                                        {{ policy.title }}
                                    </option>
                                </MmSelect>
                            </div>
                            <!--// 약관 정보 -->
                        </div>
                    </div>
                    <!--// 본문 -->
                </div>
            </div>
        </template>
    </MMPopup>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, toRefs } from 'vue';
import MMPopup from '@/components/layout/Popup.vue';
import { DisplayPolicy, PrevPolicy } from '$/@type/policy';
import { mmon } from '$/helper/mmon';
import { policyRepository } from '$/repository/policyRepository';
import MmSelect from '@/components/input/Select.vue';

const props = defineProps<{
    policyType: string
}>();
const { policyType } = toRefs(props);
const policyName = computed(() => {
    return policyType.value === 'privacy' ?  '개인정보처리방침' : '이용약관';
});
        
const currentPolicy = ref<DisplayPolicy|null>(null);
const selectedPolicyId = ref(-1);
const policy = ref<DisplayPolicy>({
    id: 0,
    title: '',
    contents: '',
    displayDate: '',
});
const prevPolices = ref<PrevPolicy[]>([]);
async function policyChange() {
    mmon.scroll.to(document.querySelector('#app') as Element, { margin: 0 });
    if (selectedPolicyId.value == -1) {
        if (currentPolicy.value !== null) {
            policy.value.id = currentPolicy.value.id;
            policy.value.contents = currentPolicy.value.contents;
        }
        return;
    }
    mmon.loading.show();
    policy.value.id = selectedPolicyId.value;
    policy.value.contents = await policyRepository.getDetail(policyType.value, selectedPolicyId.value);
    mmon.loading.hide();
}
onMounted(async () => {
    const { prevPolicies: prev, nowPolicy } = await policyRepository.getNowDisplayAndPrevPolices(policyType.value);
    prevPolices.value = prev;
    currentPolicy.value = {
        id: nowPolicy.id,
        title: nowPolicy.title,
        contents: nowPolicy.contents,
        displayDate: nowPolicy.displayDate,
    };
    policy.value = nowPolicy;
});
        
</script>