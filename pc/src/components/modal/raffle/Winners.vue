<template>
    <ul>
        <li v-for="winner in winners" :key="winner.loginId">
            <b>{{ winner.name }}</b>{{ winner.loginId }}
        </li>
    </ul>
</template>


<script setup lang='ts'>
import { RaffleWinner } from '$/@type/raffle';
import { ModalCloseHandler } from '$/@type/Modal';

defineProps<{
    winners: RaffleWinner[],
    closer: ModalCloseHandler<void>
}>();
/** VARIABLE */

/** FUNCTION */

/** VUE LIFE CYCLE */

</script>