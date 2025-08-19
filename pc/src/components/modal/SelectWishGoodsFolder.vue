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
                    @click="updateWishGoods(folder)"
                >
                    <i
                        v-if="folder.recentGoodsThumbnailUrl"
                        v-lazyload="folder.recentGoodsThumbnailUrl"
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
import { computed } from 'vue';
import { WishGoodsFolder } from '$/@type/member/wish';
import { mmon } from '$/helper/mmon';
import { wishRepository } from '$/repository/member/wishRepository';
import { makeValidator } from '$/validator';
import { defaultCatch } from '$/functions';
import { applyZosa } from '$/filters';
import { ModalCloseHandler } from '$/@type/Modal';

const props = defineProps<{
    originalFolders: WishGoodsFolder[],
    selectedGoodsIds: number[],
    reFetch: () => void,
    closer: ModalCloseHandler<void>,
}>();

/** VARIABLE */
const folders = computed<WishGoodsFolder[]>(() => {
    return props.originalFolders
})

/** FUNCTION */
function addWishGoodsFolderPrompt() {
    mmon.bom.prompt(
        '', 
        async (flag: boolean, formData: { folder_name: string }) => {
            if (!flag) {
                return
            } 

            mmon.loading.show();
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
                await wishRepository.addWishGoodsFolder(formData.folder_name);
                props.reFetch();
            } catch (e) {
                defaultCatch(e);
            }
            mmon.loading.hide();
        }, 
        {
            title: '새 폴더 추가하기',
            forms: [
                {
                    name: 'folder_name',
                    type: 'text',
                    placeholder: '최대 10자 입력',
                    maxLength: 10,
                }
            ]
        }
    );
}

async function updateWishGoods(folder: WishGoodsFolder) {
    if (props.selectedGoodsIds.length < 1) {
        return mmon.bom.alert('상품이 선택되지 않았습니다.');
    }

    try {
        mmon.loading.show()
        await wishRepository.updateWishGoods(props.selectedGoodsIds, folder.id);
        mmon.bom.alert(applyZosa(`${folder.name}(으로/로) 이동되었습니다.`), () => {
            props.closer();
        });
    } catch (e) {
        defaultCatch(e);
    }
    mmon.loading.hide();
}
/** VUE LIFE CYCLE */
</script>
