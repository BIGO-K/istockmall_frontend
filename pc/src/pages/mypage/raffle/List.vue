<template>
    <div class="mm_page-content-body">
        <div class="m_my-raffle">
            <h5 class="mm_heading">
                <b>래플 응모 내역</b>
            </h5>
            <!-- 진행중인 래플 응모 내역 -->
            <section class="m_my-raffle-on">
                <h6 class="mm_strapline T=line">
                    <b>진행중인 래플 응모 내역</b>
                </h6>
                <p
                    v-if="ongoingList.length < 1"
                    class="mm_text-none"
                >
                    <i class="ico_text-none" />응모 내역이 없습니다
                </p>
                <ul v-else>
                    <li
                        v-for="ongoing in ongoingList"
                        :key="ongoing.id"
                    >
                        <div class="mm_product-item T=single">
                            <MMLink :to="{ name: 'RaffleDetail', params: { id: ongoing.id } }">
                                <figure>
                                    <div class="mm_image-scale">
                                        <i v-lazyload="{ src: ongoing.goods.thumbnailUrl }" class="mm_bg-cover image_product" />
                                    </div>
                                    <figcaption>
                                        <b
                                            v-if="new Date(ongoing.announceAt) <= nowDate 
                                                && new Date(ongoing.buyStartAt) <= nowDate
                                                && ongoing.progressStatus === ''"
                                            class="mm_tag T=bg T=gray"
                                        >미당첨</b>
                                        <b v-else :class="['mm_tag', ongoing.progressStatus === '응모 마감' ? 'T=gray' : 'T=support']">
                                            {{ ongoing.progressStatus }}
                                        </b>
                                        <p class="text_brand">
                                            {{ ongoing.goods.brandName }}
                                        </p>
                                        <p class="text_product">
                                            {{ ongoing.goods.name }}
                                        </p>
                                    </figcaption>
                                </figure>
                            </MMLink>
                        </div>
                        <b
                            v-if="ongoing.progressStatus === '진행중' || ongoing.progressStatus === '응모 마감'"
                            class="mm_btn T=sm T=line T=dark"
                        >
                            {{ MMFilters.formatDate(ongoing.announceAt, 'MM.DD (ddd) HH:mm', true) }} 당첨자 발표 예정
                        </b>
                        <a
                            v-else 
                            class="mm_btn T=sm T=primary"
                            href="#"
                            @click.prevent="winningResultModalOpen(ongoing)"
                        >
                            <b v-if="ongoing.progressStatus === '추첨중'">당첨자 추첨 진행 중</b>
                            <b v-else>당첨 결과 확인하기</b>
                        </a>
                    </li>
                </ul>
            </section>
            <!--// 진행중인 래플 응모 내역 -->

            <!-- 종료된 래플 응모 내역 -->
            <section class="m_my-raffle-off">
                <h6 class="mm_strapline T=line">
                    <b>종료된 래플 응모 내역</b><small>최근 6개월 기준</small>
                </h6>
                <p
                    v-if="endedList.length < 1"
                    class="mm_text-none"
                >
                    <i class="ico_text-none" />응모 내역이 없습니다
                </p>
                <ul v-else>
                    <li
                        v-for="ended in endedList"
                        :key="ended.id"
                    >
                        <div class="mm_product-item T=single">
                            <figure>
                                <div class="mm_image-scale">
                                    <i
                                        v-lazyload="{ src: ended.goods.thumbnailUrl }"
                                        class="mm_bg-cover image_product"
                                    />
                                </div>
                                <figcaption>
                                    <div class="mm_tag-list">
                                        <b :class="['mm_tag T=bg', ended.isWinner ? 'T=support' : 'T=gray']">{{ ended.isWinner ? '당첨' : '미당첨' }}</b>
                                        <b
                                            v-if="ended.isWinner"
                                            :class="['mm_tag', ended.isPurchase ? 'T=support' : '']"
                                        >{{ ended.isPurchase ? '구매' : '미구매' }}</b>
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
            </section>
            <!--// 종료된 래플 응모 내역 -->
        </div>
    </div>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { raffleEntryRepository } from '$/repository/raffleEntryRepository';
import { RaffleEntry } from '$/@type/raffleEntry';
import { mmon } from '$/helper/mmon';
import { usePageTitleSetting } from '$/composables/seoComposable';
import EntryResult from '@/pages/mypage/raffle/EntryResult.vue';
import { useModal } from '$/composables/pageHandler/modalComposable';

usePageTitleSetting('래플 응모 내역', ['마이페이지']);

/** VARIABLE */
const ongoingList = ref<RaffleEntry[]>([]);  // 진행 중인 래플 리스트
const endedList = ref<RaffleEntry[]>([]);    // 종료된 래플 리스트
const nowDate = new Date();      

/** FUNCTION */
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

async function winningResultModalOpen(raffle: RaffleEntry) {
    useModal().open(EntryResult, {
        title: '당첨 결과 확인',
        name: 'WinningResult',
        props: {         
            raffle: raffle              
        },
    });
}

/** VUE LIFE CYCLE */
onMounted(async() => {
    fetch();
});
</script>
