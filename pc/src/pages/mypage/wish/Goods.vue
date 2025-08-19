<template>
    <div class="mm_page-content-body">
        <div class="m_my-like-prod">
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
                            :class="'S=tab-on'"
                            title="선택됨"
                        >
                            <b>찜한 아이템</b>
                        </MMLink>
                    </li>
                    <li>
                        <MMLink
                            :to="{ name: 'MypageWishBrands' }"
                        >
                            <b>찜한 브랜드</b>
                        </MMLink>
                    </li>
                </ul>
            </div>
            <!--// 탭메뉴 -->

            <!-- 폴더목록 -->
            <div class="m...prod-folder">
                <button
                    type="button"
                    class="btn_folder-add"
                    @click="addWishGoodsFolderPrompt"
                >
                    <i class="ico_folder-add" /><b>새 폴더 추가하기</b>
                </button>
                <a
                    class="btn_folder-modify"
                    href="#"
                    @click.prevent="editModalOpen()"
                >
                    <i class="ico_setup" /><b>폴더 수정</b>
                </a>
                <div class="mm_scroller">
                    <!-- (D) 선택된 폴더에 'S=folder-open' 클래스와 '선택됨' 타이틀을 추가합니다. -->
                    <ul>
                        <li
                            v-for="folder in folders"
                            :key="folder.id"
                        >
                            <button 
                                type="button" 
                                class="btn_folder" 
                                :class="currentFolder.id == folder.id ? 'S=folder-open' : ''" 
                                :title="currentFolder.id == folder.id ? '선택됨' : ''"
                                @click="fetchFolderGoods(folder.id)" 
                            >
                                <i class="ico_folder" /><b>{{ folder.name }}<small>{{ folder.recordsCount }}</small></b>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
            <!--// 폴더목록 -->

            <!-- 상품리스트 -->
            <div class="m...prod-list">
                <div class="m...prod-list-head">
                    <p>{{ currentFolder.name }}<strong>{{ currentFolder.recordsCount }}</strong></p>
                    <div class="mm_btn_box">
                        <a
                            class="mm_btn T=xs T=dark"
                            href="#"
                            @click.prevent="openSelectFolderModal"
                        ><i class="ico_folder-open" /><b>폴더이동</b></a>
                        <button
                            type="button"
                            class="mm_btn T=xs T=line T=lighter"
                            @click="removeGoods(selectedGoodsIds)"
                        >
                            <b>선택삭제</b>
                        </button>
                        <button
                            type="button"
                            class="mm_btn T=xs T=line T=lighter"
                            @click="removeAll"
                        >
                            <b>전체삭제</b>
                        </button>
                    </div>
                </div>
                <p
                    v-if="wishGoodsInFolder.length < 1"
                    class="mm_text-none"
                >
                    <i class="ico_text-none" />찜한 아이템이 없습니다
                </p>
                <ul v-else>
                    <li
                        v-for="goods in wishGoodsInFolder"
                        :key="goods.id"
                    >
                        <MMCheck 
                            v-model="selectedGoodsIds"
                            :value="goods.id"
                            :is-blind-label="true"
                        />
                        <MmGoods
                            class="T=single T=sm"
                            :goods="goods"
                            :is-show-price="false"
                        />
                        <button
                            type="button"
                            class="btn_remove"
                            @click="removeGoods([goods.id])"
                        >
                            <b class="mm_ir-blind">선택삭제</b><i class="ico_remove" />
                        </button>
                    </li>
                </ul>
            </div>
            <!--// 상품리스트 -->       
        </div>
    </div>
</template>
<script setup lang="ts">
import { defineComponent, onMounted, ref, computed } from 'vue'
import { WishGoodsFolder, WishGoodsInFolder } from '$/@type/member/wish';
import { wishRepository } from '$/repository/member/wishRepository';
import { defaultCatch } from '$/functions';
import { mmon } from '$/helper/mmon';
import { makeValidator } from '$/validator';
import MMCheck from '@/components/input/Check.vue';
import { usePageTitleSetting } from '$/composables/seoComposable';
import { useModal } from '$/composables/pageHandler/modalComposable';
import ModifyFolderModal from '@/components/modal/EditWishGoodsFolder.vue';
import SelectFolderModal from '@/components/modal/SelectWishGoodsFolder.vue';

