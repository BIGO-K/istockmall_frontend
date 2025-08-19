<template>
    <MMPopup>
        <template #headerTitle>
            <h1><b>My 사이즈</b></h1>
        </template>

        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="m_popup-mysize">
                            <h6 class="mm_text-label">
                                <b>성별</b>
                            </h6>
                            <div class="mm_radio-list T=chain">
                                <ul>
                                    <li>
                                        <MMRadio
                                            v-model="mySizeForm.gender"
                                            name="gender"
                                            :value="'E'"
                                        >
                                            <b class="mm_block">
                                                <span class="text_label">선택안함</span>
                                            </b>
                                        </MMRadio>
                                    </li>
                                    <li>
                                        <MMRadio
                                            v-model="mySizeForm.gender"
                                            name="gender"
                                            value="M"
                                        >
                                            <b class="mm_block">
                                                <span class="text_label">남성</span>
                                            </b>
                                        </MMRadio>
                                    </li>
                                    <li>
                                        <MMRadio
                                            v-model="mySizeForm.gender"
                                            name="gender"
                                            value="F"
                                        >
                                            <b class="mm_block">
                                                <span class="text_label">여성</span>
                                            </b>
                                        </MMRadio>
                                    </li>
                                </ul>
                            </div>
                            <h6 class="mm_text-label">
                                <b>MY 핏</b>
                            </h6>
                            <div class="mm_radio-list T=chain">
                                <ul>
                                    <li>
                                        <MMRadio
                                            :name="'fit'"
                                            :checked="mySizeForm.fitId == null"
                                            @update:model-value="mySizeForm.fitId = undefined"
                                        >
                                            <b class="mm_block">
                                                <span class="text_label">선택안함</span>
                                            </b>
                                        </MMRadio>
                                    </li>
                                    <li
                                        v-for="fit in fitList"
                                        :key="fit.id"
                                    >
                                        <MMRadio 
                                            v-model="mySizeForm.fitId" 
                                            name="fit" 
                                            :value="fit.id"
                                        >
                                            <b class="mm_block">
                                                <span class="text_label">{{ fit.label }}</span>
                                            </b>
                                        </MMRadio>
                                    </li>
                                </ul>
                            </div>
                            <h6 class="mm_text-label">
                                <b>신발 카테고리 선택</b>
                            </h6>
                            <div class="mm_radio-list T=chain">
                                <ul>
                                    <li>
                                        <MMRadio
                                            :name="'shoes_category'"
                                            :checked="mySizeForm.shoesCategoryCode == null"
                                            @update:model-value="mySizeForm.shoesCategoryCode = undefined"
                                        >
                                            <b class="mm_block">
                                                <span class="text_label">선택안함</span>
                                            </b>
                                        </MMRadio>
                                    </li>
                                    <li
                                        v-for="shoesCategory in shoesCategories"
                                        :key="shoesCategory.code"
                                    >
                                        <MMRadio 
                                            v-model="mySizeForm.shoesCategoryCode" 
                                            :name="'shoes_category'" 
                                            :value="shoesCategory.code"
                                        >
                                            <b class="mm_block">
                                                <span class="text_label">{{ shoesCategory.label }}</span>
                                            </b>
                                        </MMRadio>
                                    </li>
                                </ul>
                            </div>
                            <h6 class="mm_text-label">
                                <b>신발 사이즈 선택</b>
                            </h6>
                            <div class="mm_radio-list T=chain">
                                <ul>
                                    <li>
                                        <MMRadio
                                            :name="'shoes_size'"
                                            :checked="mySizeForm.shoesSizeId == null"
                                            @update:model-value="mySizeForm.shoesSizeId = undefined"
                                        >
                                            <b class="mm_block">
                                                <span class="text_label">선택안함</span>
                                            </b>
                                        </MMRadio>
                                    </li>
                                    <li
                                        v-for="shoesSize in shoesSizes"
                                        :key="shoesSize.id"
                                    >
                                        <MMRadio 
                                            v-model="mySizeForm.shoesSizeId" 
                                            :name="'shoes_size'" 
                                            :value="shoesSize.id"
                                        >
                                            <b class="mm_block">
                                                <span class="text_label">{{ shoesSize.label }}</span>
                                            </b>
                                        </MMRadio>
                                    </li>
                                </ul>
                            </div>
                            <h6 class="mm_text-label">
                                <b>신체 정보 입력</b>
                            </h6>
                            <div class="mm_form_mix-linked">
                                <MMInput
                                    v-model="mySizeForm.height"
                                    place-holder-text="키"
                                    data-type="number"
                                    max-length="3"
                                />
                                <span class="text_linked">cm</span>
                                <MMInput
                                    v-model="mySizeForm.weight"
                                    place-holder-text="몸무게"
                                    data-type="number"
                                    :use-trim="false"
                                    max-length="3"
                                />
                                <span class="text_linked">kg</span>
                            </div>
                            <div class="mm_note">
                                <ul>
                                    <li>사이즈 정보를 입력해주시면 맞춤 상품을 추천해드립니다.</li>
                                </ul>
                            </div>
                            <div class="m_popup-mysize-agree">
                                <MMCheck
                                    v-model="mySizeForm.informationAgree"
                                    :value="true"
                                    label="사이즈 정보 수집 및 이용 동의"
                                />
                                <ul>
                                    <li><strong>1. 수집 목적:</strong> 상품 추천 서비스</li>
                                    <li><strong>2. 수집 항목:</strong> 성별, 신체 사이즈(키, 몸무게, 체형), 신발 카테고리, 신발 사이즈</li>
                                    <li><strong>3. 수집 및 보유기간:</strong> 개인정보처리방침 보유 기간에 따라 관리</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <!--// 본문 -->
                </div>
            </div>
            <div class="mm_btn_box T=fixed">
                <button type="button" class="btn_size-save" @click="updateMySize">
                    <b>저장하기</b>
                </button>
            </div>
        </template>
    </MMPopup>
