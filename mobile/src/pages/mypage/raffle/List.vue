<template>
    <MMSub>
        <template #headerTitle>
            <h1><b>래플 응모 내역</b></h1>
        </template>

        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="m_myraffle">
                            <!-- 진행중인 응모 내역 -->
                            <section class="m_myraffle-on">
                                <h3><b>진행중인 응모 내역</b></h3>

                                <template v-if="ongoingList.length < 1">
                                    <p class="mm_text-none">
                                        <i class="ico_text-none" />응모 내역이 없습니다
                                    </p>
                                    <div class="mm_btn_box">
                                        <div class="mm_inline">
                                            <MMLink :to="{ name: 'Raffle' }" class="mm_btn T=primary">
                                                <b>래플 메인 바로가기</b>
                                            </MMLink>
                                        </div>
                                    </div>
                                </template>

                                <div v-else class="mm_product-list T=sm">
                                    <ul>
                                        <li v-for="ongoing in ongoingList" :key="ongoing.id">
                                            <div class="mm_product-item">
                                                <MMLink :to="{ name: 'RaffleDetail', params: { id: ongoing.id } }">
                                                    <figure>
                                                        <i v-lazyload="{ src: ongoing.goods.thumbnailUrl }" class="mm_bg-cover image_product" />
                                                        <figcaption>
                                                            <div class="mm_tag-list">
                                                                <b
                                                                    v-if="new Date(ongoing.announceAt) <= nowDate 
                                                                        && new Date(ongoing.buyStartAt) <= nowDate
                                                                        && ongoing.progressStatus === ''"
                                                                    class="mm_tag T=bg T=gray"
                                                                >미당첨</b>
                                                                <b v-else :class="['mm_tag', ongoing.progressStatus === '응모 마감' ? 'T=gray' : 'T=support']">
                                                                    {{ ongoing.progressStatus }}
                                                                </b>
                                                            </div>
                                                            <p class="text_brand">
                                                                {{ ongoing.goods.brandName }}
                                                            </p>
                                                            <p class="text_product">
                                                                {{ ongoing.goods.name }}
                                                            </p>
                                                        </figcaption>
                                                    </figure>
                                                </MMLink>
                                                <div class="mm_btn_box">
                                                    <AnnouncementButton :raffle="ongoing" />
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </section>
                            <!--// 진행중인 응모 내역 -->
                            <hr class="mm_line">
                            <!-- 종료된 응모 내역 -->
                            <section class="m_myraffle-off">
                                <h3><b>종료된 응모 내역</b><small>(최근 6개월)</small></h3>
                                <p v-if="endedList.length < 1" class="mm_text-none">
                                    <i class="ico_text-none" />응모 내역이 없습니다
                                </p>
                                <div v-else class="mm_product-list T=sm">
                                    <ul>
                                        <li v-for="ended in endedList" :key="ended.id">
                                            <div class="mm_product-item">
                                                <figure>
                                                    <i v-lazyload="{ src: ended.goods.thumbnailUrl }" class="mm_bg-cover image_product" />
                                                    <figcaption>
                                                        <div class="mm_tag-list">
                                                            <b :class="['mm_tag T=bg', ended.isWinner ? 'T=support' : 'T=gray']">{{ ended.isWinner ? '당첨' : '미당첨' }}</b>
                                                            <b v-if="ended.isWinner" :class="['mm_tag', ended.isPurchase ? 'T=full T=support' : '']">{{ ended.isPurchase ? '구매 완료' : '미구매' }}</b>
                                                        </div>
                                                        <p class="text_brand">
                                                            {{ ended.goods.brandName }}
                                                        </p>
                                                        <p class="text_product">
                                                            {{ ended.goods.name }}
                                                        </p>
                                                    </figcaption>
                                                </figure>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </section>
                            <!--// 종료된 응모 내역 -->
                            <hr class="mm_line">
                        </div>
                    </div>
                    <!--// 본문 -->

                    <!-- 푸터 -->
                    <MMFooter />
                    <!--// 푸터 -->
                </div>
            </div>

            <a class="btn_topmost" href="#mm_app" data-href="{ '_type': 'anchor' }" title="페이지 처음으로"><i class="ico_topmost" /><b>TOP</b></a>
        </template>
    </MMSub>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { raffleEntryRepository } from '$/repository/raffleEntryRepository';
import { RaffleEntry } from '$/@type/raffleEntry';
import { mmon } from '$/helper/mmon';
import AnnouncementButton from '@/pages/mypage/raffle/AnnouncementButton.vue'
import MMLink from '@/components/MMLink.vue';
import MMFooter from '@/components/Footer.vue';
import MMSub from '@/components/layout/Sub.vue';
import { usePageTitleSetting } from '$/composables/seoComposable';

usePageTitleSetting('래플 응모 내역', ['마이페이지']);
const ongoingList = ref<RaffleEntry[]>([]);  // 진행 중인 래플 리스트
const endedList = ref<RaffleEntry[]>([]);    // 종료된 래플 리스트

const nowDate = new Date();

onMounted(async() => {
    fetch();
});

async function fetch() {
    mmon.loading.show();                
    try {
        const [ongoing, ended] = await Promise.all([
            raffleEntryRepository.getRaffleEntryList(0),
            raffleEntryRepository.getRaffleEntryList(1)
        ]);

        ongoingList.value = ongoing;
        endedList.value = ended;                    
    } catch (e) {
        console.log(e);
    } finally {
        mmon.loading.hide();
    }
}
</script>