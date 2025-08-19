<template>
    <div class="m_prodetail-tab-info">
        <!-- 셀러 휴무일 -->
        <div v-if="goodsInformation.sellerHolidayMessage || sellerHolidayMessage" class="m...info-seller-off">
            <strong>배송 공지</strong>
            <p v-if="sellerHolidayMessage">
                {{ sellerHolidayMessage }}
            </p>
            <p v-else>
                {{ goodsInformation.sellerHolidayMessage }}
            </p>
        </div>
        <!--// 셀러 휴무일 -->
        <!-- 상품 공통배너 -->
        <div class="m_prodetail-banner">
            <ul>
                <li v-for="topBanner in goodsInformation.topBanners" :key="topBanner.imageUrl">
                    <div v-if="topBanner.isEditorUse" class="mm_editor" v-html="topBanner.contents" />
                    <!-- 이미지 등록 방식 -->
                    <i v-else class="image_banner">
                        <img
                            v-lazyload="{ src: topBanner.imageUrl }"
                            src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                            :alt="topBanner.imageAlt"
                        >
                    </i>
                </li>
            </ul>
        </div>
        <!--// 상품 공통배너 -->
        <p class="text_code">
            상품번호<span>{{ goodsId }}</span>
        </p>
        <!-- 동영상 -->
        <div v-if="goodsInformation.videoUrl !== ''" class="m...info-media" v-html="goodsInformation.videoUrl" />
        <!--// 동영상 -->
        <!-- 상품 상세설명 및 이미지 -->
        <div class="m...info-desc">
            <!-- 상세설명 -->
            <div class="mm_editor">
                <p v-editorWithImageTag="{ isForce: true }" v-html="goodsInformation.detailInfo" />
            </div>
            <!--// 상세설명 -->
        </div>
        <!--// 상품 상세설명 및 이미지 -->
        <section class="m_prodetail-info">
            <h4 class="m_prodetail-info-title">
                <b>일반 상품 정보</b>
            </h4>
            <table>
                <colgroup>
                    <col style="width: 209px">
                    <col>
                </colgroup>
                <tbody>
                    <tr>
                        <th scope="row">
                            <b>상품번호</b>
                        </th>
                        <td>{{ goodsId }}</td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <b>상품상태</b>
                        </th>
                        <td>{{ goodsInformation.useStateLabel }}</td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <b>브랜드</b>
                        </th>
                        <td>{{ brandName }}</td>
                    </tr>
                    <tr>
                        <th scope="row">
                            <b>원산지</b>
                        </th>
                        <td>{{ goodsInformation.originLabel }}</td>
                    </tr>
                </tbody>
            </table>
        </section>
        <!-- 상품정보고시 -->
        <section class="m_prodetail-info">
            <h4 class="m_prodetail-info-title">
                <b>상품정보고시</b>
            </h4>
            <table>
                <colgroup>
                    <col style="width: 209px">
                    <col>
                </colgroup>
                <tbody>
                    <tr
                        v-for="mandatory in goodsInformation.mandatory"
                        :key="mandatory.title"
                    >
                        <th scope="row">
                            <b>{{ mandatory.title }}</b>
                        </th>
                        <td>{{ mandatory.content }}</td>
                    </tr>
                </tbody>
            </table>
        </section>
        <!--// 상품정보고시 -->

        <!-- 상품 공통배너 -->
        <div class="m_prodetail-banner">
            <ul>
                <li v-for="bottomBanner in goodsInformation.bottomBanners" :key="bottomBanner.imageUrl">
                    <div v-if="bottomBanner.isEditorUse" class="mm_editor" v-html="bottomBanner.contents" />
                    <!-- 이미지 등록 방식 -->
                    <i v-else class="image_banner">
                        <img
                            v-lazyload="{ src: bottomBanner.imageUrl }"
                            src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                            :alt="bottomBanner.imageAlt"
                        >
                    </i>
                </li>
            </ul>
        </div>
    <!--// 상품 공통배너 -->
    </div>
</template>

<script setup lang='ts'>
import { goodsRepository } from '$/repository/goodsRepository'
import { computed, ref } from 'vue';
import { GoodsInformation } from '$/@type/goods'
import { editorWithImageTag } from '$/directives'
import { applyZosa, formatDate } from '$/filters'

const vEditorWithImageTag = editorWithImageTag

const props = defineProps<{
    goodsId: number,
    brandName: string
}>()
/** VARIABLE */
const goodsInformation = ref<GoodsInformation>({
    topBanners: [],
    bottomBanners: [],
    detailInfo: '',
    videoUrl: '',
    mandatory: [],
    useStateLabel: '',
    originLabel: '',
    sellerHolidayMessage: ''
});

const sellerHolidayMessage = computed(() => {
    if (!goodsInformation.value.sellerHoliday) {
        return '';
    }

    return applyZosa(`${goodsInformation.value.sellerHoliday.reason}(으로/로)`)
        + ' 인해 '
        + formatDate(goodsInformation.value.sellerHoliday.startAt, 'YYYY-MM-DD')
        + ' ~ '
        + formatDate(goodsInformation.value.sellerHoliday.endAt, 'YYYY-MM-DD')
        + ' 주문한 상품은 '
        + formatDate(goodsInformation.value.sellerHoliday.releaseAt, 'YYYY-MM-DD')
        + '부터 순차적으로 배송합니다.';
});

/** FUNCTION */

/** VUE LIFE CYCLE */
(async () => {    
    try {
        goodsInformation.value = await goodsRepository.getGoodsDetailInformation(props.goodsId);
    } catch (e) {
        console.log(e)
    }
})();
</script>
