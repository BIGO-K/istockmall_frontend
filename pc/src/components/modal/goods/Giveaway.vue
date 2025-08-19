<template>
    <div class="mm_note">
        <ul>
            <li>사은품은 회원 대상으로 지급됩니다.</li>
        </ul>
    </div>
    <div class="mm_gift-list">
        <ul>
            <li
                v-for="giveaway in giveaways"
                :key="giveaway.id"
            >
                <div class="mm_gift-item">
                    <figure>
                        <i
                            v-lazyload="{ src: giveaway.imageUrl }"
                            class="mm_bg-cover image_gift"
                        />
                        <figcaption>
                            <p class="text_name">
                                {{ giveaway.name }}
                            </p>
                            <p class="text_condition">
                                {{ giveaway.conditionLabel }}
                            </p>
                            <p
                                v-if="giveaway.startAt !== undefined && giveaway.endAt !== undefined"
                                class="text_date"
                            >
                                지급기간: {{ MMFilters.formatDate(giveaway.startAt.toString(), 'YYYY.MM.DD') }} ~ {{ MMFilters.formatDate(giveaway.endAt.toString(), 'YYYY.MM.DD') }}
                            </p>
                        </figcaption>
                    </figure>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup lang='ts'>
import { GiveAway } from '$/@type/goods';
import * as MMFilters from '$/filters';
import { ModalCloseHandler } from '$/@type/Modal';

defineProps<{
    giveaways: GiveAway[],
    closer: ModalCloseHandler<void>
}>();
/** VARIABLE */

/** FUNCTION */

/** VUE LIFE CYCLE */

</script>
