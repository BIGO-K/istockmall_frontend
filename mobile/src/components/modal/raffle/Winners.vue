<template>
    <ModalPopup>
        <template #headerTitle>
            <h1><b>래플</b></h1>
        </template>

        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="m_popup-raffle-winner">
                            <ul>
                                <li v-for="winner in winners" :key="winner.loginId">
                                    <b>{{ winner.name }}</b><b>{{ winner.loginId }}</b>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <!--// 본문 -->
                </div>
            </div>
        </template>
    </ModalPopup>
</template>

<script setup lang="ts">
import { RaffleWinner } from '$/@type/raffle';
import { ref, onMounted } from 'vue';
import { raffleRepository } from '$/repository/raffleRepository';
import { defaultCatch, historyBack } from '$/functions';
import { useRaffleModal } from '$/composables/raffleComposable';
import { useRouter } from 'vue-router';
import { mmon } from '$/helper/mmon';
import ModalPopup from '@/components/layout/ModalPopup.vue';

/** VARIABLE */
const { raffleId } = useRaffleModal();
const winners = ref<RaffleWinner[]>([]);
const router = useRouter();
/** //VARIABLE */

/** FUNCTION */
onMounted(async () => {
    try {
        mmon.loading.show();
        if (raffleId.value === null) {
            return historyBack(router);
        }
        winners.value = await raffleRepository.getWinners(raffleId.value);
    } catch (error) {
        defaultCatch(error, undefined, () => {
            return historyBack(router);
        });
    } finally {
        mmon.loading.hide();
    }
});
/** // FUNCTION */

</script>

