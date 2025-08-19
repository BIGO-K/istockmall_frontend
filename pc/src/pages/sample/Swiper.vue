<template>
  <div class="mm_page-content">
    <div class="mm_inner">
      <h3 class="mm_title">
        <b>스와이퍼 샘플</b>
      </h3>
      <Swiper :items="items">
        <template #item="{ item }">
          <div>
            <img
              :src="item.image_url"
              alt=""
            >
            <h2 v-text="item.maintext" />
            <p v-text="item.subtext" />
          </div>
        </template>
      </Swiper>
    </div>
  </div>
</template>

<script>
import Swiper from '../../components/Swiper.vue';
import { onMounted, ref } from 'vue';

export default {
    components: {
        Swiper,
    },
    setup() {
        const items = ref([]);

        onMounted(() => {
            for (let index = 0; index < 10; index++) {
                items.value.push({
                    image_url: `https://picsum.photos/600/300?random=${index}`,
                    maintext: 'Alejandro Escamilla',
                    subtext: 'Get a list of images by using the /v2/list endpoint.',
                });
            }
        });

        return {
            items,
        };
    },
};
</script>