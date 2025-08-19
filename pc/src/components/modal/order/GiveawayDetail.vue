<template>
    <div class="m_modal-gift-target">
        <div class="mm_gift-item">
            <figure>
                <i
                    v-lazyload="{ src: giveAway.imageUrl }"
                    class="mm_bg-cover image_gift"
                />
                <figcaption>
                    <p class="text_name">
                        {{ giveAway.name }}
                    </p>
                    <p class="text_condition">
                        {{ giveAway.conditionLabel }}
                    </p>
                    <p class="text_date">
                        {{ MMFilters.formatDate(giveAway.startAt?.toString() || '', 'YYYY.MM.DD') }} ~ {{ MMFilters.formatDate(giveAway.endAt?.toString() || '', 'YYYY.MM.DD') }}
                    </p>
                </figcaption>
            </figure>
        </div>
        <table>
            <colgroup>
                <col style="width:100px;">
                <col style="width:32%;">
                <col>
            </colgroup>
            <thead>
                <tr>
                    <th scope="col">
                        <b>상품</b>
                    </th>
                    <th scope="col">
                        <b>브랜드명</b>
                    </th>
                    <th scope="col">
                        <b>상품명</b>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="goods in giveawayGoodsPaginator.data"
                    :key="goods.id"
                >
                    <td>
                        <i
                            v-lazyload="{ src: goods.thumbnailUrl }"
                            class="mm_bg-cover image_product"
                        />
                    </td>
                    <td><b>{{ goods.brandName }}</b></td>
                    <td>
                        <p class="text_product">
                            {{ goods.name }}
                        </p>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- 페이지네이션 -->
        <MMPaginator
            :page-block-type="'group'"
            :page-block-count="5"
            :current-page="giveawayGoodsPaginator.currentPage"
            :items-per-page="giveawayGoodsPaginator.perPage"
            :total-count="giveawayGoodsPaginator.total"
            @move-page-to="movePage"
        />
        <!--// 페이지네이션 -->
    </div>
</template>

<script setup lang='ts'>
import MMPaginator from '@/components/Paginator.vue';
import { ref } from 'vue';
import { GiveAway, GiveAwayGoods } from '$/@type/goods';
import * as MMFilters from '$/filters';
import { shoppingRepository } from '$/repository/shoppingRepository';
import { Paginator } from '$/@type';
import { ModalCloseHandler } from '$/@type/Modal';

const props = defineProps<{
    giveAway: GiveAway,
    giveAwayGoodsPaginator: Paginator<GiveAwayGoods>
    closer: ModalCloseHandler<void>,
}>();


/** VARIABLE */
const giveawayGoodsPaginator = ref<Paginator<GiveAwayGoods>>(props.giveAwayGoodsPaginator);
const filters = ref<{
      page: number;
      pageSize: number
  }> ({
      page: 1,
      pageSize: 5
  });

/** FUNCTION */
async function movePage(page: number) {
    filters.value.page = page;
    fetchGoods();
}

async function fetchGoods() {
    giveawayGoodsPaginator.value = await shoppingRepository.getGiveawayOnGoods(
        props.giveAway.id, 
        filters.value.page, 
        filters.value.pageSize
    );
}
/** VUE LIFE CYCLE */
</script>

