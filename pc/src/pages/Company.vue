<template>
    <div class="mm_page-content">
        <!-- (D) 실제 내용을 추가하는 부분입니다. -->
        <div class="m_company">
            <header>
                <h2>고객의 라이프에 집중하기 위해<br>고객사의 이커머스 비즈니스를 위해<br>가치있고 새로운 변화를 실행중입니다.</h2>
                <div class="contents">
                    <img 
                        v-lazyload="{ src: '/image/content/stockcompany_logo_w.png' }"
                        src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                        alt="스탁컴퍼니"
                    >
                </div>
            </header>
            
            <!-- 회사소개 -->
            <div class="introduce_wrap company_info">
                <h3>회사소개</h3>
                <div class="mm_inner">
                    <dl>
                        <dt>
                            <img 
                                v-lazyload="{ src: '/image/content/thumb_02.jpg' }"
                                src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                                alt=""
                            >
                        </dt>
                        <dd>
                            <strong>스탁컴퍼니</strong>는 2004년 창립 이후 18년간 축적해 온 온라인 유통사업의 노하우를 가지고 있으며, 주요 사업은 탄탄한 '온라인 유통사업'을 필두로 자사몰인 '아이스탁몰 운영'과 '3PL 물류 사업'이 있습니다.<br><br>수 많은 브랜드의 온라인 비즈니스를 안정적으로 정착시켰으며, 더 나은 이커머스 비즈니스를 위한 온라인 솔루션을 꾸준히 제안하고 있습니다.
                        </dd>
                    </dl>
                    <dl>
                        <dt>
                            <img 
                                v-lazyload="{ src: '/image/content/thumb_09.jpg' }"
                                src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                                alt=""
                            >
                        </dt>
                        <dd>
                            <strong>스탁컴퍼니</strong>의 주요 사업으로 운영 중인 '아이스탁몰'은 2013년에 오픈한 브랜드 전문 패션 아울렛을 지향하며, 89만 명의 회원과 143만여 개의 상품, 300여 개의 브랜드로 운영되고 있는 쇼핑몰입니다.<br><br> 골프, 아웃도어, 스포츠, 여성패션, 남성패션, 캐주얼, 유아동 등의 카테고리로 구성되어 있으며, 다양한 국내/외 유명 브랜드 상품을 저렴한 가격으로 제공하고 있습니다.<br>패밀리 사이트는 여성 컨템포러리 브랜드 '매긴나잇브릿지' 와 아이들의 일상을 담은 '밤비노', 여성 섹시 패션 베이직 브랜드 '탑걸'이 있습니다.
                        </dd>
                    </dl>
                    <dl>
                        <dt>
                            <img
                                v-lazyload="{ src: '/image/content/thumb_11.jpg' }" 
                                src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                                alt=""
                            >
                        </dt>
                        <dd>
                            <strong>스탁컴퍼니</strong>는 대형 브랜드사의 위탁 운영에 대한 다수의 경험을 가지고 있으며, 물류기반에 따른 온라인 위탁대행을 다양한 방법으로 진행하고 있습니다.<br>고객사 브랜드의 유통 프로세스를 간소화하여 매출 증진과 수익 개선에 초점을 맞춤 솔루션을 제공하며, 안정적인 수익창출을 위해 각 분야의 브랜드 전문인력으로 전담팀을 구성하고 있습니다. <br><br><strong>스탁컴퍼니</strong>는 수많은 브랜드를 안정적으로 온라인 시장에 정착시킨 온라인 유통 부분 국내 최고의 기업임을 자부합니다.
                        </dd>
                    </dl>
                </div>
            </div>

            <!-- 회사비전 -->
            <div class="introduce_wrap info_wrap">
                <div class="mm_inner">
                    <div class="info_wrap_slick">
                        <div class="contents vision">
                            <h3>VISION</h3>
                            <ul>
                                <li>
                                    <img v-lazyload="{ src: '/image/content/thumb_08.jpg' }" src="/image/content/thumb_08.jpg" alt="">
                                    <p>고객사에게 가장 사랑받는<br>온라인 솔루션 컴퍼니</p>
                                </li>
                                <li>
                                    <img v-lazyload="{ src: '/image/content/thumb_05.jpg' }" src="/image/content/thumb_05.jpg" alt="">
                                    <p>고객에게 가장 사랑받는<br>온라인 패션&라이프 복합 쇼핑몰</p>
                                </li>
                            </ul>
                        </div>
                        <div class="contents mission">
                            <h3>MISSION</h3>
                            <ul>
                                <li>
                                    <img v-lazyload="{ src: '/image/content/thumb_07.jpg' }" src="/image/content/thumb_07.jpg" alt="">
                                    <p>우리는 고객의 라이프를<br>UP시키기 위해 일합니다.</p>
                                </li>
                                <li>
                                    <img v-lazyload="{ src: '/image/content/thumb_04.jpg' }" src="/image/content/thumb_04.jpg" alt="">
                                    <p>우리는 더 많은 사람들이<br>일할 수 있는 터전을 만듭니다.</p>
                                </li>
                                <li>
                                    <img v-lazyload="{ src: '/image/content/thumb_01.jpg' }" src="/image/content/thumb_01.jpg" alt="">
                                    <p>우리는 끊임없이 가치있고<br>새로운 변화를 실행합니다.</p>
                                </li>
                            </ul>
                        </div>
                        <div class="contents value">
                            <h3>7VALUE</h3>
                            <ul>
                                <li><p><strong>가치</strong> 우선</p></li>
                                <li><p>최고보다 <strong>최선</strong></p></li>
                                <li><p>끝없는<strong>도전</strong></p></li>
                                <li><p>차별화된 <strong>경쟁력</strong></p></li>
                                <li><p><strong>프로</strong> 정신</p></li>
                                <li><p>끊임없는 <strong>노력</strong></p></li>
                                <li><p>잘 다져진 <strong>팀워크</strong></p></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 연혁 -->
            <div class="introduce_wrap history">
                <div class="mm_inner">
                    <h3>연혁</h3>
                    <div class="timeline">
                        <div class="timeline__wrap">
                            <div class="timeline__items">
                                <div class="timeline__item">
                                    <div class="timeline__content">
                                        <h5>2004</h5>
                                        <p>주식회사 스탁컴퍼니 설립</p>
                                    </div>
                                </div>
                                <div class="timeline__item">
                                    <div class="timeline__content">
                                        <h5>2006</h5>
                                        <p>온라인 사업 진출</p>
                                    </div>
                                </div>
                                <div class="timeline__item">
                                    <div class="timeline__content">
                                        <h5>2007</h5>
                                        <p>제시앤코 온라인 판매권 체결</p>
                                    </div>
                                </div>
                                <div class="timeline__item">
                                    <div class="timeline__content">
                                        <h5>2009</h5>
                                        <p>하프클럽 베스트 파트너 수상</p>
                                        <p>롯데닷컴 베스트 파트너 수상</p>
                                        <p>(주)톰보이 온라인 판매권 체결</p>
                                    </div>
                                </div>
                                <div class="timeline__item">
                                    <div class="timeline__content">
                                        <h5>2010</h5>
                                        <p>하프클럽 베스트 파트너 수상</p>
                                        <p>한국의상 디자인학회 감사패 수상</p>
                                        <p>패션그룹형지 온라인 판매권 체결</p>
                                    </div>
                                </div>
                                <div class="timeline__item">
                                    <div class="timeline__content">
                                        <h5>2012</h5>
                                        <p>하프클럽 베스트 파트너 수상</p>
                                        <p>롯데닷컴 베스트 파트너 수상</p>
                                        <p>아이스타일24 베스트 파트너 수상</p>
                                        <p>리바이스, 네파(주) 백화점/온라인 벤더 체결</p>
                                        <p>펠(주) 온라인 벤더 체결</p>
                                    </div>
                                </div>
                                <div class="timeline__item">
                                    <div class="timeline__content">
                                        <h5>2013</h5>
                                        <p>GS홈쇼핑 베스트 파트너 수상</p>
                                        <p>(주)신원, (주)펠앤엘, 한국미즈노(주) 온라인 판매권 체결</p>
                                    </div>
                                </div>
                                <div class="timeline__item">
                                    <div class="timeline__content">
                                        <h5>2014</h5>
                                        <p>오프로드 최우수 매장상 수상</p>
                                        <p>하프클럽 최우수 협력업체 수상</p>
                                        <p>쿠팡 우수 협력사 감사패 수상</p>
                                        <p>세정21, (주)랩 온라인 판매권 체결</p>
                                    </div>
                                </div>
                                <div class="timeline__item">
                                    <div class="timeline__content">
                                        <h5>2015</h5>
                                        <p>(주)인디에프, (주)좋은사람들 온라인 독점 판매권 체결</p>
                                        <p>제25회 한국섬유/패션대상 유통온라인부문 수상</p>
                                    </div>
                                </div>
                                <div class="timeline__item">
                                    <div class="timeline__content">
                                        <h5>2016</h5>
                                        <p>2016 대한민국 산업대상 '서비스혁신대상'수상</p>
                                        <p>제26회 한국섬유/패션대상 패션부문 수상</p>
                                        <p>자체 물류센터 건립<span class="fc-gray">(경기도 안성시 소재 3,500py 규모)</span></p>
                                        <p>(주)평안엘앤씨 '엘르골프' 자사몰 운영대행</p>
                                        <p>공무원연금공단 폐쇄몰 운영</p>
                                        <p>(유)테일러메이드아디다스골프코리아, (유)콜맨코리아 온라인 벤더 체결</p>
                                        <p>연 매출 650억 달성</p>
                                    </div>
                                </div>
                                <div class="timeline__item">
                                    <div class="timeline__content">
                                        <h5>2017</h5>
                                        <p>블랙야크, 컨버스코리아 온라인 벤더, 3PL 체결</p>
                                        <p>아이스탁몰 연매출 200억 달성</p>
                                        <p>연매출 750억 달성</p>
                                    </div>
                                </div>
                                <div class="timeline__item">
                                    <div class="timeline__content">
                                        <h5>2018</h5>
                                        <p>JDX 멀티스포츠 온라인 벤더 체결</p>
                                        <p>퀵실버&록시코리아 온라인 벤더, 3PL 체결</p>
                                        <p>2018년 서울대학교 패션경영인 대상 수상</p>
                                        <p>대한 상공회의소 일하기 좋은 중소기업 CEO 비전, 철학부분 선정</p>
                                    </div>
                                </div>
                                <div class="timeline__item">
                                    <div class="timeline__content">
                                        <h5>2019</h5>
                                        <p>까스텔바작, 톨비스트, 캘빈클라인언더웨어/퍼포먼스, PAT남성 온라인 벤더 체결</p>
                                        <p>자체 물류센터 건립 <span class="fc-gray">(경기도 안성시 원곡면 소재 3,000py 규모)</span></p>
                                        <p>연 매출 1,000억 달성</p>
                                    </div>
                                </div>
                                <div class="timeline__item">
                                    <div class="timeline__content">
                                        <h5>2020</h5>
                                        <p>서울바이오시스, 볼빅골프웨어, 신세계인터내셔널, 몽벨, 마코 온라인 벤더 체결</p>
                                        <p>아이스탁몰 X 한빛둥지 사회복지시설 차량 기증</p>
                                    </div>
                                </div>
                                <div class="timeline__item">
                                    <div class="timeline__content">
                                        <h5>2021</h5>
                                        <p>정보보호관리체계 ISMS 인증</p>
                                        <p>한섬 덱케 온라인 벤더 체결</p>
                                        <p>한세MK 온라인 벤더 체결</p>
                                        <p>힐크릭 온라인 벤더 체결</p>
                                    </div>
                                </div>
                                <div class="timeline__item">
                                    <div class="timeline__content">
                                        <h5>2022</h5>
                                        <p>아이스탁몰X횡성노인복지센터 차량기증</p>
                                        <p>아이스탁몰X천사장애인주간보호소 차량기증</p>
                                        <p>머니투데이주관 대한민국 리딩기업대상 패션커머스부분 ESG경영대상 수상</p>
                                        <p>카페24 마켓플러스 서비스 연동</p>
                                        <p>AI 상품추천서비스 런칭</p>
                                    </div>
                                </div>
                                <div class="timeline__item">
                                    <div class="timeline__content">
                                        <h5>2023</h5>
                                        <p>아이스탁몰 리뉴얼 오픈</p>
                                        <p>머니투데이주관 대한민국 리딩기업대상 패션커머스부분 ESG경영대상 연속수상</p>
                                        <p>안성사회복지관 지역사회 복지발전 및 우수후원기업 안성시장상 수상</p>
                                    </div>
                                </div>
                                <div class="timeline__item">
                                    <div class="timeline__content">
                                        <h5>2024</h5>
                                        <p>성실납세 모범 납세자 국무총리 표창장 수상</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 쇼핑몰 -->
            <div class="introduce_wrap shoppingmall">
                <h3>MALL & FAMILY</h3>
                <div class="mm_inner">
                    <ul>
                        <li>
                            <a href="http://www.istockmall.com/" target="_blank">
                                <img 
                                    v-lazyload="{ src: '/image/content/istockmall_img.jpg' }"
                                    src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                                    alt="아이스탁몰"
                                >
                                <h4>istockmall</h4>
                                <p>온라인에서 국내 유명 브랜드 상품을<br>최대로 할인 받을 수 있는 브랜드 패션 아울렛</p>
                            </a>
                        </li>
                        <li>
                            <a href="http://www.mcginn.co.kr/" target="_blank">
                                <img 
                                    v-lazyload="{ src: '/image/content/mcginn_img.jpg' }"
                                    src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                                    alt="매긴나잇브릿지"
                                >
                                <h4>McGINN</h4>
                                <p>모던&페미닌 조합으로 여성미와 트렌디한<br> 매력이 듬뿍담긴 컨템포러리 브랜드</p>
                            </a>
                        </li>
                        <li>
                            <a href="http://topgirl.co.kr/" target="_blank">
                                <img 
                                    v-lazyload="{ src: '/image/content/topgirl_img.jpg' }"
                                    src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                                    alt="탑걸"
                                >
                                <h4>TOPGIRL</h4>
                                <p>감각적인 컬러와 유니크한 실루엣이 돋보이는 <br>섹시 패션 베이직 여성 브랜드</p>
                            </a>
                        </li>
                        <li>
                            <a href="https://camaldolikorea.co.kr/" target="_blank">
                                <i 
                                    v-lazyload="{ 'src': '/image/content/company_family_camaldoli.png' }"
                                    class="mm_bg-cover"
                                />
                                <h4>CAMALDOLI</h4>
                                <p>이탈리아 천연레시피 뷰티브랜드</p>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- 파트너 정보 -->
            <div class="introduce_wrap partner_info">
                <div class="mm_inner">
                    <div class="partner_info_slick">
                        <div class="contents">
                            <h3>BRAND PARTNER</h3>
                            <ul>
                                <li>
                                    <div class="cate_img">
                                        <p>Golf</p>
                                        <img v-lazyload="{ src: '/image/content/company_info_golf_bg.png' }" src="/image/content/company_info_golf_bg.png" alt="GOLF">
                                    </div>
                                    <div class="brand_name">
                                        까스텔바작, JDX, 엘르골프, 톨비스트, 힐크릭, 마코, 울시, 테일러메이드, 디즈니골프, 레노마골프, 아디다스골프, 이동수골프, 올포유, 김영주골프, 임페리얼, 슈페리어, 데니스골프, 지포어, 커터앤벅, 아놀드파마, 일루션골프, BTR, 클리브랜드, 팜스프링스
                                    </div>
                                </li>
                                <li>
                                    <div class="cate_img">
                                        <p>Woman</p>
                                        <img v-lazyload="{ src: '/image/content/company_info_woman_bg.png' }" src="/image/content/company_info_woman_bg.png" alt="woman">
                                    </div>
                                    <div class="brand_name">
                                        크로커다일레이디, 샤트렌, 올리비아하슬러, PAT, 올리비아로렌, 미센스, 아날도바시니, 인베스트, 율미아스탭, 블루레이스, SOUP, 비지트인뉴욕, 카라, 쉬즈미스, EnC, 시스티나, 크레송, 리스트
                                    </div>
                                </li>
                                <li>
                                    <div class="cate_img">
                                        <p>Outdoor</p>
                                        <img v-lazyload="{ src: '/image/content/company_info_outdoor_bg.png' }" src="/image/content/company_info_outdoor_bg.png" alt="outdoor">
                                    </div>
                                    <div class="brand_name">
                                        블랙야크, 레드페이스, 콜핑, 몽벨, 센터폴, 에코로바, 네파, K2, 머렐, 쉔베르크, 웨스트우드
                                    </div>
                                </li>
                                <li>
                                    <div class="cate_img">
                                        <p>Man</p>
                                        <img v-lazyload="{ src: '/image/content/company_info_man_bg.png' }" src="/image/content/company_info_man_bg.png" alt="man">
                                    </div>
                                    <div class="brand_name">
                                        빌트모아, 코모도, 인디안, 브루노바피, PAT, 티아이포맨, 제스, 올젠, 지오지아, 트레몰로, 트루젠, 남성크로커다일, 피에르가르뎅, 프랑코페라로, 앤드지, 닥스, 듀퐁, 지이크파렌하이트
                                    </div>
                                </li>
                                <li>
                                    <div class="cate_img">
                                        <p>Sports</p>
                                        <img v-lazyload="{ src: '/image/content/company_info_sports_bg.png' }" src="/image/content/company_info_sports_bg.png" alt="sports">
                                    </div>
                                    <div class="brand_name">
                                        풋마트, 나이키, 아디다스, 카파, 팀버랜드, 캘빈클라인퍼포먼스, 반스, 비트로, 뉴발란스, 디씨, 로또스포츠, 스케쳐스, 리복, 록시, 퀵실버, 푸마, 프로스펙스, 르까프
                                    </div>
                                </li>
                                <li>
                                    <div class="cate_img">
                                        <p>Casual</p>
                                        <img v-lazyload="{ src: '/image/content/company_info_casual_bg.png' }" src="/image/content/company_info_casual_bg.png" alt="casual">
                                    </div>
                                    <div class="brand_name">
                                        라코스테, 리바이스, 애드혹, 스파오, 뱅뱅, 인터크루, NII, 노티카, UCLA, 게스, 지오다노, 테이트, 클라이드, 잠뱅이, TBJ, 버커루
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div class="contents mall">
                            <h3>MALL PARTNER</h3>
                            <ul>
                                <li>
                                    <img v-lazyload="{ src: '/image/content/ssg.png' }" src="/image/content/ssg.png" alt="ssg">
                                </li>
                                <li>
                                    <img v-lazyload="{ src: '/image/content/lotte.png' }" src="/image/content/lotte.png" alt="lotte">
                                </li>
                                <li>
                                    <img v-lazyload="{ src: '/image/content/hmall.png' }" src="/image/content/hmall.png" alt="hmall">
                                </li>
                                <li>
                                    <img v-lazyload="{ src: '/image/content/akmall.png' }" src="/image/content/akmall.png" alt="akmall">
                                </li>
                                <li>
                                    <img v-lazyload="{ src: '/image/content/cjmall.png' }" src="/image/content/cjmall.png" alt="cjmall">
                                </li>
                                <li>
                                    <img v-lazyload="{ src: '/image/content/gsshop.png' }" src="/image/content/gsshop.png" alt="gsshop">
                                </li>
                                <li>
                                    <img v-lazyload="{ src: '/image/content/coupang.png' }" src="/image/content/coupang.png" alt="coupang">
                                </li>
                                <li>
                                    <img v-lazyload="{ src: '/image/content/gmarket.png' }" src="/image/content/gmarket.png" alt="gmarket">
                                </li>
                                <li>
                                    <img v-lazyload="{ src: '/image/content/auction.png' }" src="/image/content/auction.png" alt="auction">
                                </li>
                                <li>
                                    <img v-lazyload="{ src: '/image/content/interpark.png' }" src="/image/content/interpark.png" alt="interpark">
                                </li>
                                <li>
                                    <img v-lazyload="{ src: '/image/content/11st.png' }" src="/image/content/11st.png" alt="11st">
                                </li>
                                <li>
                                    <img v-lazyload="{ src: '/image/content/wemakeprice.png' }" src="/image/content/wemakeprice.png" alt="wemakeprice">
                                </li>
                                <li>
                                    <img v-lazyload="{ src: '/image/content/tmon.png' }" src="/image/content/tmon.png" alt="tmon">
                                </li>
                                <li>
                                    <img v-lazyload="{ src: '/image/content/halfclub.png' }" src="/image/content/halfclub.png" alt="halfclub">
                                </li>
                                <li>
                                    <img v-lazyload="{ src: '/image/content/fashionplus.png' }" src="/image/content/fashionplus.png" alt="fashionplus">
                                </li>
                                <li>
                                    <img v-lazyload="{ src: '/image/content/naver.png' }" src="/image/content/naver.png" alt="naver">
                                </li>
                                <li>
                                    <img v-lazyload="{ src: '/image/content/kakao.png' }" src="/image/content/kakao.png" alt="kakao">
                                </li>
                                <li>
                                    <img v-lazyload="{ src: '/image/content/musinsa.png' }" src="/image/content/musinsa.png" alt="musinsa">
                                </li>
                                <li>
                                    <img v-lazyload="{ src: '/image/content/wconcept.png' }" src="/image/content/wconcept.png" alt="wconcept">
                                </li>
                                <li>
                                    <img v-lazyload="{ src: '/image/content/29cm.png' }" src="/image/content/29cm.png" alt="29cm">
                                </li>
                                <li>
                                    <img v-lazyload="{ src: '/image/content/ezwel.png' }" src="/image/content/ezwel.png" alt="ezwel">
                                </li>
                                <li>
                                    <img v-lazyload="{ src: '/image/content/benepia.png' }" src="/image/content/benepia.png" alt="benepia">
                                </li>
                                <li>
                                    <img v-lazyload="{ src: '/image/content/samsung.png' }" src="/image/content/samsung.png" alt="samsung">
                                </li>
                                <li>
                                    <img v-lazyload="{ src: '/image/content/posty.png' }" src="/image/content/posty.png" alt="posty">
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
                        
            <!-- 연락 및 위치 정보 -->
            <div class="introduce_wrap contact_info">
                <h3>CONTACT US</h3>
                <div class="mm_inner">
                    <dl>
                        <dt>본사 위치</dt>
                        <dd>서울특별시 중구 소파로 141 스타빌딩 3층</dd>
                        <dd>(서울시 중구 남산동3가 30-7)</dd>
                        <dt>대표전화</dt>
                        <dd>1899 - 6525</dd>
                        <dt>물류센터</dt>
                        <dd><strong>- 아이스탁몰 센터 </strong> 경기도 안성시 대덕면 소재 3,000평 규모</dd>
                        <dd><strong>- 원곡 센터 </strong> 경기도 안성시 원곡면 소재 2,000평 규모</dd>
                    </dl>
                    <div class="map_info">
                        <!-- * 카카오맵 - 지도퍼가기 -->
                        <!-- 1. 지도 노드 -->
                        <div id="daumRoughmapContainer1620285915916" class="root_daum_roughmap root_daum_roughmap_landing" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import '@publish/js/lib/jquery-1.8.3.min.js'