usePageTitleSetting('찜한 아이템', ['My 찜', '마이페이지']);        
// 찜폴더 리스트
const folders = ref<WishGoodsFolder[]>([]);
// 현재 선택한 찜폴더
const currentFolderId = ref<number>(0);
const currentFolder = computed<WishGoodsFolder>(() => {
    const defaultFolder = {
        id: 0,
        name: '기본폴더',
        recordsCount: 0,
        recentGoodsThumbnailUrl: '',
        orderSeq: 0,
    }

    if (folders.value.length < 1) {
        return defaultFolder
    }

    const folder: WishGoodsFolder|undefined = folders.value.find(folder => folder.id === currentFolderId.value);
    return folder || defaultFolder;
});

// 현재 폴더 내의 찜한 상품
const wishGoodsInFolder = ref<WishGoodsInFolder[]>([]);

// checkbox 선택된 상품
const selectedGoodsIds = ref<number[]>([]);
    
onMounted(async () => {
    try {
        await fetchFolders(); // 폴더 리스트 조회
        currentFolderId.value = folders.value[0].id; // 첫번째 폴더 선택
        fetchGoodsInFolder(currentFolderId.value);
    } catch (e) {
        defaultCatch(e)
    }
});

// 폴더 내의 찜한 상품 조회 (2022.08.10 페이지네이터 제거)
async function fetchGoodsInFolder(folderId: number) {
    mmon.loading.show();
    try {
        wishGoodsInFolder.value = await wishRepository.getWishGoodsInFolder(folderId);
    } catch(e) {
        defaultCatch(e);
    } finally {
        mmon.loading.hide();
    }
}

// 폴더조회
async function fetchFolders() {
    mmon.loading.show();
    try {
        folders.value = await wishRepository.getWishGoodsFolders();
    } catch (e) {
        defaultCatch(e)
    } finally {
        mmon.loading.hide();
    }
}

// 찜상품 삭제
async function removeGoods (goodsIdList: number[]) {
    if (goodsIdList.length < 1) {
        return mmon.bom.alert('상품을 선택해주세요.');
    }

    mmon.bom.confirm('삭제하시겠습니까?', async (flag: boolean) => {
        if (flag) {
            mmon.loading.show();
            try {
                await wishRepository.deleteWishGoods(goodsIdList);
                await Promise.all([
                    fetchFolders(),
                    fetchGoodsInFolder(currentFolder.value.id)
                ]);                        
                selectedGoodsIds.value = [];
            } catch (e) {
                defaultCatch(e);
            } finally {
                mmon.loading.hide();
            }
        }
    });
}

async function fetchFolderGoods(folderId: number) {
    currentFolderId.value = folderId;
    fetchGoodsInFolder(folderId)
}

async function removeAll() {
    await removeGoods(wishGoodsInFolder.value.map((goods) => goods.id));
}

function editModalOpen() {
    useModal().open(ModifyFolderModal, {
        title: '폴더 수정하기',
        name: 'ModifyFolderModal',
        props: {
            originalFolders: folders,
            reFetch: async() => {
                await fetchFolders();
            }
        },
        onClose: () => {
            fetchFolders();
        }
    })
}

function openSelectFolderModal() {
    if (selectedGoodsIds.value.length < 1) {
        return mmon.bom.alert('상품을 선택해주세요.');
    } 
    
    useModal().open(SelectFolderModal, {
        title: '폴더 선택하기',
        name: 'SelectFolderModal',
        props: {
            originalFolders: folders,
            selectedGoodsIds: selectedGoodsIds.value,
            reFetch: async() => {
                await fetchFolders();
            }
        },
        onClose: async() => {
            await Promise.all([
                fetchGoodsInFolder(currentFolderId.value),
                fetchFolders()
            ]);
            selectedGoodsIds.value = [];
        }
    })
}

function addWishGoodsFolderPrompt() {
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
                        'name.required': ':param(을/를) 입력해주세요.',
                        'name.maxLength': ':param(은/는) 최대 :$0자까지 입력 가능합니다.',
                    })
                await validator.run();
                    
                mmon.loading.show();
                await wishRepository.addWishGoodsFolder(formData.folder_name);
                await fetchFolders();
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
</script>
