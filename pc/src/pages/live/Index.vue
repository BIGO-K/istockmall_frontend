<template>
    <div class="mm_page-content">
        <div class="mm_inner">
            <div class="m_live">
                <h3 class="mm_title">
                    <b>쇼핑 LIVE</b>
                </h3>
                <!-- 방송중 -->
                <template v-if="isLoading">
                    <ul class="T=skeleton">
                        <li>
                            <i class="image_banner" />
                            <p class="text_state" />
                            <p class="text_title" />
                        </li>
                        <li>
                            <i class="image_banner" />
                            <p class="text_state" />
                            <p class="text_title" />
                        </li>
                        <li>
                            <i class="image_banner" />
                            <p class="text_state" />
                            <p class="text_title" />
                        </li>
                        <li>
                            <i class="image_banner" />
                            <p class="text_state" />
                            <p class="text_title" />
                        </li>
                    </ul>
                </template>
                <template v-if="videos.totalCount > 0">
                    <!-- (D) 라이브 중인 영상을 video 태그로 추가해주시고, 영상이 로드 됐을 때 'S=loaded' 클래스를 추가해줍니다. -->
                    <ul>
                        <li
                            v-for="liveVideo in liveVideos.items"
                            :key="liveVideo.broadcast.id"
                        >
                            <a href="#" @click.prevent="openLiveCommerceDetail(liveVideo.broadcast.name, liveVideo.broadcast.id)">
                                <figure>
                                    <div class="m_live-visual">
                                        <i v-lazyload="{ src: liveVideo.mainThumbNail }" class="mm_bg-cover image_banner" />
                                        <live-video-preview
                                            :preview-url="liveVideo.broadcast.previewUrl || ''"
                                        />
                                        <b class="text_tag">ON AIR</b>
                                    </div>
                                    <figcaption>
                                        <p class="text_state">현재 방송중</p>
                                        <p class="text_title">{{ liveVideo.broadcast.name }}</p>
                                    </figcaption>
                                </figure>
                            </a>
                        </li>
                    </ul>

                    <MMPaginator
                        :page-block-type="'group'"
                        :page-block-count="10"
                        :current-page="liveVideos.currentPage"
                        :items-per-page="8"
                        :total-count="liveVideos.totalCount"
                        @move-page-to="moveLivePage"
                    />
                </template>
                <template v-else>
                    <p class="mm_text-none">
                        <i class="ico_text-none" />진행중인 라이브가 없습니다
                    </p>
                </template>
                <!--// 방송중 -->

                <!-- 방송예정 -->
                <section>
                    <h5><b>방송 예정 LIVE</b></h5>
                    <template v-if="isLoading">
                        <ul class="T=skeleton">
                            <li>
                                <i class="image_banner" />
                                <p class="text_state" />
                                <p class="text_title" />
                            </li>
                            <li>
                                <i class="image_banner" />
                                <p class="text_state" />
                                <p class="text_title" />
                            </li>
                            <li>
                                <i class="image_banner" />
                                <p class="text_state" />
                                <p class="text_title" />
                            </li>
                            <li>
                                <i class="image_banner" />
                                <p class="text_state" />
                                <p class="text_title" />
                            </li>
                        </ul>
                    </template>
                    <template v-if="scheduleVideos.totalCount > 0">
                        <ul>
                            <li
                                v-for="scheduleVideo in scheduleVideos.items" 
                                :key="scheduleVideo.broadcast.id"
                            >
                                <a href="#" @click.prevent="openLiveCommerceDetail(scheduleVideo.broadcast.name, scheduleVideo.broadcast.id)">
                                    <figure>
                                        <div class="m_live-visual">
                                            <i v-lazyload="{ src: scheduleVideo.mainThumbNail }" class="mm_bg-cover image_banner" />
                                            <p class="text_open">
                                                <strong>
                                                    {{ formatDate(scheduleVideo.broadcast.programmingStartAt , 'MM월 DD일') }}
                                                    <span>{{ formatDate(scheduleVideo.broadcast.programmingStartAt , 'HH') }}</span>
                                                </strong>
                                            </p>
                                        </div>
                                        <figcaption>
                                            <p class="text_state">{{ formatDate(scheduleVideo.broadcast.programmingStartAt , 'MM월 DD일 A HH시', true) }}</p>
                                            <p class="text_title">{{ scheduleVideo.broadcast.name }}</p>
                                        </figcaption>
                                    </figure>
                                </a>
                            </li>
                        </ul>
                        <MMPaginator
                            :page-block-type="'group'"
                            :page-block-count="10"
                            :current-page="scheduleVideos.currentPage"
                            :items-per-page="8"
                            :total-count="scheduleVideos.totalCount"
                            @move-page-to="moveSchedulePage"
                        />
                        <!--// 페이지네이션 -->
                    </template>
                    <template v-else>
                        <p class="mm_text-none">
                            <i class="ico_text-none" />방송 예정인 라이브가 없습니다
                        </p>
                    </template>
                </section>
                <!--// 방송예정 -->

                <!-- 방송종료 -->
                <section>
                    <h5><b>LIVE 모아보기</b></h5>
                    <template v-if="isLoading">
                        <ul class="T=skeleton">
                            <li>
                                <i class="image_banner" />
                                <p class="text_state" />
                                <p class="text_title" />
                            </li>
                            <li>
                                <i class="image_banner" />
                                <p class="text_state" />
                                <p class="text_title" />
                            </li>
                            <li>
                                <i class="image_banner" />
                                <p class="text_state" />
                                <p class="text_title" />
                            </li>
                            <li>
                                <i class="image_banner" />
                                <p class="text_state" />
                                <p class="text_title" />
                            </li>
                        </ul>
                    </template>
                    <template v-if="videos.totalCount > 0">
                        <ul>
                            <li
                                v-for="video in videos.items"
                                :key="video.broadcast.id"
                            >
                                <a href="#" @click.prevent="openLiveCommerceDetail(video.broadcast.name, video.broadcast.id)">
                                    <figure>
                                        <div class="m_live-visual">
                                            <i v-lazyload="{ src: video.mainThumbNail }" class="mm_bg-cover image_banner" />
                                            <b class="text_tag"><i class="ico_like" />{{ video.room?.reactionCounter }}</b>
                                            <p class="text_play">{{ video.broadcast.totalDuration }}</p>
                                        </div>
                                        <figcaption>
                                            <p class="text_title">{{ video.broadcast.name }}</p>
                                        </figcaption>
                                    </figure>
                                </a>
                            </li>
                        </ul>
                        <!-- (D) 리스트가 100개 이상 넘어갈 경우 페이지네이션이 노출됩니다. -->
                        <!-- 페이지네이션 -->
                        <!-- (D) 현재 페이지의 메뉴에 'S=page-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
                        <MMPaginator
                            :page-block-type="'group'"
                            :page-block-count="10"
                            :current-page="videos.currentPage"
                            :items-per-page="8"
                            :total-count="videos.totalCount"
                            @move-page-to="movePage"
                        />
                    </template>
                    <template v-else>
                        <p class="mm_text-none">
                            <i class="ico_text-none" />종료된 라이브가 없습니다
                        </p>
                    </template>
                </section>
                <!--// 방송종료 -->
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import MMPaginator from '@/components/Paginator.vue'
import LiveCommerceDetail from '@/pages/live/Detail.vue'
import LiveVideoPreview from '@/pages/live/LiveVideoPreview.vue';
import { BroadCast, BroadCastType } from '$/@type/liveCommerce';
import { defaultCatch } from '$/functions';
import { liveCommerceRepository } from '$/repository/goods/liveCommerceRepository';
import { ref, onBeforeMount } from 'vue';
import { userRepository } from '$/repository/auth/userRepository';
import { formatDate } from '$/filters';
import { useModal } from '$/composables/pageHandler/modalComposable';
import { usePageContext } from '$/composables/pageHandler/contextComposable';

