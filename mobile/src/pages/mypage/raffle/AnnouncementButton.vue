<template>
    <b v-if="raffle.progressStatus === '진행중' || raffle.progressStatus === '응모 마감'" class="mm_btn T=line">
        {{ MMFilters.formatDate(raffle.announceAt, 'MM.DD (ddd) HH:mm', true) }} 당첨자 발표 예정
    </b>
    <a
        v-else 
        class="mm_btn T=primary"
        href="#"
        @click.prevent="winningResultModalOpen()"
    >
        <b v-if="raffle.progressStatus === '추첨중'">당첨자 추첨 진행 중</b>
        <b v-else>당첨 결과 확인하기</b>
    </a>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import { RaffleEntry } from '$/@type/raffleEntry';
import Result from '@/pages/mypage/raffle/Result.vue';
import { useModal } from '$/composables/pageHandler/modalComposable';
import { defaultCatch } from '$/functions';

const props = defineProps<{
    raffle: RaffleEntry
}>()
    
const { raffle } = toRefs(props);
        
/**
 * 당첨자 결과 확인 모달
 */
async function winningResultModalOpen() {
    try {   
        useModal().open(Result, {
            title: '당첨 결과 확인',
            name: 'WinningResult',
            itemClass: 'm_modal-myraffle-result',
            props: {         
                raffle: raffle.value,
            }
        });
    } catch (error) {
        defaultCatch(error);
    }
}
        
</script>