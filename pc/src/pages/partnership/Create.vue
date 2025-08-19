<template>
    <div class="mm_page-content">
        <!-- (D) 실제 내용을 추가하는 부분입니다. -->
        <div class="mm_inner m_partnership">
            <h3 class="mm_heading">
                <b>제휴 및 입점문의</b>
            </h3>
            <p>
                공동 프로모션 제안, 이벤트 제안, 브랜드 입점 등 여러분의 참여를 기다립니다. 아래 내용을 작성하고 신청해주시면 성심껏 검토 후 답변
                드리겠습니다.
            </p>
            <div class="m_partnership-form">
                <div class="mm_lside">
                    <h6 class="mm_text-label">
                        <b>문의 선택</b>
                    </h6>
                    <div class="mm_radio-list">
                        <ul>
                            <li v-for="inquiryType in inquiryTypes" :key="inquiryType.code">
                                <MMRadio v-model="inquiry.type" :value="inquiryType.code" name="inquiry_type" @change.passive="inquiry.categories = []">
                                    <b class="mm_block">
                                        <i class="ico_form-radio" />
                                        <span class="text_label">{{ inquiryType.label }}</span>
                                        <small>{{ inquiryType.description }}</small>
                                    </b>
                                </MMRadio>
                                <div
                                    v-if="inquiryType.categoryRequired"
                                    class="mm_syncer-partnership"
                                    :class="inquiry.type == inquiryType.code ? 'S=radio-use' : ''"
                                >
                                    <p>카테고리 선택 (복수 선택가능)</p>
                                    <div class="mm_check-list">
                                        <ul>
                                            <li v-for="category in inquiryCategories" :key="category.code">
                                                <MMCheck v-model="inquiry.categories" :value="category.code" :label="category.name" />
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <h6 class="mm_text-label">
                        <b>업체명</b><i class="ico_required" />
                    </h6>
                    <MMInput v-model="inquiry.companyName" :use-trim="false" place-holder-text="업체를 입력하세요" />
                    <h6 class="mm_text-label">
                        <b>브랜드명</b><i class="ico_required" />
                    </h6>
                    <MMInput v-model="inquiry.brandName" :use-trim="false" place-holder-text="브랜드를 입력하세요" />
                </div>
                <div class="mm_rside">
                    <h6 class="mm_text-label">
                        <b>담당자명</b><i class="ico_required" />
                    </h6>
                    <MMInput v-model="inquiry.name" :use-trim="false" place-holder-text="담당자를 입력하세요" />
                    <h6 class="mm_text-label">
                        <b>담당자 이메일</b><i class="ico_required" />
                    </h6>
                    <MMInput v-model="inquiry.email" data-type="email" place-holder-text="이메일을 입력하세요" />
                    <h6 class="mm_text-label">
                        <b>담당자 휴대폰 번호</b><i class="ico_required" />
                    </h6>
                    <MMInput v-model="inquiry.phone" data-type="phone" place-holder-text="휴대폰 번호를 입력하세요" maxlength="12" />
                    <h6 class="mm_text-label">
                        <b>구체적인 제휴 내용</b><i class="ico_required" />
                    </h6>
                    <MMTextarea v-model="inquiry.contents" place-holder-text="제휴내용을 입력해주세요" :max-byte="2000" />
                </div>
            </div>
            <div class="m_partnership-agree">
                <MMCheck v-model="policyAgreed" label="개인정보 수집 및 이용에 동의" :value="true" />
                <a
                    class="btn_detail"
                    href="#"
                    @click.prevent="policyModalOpen"
                >
                    <b>자세히</b>
                </a>
            </div>
            <div class="mm_foot">
                <div class="mm_btn_box T=equal">
                    <a class="mm_btn T=light" href="#" @click.prevent="router.go(-1)"><b>취소하기</b></a>
                    <button type="button" class="mm_btn T=primary" @click="sendInquiry">
                        <b>신청하기</b>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineAsyncComponent, onMounted, ref, defineComponent } from 'vue';
import { PartnershipInquiryCategory, PartnershipInquiryType, PartnershipInquiry } from '$/@type/partnershipInquiry'
import { defaultCatch } from '$/functions'
import { partnershipInquiryRepository } from '$/repository/partnershipInquiryRepository'
import { mmon } from '$/helper/mmon'
import { useRouter } from 'vue-router'
import { makeValidator } from '$/validator'
import { usePageTitleSetting } from '$/composables/seoComposable';
import { useModal } from '$/composables/pageHandler/modalComposable';
import PolicyDetail from '@/components/modal/policy/Detail.vue'
import { policyRepository } from '$/repository/policyRepository';

declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        inquiryTypes: PartnershipInquiryType[]
        inquiryCategories: PartnershipInquiryCategory[]
    }
}

