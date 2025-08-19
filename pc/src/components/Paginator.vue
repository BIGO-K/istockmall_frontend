<template>
    <div v-if="isShow" class="mm_pagination">
        <div class="mm_inline">
            <ol>
                <li v-for="page in pages" :key="page.number">
                    <a
                        href="javascript:void(0)"
                        :class="{ 'S=page-on': page.isCurrentPage }"
                        :title="page.isCurrentPage ? '선택됨' : ''"
                        @click="pageMove(page.number)"                        
                    >
                        <span v-text="page.number" />
                    </a>
                </li>
            </ol>

            <!-- @click="$emit('movePageTo', page.number); scrollTop();" -->

            <!-- 첫 페이지 버튼 -->
            <button
                type="button"
                class="btn_control-first"
                :disabled="currentPage === 1"
                @click="pageMove(1)"
            >
                <i class="ico_page-first" />
                <b class="mm_ir-blind">처음</b>
            </button>

            <!-- 이전 페이지 버튼 -->
            <button
                type="button"
                class="btn_control-prev"
                :disabled="currentPage === 1"
                @click="pageMove(pageNumberOnPrev)"
            >
                <i class="ico_page-prev" />
                <b class="mm_ir-blind">이전</b>
            </button>

            <!-- 다음 페이지 버튼 -->
            <button
                type="button"
                class="btn_control-next"
                :disabled="maxPageOnCurrentPages == lastPage"
                @click="pageMove(pageNumberOnNext)"
            >
                <i class="ico_page-next" />
                <b class="mm_ir-blind">다음</b>
            </button>

            <!-- 마지막 페이지 버튼 -->
            <button
                type="button"
                class="btn_control-last"
                :disabled="maxPageOnCurrentPages == lastPage"
                @click="pageMove(lastPage)"
            >
                <i class="ico_page-last" />
                <b class="mm_ir-blind">마지막</b>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, toRefs } from 'vue';

const props = withDefaults(defineProps<{
    pageBlockType: string,
    pageBlockCount: number,
    currentPage: number,
    itemsPerPage: number,
    totalCount: number,
    scrollYPosition?: number,
    scrollYTarget?: HTMLElement,
}>(), {
    pageBlockType: 'padded',
    pageBlockCount: 2,
    currentPage: 1,
    itemsPerPage: 20,
    totalCount: 0,
    scrollYPosition: 0,
    scrollYTarget: undefined,
})

const emit = defineEmits(['movePageTo']);

const { pageBlockType, pageBlockCount, currentPage, itemsPerPage, totalCount, scrollYPosition, scrollYTarget } =
            toRefs(props);

const lastPage = computed(() => {
    return Math.ceil(totalCount.value / itemsPerPage.value);
});

// 페이징 영역 노출여부
const isShow = computed(() => {
    return totalCount.value > 0;
});

// 노출 페이지 목록
const pages = computed(() => {
    const pageItems = [];

    if (pageBlockType.value == 'padded') {
        const pageNumbers = [];
        const padCount = pageBlockCount.value * 2;
        let paddedCount = 0;

        let leftPadSeq = 1;
        let rightPadSeq = 1;

        pageNumbers.push(currentPage.value);
        while (paddedCount < padCount) {
            let leftTouched = false;
            let rightTouched = false;

            if (currentPage.value - leftPadSeq >= 1) {
                pageNumbers.push(currentPage.value - leftPadSeq);
                leftPadSeq++;
                paddedCount++;
                leftTouched = true;
            }

            if (currentPage.value + rightPadSeq <= lastPage.value) {
                pageNumbers.push(currentPage.value + rightPadSeq);
                rightPadSeq++;
                paddedCount++;
                rightTouched = true;
            }

            if (!leftTouched && !rightTouched) {
                break;
            }
        }

        pageNumbers
            .sort((a, b) => a - b)
            .forEach((pageNumber) => {
                pageItems.push({
                    number: pageNumber,
                    isCurrentPage: pageNumber == currentPage.value,
                });
            });
    } else if (pageBlockType.value == 'group') {
        const groupSeqOfCurrentPage = Math.ceil(currentPage.value / pageBlockCount.value);

        for (let index = 0; index < pageBlockCount.value; index++) {
            const pageNumber =
                (groupSeqOfCurrentPage - 1) * pageBlockCount.value + (index + 1);

            if (pageNumber > lastPage.value) {
                break;
            }

            pageItems.push({
                number: pageNumber,
                isCurrentPage: pageNumber == currentPage.value,
            });
        }
    }

    return pageItems;
});

// [이전] 페이지 처리
const pageNumberOnPrev = computed(() => {
    // 한 벌씩 옮기기
    if (pageBlockType.value == 'padded') {
        return Math.max(1, currentPage.value - (pageBlockCount.value * 2 + 1));
    } else if (pageBlockType.value == 'group') {
        return Math.max(1, Math.min(lastPage.value, currentPage.value - ((currentPage.value % pageBlockCount.value) || pageBlockCount.value)));
    } else {
        return 0;
    }
});

// [다음] 페이지 처리
const pageNumberOnNext = computed(() => {
    // 한 벌씩 옮기기
    if (pageBlockType.value == 'padded') {
        return Math.min(lastPage.value, currentPage.value + (pageBlockCount.value * 2 + 1));
    } else if (pageBlockType.value == 'group') {
        return Math.min(lastPage.value, maxPageOnCurrentPages.value + 1);
    } else {
        return lastPage.value;
    }
});

const maxPageOnCurrentPages = computed(() => {
    return pages.value.slice().reverse().find(() => true)?.number || lastPage.value;
})

// 페이지 이동 공통 함수
function pageMove(page: number) {
    // 모달인 경우 상위 페이지 스크롤도 이동 되기 대문에 스크롤 이동처리 안함 
    if(document.querySelector('.mm_modal') === null) {
        const scrollTo = !scrollYTarget.value ? scrollYPosition.value : window.scrollY + scrollYTarget.value.getBoundingClientRect().top
        window.scroll({
            top: scrollTo,                
        });
    }
    emit('movePageTo', page);            
}
</script>