</template>

<script setup lang="ts">
import MMPopup from '@/components/layout/Popup.vue';
import { ref, onMounted } from 'vue';
import MMRadio from '@/components/input/Radio.vue';
import MMCheck from '@/components/input/Check.vue';
import { ShoesSize, ShoesCategory } from '$/@type/configs';
import { mySizeRepository } from '$/repository/member/mySizeRepository';
import { MySize } from '$/@type/member/info';
import { FilterFit } from '$/@type/searchFilter';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { makeValidator } from '$/validator';
import { usePersonalization } from '$/composables/goods/reviewComposable';

usePageTitleSetting('My 사이즈');
const mySizeForm = ref<MySize>({
    gender: undefined,
    fitId: undefined,
    shoesCategoryCode: undefined,
    shoesSizeId: undefined,
    height: undefined,
    weight: undefined,
    informationAgree: false,
});

const shoesSizes = ref<ShoesSize[]>([]);
const shoesCategories = ref<ShoesCategory[]>([]);
const fitList = ref<FilterFit[]>([]);

const dataLoaded = ref<boolean>(false);

const { 
    getShoesSizes, 
    getShoesCategories, 
    getFits, 
    getMySize 
} = usePersonalization()

onMounted(async () => {
    const [ mySizeInfo, shoesSizeList, shoesCategoryList, fits ] = await Promise.all([
        getMySize(),
        getShoesSizes(),
        getShoesCategories(),
        getFits(),
    ]);

    if (mySizeInfo != null) {
        mySizeForm.value = mySizeInfo;
    }
    shoesSizes.value = shoesSizeList;
    shoesCategories.value = shoesCategoryList
    fitList.value = fits;
    dataLoaded.value = true;
});

async function updateMySize() {
    const validator = makeValidator(mySizeForm.value)
        .setRules({
            'gender(성별)': ['required'],
            'fitId(My 핏)': [`in:${(fitList.value.map(fit => fit.id)).join()}`],
            'shoesCategoryCode(신발 카테고리)': [`in:${(shoesCategories.value.map(category => category.code)).join()}`],
            'shoesSizeId(신발 사이즈)': [`in:${(shoesSizes.value.map(size => size.id)).join()}`],
            'height(키)': ['betweenValue:0,300'],
            'weight(몸무게)': ['betweenValue:0,255'],
            'informationAgree(사이즈 정보 수집 및 이용 동의)': ['required', 'in:true'],
        })
        .setMessages({
            'informationAgree.required': ':param를 체크해주세요.',
            'informationAgree.in': ':param를 체크해주세요.',
            'fitId.in': ':param를 올바르게 선택해주세요.',
            'shoesCategoryCode.in': ':param를 올바르게 선택해주세요.',
            'shoesSizeId.in': ':param를 올바르게 선택해주세요.',
        })

    try {
        await validator.run();
        await mySizeRepository.updateMySize(mySizeForm.value);
        mmon.bom.alert('수정되었습니다.')
    } catch (e) {
        defaultCatch(e)
    }
}
</script>

