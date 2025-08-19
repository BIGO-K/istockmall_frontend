<template>
    <div
        class="m_modal-my-folder"
        :class="isSortable ? 'S=folder-sortable' : ''"
    >
        <div class="m...folder-head">
            <div class="mm_lside">
                <button
                    type="button"
                    class="btn_add-folder"
                    @click="addWishGoodsFolderPrompt"
                >
                    <i class="ico_add" /><b>새 폴더 추가하기</b>
                </button>
                <p class="text_sort">
                    <i class="ico_sort" />를 드래그하여 원하는 위치로 옮기세요
                </p>
            </div>
            <div class="mm_rside">
                <div class="mm_btn_box">
                    <button
                        type="button"
                        class="mm_btn T=xs T=line btn_sort-edit"
                        @click="isSortable = !isSortable"
                    >
                        <i class="ico_modify" /><b>순서편집</b>
                    </button>
                    <button
                        type="button"
                        class="mm_btn T=xs T=line btn_sort-cancel"
                        @click="resetSort"
                    >
                        <i class="ico_modify" /><b>편집취소</b>
                    </button>
                    <button
                        type="button"
                        class="mm_btn T=xs T=primary btn_sort-complete"
                        @click="updateSort"
                    >
                        <b>저장</b>
                    </button>
                </div>
            </div>
        </div>
        <draggable
            tag="ul"
            :list="folders"
            :disabled="!isSortable"
            drag-class="S=sortable-changed"
            handle=".btn_sort-handler"
            item-key="id"
        >
            <template #item="{ element }">
                <li>
                    <button
                        type="button"
                        class="btn_sort-handler"
                    >
                        <i class="ico_sort" /><b class="mm_ir-blind">순서이동</b>
                    </button>
                    <i
                        v-if="element.recentGoodsThumbnailUrl"
                        v-lazyload="element.recentGoodsThumbnailUrl"
                        class="mm_bg-cover image_product"
                    />
                    <i
                        v-else
                        class="ico_like"
                    />
                    <p class="text_folder">
                        {{ element.name }}<small>{{ element.recordsCount }}</small>
                    </p>
                    <div
                        v-if="element.id != 0"
                        class="mm_btn_box"
                    >
                        <button
                            type="button"
                            class="mm_btn T=xs T=line T=light"
                            @click="nameEditPrompt(element.id, element.name)"
                        >
                            <b>수정</b>
                        </button>
                        <button
                            type="button"
                            class="btn_remove"
                        >
                            <i
                                class="ico_remove"
                                @click="remove(element.id)"
                            /><b class="mm_ir-blind">폴더 삭제</b>
                        </button>
                    </div>
                </li>
            </template>
        </draggable>
    </div>
</template>

<script setup lang='ts'>
import { ref, watch } from 'vue'
import { WishGoodsFolder } from '$/@type/member/wish';
import { mmon } from '$/helper/mmon';
import { wishRepository } from '$/repository/member/wishRepository';
import { makeValidator } from '$/validator';
import { defaultCatch } from '$/functions';
import draggable from "vuedraggable";
import { ModalCloseHandler } from '$/@type/Modal';

const props = defineProps<{
    originalFolders: WishGoodsFolder[],
    closer: ModalCloseHandler<void>,
    reFetch: () => void
}>();


/** VARIABLE */
const isSortable = ref<boolean>(false);
const folders = ref<WishGoodsFolder[]>([])
folders.value = ([] as WishGoodsFolder[]).concat(props.originalFolders);


watch(() => props.originalFolders, () => {
    folders.value = ([] as WishGoodsFolder[]).concat(props.originalFolders);
})
        
// 순서편집 취소
function resetSort() {
    isSortable.value = false;
    // 총 폴더 개수가 2개 이하인경우
    if (folders.value.length < 2) {
        return;
    }    
    folders.value = ([] as WishGoodsFolder[]).concat(props.originalFolders);
}

function nameEditPrompt(folderId: number, folderName: string) {
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
                mmon.loading.show();
                await validator.run();
                await wishRepository.updateWishFolder(folderId, formData.folder_name);
                props.reFetch();
            } catch (e) {
                defaultCatch(e);
            }
            mmon.loading.hide();
        },
        {
            title: '폴더 이름 변경',
            forms: [
                {
                    type: 'text',
                    name: 'folder_name',
                    placeholder: '최대 10자 입력',
                    value: folderName,
                    maxLength: 10,
                }
            ]
        }
    )
}
function addWishGoodsFolderPrompt() {
    mmon.bom.prompt(
        "", 
        async (flag: boolean, formData: { folder_name: string}) => {
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
                        'name.required': ':param(을/를) 입력해주세요.',
                        'name.maxLength': ':param(은/는) 최대 :$0자까지 입력 가능합니다.',
                    })
                await validator.run();
                mmon.loading.show();
                await wishRepository.addWishGoodsFolder(formData.folder_name);
                props.reFetch();
            } catch (e) {
                defaultCatch(e);
            } finally {
                mmon.loading.hide();
            }
            
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
async function updateSort()  {
    try {
        const sorts: Pick<WishGoodsFolder, "id"|"orderSeq">[] = folders.value.map((folder, index) => {
            if (folder.id == 0 && index !== 0) {
                throw new Error('기본폴더의 순서는 변경할 수 없습니다.');
            }
            return {
                id: folder.id,
                orderSeq: index,
            }
        });

        //기본폴더 제외
        sorts.shift();
        
        // 기본폴더 제외한 폴더 수가 2개 이하인 경우
        if (sorts.length < 2) {
            isSortable.value = false
            return;
        } 
        
        mmon.loading.show();
        await wishRepository.updateWishGoodsFolderSort(sorts);
        isSortable.value = false
        props.reFetch();
    } catch (e) {
        defaultCatch(e);
        resetSort();
    } finally {
        mmon.loading.hide();
    }
    
}
async function remove(folderId: number) {
    mmon.bom.confirm('폴더를 삭제하시겠습니까?<br>삭제된 폴더는 복구할 수 없습니다.', async(flag: boolean) => {
        if (flag) {
            mmon.loading.show();
            try {
                await wishRepository.deleteWishGoodsFolder(folderId);
                props.reFetch();
            } catch (e) {
                defaultCatch(e);
            } finally {
                mmon.loading.hide();
            }
        }
    });
}
/** FUNCTION */

/** VUE LIFE CYCLE */

</script>
