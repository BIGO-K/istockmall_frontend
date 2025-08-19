<template>
    <!-- 찜한브랜드 -->
    <div v-if="wishBrandFetchComplete" class="m_mylike-brand">
        <p v-if="wishAllBrands.length < 1" class="mm_text-none">
            <i class="ico_text-none" />찜한 브랜드가 없습니다
        </p>
        <ul v-else>
            <li v-for="brand in wishAllBrands" :key="brand.id">
                <MMLink :to="{ name: 'GoodsBrandIndex', params: { id: brand.id } }">
                    <figure>
                        <i 
                            v-lazyload="{ src: brand.logoImageUrl, isRatio: true, useErrorImage: false }" 
                            class="mm_bg-contain image_brand" 
                            :title="brand.name"
                        />
                        <figcaption>{{ brand.name }}</figcaption>
                    </figure>
                </MMLink>
                <button type="button" class="btn_remove" @click="removeBrand(brand.id)">
                    <i class="ico_remove" />
                    <b class="mm_ir-blind">삭제</b>
                </button>
            </li>
        </ul>
    </div>
    <!--// 찜한브랜드 -->
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { wishRepository } from '$/repository/member/wishRepository';
import { defaultCatch } from '$/functions';
import { WishBrand } from '$/@type/member/wish';
import { mmon } from '$/helper/mmon';
import MMLink from '@/components/MMLink.vue';
import { usePageTitleSetting } from '$/composables/seoComposable';

usePageTitleSetting('찜한 브랜드', ['My 찜', '마이페이지']);
const wishBrandFetchComplete = ref(false);
const wishAllBrands = ref<WishBrand[]>([]);

onMounted(async () => {
    fetchBrands();            
});

// 찜한 브랜드 조회
async function fetchBrands() {
    mmon.loading.show();
    try {
        wishAllBrands.value = await wishRepository.getAllBrands();
    } catch (e) {
        defaultCatch(e);
    } finally {
        mmon.loading.hide();
        wishBrandFetchComplete.value = true;
    }
}

// 찜한 브랜드 삭제
async function removeBrand(brandId: number) {
    mmon.bom.confirm('삭제하시겠습니까?', async(flag: boolean) => {
        if (flag) {
            mmon.loading.show();
            try {
                await wishRepository.deleteBrand(brandId);
            } catch (e) {
                defaultCatch(e);
            } finally {
                fetchBrands();
                mmon.loading.hide();
            }
        }
    });
}
</script>