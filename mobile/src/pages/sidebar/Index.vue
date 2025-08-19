<template>
    <div :class="['mm_view', $route.meta.layouts]">
        <MMHeader>
            <template #baseHeaderTitle>
                <h1 v-if="isUser">
                    <i v-lazyload="{ src: user?.grade.imageUrl }" class="mm_bg-contain image_grade" /><b><strong>{{ user?.grade.name }}</strong>{{ user?.name }}님, 환영합니다</b>
                </h1>
                <h1 v-else>
                    <MMLink :to="{ name : 'Login' }">
                        <b>로그인이 필요합니다<i class="ico_link" /></b>
                    </MMLink>
                </h1>
            </template>
            <template #extra>
                <!-- 사이드바 퀵메뉴 -->
                <ul class="mm_flex T=auto m_sidebar-menu">
                    <li>
                        <MMLink :to="{ name : 'Mypage'}">
                            <i class="ico_mypage" /><b>마이페이지</b>
                        </MMLink>
                    </li>
                    <li>
                        <MMLink :to="{ name : 'MypageOrder'}">
                            <i class="ico_ship" /><b>배송조회</b>
                        </MMLink>
                    </li>
                    <li>
                        <MMLink :to="{ name : 'MypageWish'}">
                            <i class="ico_like" /><b>찜상품</b>
                        </MMLink>
                    </li>
                </ul>
            <!--// 사이드바 퀵메뉴 -->
            </template>
        </MMHeader>
        <div id="mm_body" class="mm_page">
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <!-- 사이드바 탭 -->
                        <div class="mm_full">
                            <div class="mm_tab m_sidebar-tab">
                                <!-- 탭메뉴 -->
                                <div class="mm_tab_menu T=full">
                                    <!-- (D) 선택된 탭메뉴에 'S=tab-on' 클래스와 '선택됨' 타이틀을 추가합니다. -->
                                    <ul class="mm_flex T=equal">
                                        <li>
                                            <a 
                                                :class="['btn_tab', { 'S=tab-on' : tabName === 'category' }]"
                                                href="#" 
                                                :title="tabName === 'category' ? '선택됨' : ''"
                                                @click.prevent="tab('category')"
                                            >
                                                <b>아이템</b>
                                            </a>
                                        </li>
                                        <li>
                                            <a 	
                                                :class="['btn_tab', { 'S=tab-on' : tabName === 'brand' }]"
                                                href="#" 
                                                :title="tabName === 'brand' ? '선택됨' : ''"
                                                @click.prevent="tab('brand')"
                                            >
                                                <b>브랜드</b>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <!--// 탭메뉴 -->
                                <!-- 아이템 -->
                                <div :class="['mm_tab-item', { 'S=tab-on' : tabName === 'category' }]">
                                    <SideBarCategory 
                                        :all-categories="allCategories"
                                    />
                                </div>
                                <!--// 아이템 -->

                                <!-- 브랜드 검색 -->
                                <div :class="['mm_tab-item', { 'S=tab-on' : tabName === 'brand' }]">
                                    <SideBarBrand />
                                </div>

                                <!--// 브랜드 검색 -->
                            </div>
                        </div>
                        <!--// 사이드바 탭 -->
                    </div>
                    <!--// 본문 -->
                </div>
            </div>
            <div class="mm_btn_box T=fixed m_sidebar-footer">
                <div class="mm_flex T=equal">
                    <MMLink :to="{ name: 'CsCenter'}">
                        <i class="ico_cs" /><b>고객센터</b>
                    </MMLink>
                    <MMLink :to="{ name : 'Setting' }">
                        <i class="ico_setup" /><b>계정관리</b>
                    </MMLink>
                </div>
            </div>			
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onBeforeMount } from 'vue';
import { useRefreshUser, useUserState } from '$/composables/auth/userComposable';
import { LocationQuery, useRoute, useRouter } from 'vue-router';
import { categoryRepository } from '$/repository/category/categoryRepository';
import { Category } from '$/@type/category';
import SideBarBrand from '@/pages/sidebar/Brand.vue';
import SideBarCategory from '@/pages/sidebar/Category.vue'

export default defineComponent({
    components: {
        SideBarBrand,
        SideBarCategory
    },
    beforeRouteEnter: async (to, from, next) => {
        // ...
        const categories = await categoryRepository.getAllCategoryList();
        next(vm => vm.setBaseData(categories));
    },
    setup() {
        const route = useRoute()
        const router = useRouter()

        // 회원 관련
        const { user, isUser } = useUserState();
        const tabName = ref(route.query.tab || 'category');
        
        onBeforeMount(() => {
            if (isUser.value) {
                useRefreshUser();
            }
        })

        const categoryQuery = ref<LocationQuery|null>(null)
        const brandQuery = ref<LocationQuery|null>(null)
        const categoryHash = ref<string>('')
        const brandHash = ref<string>('')
        function tab(selectedTab: string) {
            if (selectedTab == 'category') {
                brandQuery.value = route.query
                brandHash.value = route.hash
            } else {
                categoryQuery.value = route.query
                categoryHash.value = route.hash
            }

            tabName.value = selectedTab
            router.replace({
                path: route.path,
                query: {
                    tab: tabName.value,
                    ...(selectedTab == 'category' ? categoryQuery.value : brandQuery.value)
                },
                hash: selectedTab == 'category' ? categoryHash.value : brandHash.value,
            })
        }


        const allCategories = ref<Category[]>([]);

        function setBaseData(categories: Category[]) {
            allCategories.value = categories
        }
        return {            
            tabName,
            isUser,
            user,            
            tab,
            setBaseData,
            allCategories
        }
    }
})
</script>
