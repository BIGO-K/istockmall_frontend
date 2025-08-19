<template>
    <div class="mm_page-content">
        <!-- (D) 실제 내용을 추가하는 부분입니다. -->

        <div class="G:lnb">
            <!-- 서브상단 -->
            <div class="mm_page-content-head">
                <h3 class="mm_title">
                    <b>마이페이지</b>
                </h3>
            </div>
            <!--// 서브상단 -->

            <!-- lnb -->
            <nav class="mm_lnb">
                <h2 class="mm_lnb-title">
                    <b>마이페이지</b>
                </h2>
                <!-- (D) 현재페이지의 a요소에 S=lnb-on 클래스와 '선택됨' 타이틀을 넣어줍니다 -->
                <ul>
                    <li>
                        <MMLink 
                            :class="router.currentRoute.value.name == 'GuestMyPageOrderList' ? 'S=lnb-on' : ''"
                            :title="router.currentRoute.value.name == 'GuestMyPageOrderList' ? '선택됨' : ''"
                            :to="{ name: 'GuestMyPageOrderList' }"
                        >
                            <h6><b>주문 관리</b></h6>
                        </MMLink>
                        <ul>
                            <MMLink 
                                :class="router.currentRoute.value.name == 'GuestMyPageCancelList' ? 'S=lnb-on' : ''"
                                :title="router.currentRoute.value.name == 'GuestMyPageCancelList' ? '선택됨' : ''"
                                :to="{ name: 'GuestMyPageCancelList' }"
                            >
                                <b>주문 취소</b>
                            </MMLink>
                            <MMLink 
                                :class="router.currentRoute.value.name == 'GuestMyPageExchangeList' ? 'S=lnb-on' : ''"
                                :title="router.currentRoute.value.name == 'GuestMyPageExchangeList' ? '선택됨' : ''"
                                :to="{ name: 'GuestMyPageExchangeList' }"
                            >
                                <b>주문 교환</b>
                            </MMLink>
                            <MMLink 
                                :class="router.currentRoute.value.name == 'GuestMyPageReturnList' ? 'S=lnb-on' : ''"
                                :title="router.currentRoute.value.name == 'GuestMyPageReturnList' ? '선택됨' : ''"
                                :to="{ name: 'GuestMyPageReturnList' }"
                            >
                                <b>주문 반품</b>
                            </MMLink>
                        </ul>
                    </li>
                </ul>
            </nav>
            <!--// lnb -->

            <!-- 본문 내용 -->
            <router-view />
            <!--// 본문 내용 -->
        </div>

    <!-- 현재 페이지 스크립트 -->
    <!-- <script src="../js/.js"></script> -->
    </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
const router = useRouter();
</script>