import '@publish/js/lib/timeline.min.js'
import '@publish/js/lib/slick.min.js'
import '@publish/css/lib/slick.css'
import '@publish/css/lib/slick-theme.css'
import '@publish/css/lib/timeline.min.css'

if (!window.daum) {
    const scriptLoader = document.createElement("script");
    scriptLoader.src = "https://ssl.daumcdn.net/dmaps/map_js_init/roughmapLoader.js";

    const scriptLander = document.createElement("script");
    scriptLander.src = "https://t1.daumcdn.net/kakaomapweb/place/jscss/roughmap/6af7869e/roughmapLander.js";
    
    document.head.appendChild(scriptLoader);
    document.head.appendChild(scriptLander);

    scriptLander.onload = () => {
        new daum.roughmap.Lander({
            "timestamp" : "1620285915916",
            "key" : "25np5",
            "mapWidth" : "500",
            "mapHeight" : "360"
        }).render();
    }
} else {
    new daum.roughmap.Lander({
        "timestamp" : "1620285915916",
        "key" : "25np5",
        "mapWidth" : "500",
        "mapHeight" : "360"
    }).render();
}


$(document).ready(function() {
    $('.info_wrap_slick').slick(); 

    $('.partner_info_slick').slick({
        autoplay: true,
        autoplaySpeed: 2000,
    });

    $('.timeline').timeline({
        forceVerticalMode: 700,
        mode: 'horizontal',
        verticalStartPosition: 'right',
        visibleItems: 4,
        startIndex: 14
    });
});

</script>