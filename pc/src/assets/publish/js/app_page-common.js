'use strict';

/**
 * 페이지 공통
**/

//< 최초(레디 전)
(function () {

	/*
	// 우클릭 및 드래그 방지
	function returnHandler(__e) {

		__e.preventDefault();

	}

	window.addEventListener('contextmenu', returnHandler);
	// document.addEventListener('selectstart', returnHandler);// 에디터 입력 이슈
	document.addEventListener('dragstart', returnHandler);
	*/

	// 로딩 제거(크롬 페이지 뒤로가기 시 이전 링크 이동으로 생긴 로딩 제거)
	mm.event.on(window, 'unload', function (__e) {

		mm.loading.hide();

	});

})();
//< 최초(레디 전)

//< 레디
mm.ready(function () {

	// 아이프레임
	if (frameElement) {
		mm.observer.dispatch(mm.event.type.frame_ready, { data: { this: window } });

		// 컨텐츠 아이프레임 리사이즈
		if (mm._isFrame) mm.frameResize(null, { _isLoad: true });
	}

	// 컴포넌트
	mm.ui.update();

	// autofill 감지
	mm.event.on('[data-text]', 'animationstart', function (__e) {

		var $text = this.closest('.mm_form-text');
		if (!$text) return;

		switch (__e.animationName) {
			case 'autofill-on':
				$text.classList.add('S=on');
				break;
			case 'autofill-cancel':
				if (this.value.trim().length === 0) $text.classList.remove('S=on');
				break;
		}

	});

	// 터치이벤트 확인
	mm.event.on(document, 'mousedown mouseup', function (__e) {

		switch (__e.type) {
			case 'mousedown':
				mm._isTouch = true;
				break;
			case 'mouseup':
				mm._isTouch = false;
				break;
		}

	});

	// a 링크
	mm.delegate.on(document, 'a[data-href]', 'click', function (__e) {

		if (this.target.toLowerCase() === 'blank') return;// target blank 제외

		// mm.data에 저장할 기본 값
		var initial = {
			openEl: this,// ? :element - 클릭한 요소
			_type: null,// ? :string - link, popup, modal, anchor, back, forward, reload
			_frameId: null,// ? :string - popup, modal을 iframe으로 노출할 때 id 값
			_frameName: null,// ? :string - popup, modal을 iframe으로 노출할 때 name 값
			// _isCloseBefore: false,// ? :boolean - type 값이 link/popup일 때 현재 팝업 요소를 닫음(교체)
			// _isLinkStage: true,// ? :boolean - type이 link일 때 true(스테이지에서 실행 mm.popup.open), false(현재 창에서 실행 location.href)
			_step: 1,// ? :number - mm.history.back/forward 이동 수
			// * 이 외 mm.link, mm.scroll.to  등에서 사용하는 변수를 추가로 적용하여 사용
		};

		var data = mm.data.get(this, 'data-href', { initial: initial });
		if (mm.is.empty(data)) data = mm.data.set(this, 'data-href', { initial: initial });
		var _attrHref = this.getAttribute('href');
		var _href = this.href;

		if (!data._type) return false;
		if (data._type === 'link') {
			if (_attrHref.replace('#', '').trim().length === 0 || _attrHref.toLowerCase().includes('javascript:')) return false;

			if (_href.split('#')[0] === location.href.split('#')[0]) data._type = 'reload';// 링크가 같으면 reload로 변경
			if (data._type === 'reload' && _href.includes('#')) data._type = 'anchor';// 링크가 같고 #이 있으면 anchor로 변경
		}

		__e.preventDefault();

		// 외부링크
		if (['link', 'popup'].includes(data._type)) {
			if (!_href.includes(location.host)) {
				// 프로토콜이 https 일 때 외부 http 경로의 iframe이 보안상 이유로 연결 안됨
				// mm.popup.open('popup_externalLink.html?url=' + _href);
				window.open(_href);// 새 창 열림
				return false;
			}
		}

		switch (data._type) {
			case 'reload':
				location.reload();// location.reload(true);
				break;
			case 'back':
				mm.history.back(data._step);
				break;
			case 'forward':
				mm.history.forward(data._step);
				break;
			case 'anchor':
				mm.scroll.to(_attrHref, data);
				break;
			case 'modal':
			case 'popup':
				// data.openEl = this;
			case 'link':
			case 'home':
				mm.link(_href, data);
				break;
		}

	});

	// PC 사용 추가
	(function () {

		var $header = mm.find('.mm_header')[0];
		var $footer = mm.find('.mm_footer')[0];

		// flex 수직 정렬이 ie에서 적용되지 않아서 높이값을 강제로 적용 > 컨텐츠를 ajax로 로드 하면 처음 높이를 가져올 수 없어 ie 높이 무시
		// error 레이아웃에서만 적용
		if (mm.is.ie() && mm._isError) {

			var $view = mm.find('.mm_view')[0];
			var _footerHeight = ($footer) ? $footer.offsetHeight : 0;
			var _pageHeight = $view.offsetHeight - _footerHeight - parseFloat(mm.element.style($view, 'padding-top'));
			var _contentHeight = mm.find('.mm_page-content')[0].offsetHeight;

			if (_pageHeight > _contentHeight) mm.element.style('.mm_page', { 'height': '100%' });
		}

		// 이미지 썸네일(썸네일 클릭 시 이미지 변경)
		_.forEach(mm.find('.m_prodetail-thumbnail'), function (__$thumb) {

			var $thumbImage = mm.find('.image_thumbnail img', __$thumb)[0];
			var $btnThumbs = mm.find('.btn_thumbnail', __$thumb);
			var $multiangle = mm.find('.m_prodetail-multiangle', __$thumb)[0];
			var _classOn = 'S=thumbnail-on';

			mm.event.on($btnThumbs, 'click', function (__e) {

				mm.class.remove($btnThumbs, _classOn);
				mm.element.attribute($btnThumbs, { 'title': '' });
				this.classList.add(_classOn);
				this.setAttribute('title', '선택됨');
				$thumbImage.setAttribute('src', mm.data.get(mm.find('i', this)[0]).lazyload._src);

				if ($multiangle && $multiangle.classList.contains('__multiangle-on')) mm.event.dispatch(mm.find('.btn_close', $multiangle)[0], 'click');

			});

			mm.event.dispatch($btnThumbs[0], 'click');

		});

		//< 리뷰상품 선택 (리뷰작성, 상품문의 모달 등에 사용)
		var $prodSelect = mm.find('.mm_product-select')[0];
		var $prodSelected = mm.find('.mm_product-select-complete', $prodSelect)[0];
		var $reviewPoint = mm.find('.m_modal-myreview-product .m\\.\\.\\.product-point')[0];
		mm.event.on(mm.find('.mm_product-item', $prodSelect), 'click', function (__e) {

			__e.preventDefault();

			var _classSelected = 'S=selected-complete';
			var _classOn = 'S=point-on';
			mm.dropdown.close(this.closest('.mm_dropdown'));

			var $btnRemove = mm.element.create(mm.string.template([
				'<button type="button" class="btn_remove">',
				'   <i class="ico_remove"></i><b class="mm_ir-blind">삭제하기</b>',
				'</button>'
			]))[0];

			if ($prodSelect.classList.contains('T=inquiry')) {
				if (!mm.find('ul', $prodSelected)[0]) $prodSelected.append(mm.element.create('<div class="mm_scroller"><ul></ul></div>')[0]);

				mm.find('ul', $prodSelected)[0].prepend(this.closest('li').cloneNode(true));
				mm.find('ul li', $prodSelected)[0].append($btnRemove);
			}
			else {
				$prodSelected.innerHTML = '';
				$prodSelected.append(this.cloneNode(true));
				$prodSelected.append($btnRemove);
			}

			$prodSelect.classList.add(_classSelected);

			if ($reviewPoint && !$reviewPoint.classList.contains(_classOn)) $reviewPoint.classList.add(_classOn);

			mm.event.on($btnRemove, 'click', function (__e) {

				__e.preventDefault();

				if ($prodSelect.classList.contains('T=inquiry') && mm.find('ul li', $prodSelected).length > 1) {
					this.closest('li').remove();
				}
				else {
					$prodSelected.innerHTML = '';
					$prodSelect.classList.remove(_classSelected);
				}

				if ($reviewPoint) $reviewPoint.classList.remove(_classOn);

			});

		});
		//> 리뷰상품 선택

		if (mm._isModal) return;// 아래 스크립트는 모달에서는 사용 안함

		// 스크롤 이벤트
		var $prodList = _.filter(mm.find('.mm_product-list'), function (__$list) { return __$list.parentElement.nextElementSibling && __$list.parentElement.nextElementSibling.classList.contains('mm_filter-gender'); })[0];
		var $genderFilter = mm.find('.mm_filter-gender')[0];
		var $rankingGnb = mm.find('.m_ranking-gnb')[0];
		var $rankingCate = mm.find('.m_ranking-category')[0];
		var $stickies = mm.find('data-horizon');

		var _headerHeight = ($header) ? $header.offsetHeight : null;
		var _classStickyHeader = 'S=header-sticky';
		var _classHoldFilter = 'S=filter-hold';
		var _classSticky = 'S=sticky-on';

		var $side = mm.find('.mm_sidebar')[0];
		var $sideAnchorInner = mm.find('.mm_sidebar-anchors-inner', $side)[0];
		var $btnAnchors = mm.find('[class*="btn_anchor"]', $side);
		var _isShowAnchor = false;

		var $wingBanner = mm.find('.mm_sidebar-wing', $side)[0];

		mm.event.on(mm.scroll.el, 'load scroll', function (__e) {

			var scrollOffset = mm.scroll.offset(this);

			if ($header) {
				if (scrollOffset.top > _headerHeight) $header.classList.add(_classStickyHeader);
				else $header.classList.remove(_classStickyHeader);
			}

			// 성별필터
			if ($genderFilter) {
				if (mm.element.offset($prodList).top > window.innerHeight * 0.5 || mm.element.offset($footer).top < document.documentElement.offsetHeight) $genderFilter.classList.add(_classHoldFilter);
				else $genderFilter.classList.remove(_classHoldFilter);
			}

			// 랭킹 gnb
			if ($rankingGnb) {
				if (mm.element.offset($rankingGnb).top - $header.offsetHeight - mm.element.offset($header).top < 0) $rankingGnb.classList.add(_classSticky);
				else $rankingGnb.classList.remove(_classSticky);
			}

			// 랭킹 category
			if ($rankingCate) {
				if (mm.element.offset($rankingCate).top - $header.offsetHeight - mm.element.offset($header).top < 0) $rankingCate.classList.add(_classSticky);
				else $rankingCate.classList.remove(_classSticky);
			}

			// fixed 요소 가로 스크롤 할 때 위치 이동
			if ($stickies) mm.element.style($stickies, { 'left': mm.number.unit(-scrollOffset.left) });

			// 사이드바 앵커 버튼 스크롤 할 때 노출
			if ($side) {
				if (scrollOffset.top > _headerHeight && !_isShowAnchor) {
					_isShowAnchor = true;

					gsap.to($sideAnchorInner, { height: 124, duration: 0.3, ease: 'sine.out' });
					gsap.to($btnAnchors, { autoAlpha: 1, duration: 0.2, delay: 0.2, ease: 'sine.out' });

					if ($wingBanner) gsap.to($wingBanner, { y: -157, duration: 0.3, ease: 'sine.out' });
				}
				else if (scrollOffset.top < _headerHeight && _isShowAnchor) {
					_isShowAnchor = false;

					gsap.to($sideAnchorInner, { height: 102, duration: 0.3, ease: 'sine.inOut' });
					gsap.to($btnAnchors, { autoAlpha: 0, duration: 0.2, ease: 'sine.out' });

					if ($wingBanner) gsap.to($wingBanner, { y: 0, duration: 0.3, ease: 'sine.inOut' });
				}

				// 날개배너 가로 화면 축소 가로 스크롤 할 때 위치 이동
				if ($wingBanner) {
					if ($side.classList.contains('S=sidebar-sm')) mm.element.style($wingBanner, { 'left': mm.number.unit(-scrollOffset.left) });
					else mm.element.style($wingBanner, { 'left': '' });
				}
			}

		});

		// 화면 리사이즈 이벤트
		var _classSmall = 'S=sidebar-sm';

		// 사이드바 앵커 버튼 최소화(화면 최소 사이즈 1360 + 좌측 여백 256)
		if ($side) {
			mm.event.on(window, 'load resize', function (__e) {

				if (window.innerWidth <= 1360 + 256) $side.classList.add(_classSmall);
				else $side.classList.remove(_classSmall);

			});
		}

	})();

});
//> 레디