export default defineComponent({
    components: {
        MMRadio: defineAsyncComponent(() => import('@/components/input/Radio.vue')),
        MMCheck: defineAsyncComponent(() => import('@/components/input/Check.vue')),
        MMTextarea: defineAsyncComponent(() => import('@/components/input/Textarea.vue')),
    },
    async beforeRouteEnter(to, from, next) {
        try {
            const partnershipInquiryTypes = await partnershipInquiryRepository.getTypes()
            const categoryInquiryTypeCode: number = partnershipInquiryTypes.find((inquiryType) => inquiryType.categoryRequired)?.code || 0
            let partnershipInquiryCategories: PartnershipInquiryCategory[] = []
            if (categoryInquiryTypeCode) {
                partnershipInquiryCategories = await partnershipInquiryRepository.getCategories(categoryInquiryTypeCode)
            } 

            next(async (vm) => {
                vm.inquiryTypes =  partnershipInquiryTypes;
                vm.inquiryCategories = partnershipInquiryCategories;
            })
        } catch (e) {
            next();
        }
    },
    setup() {
        const router = useRouter()
        usePageTitleSetting('제휴 및 입점문의');
        // 제휴문의 구분
        const inquiryTypes = ref<PartnershipInquiryType[]>([])
        // 제휴문의 카테고리
        const inquiryCategories = ref<PartnershipInquiryCategory[]>([])
        // 제휴문의
        const inquiry = ref<PartnershipInquiry>({
            type: 0,
            categories: [],
            companyName: '',
            brandName: '',
            name: '',
            email: '',
            phone: '',
            contents: '',
        })

        const policyAgreed = ref<boolean>(false)
        // 제휴문의 신청
        async function sendInquiry() {
            const validator = makeValidator(Object.assign(inquiry.value, { policyAgreed: policyAgreed.value }))
                .setRules({
                    'type(문의사항)': ['required'],
                    'categories(카테고리)': [`requiredIf:type,${inquiryTypes.value.find((inquiryType) => inquiryType.categoryRequired)?.code}`],
                    'companyName(업체명)': ['required'],
                    'brandName(브랜드명)': ['required'],
                    'name(담당자명)': ['required'],
                    'email(이메일)': ['required', 'email'],
                    'phone(휴대폰 번호)': ['required', 'number', 'maxLength:12'],
                    'contents(제휴 내용)': ['required'],
                    'policyAgreed(필수 약관)': ['in:true'],
                })
                .setMessages({
                    'type.required': ':param(을/를) 선택해주세요.',
                    'categories.requiredIf': ':param(을/를) 선택해주세요.',
                    'companyName.required': ':param(을/를) 입력해주세요.',
                    'brandName.required': ':param(을/를) 입력해주세요.',
                    'name.required': ':param(을/를) 입력해주세요.',
                    'email.required': ':param(을/를) 입력해주세요.',
                    'email.email': '잘못된 :param 형식입니다.',
                    'phone.required': ':param(을/를) 입력해주세요.',
                    'phone.number': ':param(은/는) 숫자만 입력가능합니다.',
                    'phone.maxLength': ':param(은/는) :$0자리 이내로 입력해주세요.',
                    'contents.required': ':param(을/를) 입력해주세요.',
                    'contents.maxLength': ':param(은/는)\n최대 :$0자까지 입력가능합니다.',
                    'policyAgreed.in': ':param에 동의해주세요.',
                })

            try {
                await validator.run()
                await partnershipInquiryRepository.sendPartnershipInquiry(inquiry.value)
                mmon.bom.alert('메일이 전송되었습니다.', () => {
                    inquiry.value = {
                        type: String(inquiryTypes.value[0].code),
                        categories: [],
                        companyName: '',
                        brandName: '',
                        name: '',
                        email: '',
                        phone: '',
                        contents: '',
                    }
                    policyAgreed.value = false
                })
            } catch (e) {
                defaultCatch(e)
            }
        }

        function policyModalOpen() {
            return useModal().open(PolicyDetail, {
                name: 'policyDetail',
                itemClass: 'm_modal-term T=version',
                title: '개인정보처리방침',        
                props: async () => {
                    const { prevPolicies: prev, nowPolicy } = await policyRepository.getNowDisplayAndPrevPolices('privacy');
                    return {
                        policyType: 'privacy',
                        prevPolices: prev,
                        now: nowPolicy
                    }
                },
            })
        }

        onMounted(async () => {
            // 제휴문의 구분 초기화
            inquiry.value.type = `${inquiryTypes.value[0]?.code}` // 숫자는 kalidator requiredIf에 적용되지 않아 문자열화
        })

        return {            
            inquiryCategories,
            inquiry,
            inquiryTypes,
            router,
            sendInquiry,            
            policyAgreed,
            policyModalOpen
        }
    }
})
</script>
