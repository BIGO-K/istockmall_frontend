<template>
  <div class="mm_page-content">
    <div class="mm_inner">
      <h3 class="mm_title">
        <b>페이지 테스트</b>
      </h3>
      <div>
        <div>
          <b>페이지 블록 타입</b>
          <br>
                    
          <input
            id="page_block_type_padded"
            v-model="pageBlockType"
            type="radio"
            value="padded"
          >
          <label for="page_block_type_padded">PADDED</label>

          <input
            id="page_block_type_group"
            v-model="pageBlockType"
            type="radio"
            value="group"
          >
          <label for="page_block_type_group">GROUP</label>
        </div>
        <div>
          <b>페이지 블록 갯수</b>
          <span>({{ pageBlockType == 'padded' ? '양 옆에 붙일 페이지 갯수' : '한 그룹당 보일 페이지 갯수' }})</span>
          <br>
          <input
            v-model="pageBlockCount"
            type="number"
          >
        </div>
        <div>
          <b>페이지당 아이템 수</b>
          <br>
          <input
            v-model="itemsPerPage"
            type="number"
          >
        </div>
        <div>
          <b>총 아이템 수</b>
          <br>
          <input
            v-model="totalCount"
            type="number"
          >
        </div>
      </div>
      <div>
        <Paginator
          v-bind="{
            pageBlockType,
            pageBlockCount,
            currentPage,
            itemsPerPage,
            totalCount,
          }"
          @movePageTo="movePage"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Paginator from '$/components/Paginator.vue';
import { ref } from 'vue';

export default {
    components: {
        Paginator,
    },
    setup() {
        const pageBlockType = ref('padded');
        const pageBlockCount = ref(2);
        const currentPage = ref(1);
        const itemsPerPage = ref(20);
        const totalCount = ref(321);

        function movePage(page) {
            currentPage.value = page;
        }

        return {
            pageBlockType,
            pageBlockCount,
            currentPage,
            itemsPerPage,
            totalCount,

            movePage,
        };
    },
};
</script>