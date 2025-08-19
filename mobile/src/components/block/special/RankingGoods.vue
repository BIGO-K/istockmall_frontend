<template>
    <MMLink
        :to="
            goods.isOnlyAdult && needCertificateAge
                ? { name: pathCertificate, query: { redirect_to_after: `/goods/detail/${goods.id}`, is_need_adult_certification: 'Y' } }
                : { name: 'GoodsDetail', params: { id: goods.id } }
        "
        @click="zoomLoader"
    >
        <slot />
    </MMLink>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { rankGoodsZoomLoader } from '$/functions'
import { useUserState } from '$/composables/auth/userComposable'
import { useMaintenanceState } from '$/composables/pageHandler/contextComposable';
import { Block } from '$/@type/block';

const props = defineProps<{ goods: NonNullable<Block['goodsGroup']>['goodsList'][number] }>()

const { isUser, needCertificateAge } = useUserState();
const pathCertificate = computed(() => isUser.value ? 'AdultCertification' : 'Login')

function zoomLoader(event: MouseEvent) {
    if (
        useMaintenanceState().isUnderMaintenance.value
        || (props.goods.isOnlyAdult && needCertificateAge.value)
    ) {
        return;
    }

    rankGoodsZoomLoader(event);
}
</script>