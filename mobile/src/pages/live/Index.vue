<template>
    <div class="m_live">
        <h2><b>쇼핑 LIVE</b></h2>
        <!-- 방송중 -->
        <!-- (D) 라이브 중인 영상을 video 태그로 추가해주시고, 영상이 로드 됐을 때 'S=loaded' 클래스를 추가해줍니다. -->
        <div v-if="liveVideos.totalCount > 0" class="mm_scroller T=x">
            <ul>
                <li
                    v-for="liveVod in liveVideos.items" 
                    :key="liveVod.broadcast.id"
                >
                    <MMLink :to="{ name: 'LiveCommerceShowRoom', params: { roomId: liveVod.broadcast.id }}">
                        <figure>
                            <div class="m_live-visual">
                                <i v-lazyload="{ src: liveVod.mainThumbNail }" class="mm_bg-cover image_banner" />
                                <live-video-preview
                                    :preview-url="liveVod.broadcast.previewUrl || ''"
                                />
                                <b class="text_tag">ON AIR</b>
                            </div>
                            <figcaption>
                                <p class="text_state">
                                    현재 방송중
                                </p>
                                <p class="text_title">
                                    {{ liveVod.broadcast.name }}
                                </p>
                            </figcaption>
                        </figure>
                    </MMLink>
                </li>
            </ul>
        </div>
        <p v-else class="mm_text-none">
            <i class="ico_text-none" />진행중인 라이브가 없습니다
        </p>
        <!-- 방송중 -->

        <!-- 방송예정 -->
        <section>
            <h4 class="mm_title">
                <b>방송 예정 LIVE</b>
            </h4>
            <div class="mm_scroller T=x">
                <ul v-if="scheduleVideos.totalCount > 0">
                    <li
                        v-for="scheduleVideo in scheduleVideos.items" 
                        :key="scheduleVideo.broadcast.id"
                    >
                        <MMLink :to="{ name: 'LiveCommerceShowRoom', params: { roomId: scheduleVideo.broadcast.id }}">
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
                                    <b class="text_tag">방송예정</b>
                                    <p class="text_state">
                                        {{ formatDate(scheduleVideo.broadcast.programmingStartAt , 'MM월 DD일 A HH시', true) }}
                                    </p>
                                    <p class="text_title">
                                        {{ scheduleVideo.broadcast.name }}
                                    </p>
                                </figcaption>
                            </figure>
                        </MMLink>
                    </li>
                </ul>
                <p v-else class="mm_text-none">
                    <i class="ico_text-none" />방송 예정인 라이브가 없습니다
                </p>
            </div>
        </section>
        <!--// 방송예정 -->

        <!-- 방송종료 -->
        <section>
            <h4 class="mm_title">
                <b>LIVE 모아보기</b>
            </h4>
            <ul v-if="videos.totalCount > 0">
                <li
                    v-for="video in videos.items" 
                    :key="video.broadcast.id"
                >
                    <MMLink :to="{ name: 'LiveCommerceShowRoom', params: { roomId: video.broadcast.id }}">
                        <figure>
                            <div class="m_live-visual">
                                <i v-lazyload="{ src: video.mainThumbNail }" class="mm_bg-cover image_banner" />
                                <b class="text_tag"><i class="ico_like" />{{ video.room?.reactionCounter }}</b>
                                <p class="text_play">
                                    {{ video.broadcast.totalDuration }}
                                </p>
                            </div>
                            <figcaption>
                                <p class="text_title">
                                    {{ video.broadcast.name }}
                                </p>
                            </figcaption>
                        </figure>
                    </MMLink>
                </li>               
            </ul>
            <p v-else class="mm_text-none">
                <i class="ico_text-none" />종료된 라이브가 없습니다
            </p>
        </section>
        <!--// 방송종료 -->
    </div>
</template>
<script setup lang='ts'>
import LiveVideoPreview from '@/pages/live/LiveVideoPreview.vue';
import { BroadCast, BroadCastType } from '$/@type/liveCommerce';
import { onBeforeMount, ref } from 'vue';
import { liveCommerceRepository } from '$/repository/goods/liveCommerceRepository';
import { defaultCatch } from '$/functions';
import { formatDate } from '$/filters';

/** VARIABLE */
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


/** FUNCTION */

/** VUE LIFE CYCLE */
onBeforeMount(async() => {

    try {
        const [ live, schedule, video] = await Promise.all([
            liveCommerceRepository.getBroadCastsByType(100, BroadCastType.LIVE),
            liveCommerceRepository.getScheduleBroadCasts(8),
            liveCommerceRepository.getBroadCastsByType(100, BroadCastType.CATCHUP),
        ])
        // liveVideos.value = live;
        liveVideos.value = video;
        scheduleVideos.value = schedule;
        videos.value = video;
    } catch(e) {
        console.log(e);
        defaultCatch(e);
    }

});
</script>