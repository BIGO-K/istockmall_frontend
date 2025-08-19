<template>
    <div class="m_modal-company">
        <table>
            <colgroup>
                <col>
                <col style="width: 182px;">
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
</template>

<script setup lang="ts">
import { ModalCloseHandler } from '$/@type/Modal';
import { useRouteHash } from '@vueuse/router';
import { onBeforeUnmount } from 'vue'

defineProps<{
    closer: ModalCloseHandler<void>,
    companyList: { name: string, ceo: string}[]
}>();
const hash = useRouteHash()


onBeforeUnmount(() => {
    hash.value = '';
});
</script>
