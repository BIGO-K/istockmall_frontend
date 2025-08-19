<template>
    <MMLink :to="banner.link || ''">
        <figure>
            <i
                v-lazyload="{ src: `${banner.imageUrl}`}"
                :data-lazyload="`{ '_src': '${banner.imageUrl || ''}' }`"
                :class="'mui_bg-cover image_banner ' + (bannerImageClass || '')"                
            />
            <figcaption :class="banner.colorCode === '#000000' ? 'T=text-black' : ''">
                <p v-if="banner.isUseText && banner.text1" class="text_banner1">
                    {{ banner.text1 }}
                </p>
                <template v-if="dateTextPosition === 2">
                    <p v-if="showDisplayPeriod && banner.displayStartAt && banner.displayEndAt" class="text_date">
                        {{ MMFilters.formatDate(banner.displayStartAt, dateFormatString) }} ~
                        {{ MMFilters.formatDate(banner.displayEndAt, dateFormatString) }}
                    </p>
                    <p v-if="showCreatedAt && banner.createdAt" class="text_date">
                        {{ MMFilters.formatDate(banner.createdAt, dateFormatString) }}
                    </p>
                </template>
                <p v-if="banner.isUseText && banner.text2" class="text_banner2">
                    {{ banner.text2 }}
                </p>
                <template v-if="!dateTextPosition || dateTextPosition === 3">
                    <p v-if="showDisplayPeriod && banner.displayStartAt && banner.displayEndAt" class="text_date">
                        {{ MMFilters.formatDate(banner.displayStartAt, dateFormatString) }} ~
                        {{ MMFilters.formatDate(banner.displayEndAt, dateFormatString) }}
                    </p>
                    <p v-if="showCreatedAt && banner.createdAt" class="text_date">
                        {{ MMFilters.formatDate(banner.createdAt, dateFormatString) }}
                    </p>
                </template>
                <p v-if="banner.isUseText && banner.text3" class="text_banner3">
                    {{ banner.text3 }}
                </p>
                <template v-if="dateTextPosition === 4">
                    <p v-if="showDisplayPeriod && banner.displayStartAt && banner.displayEndAt" class="text_date">
                        {{ MMFilters.formatDate(banner.displayStartAt, dateFormatString) }} ~
                        {{ MMFilters.formatDate(banner.displayEndAt, dateFormatString) }}
                    </p>
                    <p v-if="showCreatedAt && banner.createdAt" class="text_date">
                        {{ MMFilters.formatDate(banner.createdAt, dateFormatString) }}
                    </p>
                </template>
                <p v-if="banner.isUseText && banner.text4" class="text_banner4">
                    {{ banner.text4 }}
                </p>
                <slot name="text-detail" />
                <!-- (D) 등록된 text_banner가 없을 때 노출합니다. -->
                <p v-if="!banner.text1 && !banner.text2 && !banner.text3 && !banner.text4" class="text_alt">
                    {{ banner.alt }}
                </p>
            </figcaption>
        </figure>
    </MMLink>
</template>

<script setup lang="ts">
import { Banner } from '$/@type/block/item'
import { computed, toRefs } from 'vue'
import MMLink from '@/components/MMLink.vue'

const props = defineProps<{
    banner: Banner
    bannerImageClass?: string
    useLinkIcon?: boolean
    showDisplayPeriod?: boolean
    showCreatedAt?: boolean
    dateFormat?: string
    dateTextPosition?: number
}>()

const { banner, bannerImageClass, showDisplayPeriod, showCreatedAt, dateFormat } = toRefs(props)
const dateFormatString = computed<string>(() => {
    return dateFormat?.value || 'YYYY.MM.DD'
})
</script>
