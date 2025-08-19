<template>
    <div v-if="isShow" class="mm_pagination">
        <div class="mm_inline">
            <ol>
                <li v-for="page in pages" :key="page.number">
                    <a
                        href="javascript:void(0)"
                        :class="{ 'S=page-on': page.isCurrentPage }"
                        :title="page.isCurrentPage ? '선택됨' : ''"
                        @click="movePageTo(page.number);"
                    >
                        <span v-text="page.number" />
                    </a>
                </li>
            </ol>

            <!-- 첫 페이지 버튼 -->
            <button
                type="button"
                class="btn_control-first"
                :disabled="currentPage == 1"
                @click="movePageTo(1)"
            >
                <i class="ico_page-first" />
                <b class="mm_ir-blind">처음</b>
            </button>

            <!-- 이전 페이지 버튼 -->
            <button
                type="button"
                class="btn_control-prev"
                :disabled="currentPage == 1"
                @click="movePageTo(pageNumberOnPrev)"
            >
                <i class="ico_page-prev" />
                <b class="mm_ir-blind">이전</b>
            </button>

            <!-- 다음 페이지 버튼 -->
            <button
                type="button"
                class="btn_control-next"
                :disabled="maxPageOnCurrentPages == lastPage"
                @click="movePageTo(pageNumberOnNext)"
            >
                <i class="ico_page-next" />
                <b class="mm_ir-blind">다음</b>
            </button>

            <!-- 마지막 페이지 버튼 -->
            <button
                type="button"
                class="btn_control-last"
                :disabled="maxPageOnCurrentPages == lastPage"
                @click="movePageTo(lastPage)"
            >
                <i class="ico_page-last" />
                <b class="mm_ir-blind">마지막</b>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { mmon } from '$/helper/mmon';
import { computed, toRefs } from 'vue';

const props = withDefaults(defineProps<{
    // padded: 양쪽으로 채우는 페이지블록 (ex: 3페이지라면 1, 2, [3], 4, 5)
    // group: 일정 갯수 단위로 그룹(ex: 3페이지라면 1, 2, [3], 4, 5 \ 6페이지라면 [6], 7, 8, 9, 10)
    pageBlockType: 'padded'|'group'
    // pageBlockType가 padded 라면 양쪽으로 채울 페이지 수로 해석되고
    // pageBlockType가 group 이라면 총 갯수로 해석됨
    pageBlockCount: number
    currentPage: number
    itemsPerPage: number
    totalCount: number
    scrollYTarget?: HTMLElement|null
}>(), {
    pageBlockType: 'padded',
    pageBlockCount: 2,
    currentPage: 1,
    itemsPerPage: 20,
    totalCount: 0,
    scrollYTarget: null
})

const emit = defineEmits(['movePageTo']);

const { 
    pageBlockType, 
    pageBlockCount, 
    currentPage, 
    itemsPerPage, 
    totalCount, 
    scrollYTarget 
} = toRefs(props);

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
        
// 블록 페이지네이터에서도 scroll top 필요한 경우 사용 
function scrollTop() {
    const scrollY = scrollYTarget.value ?? document.querySelector('#app') as Element;

    mmon.scroll.to(scrollY, {
        margin: 0,
        time: 0.0
    });
}

function movePageTo(page: number) {
    emit('movePageTo', page);
    scrollTop();
}
</script>