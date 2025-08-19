<template>
    <div v-if="!isHide && banner" :class="`m_topbanner ${bannerClassName}`">
        <MMLink :to="banner.link">
            <i 
                v-lazyload="{ 'src': banner.imageUrl }"
                :class="[globalConfigs.design?.mobileTopBannerType === 'custom' ? '' : 'mm_bg-cover']"
            />
            <b class="mm_ir-blind">{{ banner.title }}</b>
        </MMLink>
        <button type="button" class="btn_close" @click="hide">
            <i class="ico_close T=thin" /><b class="mm_ir-blind">닫기</b>
        </button>
    </div>
</template>
<script setup lang='ts'>
import { TopBanner } from '$/@type/exhibit';
import { useTopBannerHide } from '$/composables/exhibit/bannerComposable';
import { useGlobalConfigs } from '$/composables/globalConfigComposable';
import { computed } from 'vue';

const { globalConfigs } = useGlobalConfigs();
const { hide, isHide } = useTopBannerHide();

const props = defineProps<{
    banner: TopBanner|null
}>();

const bannerClassName = computed<string>(() => {
    if (!props.banner) {
        return ''
    }

    switch(globalConfigs.value.design?.mobileTopBannerType) {
    case 'A':
        return 'T=ta S=show';
    case 'B': 
        return 'T=tb S=show';
    case 'custom':
        return 'T=custom';
    default: 
        return '';
    }
});

</script>
