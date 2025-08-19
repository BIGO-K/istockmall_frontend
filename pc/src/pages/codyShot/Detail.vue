<template>
    <!-- 본문 -->
    <div class="mm_page-content">
        <div
            v-if="codyShot !== undefined"
            class="mm_inner m_codyshot-detail"
        >
            <h3 class="mm_title">
                <b>코디샷</b>
            </h3>
            <figure>
                <div class="m_codyshot-detail-banner">
                    <img
                        v-lazyload="{ src: codyShot.thumbnailUrl }"
                        src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                        :alt="codyShot.alt"
                    >
                    <button
                        v-for="(pointer, index) in codyShot.pointers"
                        :key="index"
                        :style="{ top: `${pointer.y}%`, left: `${pointer.x}%` }"
                        type="button"
                        class="btn_product-pointer"
                        @click="() => {
                            highlightPointerGoods(index);
                            scrollToPointer(index);
                        }"
                    >
                        <b class="mm_ir-blind">{{ pointer.goods.name }}</b>
                    </button>
                </div>
                <figcaption>
                    <p class="text_brand">
                        {{ codyShot.brandName }}
                    </p>
                    <p class="text_title">
                        {{ codyShot.title }}
                    </p>
                    <p class="text_sub">
                        {{ codyShot.subTitle }}
                    </p>
                    <p class="text_date">
                        {{ MMFilters.formatDate(codyShot.createdAt, 'YYYY-MM-DD') }}
                    </p>
                    <button
                        type="button"
                        class="btn_share"
                        @click="copyPath"
                    >
                        <i class="ico_share" /><b class="mm_ir-blind">클립보드 복사</b>
                    </button>
                </figcaption>
            </figure>
            <div class="mm_product-list">
                <ul>
                    <li
                        v-for="(pointer, index) in codyShot.pointers"
                        :key="index"
                        :ref="(element) => { if(element instanceof Element) pointerList.push(element)}"
                        :class="{ 'S=pointer-on': index === selectedPointerGoodsIndex }"
                    >
                        <MmGoods 
                            :goods="pointer.goods" 
                            :use-react-tag="true" 
                            :use-liked-button="true"
                        />
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <!--// 본문 -->
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { mmon } from '$/helper/mmon';
import { useRoute } from 'vue-router';
import { shoppingRepository } from '$/repository/shoppingRepository';
import { codyShotRepository } from '$/repository/codyShotRepository';
import { CodyShot } from '$/@type/codyShot';
import { usePageTitleSetting } from '$/composables/seoComposable'

export default defineComponent({    
    setup() {
        const route = useRoute();

        const codyShotId = Number(`${route.params.id}`);
        // 코디샷 정보
        const codyShot = ref<CodyShot>();
        // 코디샷에 등록된 상품id 목록
        const goodsIds = ref<number[]>([]);
        // 포인터 클릭시 선택한 상품 id
        const selectedPointerGoodsIndex = ref<number|null>(null);
        // 상품 포커스 효과 삭제 타이머
        let highlightTimer: NodeJS.Timeout;
        // 포인터 Element 목록
        const pointerList = ref<Element[]>([]);
        /**
         * onMounted
         */
        onMounted(async() => {
            codyShot.value = await codyShotRepository.getCodyShot(codyShotId);
            goodsIds.value = codyShot.value.pointers.map(pointer => {
                return pointer.goods.id;
            });
            // 상품의 좋아요 여부
            await shoppingRepository.getRelationLikedGoods(goodsIds.value, true);
            usePageTitleSetting(codyShot.value?.title);
        });


        /**
         * 포인터 선택시 해당 포인터의 상품에 하이라이트효과
         * 
         * @param { number } goodsIndex
         */
        function highlightPointerGoods(goodsIndex: number) {
            // 기존 타임아웃 제거
            clearTimeout(highlightTimer);
            // 2초뒤 상품에 포커스 효과 제거 타임아웃 설정
            selectedPointerGoodsIndex.value = goodsIndex;
            highlightTimer = setTimeout(() => {
                selectedPointerGoodsIndex.value = null;
            }, 2000);
        }

        /**
         * 포인터 클릭시 해당 상품으로 스크롤
         *
         * @param { number } index
         */
        function scrollToPointer(index: number) {
            mmon.scroll.to(pointerList.value[index], {
                margin: 100,
                direction: 'vertical',
                time: 0.2
            });
        }

        /**
         * 공유버튼 클릭시 url복사
         */
        function copyPath() {
            mmon.copy(location.href);
        }

        return {
            Element,
            codyShot,
            goodsIds,
            pointerList,
            selectedPointerGoodsIndex,
            copyPath,
            scrollToPointer,
            highlightPointerGoods,
        }
    },
})
</script>
