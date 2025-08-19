<template>
    <div class="m_spot">
        <template v-for="template in templateList" :key="template.id">
            <!-- 스팟성테마관 A타입 -->
            <div v-if="template.type === 'A'" class="m_spot-item T=a">
                <MMLink :to="template.url || ''">
                    <figure>
                        <i v-lazyload="{ src: template.bannerImageUrl }" class="mm_bg-cover image_banner" />
                        <figcaption v-if="template.mainText1 || template.mainText2 || template.subText1 || template.subText2">
                            <p class="text_main">
                                {{ template.mainText1 }}
                            </p>
                            <p class="text_main">
                                {{ template.mainText2 }}
                            </p>
                            <p class="text_sub">
                                {{ template.subText1 }}
                            </p>
                            <p class="text_sub">
                                {{ template.subText2 }}
                            </p>
                        </figcaption>
                        <!-- (D) 문구를 등록하지 않았을 경우 노출하는 구조입니다 -->
                        <b v-else class="mm_ir-blind">
                            {{ template.bannerImageAlt }}
                        </b>
                    </figure>
                    <i v-if="template.mainText1 || template.mainText2 || template.subText1 || template.subText2" class="ico_arrow" />
                </MMLink>
            </div>
            <!--// 스팟성테마관 A타입 -->

            <!-- 스팟성테마관 B타입 -->
            <div v-if="template.type === 'B'" class="m_spot-item">
                <MMLink :to="template.url || ''">
                    <figure>
                        <i v-lazyload="{ src: template.bannerImageUrl }" class="mm_bg-cover image_banner" />
                        <figcaption v-if="template.mainText1 || template.mainText2 || template.subText1 || template.subText2">
                            <p class="text_main">
                                {{ template.mainText1 }}
                            </p>
                            <p class="text_main">
                                {{ template.mainText2 }}
                            </p>
                            <p class="text_sub">
                                {{ template.subText1 }}
                            </p>
                            <p class="text_sub">
                                {{ template.subText2 }}
                            </p>
                        </figcaption>
                        <!-- (D) 문구를 등록하지 않았을 경우 노출하는 구조입니다 -->
                        <b v-else class="mm_ir-blind">
                            {{ template.bannerImageAlt }}
                        </b>
                    </figure>
                    <i v-if="template.mainText1 || template.mainText2 || template.subText1 || template.subText2" class="ico_arrow" />
                </MMLink>

                <!-- 상품리스트 -->
                <div v-if="template.goodsList.length > 0" class="mm_product-list">
                    <ul>
                        <li v-for="goods in template.goodsList" :key="goods.id">
                            <MmGoods :goods="goods" :use-liked-button="true" :use-react-tag="true" />
                        </li>
                    </ul>
                </div>
            <!--// 상품리스트 -->
            </div>
            <!--// 스팟성테마관 B타입 -->

            <!-- 스팟성테마관 C타입 -->
            <div v-if="template.type === 'C'" class="m_spot-item">
                <MMLink :to="template.url || ''">
                    <figure>
                        <i v-lazyload="{ src: template.bannerImageUrl }" class="mm_bg-cover image_banner" />
                        <figcaption v-if="template.mainText1 || template.mainText2 || template.subText1 || template.subText2">
                            <p class="text_main">
                                {{ template.mainText1 }}
                            </p>
                            <p class="text_main">
                                {{ template.mainText2 }}
                            </p>
                            <p class="text_sub">
                                {{ template.subText1 }}
                            </p>
                            <p class="text_sub">
                                {{ template.subText2 }}
                            </p>
                        </figcaption>
                        <!-- (D) 문구를 등록하지 않았을 경우 노출하는 구조입니다 -->
                        <b v-else class="mm_ir-blind">
                            {{ template.bannerImageAlt }}
                        </b>
                    </figure>
                    <i v-if="template.mainText1 || template.mainText2 || template.subText1 || template.subText2" class="ico_arrow" />
                </MMLink>

                <!-- 상품리스트 -->
                <div v-if="template.goodsList.length > 0" class="mm_scroller T=x">
                    <div class="mm_product-list T=card">
                        <ul>
                            <li v-for="goods in template.goodsList" :key="goods.id">
                                <MmGoods :goods="goods" :use-liked-button="true" :is-show-sell-rate="false" :is-show-price="false" />
                            </li>
                        </ul>
                    </div>
                </div>
            <!--// 상품리스트 -->
            </div>
        <!--// 스팟성테마관 C타입 -->
        </template>
    </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, watch, computed } from 'vue';
import { spotThemeRepository } from '$/repository/spotThemeRepository';
import { defaultCatch } from '$/functions';
import { Template } from '$/@type/spotTheme';
import { usePageContext } from '$/composables/pageHandler/contextComposable';

const {
    route,
    mmon,
    router,
    usePageTitleSetting 
} = usePageContext();
const spotThemeId = computed(() => {
    return Number(`${route.params.id}`)
})
const templateList = ref<Template[]>([])
usePageTitleSetting('스팟성 테마관')

watch(spotThemeId, async() => {
    try {
        if (!isNaN(spotThemeId.value)) {
            templateList.value = await spotThemeRepository.getSpotTheme(spotThemeId.value)
        }
    } catch(e) {
        defaultCatch(e)
    }
}, {
    flush: 'post'
})

onBeforeMount(async() => {
    try {
        templateList.value = await spotThemeRepository.getSpotTheme(spotThemeId.value)
    } catch(e) {
        defaultCatch(e, 
            {
                404: () => {
                    mmon.bom.alert('존재하지 않는 스팟성 테마관 입니다.\n 메인 페이지로 이동 됩니다.', () => {
                        router.replace({ 
                            name: 'Main'
                        })
                    })
                }
            }, 
            () => {
                router.replace({ 
                    name: 'Main'
                })
            }
        )
    }
})

</script>
