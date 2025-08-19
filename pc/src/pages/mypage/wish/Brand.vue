<template>
    <div class="mm_page-content-body">
        <div class="m_my-like-brand">
            <h5 class="mm_heading">
                <b>My 찜</b>
            </h5>
            <!-- 탭메뉴 -->
            <div class="mm_tab_menu">
                <!-- (D) 선택된 탭메뉴에 'S=tab-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
                <ul class="mm_flex T=equal">
                    <li>
                        <MMLink
                            :to="{ name: 'MypageWishGoods' }"
                        >
                            <b>찜한 아이템</b>
                        </MMLink>
                    </li>
                    <li>
                        <MMLink
                            :to="{ name: 'MypageWishBrands' }"
                            :class="'S=tab-on'"
                            title="선택됨"
                        >
                            <b>찜한 브랜드</b>
                        </MMLink>
                    </li>
                </ul>
            </div>
            <!--// 탭메뉴 -->
            <p
                v-if="wishAllBrands.length < 1"
                class="mm_text-none"
            >
                <i class="ico_text-none" />찜한 브랜드가 없습니다
            </p>
            <ul v-else>
                <li
                    v-for="brand in wishAllBrands"
                    :key="brand.id"
                >
                    <MMLink :to="{ name: 'GoodsBrandIndex', params: { id: brand.id} }">
                        <figure>
                            <i 
                                v-lazyload="{ src: brand.logoImageUrl, isRatio: true, useErrorImage: false }" 
                                class="mm_bg-contain image_logo" 
                                :title="brand.name"
                            />
                            <figcaption>{{ brand.name }}</figcaption>
                        </figure>
                    </MMLink>
                    <button
                        type="button"
                        class="btn_remove"
                        @click="remove(brand.id)"
                    >
                        <b class="mm_ir-blind">선택삭제</b><i class="ico_remove" />
                    </button>
                </li>
            </ul>
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { wishRepository } from "$/repository/member/wishRepository";
import { defaultCatch } from '$/functions';
import { WishBrand } from '$/@type/member/wish';
import { mmon } from '$/helper/mmon';
import { usePageTitleSetting } from '$/composables/seoComposable';

usePageTitleSetting('찜한 브랜드', ['My 찜', '마이페이지']);
const wishAllBrands = ref<WishBrand[]>([]);

// 찜한 브랜드 조회 (2022.08.10 페이지네이터 제거)
async function fetchBrands() {            
    mmon.loading.show();
    try {
        wishAllBrands.value = await wishRepository.getAllBrands();
    } catch (e) {
        defaultCatch(e);
    } finally {
        mmon.loading.hide();
    }
}

async function remove(brandId: number) {
    mmon.bom.confirm('삭제하시겠습니까?', async(flag: boolean) => {
        if (flag) {
            mmon.loading.show();
            try {
                await wishRepository.deleteBrand(brandId);
                fetchBrands();
            } catch (e) {
                defaultCatch(e);
            } finally {
                mmon.loading.hide();
            }
        }
    });
}

onMounted(async () => {
    fetchBrands()
});
</script>