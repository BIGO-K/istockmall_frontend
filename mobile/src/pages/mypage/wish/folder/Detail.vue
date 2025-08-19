<template>
    <MMPopup>
        <template #headerTitle>
            <h1><b>{{ folderName }}</b></h1>
        </template>
        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="m_popup-mylike-folder" :class="editable ? 'S=folder-modify' : ''">
                            <!-- 상단영역 -->
                            <div class="m...folder-head">
                                <div class="mm_lside">
                                    <p>전체<strong class="mm_text-variable">{{ wishGoods.length }}개</strong></p>
                                </div>
                                <div class="mm_rside">
                                    <div class="mm_btn_box">
                                        <div class="mm_inline">
                                            <button
                                                type="button"
                                                class="mm_btn T=sm T=line T=light btn_modify"
                                                @click="editable = !editable"
                                            >
                                                <i class="ico_modify" />
                                                <b>편집</b>
                                            </button>
                                            <button
                                                type="button"
                                                class="mm_btn T=sm T=line T=primary btn_move"
                                                :disabled="selectedGoodsIds.length < 1 ? true : false"
                                                @click="moveGoodsPopup(selectedGoodsIds)"
                                            >
                                                <b>이동</b>
                                            </button>
                                            <button
                                                type="button"
                                                class="mm_btn T=sm T=line T=primary btn_remove"
                                                :disabled="selectedGoodsIds.length < 1 ? true : false"
                                                @click="removeGoods(selectedGoodsIds); selectedGoodsIds = []"
                                            >
                                                <b>삭제</b>
                                            </button>
                                            <button
                                                type="button"
                                                class="mm_btn T=sm T=line T=light btn_modify-cancel"
                                                @click="editCancel"
                                            >
                                                <i class="ico_modify" />
                                                <b>편집취소</b>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!--// 상단영역 -->

                            <!-- 상품목록 -->
                            <div class="mm_product-list T=sm">
                                <p v-if="wishGoods.length < 1" class="mm_text-none">
                                    <i class="ico_text-none" />찜한 아이템이 없습니다
                                </p>
                                <ul v-else>
                                    <li v-for="goods in wishGoods" :key="goods.id">
                                        <div class="mm_product-item">
                                            <MMCheck
                                                v-model="selectedGoodsIds"
                                                :value="goods.id"
                                                :is-blind-label="true"
                                            />
                                            <MmGoods :goods="goods" :is-show-price="false" />
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <!--// 상품목록 -->
                        </div>
                    </div>
                    <!--// 본문 -->
                </div>
            </div>
        </template>
    </MMPopup>
</template>

<script setup lang="ts">
import { WishGoodsFolder, WishGoodsInFolder } from '$/@type/member/wish';
import { onMounted, ref } from 'vue';
import { wishRepository } from '$/repository/member/wishRepository';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import MMCheck from '@/components/input/Check.vue';
import MMPopup from '@/components/layout/Popup.vue';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { useLikedGoods } from '$/composables/shoppingComposable';
import { usePageContext } from '$/composables/pageHandler/contextComposable';

const {
    route,
    router
} = usePageContext()

const editable = ref<boolean>(false);

// 찜 폴더 리스트
const folders = ref<WishGoodsFolder[]>([]);
const folderId = Number(route.params.id);
const folderName = ref('');
			
// 현재 선택한 폴더에 담긴 상품
const wishGoods = ref<WishGoodsInFolder[]>([]);

// checkbox 선택된 상품
const selectedGoodsIds = ref<number[]>([]);

// 선택한 폴더에 담긴 찜 상품 조회
async function fetchGoods(folderId: number) {
    editable.value = false;
    wishGoods.value = await wishRepository.getWishGoodsInFolder(folderId);
}

async function nameOfFolder() {
    folders.value = await wishRepository.getWishGoodsFolders();
    folderName.value = folders.value.find(folder => folder.id == folderId)?.name || '';
    usePageTitleSetting(folderName.value);
}

// 선택한 찜 상품 폴더 이동 팝업 띄우기
async function moveGoodsPopup(goodsIdList: number[]) {
    mmon.loading.show();
    try {
        router.push({
            name: 'MypageWishGoodsFolderMove',
            params: {
                id: folderId,
            },
            query: {
                goodsIdList: goodsIdList.join(',')
            }
        });
    } catch (e) {
        defaultCatch(e);
    } finally {
        mmon.loading.hide();
    }
}

// 선택한 찜 상품 삭제
async function removeGoods(goodsIdList: number[]) {
    mmon.bom.confirm('삭제하시겠습니까?', async (flag: boolean) => {
        if (flag) {
            mmon.loading.show();
            try {
                await wishRepository.deleteWishGoods(goodsIdList);

                const { removeLiked } = useLikedGoods(goodsIdList);
                removeLiked();
                        
                fetchGoods(folderId);
            } catch (e) {
                defaultCatch(e);
            } finally {
                mmon.loading.hide();
            }
        }
    });
}

// 편집 취소
function editCancel() {
    editable.value = false;
}

onMounted(async () => {
    mmon.loading.show();
    try {
        fetchGoods(folderId);
        nameOfFolder();
    } catch (e) {
        defaultCatch(e);
    } finally {
        mmon.loading.hide();
    }
});
</script>