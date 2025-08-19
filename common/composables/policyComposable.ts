import { PrevPolicy } from "$/@type/policy";
import { policyRepository } from "$/repository/policyRepository";
import { ref } from "vue";
const policyContents = ref('');
const policyType = ref('');
const policyName = ref('');

/**
 * 이용약관 관련 처리 
 */
export function usePolicyModal() {
    function setContents(content: string, name: string, type: string) {
        policyContents.value = content;
        policyType.value = type;
        policyName.value = name;
    }

    return {
        setContents,
        policyContents,
        policyName,
        policyType
    }
}