//< 로드
mm.load(function () {

	// 팝업 리사이즈
	if (mm._isPopup) mm.popup.resize();
	else if (mm._isModal) mm.modal.resize({ _isLoad: true });

	// 컨텐츠 아이프레임 리사이즈
	if (mm._isFrame) mm.frameResize(null, { _isLoad: true });

	// 익스/엣지 브라우저에서 새로고침 할 때 라디오/체크박스의 기존 선택을 물고있는거나 날려버리는 이슈가 있어 초기화 후 재연결
	if (mm.is.ie()) {
		var $checked = mm.find('[checked]');
		_.forEach($checked, function (__$check) {

			__$check.checked = true;

		});

		mm.form.update($checked);// mm.delay 필요?
	}

	// mm을 수정하지 못하도록 적용
	Object.freeze(mm);

});
//> 로드

//< 상품 찜하기
// function changeLikeProduct(__is, __url, __offCallback, __offParam) {

// 	var $switch = this;

// 	// 찜하기
// 	if (__is) {
// 		mm.modal.open(__url, { openEl: $switch, onReady: function () {

// 			mm.event.on(mm.find('.btn_modal-close', mm.find('iframe', this)[0])[0], 'click', function () {

// 				var data = mm.data.get($switch).switch;
// 				var onChange = data.onChange;

