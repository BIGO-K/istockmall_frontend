<template>
    <MMPopup>
        <template #headerTitle>
            <h1><b>폴더 선택</b></h1>
        </template>
        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="m_popup-like-folder">
                            <h3><b>상품을 담을 폴더를 선택하세요</b></h3>
                            <button type="button" class="btn_add-folder" @click="addFolder">
                                <i class="ico_add" />
                                <b>새 폴더 추가하기</b>
                            </button>
                            <ul>
                                <li v-for="folder in folders" :key="folder.id">
                                    <button type="button" @click.prevent="moveGoods(folder)">
                                        <i v-if="folder.recentGoodsThumbnailUrl" v-lazyload="folder.recentGoodsThumbnailUrl" class="mm_bg-cover image_product" />
                                        <i v-else class="ico_like" />
                                        <b>
                                            <span>{{ folder.name }}</span>
                                            <small>{{ folder.recordsCount }}</small>
                                        </b>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <!--// 본문 -->
                </div>
            </div>
        </template>
    </MMPopup>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { WishGoodsFolder } from '$/@type/member/wish';
import { wishRepository } from '$/repository/member/wishRepository';
import { defaultCatch } from '$/functions';
import { useRoute, useRouter } from 'vue-router';
import { applyZosa } from '$/filters';
import { mmon } from '$/helper/mmon';
import { makeValidator } from '$/validator';
import MMPopup from '@/components/layout/Popup.vue';

const route = useRoute();
const router = useRouter();
            
// 찜 폴더 리스트
const folders = ref<WishGoodsFolder[]>([]);            
const goodsIdList = ref<number[]>([]);
goodsIdList.value = (`${route.query.goodsIdList}` || '').split(',').map(Number);
            
onMounted(async () => {
    fetchFolders(); // 폴더 리스트 조회
});

// 폴더 조회
async function fetchFolders() {
    mmon.loading.show();
    try {
        folders.value = await wishRepository.getWishGoodsFolders();
    }
    catch (e) {
        defaultCatch(e);
    } finally {
        mmon.loading.hide();
    }
}

// 새 폴더 추가하기
async function addFolder() {
    mmon.bom.prompt(
        "",
        async (flag: boolean, formData: { folder_name: string }) => {
            if(!flag) return;

            try {
                const validator = makeValidator({
                    name: formData.folder_name,
                })
                    .setRules({
                        'name(폴더명)': ['required', 'maxLength:10']
                    })
                    .setMessages({
                        'name.required': ':param(을/를) 입력해 주세요.',
                        'name.maxLength': ':param(은/는) 최대 :$0자까지 입력 가능합니다.',
                    })
                await validator.run();
                mmon.loading.show();
                await wishRepository.addWishGoodsFolder(formData.folder_name);
            } catch (e) {
                defaultCatch(e);
            } finally {
                fetchFolders();
                mmon.loading.hide();
            }
        },
        {
            title: "새 폴더 추가하기",
            forms: [
                {
                    type: "text",
                    name: "folder_name",
                    placeholder: "최대 10자 입력",
                    maxLength: 10,
                }
            ]
        }
    )
}

/**
 * 찜한 상품 폴더 이동
 * @param folder 이동할 폴더
 */
async function moveGoods(folder: WishGoodsFolder) {
    mmon.loading.show();
    try {
        await wishRepository.updateWishGoods(goodsIdList.value, folder.id);
        mmon.bom.alert(applyZosa(`${folder.name}(으로/로) 이동되었습니다.`), () => {
            router.go(-1);
        });
    } catch (e) {
        defaultCatch(e);
    } finally {
        mmon.loading.hide();
    }
}
</script>