<template>
    <div class="mm_page-content">
        <!-- (D) 실제 내용을 추가하는 부분입니다. -->
        <div class="mm_inner">
            <h3 class="mm_title">
                <b>{{ policyName }}</b>
            </h3>
            <div class="mm_term">
                <!-- 약관 내용 -->
                <div :key="policy.id" class="mm_term-inner" v-html="policy.contents" />
                <!--// 약관 내용 -->

                <!-- 약관 정보 -->
                <div class="mm_term-info">
                    <MmSelect v-if="prevPolices.length > 0" :key="currentPolicyType" v-model="selectedPolicyId" @change="policyChange">
                        <option value="-1">
                            현재 {{ policyName }} 보기
                        </option>
                        <option v-for="prevPolicy in prevPolices" :key="prevPolicy.id" :value="prevPolicy.id">
                            {{ prevPolicy.title }}
                        </option>
                    </MmSelect>
                </div>
                <!--// 약관 정보 -->
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, toRefs, computed, watch } from 'vue';
import { DisplayPolicy, PrevPolicy } from '$/@type/policy'
import { policyRepository } from '$/repository/policyRepository'
import MmSelect from '@/components/input/Select.vue'
import { mmon } from '$/helper/mmon'
import { usePageTitleSetting } from '$/composables/seoComposable';
import CompanyList from '@/components/modal/policy/CompanyList.vue';
import { useEventListener } from '@vueuse/core';
import { useModal } from '$/composables/pageHandler/modalComposable';
import { defaultCatch } from '$/functions';

const props = defineProps<{
    policyType: string,
}>();

const selectedPolicyId = ref(-1)
const { policyType: currentPolicyType } = toRefs(props)
const policyName = computed(() => {
    return currentPolicyType.value === 'privacy' ? '개인정보처리방침' : '이용약관'
})

usePageTitleSetting(policyName.value);
useEventListener('hashchange', (event) => {
    const before = event.oldURL.split('#')[1] ?? '';
    const after = event.newURL.split('#')[1] ?? '';

    if (before === '' && after === 'COMPANY_ALL') {
        useModal().open(CompanyList, {
            title: '업체리스트',
            name: 'CompanyList',
            props: async() => {
                try {
                    const companyList = await policyRepository.getCompanyList();
                    return {
                        companyList
                    }
                } catch (e) {
                    defaultCatch(e);
                }
            }
        })
    }
})

const currentPolicy = ref<DisplayPolicy | null>(null)

const policy = ref<DisplayPolicy>({
    id: 0,
    title: '',
    contents: '',
    displayDate: '',
})
const prevPolices = ref<PrevPolicy[]>([])

async function policyChange() {
    window.scrollTo(0, 0)

    if (selectedPolicyId.value == -1) {
        if (currentPolicy.value !== null) {
            policy.value.id = currentPolicy.value.id
            policy.value.contents = currentPolicy.value.contents
        }

        return
    }

    mmon.loading.show()
    policy.value.id = selectedPolicyId.value
    policy.value.contents = await policyRepository.getDetail(currentPolicyType.value, selectedPolicyId.value)
    mmon.loading.hide()
}

// onBeforeMount(() => {
//     if (location.hash !== '') {
//         closeModal()
//     }
// })

watch(
    currentPolicyType,
    async (to, from) => {
        if (to !== from) {
            selectedPolicyId.value = -1
            const { prevPolicies: prev, nowPolicy } = await policyRepository.getNowDisplayAndPrevPolices(currentPolicyType.value)
            prevPolices.value = prev
            currentPolicy.value = {
                id: nowPolicy.id,
                title: nowPolicy.title,
                contents: nowPolicy.contents,
                displayDate: nowPolicy.displayDate,
            }
            policy.value = nowPolicy

            usePageTitleSetting(policyName.value);
        }
    },
    {
        flush: 'post',
    },
)

onMounted(async () => {
    const { prevPolicies: prev, nowPolicy } = await policyRepository.getNowDisplayAndPrevPolices(currentPolicyType.value)
    prevPolices.value = prev
    currentPolicy.value = {
        id: nowPolicy.id,
        title: nowPolicy.title,
        contents: nowPolicy.contents,
        displayDate: nowPolicy.displayDate,
    }
    policy.value = nowPolicy
    if (window.location.hash) {
        window.location.hash = '';
    }
})

/**
    * 이용약관내 관련 모달 오픈
    */
// window.addEventListener('hashchange', e => {
//     modalType.value = e.newURL.split('#')[1];
//     if (modalType.value != null) {
//         modal.open();
//     }
// });

// /**
//  * 모달창 CLOSE
//  */
// function closeModal() {
//     modalType.value = null;
//     router.replace({ hash: undefined })
//     modal.close();
// }
</script>