<template>
    <div class="mm_view" :class="$route.meta.layout">
        <!-- 헤더 -->
        <!--// 헤더 -->

        <!-- 내용 -->
        <div id="mm_body" class="mm_page">
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="m_popup-sign">
                            <!-- 페이지제목 -->
                            <div class="m_popup-sign-title">
                                <h3 class="mm_title">
                                    <b>정보 보호를 위해 6개월마다<br><strong>비밀번호를 변경해주세요</strong></b>
                                </h3>
                                <b>‘다음에 변경’ 시 1개월간 안내를 받지않습니다</b>
                            </div>
                            <!--// 페이지제목 -->

                            <form>
                                <!-- 비밀번호입력 -->
                                <h6 class="mm_strapline">
                                    <b>현재 비밀번호</b>
                                </h6>
                                <div class="mm_form-text">
                                    <button type="button" class="btn_text-pw">
                                        <i class="mco_pw-hide" /><b class="mm_ir-blind">비밀번호 보기</b>
                                    </button>
                                    <button type="button" class="btn_text-clear">
                                        <i class="mco_form-clear" /><b class="mm_ir-blind">지우기</b>
                                    </button>
                                    <label>
                                        <input type="password" class="textfield" data-text minlength="8" maxlength="16"><i class="bg_text" />
                                        <span class="text_placeholder">현재 비밀번호를 입력하세요</span>
                                    </label>
                                </div>
                                <h6 class="mm_strapline">
                                    <b>새 비밀번호</b>
                                </h6>
                                <div class="mm_form-text">
                                    <button type="button" class="btn_text-pw">
                                        <i class="mco_pw-hide" /><b class="mm_ir-blind">비밀번호 보기</b>
                                    </button>
                                    <button type="button" class="btn_text-clear">
                                        <i class="mco_form-clear" /><b class="mm_ir-blind">지우기</b>
                                    </button>
                                    <label>
                                        <input type="password" class="textfield" data-text minlength="8" maxlength="16"><i class="bg_text" />
                                        <span class="text_placeholder">새 비밀번호를 입력하세요</span>
                                    </label>
                                </div>
                                <h6 class="mm_strapline">
                                    <b>새 비밀번호 확인</b>
                                </h6>
                                <div class="mm_form-text">
                                    <button type="button" class="btn_text-pw">
                                        <i class="mco_pw-hide" /><b class="mm_ir-blind">비밀번호 보기</b>
                                    </button>
                                    <button type="button" class="btn_text-clear">
                                        <i class="mco_form-clear" /><b class="mm_ir-blind">지우기</b>
                                    </button>
                                    <label>
                                        <input type="password" class="textfield" data-text minlength="8" maxlength="16"><i class="bg_text" />
                                        <span class="text_placeholder">비밀번호를 한번 더 입력하세요</span>
                                    </label>
                                </div>
                                <!--// 비밀번호입력 -->

                                <!-- 하단버튼 -->
                                <div class="mm_foot">
                                    <div class="mm_btnbox">
                                        <button type="button" class="mm_btn __btn_primary__">
                                            <b>비밀번호 변경하기</b>
                                        </button>
                                        <a class="mm_btn __btn_line__" href="#" data-href="{ '_type': 'link' }"><b>다음에 변경하기</b></a>
                                    </div>
                                </div>
                                <!--// 하단버튼 -->
                                <input hidden>
                            </form>
                        </div>
                    </div>
                    <!--// 본문 -->
                </div>
            </div>

            <a class="btn_topmost" href="#mm_app" data-href="{ '_type': 'anchor' }" title="페이지 처음으로"><i class="mco_topmost" /><b>TOP</b></a>
        </div>
        <!--// 내용 -->
    </div>
</template>