// 				data.onChange = null;
// 				mm.switch.off($switch);
// 				data.onChange = onChange;

// 			});

// 		} });
// 	}
// 	// 찜해제
// 	else mm.apply(__offCallback, $switch, [__offParam]);// goods.wish.delete(this.getAttribute('data-goods_idx')); 개발 적용

// }
//> 상품 찜하기

//< 브랜드 찜하기 활성화
function toggleLikeBrand(__is) {

	if (__is) {
		var $likeIcon = this.children[0];

		gsap.to($likeIcon, { alpha: 0.3, scale: 0.3, duration: 0.15, ease: 'sine.out', onComplete: function () {

			gsap.set($likeIcon, { scale: 1.5 });
			gsap.to($likeIcon, { alpha: 1, scale: 1, duration: 0.2, ease: 'cubic.out' });

		} });
	}

}
//> 브랜드 찜하기 활성화

//< 성별필터
function switchGenderFilter() {

	mm.siblings(this)[0].classList.remove('S=switch-on');

}
//> 성별필터

//< 인기검색어 스위칭
function searchPopularChange(__is) {

	mm.observer.dispatch('SEARCH_POPULAR_CHANGE', { _isLocal: true, data: { _is: __is } });

}
//> 인기검색어 스위칭

//< 윙배너 확장
function extendWingBanner(__isChange) {

	var $wingBanner = mm.find('.mm_sidebar-wing')[0];
	var $carousel = mm.find('.mm_carousel', $wingBanner);

	var carouselData = mm.data.get($carousel, 'data-carousel');
	var _activeIndex = (!carouselData) ? 0 : carouselData._index;

	var $carouselItem = mm.find('.mm_carousel-item', $carousel)[_activeIndex];
	var $bannerDefault = mm.find('button', $carouselItem)[0];// 작은 배너 영역
	var $bannerExtend = mm.find('.mm_sidebar-wing-extend', $carouselItem)[0];// 큰 배너 영역
	var $imageSmall = mm.find('img', $bannerDefault)[0];// 작은 배너 이미지
	var $imageLarge = mm.find('img', $bannerExtend)[0];// 큰 배너 이미지
	var $btnClose = mm.find('.btn_close', $bannerExtend)[0];

	if (__isChange) {
		if (!mm.is.empty(carouselData)) mm.carousel.stop($carousel); // 배너 확장시 윙배너 롤링stop
		mm.delay.off('DELAY_SWITCH_OFF');

		mm.element.append($wingBanner, $bannerExtend);
		if (mm.cookie.get('IS_WING_POPUP_HIDE') === 'true') $wingBanner.classList.add('S=today-hide');

		mm.element.style($bannerExtend, { 'width': mm.number.unit($imageSmall.width), 'height': mm.number.unit($imageSmall.height) });

		var _defaultRect = $bannerDefault.getBoundingClientRect();

		if (_defaultRect.bottom <= (document.body.offsetHeight * 0.65)) mm.element.style($bannerExtend, { 'top': mm.number.unit(-$imageSmall.naturalHeight), 'bottom': 'auto' });
		gsap.to($bannerExtend, { width: $imageLarge.naturalWidth, height: $imageLarge.naturalHeight, duration: 0.3, ease: 'sine.InOut' });

		mm.element.show($btnClose);

		// 열린 윙배너가 3초후 닫힘
		mm.delay.on(function () {

			mm.event.dispatch($btnClose, 'click');

		}, { _time: 3, _isSec: true, _name: 'DELAY_WING_OFF' });

		mm.event.on($wingBanner, 'mouseover mouseleave', function wingBannerInlineHandler(__e) {

			switch (__e.type) {
				case 'mouseover':
					mm.delay.off('DELAY_WING_OFF');
					break;
				case 'mouseleave':
					mm.delay.on(function () { mm.event.dispatch(mm.find('.btn_close', $wingBanner), 'click') }, { _time: 1000, _name: 'DELAY_WING_OFF' });
					break;
			}

		});

		mm.event.on(mm.find('button', $bannerExtend), 'click', function wingCloseInlineHandler() {

			mm.element.hide($btnClose);

			// 오늘하루 그만보기
			if (this.classList.contains('btn_today')) mm.cookie.set('IS_WING_POPUP_HIDE', true, 1, true);// 1일 자정 리셋

			gsap.to($bannerExtend, { 'width': $imageSmall.width, 'height': $imageSmall.height, duration: 0.15, ease: 'sine.out', onComplete: function () {

				$bannerExtend.removeAttribute('style');
				mm.element.append($bannerDefault.closest('li'), $bannerExtend);

				if (!mm.is.empty(carouselData)) mm.carousel.play($carousel); // 배너 축소시 윙배너 롤링 start

			} });

			mm.delay.on(mm.switch.off, { _time: 100, _name: 'DELAY_SWITCH_OFF', params: [$bannerDefault] });

		}, { _isOnce: true });
	}
	else {
		mm.event.off($wingBanner, 'mouseover mouseleave', 'wingBannerInlineHandler');
		mm.event.off($btnClose, 'click', 'wingCloseInlineHandler');
	}

}
//> 윙배너 확장