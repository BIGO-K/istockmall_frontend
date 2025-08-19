<template>
    <ModalPopup>
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
                            <button type="button" class="btn_add-folder" @click="addWishGoodsFolderPrompt">
                                <i class="ico_add" /><b>새 폴더 추가하기</b>
                            </button>
                            <ul>
                                <li v-for="folder in folders" :key="folder.id">
                                    <button type="button" @click.prevent="addWishedGoods(folder.id, folder.name)">
                                        <i
                                            v-if="folder.recentGoodsThumbnailUrl"
                                            v-lazyload="{ src: folder.recentGoodsThumbnailUrl }" 
                                            class="mm_bg-contain image_product"
                                        />
                                        <i v-else class="ico_like" />
                                        <b><span>{{ folder.name }}</span><small>{{ folder.recordsCount }}</small></b>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <!--// 본문 -->
                </div>
            </div>
        </template>
    </ModalPopup>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { WishGoodsFolder } from '$/@type/member/wish';
import { mmon } from '$/helper/mmon';
import { wishRepository } from '$/repository/member/wishRepository';
import { defaultCatch } from '$/functions';
import { useRouter } from 'vue-router';
import { makeValidator } from '$/validator';
import ModalPopup from '@/components/layout/ModalPopup.vue';
import { useLikedGoods, useWishedGoods } from '$/composables/shoppingComposable';

const router = useRouter();
const { forWishedGoodsId: goodsId } = useWishedGoods();        
const folders = ref<WishGoodsFolder[]>([]);        

/**
 * 찜폴더 추가 prompt
 */
function addWishGoodsFolderPrompt () {
    mmon.bom.prompt(
        "", 
        async (flag: boolean, formData: { folder_name: string }) => {
            if (!flag) {
                return
            } 
        
            try {
                const validator = makeValidator({
                    name: formData.folder_name,
                })
                    .setRules({
                        'name(폴더명)': ['required', 'maxLength:10']
                    })
                    .setMessages({
                        'name.required': ':param(을/를) 입력해주세요.'
                    })
                await validator.run();
                mmon.loading.show();
                await wishRepository.addWishGoodsFolder(formData.folder_name);
                folders.value = await wishRepository.getWishGoodsFolders();                            
            } catch (e) {
                defaultCatch(e);
            }
            mmon.loading.hide();
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
    );
}
    
/**
 * 좋아요 상품 추가 
 * @param {number} folderId : 폴더 ID
 */
async function addWishedGoods(folderId: number, folderName: string) {
    if (goodsId.value === undefined) {
        return;
    }
    const { addLiked } = useLikedGoods(goodsId.value);

    mmon.loading.show();
    try {
        addLiked(folderId);
        mmon.bom.alert(`${folderName}에 담았습니다`, () => {
            router.go(-1);
        });
    } catch (error) {
        defaultCatch(error);
    } finally {
        mmon.loading.hide();
    }
}
onMounted(async() => {
    if (!goodsId.value) {
        router.go(-1);
    }
    folders.value = await wishRepository.getWishGoodsFolders();
})
</script>