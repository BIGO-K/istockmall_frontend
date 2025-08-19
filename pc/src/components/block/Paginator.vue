<template>
    <div v-if="isShow" class="mui_pagination">
        <div class="mui_inline">
            <ol>
                <li v-for="page in pages" :key="page.number">
                    <button 
                        type="button" 
                        :class="{ 'S=page-on': page.isCurrentPage }" 
                        :title="page.isCurrentPage ? '선택됨' : ''"
                        @click="$emit('movePageTo', page.number)"
                    >
                        <b v-text="page.number" />
                    </button>
                </li>
            </ol>

            <!-- 첫 페이지 버튼 -->
            <button
                type="button"
                class="btn_control-first"
                :disabled="currentPage === 1"
                @click="$emit('movePageTo', 1)"
            >
                <i class="uico_page-first" />
                <b class="mui_ir-blind">처음</b>
            </button>

            <!-- 이전 페이지 버튼 -->
            <button
                type="button"
                class="btn_control-prev"
                :disabled="currentPage === 1"
                @click="$emit('movePageTo', pageNumberOnPrev)"
            >
                <i class="uico_page-prev" />
                <b class="mui_ir-blind">이전</b>
            </button>

            <!-- 다음 페이지 버튼 -->
            <button
                type="button"
                class="btn_control-next"
                :disabled="maxPageOnCurrentPages == lastPage"
                @click="$emit('movePageTo', pageNumberOnNext)"
            >
                <i class="uico_page-next" />
                <b class="mui_ir-blind">다음</b>
            </button>

            <!-- 마지막 페이지 버튼 -->
            <button
                type="button"
                class="btn_control-last"
                :disabled="maxPageOnCurrentPages == lastPage"
                @click="$emit('movePageTo', lastPage)"
            >
                <i class="uico_page-last" />
                <b class="mui_ir-blind">마지막</b>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';

const props = withDefaults(defineProps<{
// padded: 양쪽으로 채우는 페이지블록 (ex: 3페이지라면 1, 2, [3], 4, 5)
// group: 일정 갯수 단위로 그룹(ex: 3페이지라면 1, 2, [3], 4, 5 \ 6페이지라면 [6], 7, 8, 9, 10)
    pageBlockType: string,
// pageBlockType가 padded 라면 양쪽으로 채울 페이지 수로 해석되고
// pageBlockType가 group 이라면 총 갯수로 해석됨
    pageBlockCount: number,
    currentPage: number,
    itemsPerPage: number,
    totalCount: number,
}>(), {
    pageBlockType: 'padded',
    pageBlockCount: 2,
    currentPage: 1,
    itemsPerPage: 20,
    totalCount: 0,
})

defineEmits<{
    (e: 'movePageTo', pageNum: number): void
}>();

const { pageBlockType, pageBlockCount, currentPage, itemsPerPage, totalCount } = toRefs(props);

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
</script>