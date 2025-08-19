<template>
    <MMPopup>
        <template #headerTitle>
            <h1><b>반품/환불 안내</b></h1>
        </template>
        <template #contents>
            <div class="mm_scroller">
                <div class="mm_page-inner">
                    <!-- 본문 -->
                    <div class="mm_page-content">
                        <div class="m_popup-cs">
                            <div class="mm_accordion">
                                <ul>
                                    <li>
                                        <dl
                                            :class="['mm_dropdown', { 'S=on' : check === 1 }]"
                                            @click="() => {
                                                orderOfGuidance = 1;
                                                check = check === orderOfGuidance ? 0 : orderOfGuidance;
                                            }"
                                        >
                                            <dt class="btn_dropdown" tabindex="0" :title="check === 1 ? '접어보기' : '펼쳐보기'">
                                                <p><b>반품신청 방법</b></p><i class="ico_dropdown" />
                                            </dt>
                                            <dd class="mm_dropdown-item" :style="check === 1 ? { height: 'auto' } : {}">
                                                <div class="mm_dropdown-item-inner">
                                                    <ul>
                                                        <li><p>주문 제작하신 상품 및 해외 배송 상품은 반품이 불가하여 리스트에 노출되지 않습니다.</p></li>
                                                        <li><p>반품은 배송 완료 이후 7일 이내 신청 가능합니다.</p></li>
                                                        <li><p>반품 사유별 배송비 부담이 상이합니다.</p></li>
                                                        <li><p>묶음 반품의 경우 동일한 업체에 한해서 가능합니다.</p></li>
                                                        <li><p>반품 신청은 <strong class="text_highlight">[<span>마이페이지 &#62; 주문관리</span>]</strong> 및 <strong class="text_highlight">[<span>1:1 고객상담</span>]</strong>에 반품 문의하시거나 유선상 업체 연락처로 반품 신청해주시기 바랍니다.</p></li>
                                                    </ul>
                                                </div>
                                            </dd>
                                        </dl>
                                    </li>
                                    <li>
                                        <dl 
                                            :class="['mm_dropdown', { 'S=on' : check === 2 }]"
                                            @click="() => {
                                                orderOfGuidance = 2;
                                                check = check === orderOfGuidance ? 0 : orderOfGuidance;
                                            }"
                                        >
                                            <dt class="btn_dropdown" tabindex="0" :title="check === 2 ? '접어보기' : '펼쳐보기'">
                                                <p><b>반품진행 과정</b></p><i class="ico_dropdown" />
                                            </dt>
                                            <dd class="mm_dropdown-item" :style="check === 2 ? { height: 'auto' } : {}">
                                                <div class="mm_dropdown-item-inner">
                                                    <div class="m_popup-cs-step">
                                                        <ol>
                                                            <li>
                                                                <span class="text_step">STEP 1</span>
                                                                <p><strong class="text_highlight">[<span>반품신청</span>]</strong> 고객님께서 반품을 신청한 상태</p>
                                                            </li>
                                                            <li>
                                                                <span class="text_step">STEP 2</span>
                                                                <p><strong class="text_highlight">[<span>반품신청</span>]</strong> 상품이 반송지에 도착/확인 중 상태</p>
                                                            </li>
                                                            <li>
                                                                <span class="text_step">STEP 3</span>
                                                                <p><strong class="text_highlight">[<span>반품완료</span>]</strong> 반품(환불)이 완료된 상태</p>
                                                            </li>
                                                        </ol>
                                                    </div>
                                                </div>
                                            </dd>
                                        </dl>
                                    </li>
                                    <li>
                                        <dl 
                                            :class="['mm_dropdown', { 'S=on' : check === 3 }]"
                                            @click="() => {
                                                orderOfGuidance = 3;
                                                check = check === orderOfGuidance ? 0 : orderOfGuidance;
                                            }"
                                        >
                                            <dt class="btn_dropdown" tabindex="0" :title="check === 3 ? '접어보기' : '펼쳐보기'">
                                                <p><b>반품 수거</b></p><i class="ico_dropdown" />
                                            </dt>
                                            <dd class="mm_dropdown-item" :style="check === 3 ? { height: 'auto' } : {}">
                                                <div class="mm_dropdown-item-inner">
                                                    <ul>
                                                        <li><p><strong class="text_highlight">[<span>마이페이지 &#62; 주문관리 &#62; 반품 신청 완료</span>]</strong>에서 완료 처리가 되었을 경우, 해당 택배사에 자동으로 반품 수거가 예약되므로 고객은 별도의 택배사 수거 접수 필요하지 않습니다.</p></li>
                                                        <li><p>판매자와 협의 없이 판매자의 지정 택배사가 아닌 타 업체를 이용한 경우 상품이 반송처리될 수 있으며, 이때 발생된 추가 배송료는 고객 부담입니다.</p></li>
                                                        <li><p>현재 일부 상품은 자동 반품 수거 서비스가 제공되지 않으므로 '반품 수거 접수' 요청 메시지가 나올 경우, 고객님께서 직접 반품 수거 예약을 택배사에 해야 합니다.</p></li>
                                                        <li><p>반품 신청이 접수 후, 영업일 기준 2~3일 이내에 택배 수거 방문이 없을 시 해당 택배사로 문의해 주세요.</p></li>
                                                    </ul>
                                                </div>
                                            </dd>
                                        </dl>
                                    </li>
                                    <li>
                                        <dl 
                                            :class="['mm_dropdown', { 'S=on' : check === 4 }]"
                                            @click="() => {
                                                orderOfGuidance = 4;
                                                check = check === orderOfGuidance ? 0 : orderOfGuidance;
                                            }"
                                        >
                                            <dt class="btn_dropdown" tabindex="0" :title="check === 4 ? '접어보기' : '펼쳐보기'">
                                                <p><b>반품 배송료</b></p><i class="ico_dropdown" />
                                            </dt>
                                            <dd class="mm_dropdown-item" :style="check === 4 ? { height: 'auto' } : {}">
                                                <div class="mm_dropdown-item-inner">
                                                    <ul>
                                                        <li>
                                                            <dl>
                                                                <dt><span class="text_indent">1.</span><p>구매자가 부담하는 경우</p></dt>
                                                                <dd><p>단순 변심, 사이즈/색상 변경, 배송지 잘못 입력</p></dd>
                                                            </dl>
                                                        </li>
                                                        <li>
                                                            <dl>
                                                                <dt><span class="text_indent">2.</span><p>판매자가 부담하는 경우</p></dt>
                                                                <dd><p>상품 자체의 파손/손상/오염</p></dd>
                                                                <dd><p>판매자가 제공한 상품의 상세정보와 실제 상품의 불일치</p></dd>
                                                            </dl>
                                                        </li>
                                                        <li><span class="text_indent">3.</span><p>판매자의 상품이 조건부 무료배송일 경우 결제 금액에서 배송료가 차감되어 환불 처리됩니다.</p></li>
                                                        <li><span class="text_indent">4.</span><p>반품 시 부과되는 배송료는 환불 예정금액에서 차감됩니다.</p></li>
                                                        <li><span class="text_indent">5.</span><p>상품을 보낼 때 배송료를 동봉하여 보낸 경우 환불 금액에서 차이가 발생할 수 있으니 유의하시기 바랍니다.</p></li>
                                                    </ul>
                                                </div>
                                            </dd>
                                        </dl>
                                    </li>
                                    <li>
                                        <dl 
                                            :class="['mm_dropdown', { 'S=on' : check === 5 }]"
                                            @click="() => {
                                                orderOfGuidance = 5;
                                                check = check === orderOfGuidance ? 0 : orderOfGuidance;
                                            }"
                                        >
                                            <dt class="btn_dropdown" tabindex="0" :title="check === 5 ? '접어보기' : '펼쳐보기'">
                                                <p><b>반품이 불가능한 경우</b></p><i class="ico_dropdown" />
                                            </dt>
                                            <dd class="mm_dropdown-item" :style="check === 5 ? { height: 'auto' } : {}">
                                                <div class="mm_dropdown-item-inner">
                                                    <p>전자 상거래 등에서의 소비자 보호에 관한 법률 제 17조에 의거한 반품이 불가능한 경우는 아래와 같습니다.</p>
                                                    <ul>
                                                        <li>
                                                            <dl>
                                                                <dt><span class="text_indent">1.</span><p>반품 신청 기간 경과</p></dt>
                                                                <dd><p>구매자 단순 변심: 상품 수령 후 7일 이내 </p></dd>
                                                                <dd><p>판매자가 제공한 상품의 상세 정보와 실제 상품의 불일치: 상품 수령 후 3개월 이내 또는 그 사실을 안 날로부터 30일 이내</p></dd>
                                                            </dl>
                                                        </li>
                                                        <li><span class="text_indent">2.</span><p>구매자의 책임 사유로 상품의 멸실 또는 훼손(내용 확인을 위한 포장 훼손은 제외)</p></li>
                                                        <li><span class="text_indent">3.</span><p>구매자의 사용 또는 일부 소비에 의한 상품 가치 감소</p></li>
                                                        <li><span class="text_indent">4.</span><p>시간의 경과에 의한 재 판매가 곤란할 정도의 상품 가치 감소</p></li>
                                                        <li><span class="text_indent">5.</span><p>복제가 가능한 상품의 포장 훼손</p></li>
                                                    </ul>
                                                </div>
                                            </dd>
                                        </dl>
                                    </li>
                                    <li>
                                        <dl 
                                            :class="['mm_dropdown', { 'S=on' : check === 6 }]"
                                            @click="() => {
                                                orderOfGuidance = 6;
                                                check = check === orderOfGuidance ? 0 : orderOfGuidance;
                                            }"
                                        >
                                            <dt class="btn_dropdown" tabindex="0" :title="check === 6 ? '접어보기' : '펼쳐보기'">
                                                <p><b>환불 안내</b></p><i class="ico_dropdown" />
                                            </dt>
                                            <dd class="mm_dropdown-item" :style="check === 6 ? { height: 'auto' } : {}">
                                                <div class="mm_dropdown-item-inner">
                                                    <ul>
                                                        <li>
                                                            <p>반품 상품의 입고 이후, 3~5일 이내에 상품 검수가 이루어집니다. 판매자와 구매자 간 반품 사유에 대한 문제가 없을 시, 실제 환불처리가 진행됩니다.</p>
                                                            <table>
                                                                <colgroup>
                                                                    <col style="width:29.66666%;">
                                                                    <col>
                                                                    <col style="width:32.74336%;">
                                                                </colgroup>
                                                                <thead>
                                                                    <tr>
                                                                        <th scope="col">
                                                                            <b>결제수단</b>
                                                                        </th>
                                                                        <th scope="col">
                                                                            <b>환불방식</b>
                                                                        </th>
                                                                        <th scope="col">
                                                                            <b>환불 소요 기간</b>
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr>
                                                                        <th scope="row">
                                                                            <b>신용카드 결제</b>
                                                                        </th>
                                                                        <td>카드 승인 취소</td>
                                                                        <td>반품완료 +7~10일</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th scope="row">
                                                                            <b>실시간 계좌이체</b>
                                                                        </th>
                                                                        <td>입금계좌로 환불</td>
                                                                        <td>반품완료 +1~2 일</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th scope="row">
                                                                            <b>무통장 입금</b>
                                                                        </th>
                                                                        <td>등록된 환불계좌로 입금</td>
                                                                        <td>반품완료 +1일</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th scope="row">
                                                                            <b>휴대폰 결제</b>
                                                                        </th>
                                                                        <td>당월 전액 취소 시: 휴대폰 결제 취소 부분 취소/익월 취 소 시: 등록된 환불 계좌로 입금</td>
                                                                        <td>반품완료 +2일</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </li>
                                                        <li><p>환불 소요 기간은 영업일 기준으로 토/일/공휴일은 제외 됩니다.</p></li>
                                                        <li><p>신용카드 승인/취소 기간은 카드사별로 차이가 있으며, 승인 취소 확인에 대한 문의는 해당 카드사로 직접 문의 해 주시기 바랍니다.</p></li>
                                                        <li><p>고객님의 단순 변심에 의한 반품일 경우, 주문 시 사용한 쿠폰은 복원이 불가능합니다.</p></li>
                                                    </ul>
                                                </div>
                                            </dd>
                                        </dl>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <!--// 본문 -->
                </div>
            </div>
        </template>
    </MMPopup>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MMPopup from '@/components/layout/Popup.vue';
import { usePageTitleSetting } from '$/composables/seoComposable';

usePageTitleSetting('반품/환불 안내');

const orderOfGuidance = ref(0);	// 안내 순번
const check = ref(0);			// 순번 체크 
</script>