/** VARIABLE */
const {
    isUser
} = usePageContext();

const modalLiveUrl = ref<string>('');
const liveVideos = ref<BroadCast>({
    currentPage: 1,
    totalCount: 0,
    nextPage: null,
    itemsCount: 0,
    items: []
});

const scheduleVideos = ref<BroadCast>({
    currentPage: 1,
    totalCount: 0,
    nextPage: null,
    itemsCount: 0,
    items: []
});

const videos = ref<BroadCast>({
    currentPage: 1,
    totalCount: 0,
    nextPage: null,
    itemsCount: 0,
    items: []
});

const isLoading = ref<boolean>(true);
const limitPerPage = 8;
const liveCommerceUserAccessToken = ref<string>('');

/** FUNCTION */
async function moveLivePage(page: number) {
    liveVideos.value = await liveCommerceRepository.getBroadCastsByType(
        limitPerPage, 
        BroadCastType.LIVE, 
        page
    );

}

async function moveSchedulePage(page: number) {
    scheduleVideos.value = await liveCommerceRepository.getScheduleBroadCasts(
        limitPerPage,
        page
    )
}

async function movePage(page: number) {
    videos.value = await liveCommerceRepository.getBroadCastsByType(
        limitPerPage,
        BroadCastType.CATCHUP,
        page
    )
}

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

/** VUE LIFE CYCLE */
onBeforeMount(async() => {
    try {
        const [ live, schedule, video] = await Promise.all([
            liveCommerceRepository.getBroadCastsByType(limitPerPage, BroadCastType.LIVE),
            liveCommerceRepository.getScheduleBroadCasts(limitPerPage),
            liveCommerceRepository.getBroadCastsByType(limitPerPage, BroadCastType.CATCHUP)
        ])        
        
        // liveVideos.value =  live;
        liveVideos.value = video;
        scheduleVideos.value = schedule;
        videos.value = video;
        isLoading.value = false;
        if (isUser.value) {
            liveCommerceUserAccessToken.value = await userRepository.generateLiveCommerceToken();
        }
    } catch(e) {
        console.log(e);
        defaultCatch(e);
    }
});
</script>