<template>
    <ModalPopup>
        <template #headerTitle>
            <h1><b>업체리스트</b></h1>
        </template>
        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="m_popup-company">
                            <div class="m_modal-company">
                                <table>
                                    <colgroup>
                                        <col>
                                        <col style="width: 29.521276%;">
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th scope="col">
                                                <b>업체명</b>
                                            </th>
                                            <th scope="col">
                                                <b>대표자</b>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="companyInfo, index in companyList" :key="index">
                                            <td><b>{{ companyInfo.name }}</b></td>
                                            <td><b>{{ companyInfo.ceo }}</b></td>
                                        </tr>
                                    </tbody>
                                </table>
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
import { ref, onMounted } from 'vue';
import ModalPopup from '@/components/layout/ModalPopup.vue';
import { policyRepository } from '$/repository/policyRepository';

const companyList = ref<{
    name: string,
    ceo: string,
}[]>([])

onMounted(async () => {
    try {
        companyList.value = await policyRepository.getCompanyList();
    } catch (e) {
        console.log(e)
    }
});
</script>

