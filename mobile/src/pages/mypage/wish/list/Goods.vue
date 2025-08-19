<template>
    <div class="m_mylike-folder" :class="isSortable ? 'S=sortable' : ''">
        <!-- 상단영역 -->
        <div class="m_mylike-folder-head">
            <div class="mm_lside">
                <button type="button" class="btn_add-folder" @click="addFolder">
                    <i class="ico_add" />
                    <b>새 폴더 추가하기</b>
                </button>
                <p class="text_sortable-note">
                    <i class="ico_sortable-handle"><span class="mm_ir-blind">순서이동 버튼</span></i>을 눌러 순서를 편집하세요
                </p>
            </div>
            <div class="mm_rside">
                <button
                    type="button"
                    class="mm_btn T=sm T=line T=light btn_sort-edit"
                    @click="isSortable = !isSortable"
                >
                    <i class="ico_sortable" />
                    <b>순서편집</b>
                </button>
                <button
                    type="button"
                    class="mm_btn T=sm T=line T=light btn_sort-cancel" 
                    @click="isSortable = false; fetchFolders();"
                >
                    <b>취소</b>
                </button>
                <button
                    type="button"
                    class="mm_btn T=sm T=primary btn_sort-complete"
                    @click="updateSort"
                >
                    <b>저장</b>
                </button>
            </div>
        </div>
        <!--// 상단영역 -->

        <!-- 폴더목록 -->
        <draggable
            tag="ul"
            :list="folders"
            :disabled="!isSortable"
            handle=".btn_sort-handler"
            item-key="id"
        >
            <template #item="{ element }">
                <li>
                    <MMLink 
                        :to="element.recordsCount > 0 
                            ? { name: 'MypageWishGoodsFolderDetail', params: { id: element.id } } 
                            : {}"
                    >
                        <i
                            v-lazyload="{ src: element.recentGoodsThumbnailUrl }"
                            :class="['mm_bg-contain image_product', element.recordsCount === 0 ? 'ico_like' : '']"
                        />
                        <b>
                            <span>{{ element.name }}</span>
                            <small>{{ element.recordsCount }}</small>
                        </b>
                    </MMLink>
                    <div class="mm_btn_box">
                        <div class="mm_inline">
                            <button
                                v-if="element.id != 0"
                                type="button"
                                class="mm_btn T=2xs T=line T=lighter btn_modify"
                                @click="nameEditPrompt(element.id, element.name)"
                            >
                                <b>수정</b>
                            </button>
                            <button
                                v-if="element.id != 0"
                                type="button"
                                class="btn_remove"
                                @click="removeFolder(element.id)"
                            >
                                <i class="ico_remove" />
                                <b class="mm_ir-blind">폴더 삭제</b>
                            </button>
                            <button v-if="element.id != 0" type="button" class="btn_sort-handler">
                                <i class="ico_sortable-handle" /><b class="mm_ir-blind">순서이동</b>
                            </button>
                        </div>
                    </div>
                </li>
            </template>
        </draggable>
        <!--// 폴더목록 -->
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { WishGoodsFolder } from '$/@type/member/wish';
import { wishRepository } from '$/repository/member/wishRepository';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import { makeValidator } from '$/validator';
import draggable from "vuedraggable";
import MMLink from '@/components/MMLink.vue';
import { usePageTitleSetting } from '$/composables/seoComposable';

usePageTitleSetting('찜한 아이템', ['My 찜', '마이페이지']);
const isSortable = ref<boolean>(false);
        
// 찜 폴더 리스트
const folders = ref<WishGoodsFolder[]>([]);

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

// 폴더 이름 변경
async function nameEditPrompt(folderId: number, folderName: string) {
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
                        'name.required': ':param(을/를) 입력해 주세요.',
                        'name.maxLength': ':param(은/는) 최대 :$0자까지 입력 가능합니다.',
                    })
                        
                mmon.loading.show();
                await validator.run();
                await wishRepository.updateWishFolder(folderId, formData.folder_name);
            } catch (e) {
                defaultCatch(e);
            } finally {
                fetchFolders();
                mmon.loading.hide();
            }
        },
        {
            title: "폴더 이름 변경",
            forms: [
                {
                    type: "text",
                    name: "folder_name",
                    placeholder: "최대 10자 입력",
                    value: folderName,
                    maxLength: 10,
                }
            ]
        }
    )
}

// 폴더 삭제
async function removeFolder(folderId: number) {
    mmon.bom.confirm('폴더를 삭제하시겠습니까?<br>삭제된 폴더는 복구할 수 없습니다.', async(flag: boolean) => {
        if (!flag) {
            return;
        }
        
        mmon.loading.show();
        try {
            await wishRepository.deleteWishGoodsFolder(folderId);
        } catch (e) {
            defaultCatch(e);
        } finally {
            fetchFolders();
            mmon.loading.hide();
        }
    });
}

// 순서 변경 저장
async function updateSort() {
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
        isSortable.value = false;
    } catch (e) {
        defaultCatch(e);
        isSortable.value = false;
    } finally {
        fetchFolders();
        mmon.loading.hide();
    }
}

onMounted(async () => {
    fetchFolders(); // 폴더 리스트 조회
});
</script>