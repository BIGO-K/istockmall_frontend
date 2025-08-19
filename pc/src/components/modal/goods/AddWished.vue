<template>
    <div class="m_modal-like-folder">
        <button
            type="button"
            class="btn_add-folder"
            @click="addWishGoodsFolderPrompt"
        >
            <i class="ico_add" /><b>새 폴더 추가하기</b>
        </button>
        <p class="text_tooltip">
            상품을 <strong>담을 폴더</strong>를 선택하세요
        </p>
        <ul>
            <li
                v-for="folder in folders"
                :key="folder.id"
            >
                <button
                    type="button"
                    @click="addWishGoods(folder)"
                >
                    <i
                        v-if="folder.recentGoodsThumbnailUrl"
                        v-lazyload="{ src: folder.recentGoodsThumbnailUrl }"
                        class="mm_bg-cover image_product"
                    />
                    <i
                        v-else
                        class="ico_like"
                    />
                    <p class="text_folder">
                        {{ folder.name }}<small>{{ folder.recordsCount }}</small>
                    </p>
                </button>
            </li>
        </ul>
    </div>
</template>

<script setup lang='ts'>
import { WishGoodsFolder } from '$/@type/member/wish';
import { mmon } from '$/helper/mmon';
import { wishRepository } from '$/repository/member/wishRepository';
import { makeValidator } from '$/validator';
import { defaultCatch } from '$/functions';
import { useLikedGoods } from '$/composables/shoppingComposable';
import { ModalCloseHandler } from '$/@type/Modal';
import { ref } from 'vue';

const props = defineProps<{
    goodsId: number,
    folders: WishGoodsFolder[],
    closer: ModalCloseHandler<void>
}>();

const folders = ref(props.folders)
const { addLiked } = useLikedGoods(props.goodsId);
/** VARIABLE */

/** FUNCTION */
function addWishGoodsFolderPrompt() {
    mmon.bom.prompt(
        '', 
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
            title: '새 폴더 추가하기',
            forms: [
                {
                    type: 'text',
                    name: 'folder_name',
                    placeholder: '최대 10자 입력',
                    maxLength: 10,
                }
            ]
        }
    );
}
async function addWishGoods(folder: WishGoodsFolder) {
    try {
        mmon.loading.show()
        addLiked(folder.id);
        mmon.bom.alert(`${folder.name}에 담았습니다.`, () => { props.closer() });
    } catch (e) {
        defaultCatch(e);
    }
    mmon.loading.hide();
}

/** VUE LIFE CYCLE */

</script>
