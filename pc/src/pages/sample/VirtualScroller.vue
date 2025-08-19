<template>
  <div>
    <h3 class="mm_title">
      <b>가상 스크롤 샘플</b>
    </h3>
    <VirtualScroller
      :items="items"
      :height-px-per-item="heightPxPerItem"
      :initialize-page="initializePage"
      @pageMoved="handlePageMoved"
      @touchEmptyPage="handleTouchEmptyPage"
      @needNextPage="handleNeedNextPage"
    >
      <template #item="{ item }">
        <div v-if="item">
          <p v-text="item.title" />
          <div>
            <img
              :src="item.thumbnailUrl"
              alt=""
            >
            <span v-text="item.id" />
          </div>
        </div>
      </template>
    </VirtualScroller>
  </div>
</template>

<script>
import { inject, onMounted, ref, nextTick, watch } from 'vue';
import VirtualScroller from '@/components/VirtualScroller.vue';
import { useRoute, useRouter } from 'vue-router';

export default {
    components: {
        VirtualScroller,
    },
    setup() {
        const route = useRoute();
        const router = useRouter();

        const hasInitializePage = route.query.page && !isNaN(route.query.page);
        const initializePage = hasInitializePage ? Number.parseInt(route.query.page) : 1;
        const page = ref(initializePage || 1);
        const pageSize = ref(20);
        const items = ref([]);
        const heightPxPerItem = ref(190);

        async function fetchItems(targetPage) {
            const res = await fetch('https://jsonplaceholder.typicode.com/photos');
            const photos = await res.json();
            
            return photos.slice((targetPage - 1) * pageSize.value, targetPage * pageSize.value);
        }

        function handlePageMoved(currentPage) {
            page.value = currentPage;
        }

        const fetchingEmptyPages = ref([]);
        function handleTouchEmptyPage(emptyPage) {
            if (fetchingEmptyPages.value.indexOf(emptyPage) !== -1) {
                return;
            }

            fetchingEmptyPages.value.push(emptyPage);
            fetchItems(emptyPage)
                .then((replaceItems) => {
                    const beforeItems = items.value.slice(0, (emptyPage - 1) * pageSize.value);
                    const afterItems = items.value.slice(emptyPage * pageSize.value);

                    items.value = beforeItems.concat(replaceItems).concat(afterItems);
                })
                .finally(() => {
                    fetchingEmptyPages.value = fetchingEmptyPages.value.filter(
                        (fetchingEmptyPage) => {
                            return fetchingEmptyPage != emptyPage;
                        }
                    );
                });
        }

        const isOnFetchNext = ref(false);
        async function handleNeedNextPage(nextPage) {
            if (items.value.length >= nextPage * pageSize.value) {
                return;
            }

            if (isOnFetchNext.value) {
                return;
            }

            isOnFetchNext.value = true;
            const fetchedItems = await fetchItems(nextPage);

            items.value = items.value.concat(fetchedItems);

            isOnFetchNext.value = false;
        }

        watch(page, () => {
            router.replace({ query: { page: page.value } });
        });

        onMounted(async () => {
            const initItems = await fetchItems(initializePage);

            for (let index = 0; index < (initializePage - 1) * pageSize.value; index++) {
                items.value.push(null);
            }

            items.value = items.value.concat(initItems);

            // containers.value = (await Backend.run('TEST_API')).data.containers
        });

        return {
            initializePage,
            items,
            heightPxPerItem,
            handlePageMoved,
            handleTouchEmptyPage,
            handleNeedNextPage,
        };
    },
};
</script>