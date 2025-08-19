<template>
    <ModalPopup>    
        <template #headerTitle>
            <h1><b>사은품 정보</b></h1>
        </template>
        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="mm_inner m_popup-gift">
                            <div class="mm_note">
                                <ul>
                                    <li>사은품은 회원 대상으로 지급됩니다.</li>
                                </ul>
                            </div>
                            <!-- (D) 사은품 정보 팝업에서만 지급조건과 지급기간 내용 앞에 "지급조건:", "지급기간:" 문구가 추가됩니다.(다른 페이지 내 사은품 내용에는 추가되지 않습니다.) -->
                            <ul class="mm_gift-list">
                                <li v-for="giveaway in giveaways" :key="giveaway.id">
                                    <div class="mm_gift-item">
                                        <figure>
                                            <i v-lazyload="{ src: giveaway.imageUrl }" class="mm_bg-cover image_gift" />
                                            <figcaption>
                                                <p class="text_name">
                                                    {{ giveaway.name }}
                                                </p>
                                                <p class="text_condition">
                                                    지급조건: {{ giveaway.conditionLabel }}
                                                </p>
                                                <p class="text_date">
                                                    지급기간: {{ MMFilters.formatDate((giveaway.startAt || '').toString(), 'YYYY.MM.DD') }} ~ {{ MMFilters.formatDate((giveaway.endAt || '').toString(), 'YYYY.MM.DD') }}
                                                </p>
                                            </figcaption>
                                        </figure>
                                    </div>
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
import ModalPopup from '@/components/layout/ModalPopup.vue';
import { useGiveaways } from '$/composables/goods/detailComposable';

const { giveaways } = useGiveaways();
</script>
