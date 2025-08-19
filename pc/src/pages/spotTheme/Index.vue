<template>
    <div class="mm_page-content">
        <div class="mm_inner">
            <div class="m_spot">
                <template v-for="template in templateList" :key="template.id">
                    <!-- 스팟성테마관 A타입 -->
                    <div v-if="template.type === 'A'" class="m_spot-item">
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
                        </MMLink>

                        <!-- 상품리스트 -->
                        <div v-if="template.goodsList.length > 0" class="mm_product-list">
                            <ul>
                                <li
                                    v-for="goods in template.goodsList"
                                    :key="goods.id"
                                >
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
                        </MMLink>

                        <!-- 상품리스트 -->
                        <div v-if="template.goodsList.length > 0" class="mm_product-list">
                            <Slider :items="template.goodsList" :use-control="true">
                                <template #item="{ item }">
                                    <MmGoods :goods="item" :use-liked-button="true" :use-react-tag="true" />
                                </template>
                            </Slider>
                        </div>
                        <!--// 상품리스트 -->
                    </div>
                    <!--// 스팟성테마관 C타입 -->
                </template>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, onBeforeMount } from 'vue';
import Slider from '@/components/Slider.vue';
import { Template } from '$/@type/spotTheme';
import { spotThemeRepository } from '$/repository/spotThemeRepository';
import { defaultCatch } from '$/functions';
import { usePageContext } from '$/composables/pageHandler/contextComposable';
const {
    route,
    mmon,
    router,
    usePageTitleSetting 
} = usePageContext();
usePageTitleSetting('스팟성 테마관')

const templateList = ref<Template[]>([])
onBeforeMount(async() => {
    try {
        templateList.value = await spotThemeRepository.getSpotTheme(Number(`${route.params.id}`))
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