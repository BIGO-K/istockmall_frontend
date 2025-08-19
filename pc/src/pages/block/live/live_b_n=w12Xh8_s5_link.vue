<template>
    <MMBlock
        :block-name="'live_b_n=w12Xh8_s5_link'"
        :required="{
            requiredValueList: [block.liveCommercePartition?.liveCommerceList, block.title1, block.title2]
        }"
    >
        <MMTitle 
            :title1="block.title1"
            :title2="block.title2"
            :design-class-name="block.designTitleClassName"
            :position="'center'"
        />
        <ul>
            <li 
                v-for="liveCommerce in block.liveCommercePartition?.liveCommerceList"
                :key="liveCommerce.broadcastId"
            >
                <template v-if="liveCommerce.isOnAir">
                    <a href="#" @click.prevent="openLiveCommerceDetail(liveCommerce.broadcastName, liveCommerce.broadcastId)">
                        <!--
                            (D) 방송 중일 때 노출되는 형식입니다.
                                라이브 중인 영상을 video 태그로 추가해주시고, 영상이 로드 됐을 때 'S=loaded' 클래스를 추가해줍니다.
                        -->
                        <figure>
                            <div>
                                <i v-lazyload="{ src: liveCommerce.mainThumbnail }" class="mm_bg-cover image_banner" />
                                <LiveVideoPreview 
                                    :preview-url="liveCommerce.previewUrl"
                                /> 
                                <b class="text_tag T=live">ON AIR</b>
                            </div>
                            <figcaption>
                                <p class="text_state">현재 방송중</p>
                                <p class="text_banner1">{{ liveCommerce.broadcastName }}</p>
                            </figcaption>
                        </figure>
                    </a>
                </template>
                <template v-else>
                    <a href="#" @click.prevent="openLiveCommerceDetail(liveCommerce.broadcastName, liveCommerce.broadcastId)">
                        <!--
                            (D) 방송 중일 때 노출되는 형식입니다.
                                라이브 중인 영상을 video 태그로 추가해주시고, 영상이 로드 됐을 때 'S=loaded' 클래스를 추가해줍니다.
                        -->
                        <figure>
                            <div>
                                <i v-lazyload="{ src: liveCommerce.mainThumbnail }" class="mm_bg-cover image_banner" />
                                <b class="text_tag T=standby">방송예정</b>
                                <p class="text_open">
                                    <strong>
                                        {{ formatDate(liveCommerce.programmingStartAt , 'MM월 DD일') }}
                                        <span>{{ formatDate(liveCommerce.programmingStartAt , 'HH:mm') }}</span>
                                    </strong>
                                </p>
                            </div>
                            <figcaption>
                                <p class="text_state">{{ formatDate(liveCommerce.programmingStartAt , 'MM월 DD일 A HH시', true) }}</p>
                                <p class="text_banner1">{{ liveCommerce.broadcastName }}</p>
                            </figcaption>
                        </figure>
                    </a>
                </template>
            </li>
        </ul>
        <MMBlockLink :link="block.link || ''" :label="'전체보기'" />
    </MMBlock>
</template>
<script setup lang="ts">
import { Block } from "$/@type/block"
import MMBlock from '@/components/block/Block.vue'
import MMTitle from '@/components/block/Title.vue'
import MMBlockLink from '@/components/block/Link.vue'
import LiveVideoPreview from '@/pages/live/LiveVideoPreview.vue';
import LiveCommerceDetail from '@/pages/live/Detail.vue'
import { toRefs, ref, onBeforeMount } from 'vue';
import { formatDate } from '$/filters';
import { userRepository } from '$/repository/auth/userRepository';
import { defaultCatch } from "$/functions";
import { useModal } from "$/composables/pageHandler/modalComposable";
import { usePageContext } from '$/composables/pageHandler/contextComposable';

const props = defineProps<{
    block: Block
}>();
const { block } = toRefs(props);
const modalLiveUrl = ref<string>('');
const { isUser } = usePageContext()
const liveCommerceUserAccessToken = ref<string>('');

async function openLiveCommerceDetail(broadCastName: string, roomId: string) {
    modalLiveUrl.value = `https://player.sauceflex.com/broadcast/${roomId}`;

    if (isUser.value && liveCommerceUserAccessToken.value !== '') {
        modalLiveUrl.value = modalLiveUrl.value  + `?accessToken=${liveCommerceUserAccessToken.value}`
    }
    useModal().open(LiveCommerceDetail, {
        title: broadCastName,
        name: 'LiveCommerceDetail',
        itemClass: 'm_modal-live',
        props: {
            roomUrl: modalLiveUrl.value
        }
    })   
}


onBeforeMount(async() => {
    try {
        if (isUser.value) {
            liveCommerceUserAccessToken.value = await userRepository.generateLiveCommerceToken();
        }
    } catch(e) {
        defaultCatch(e);
    }
})
</script>
<style>
@import '@publish/css/block/specific/live_b_n=w12Xh8_s5_link.css';
</style>