<template>
    <div class="mm_term">
        <!-- 약관 내용 -->
        <div
            class="mm_term-inner"
            v-html="policyContents"
        />
        <div class="mm_term-info">
            <ul v-if="policyType === 'privacy'">
                <li>개인정보처리방침 버전번호: {{ policyVersion }}</li>
                <li>개인정보처리방침 시행일자: 2023-04-05</li>
                <li>개인정보처리방침 변경일자: {{ MMFilters.formatDate(privacyChangeDate, 'YYYY-MM-DD') }}</li>
            </ul>
            <MMSelect
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
            </MMSelect>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { DisplayPolicy, PrevPolicy } from '$/@type/policy';
import { policyRepository } from '$/repository/policyRepository';
import MMSelect from '@/components/input/Select.vue';
import { ref, toRefs, computed  } from 'vue';

const props = defineProps<{
    policyType: string,
    prevPolices: PrevPolicy[],
    now: DisplayPolicy
}>();

const policyContents = ref<string>(props.now.contents);

const { policyType } = toRefs(props);

const selectedPolicyId = ref(0);
const prevPolices = ref<PrevPolicy[]>(props.prevPolices);
const privacyChangeDate = ref<string>(props.now.displayDate)

const policyName = computed(() => {
    if (policyType.value === 'privacy') {
        return '개인정보처리방침';
    } else {
        return '이용약관';
    }
})

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
        return policyContents.value = props.now.contents;
    }

    policyContents.value = await policyRepository.getDetail(policyType.value, selectedPolicyId.value);
}

/** VARIABLE */

/** FUNCTION */

/** VUE LIFE CYCLE */

</script>