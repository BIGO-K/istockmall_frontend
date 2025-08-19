'use strict';

/**
 * 페이지 공통
**/


//< 레디
mm.ready(function () {

	// 헤더 검색
	(function (__$search) {

		if (!__$search) return;

		var $searchInput = mm.find('data-text', __$search)[0];// 검색어 입력창
		var $recentWord = mm.find('.mm_header-search-keyword', __$search)[0];// 최근검색어
		var $recommendWord = mm.find('.mm_header-search-auto', __$search)[0];// 추천검색어
		var $btnClose = mm.find('.btn_close', __$search)[0];
		var _classOn = 'S=search-on';

		// 키보드 방향키 제어
		function keyDownFocus(__e, __$el) {

			if (!__$el) return;

			__e.preventDefault();// 스크롤 움직임 방지

			mm.delay.on(function () {

				mm.class.remove(mm.find('.S=over', __$search), 'S=over');
				__$el.classList.add('S=over');

				$searchInput.value = _.last(mm.find('b:not(.text_date)', __$el)).textContent;

			});

		}

		mm.element.attribute(__$search, { 'tabindex': 0, 'style': { 'cursor': 'auto' } });

		mm.event.on($searchInput, 'click change keydown keyup', function (__e) {

			var _isKeyword = this.value.trim().length > 0;
			switch (__e.type) {
				case 'click':
				case 'keydown':
					if (__$search.classList.contains(_classOn)) return;// 이미 열려있으면 리턴

					__$search.classList.add(_classOn);
					gsap.to([$recentWord, $recommendWord], { alpha: 1, height: 550, duration: mm.time._fast, ease: 'cubic.inOut' });

					// break;
				case 'change':
					if (__e.detail && __e.detail._isUpdate === true) return;
				case 'keyup':
					if (__e.type === 'keyup' && __e.keyCode > 36 && __e.keyCode < 41) return;// 방향키

					mm.class.remove([$recommendWord, $recentWord], _classOn);
					if (_isKeyword) $recommendWord.classList.add(_classOn);
					else $recentWord.classList.add(_classOn);
					break;
			}

		});

		mm.event.on(__$search, 'keydown mouseover mouseenter mouseleave focusin focusout', function (__e) {

			var $searchOn = mm.find(mm.selector(_classOn, '.'), __$search);
			mm.delay.off('DELAY_SEARCH_CLOSE');

			switch (__e.type) {
				case 'keydown':
					if ($searchOn.length === 0) return;

					var $active = mm.find('.S=over', __$search)[0] || document.activeElement;
					var $items = mm.find('li > a', $searchOn);
					var _itemIndex = mm.element.index($items, $active);
					var _isText = $active.matches('[data-text]');

					// 방향키 상
					if (__e.keyCode === 38) {
						if (_isText) return;

						if ($active.tagName !== 'A' || _itemIndex === 0) keyDownFocus(__e, $items[$items.length - 1]);
						else keyDownFocus(__e, $items[_itemIndex - 1]);
					}
					// 방향키 하
					else if (__e.keyCode === 40) {
						if ($active.tagName === 'A' && _itemIndex === $items.length - 1) keyDownFocus(__e, $items[0]);
						else keyDownFocus(__e, $items[_itemIndex + 1]);
					}
					break;
				case 'mouseover':// 리스트 아이템에 hover시 포커스
					mm.class.remove(mm.find('.S=over', __$search), 'S=over');
					if (document.activeElement.tagName === 'A') mm.focus.in($searchInput);

					var $searchItem = __e.target.closest('a');
					if ($searchItem) $searchItem.classList.add('S=over');
					break;
				// case 'mouseenter':
				// case 'focusin':
				// 	break;
				case 'mouseleave':
				case 'focusout':
					mm.delay.on(function () {

						mm.event.dispatch($btnClose, 'click');

					}, { _time: (__e.type === 'mouseleave') ? 1 : 0, _isSec: true, _name: 'DELAY_SEARCH_CLOSE', _isOverwrite: true });
					break;
			}

		});

		// 검색창 닫기
		mm.event.on($btnClose, 'click', function (__e) {

			gsap.to([$recentWord, $recommendWord], { alpha: 0, height: 0, duration: mm.time._faster, ease: 'quart.out',
				onComplete: function () {

					mm.class.remove([__$search, $recentWord, $recommendWord], _classOn);

				},
			});

		});

	})(mm.find('.mm_header-search')[0]);

	// 헤더 인기검색어 자동 롤링
	(function (__$popular) {

		if (!__$popular) return;

		var $popularItems = mm.find('ol > li', __$popular);
		var _index = 0;
		var popularInterval;

		function popularAutoPlay() {

			popularInterval = setInterval(function () {

				gsap.fromTo($popularItems[_index], { y: '0%' }, { y: '-100%', duration: 0.3, ease: 'sine.inOut' });

				_index = (_index === $popularItems.length - 1) ? 0 : _index + 1;
				gsap.fromTo($popularItems[_index], { y: '100%' }, { y: '0', duration: 0.3, ease: 'sine.inOut' });

			}, 4000);

		}

		popularAutoPlay();

		mm.observer.on(__$popular, 'SEARCH_POPULAR_CHANGE', function (__e) {

			if (__e.detail._is) {
				gsap.killTweensOf($popularItems);
				clearInterval(popularInterval);
				mm.element.style($popularItems, { 'transform': '' });
			}
			else {
				_index = 0;
				popularAutoPlay();
			}

		});

	})(mm.find('.mm_header-popular')[0]);

	// 헤더 카테고리 메뉴 컨트롤
	var $cate = mm.find('.mm_gnb-cate')[0]
	var $cateBox = mm.find('.mm_gnb-cate-item > nav', $cate)[0];
	var $cateList = mm.find('> ul', $cateBox)[0];
	var $cateItems = mm.find('> li', $cateList);
	var _classCateOn = 'S=catemenu-on';
	var _cateMoveHeight;
	var _cateLimit;

	mm.event.on($cateBox, 'mouseenter mouseleave', function (__e) {

		switch (__e.type) {
			case 'mouseenter':
				_cateLimit = $cateList.children[0].offsetHeight;
				_cateMoveHeight = $cateList.offsetHeight - $cateBox.offsetHeight;

				if (_cateMoveHeight > 0 && !__e.target.closest(mm.selector('.mm_gnb\\.\\.\\.depth'))) {
					mm.event.on($cateBox, 'mousemove', function cateMouseMoveHandler(__e) {

						if (__e.target.closest(mm.selector('.mm_gnb\\.\\.\\.depth'))) return;

						var _ratioY = (__e.clientY - mm.element.offset($cateBox).top - _cateLimit) / ($cateBox.offsetHeight - _cateLimit * 2);
						_ratioY = Math.max(0, Math.min(_ratioY, 1));
						gsap.to($cateList, { 'margin-top': -_cateMoveHeight * _ratioY, duration: 0.4, ease: 'quad.out' });

					});
				}
				break;
			case 'mouseleave':
				mm.event.off($cateBox, 'mousemove', 'cateMouseMoveHandler');
				break;
		}

	});

	mm.event.on(mm.find('> li, section', $cateList), 'mouseenter mouseleave', function (__e) {

		var $target = __e.currentTarget;
		var _isCurrent = (($target.tagName === 'LI') ? $target : $cateItems);

		var $depth1 = mm.find('> a', _isCurrent)[0];
		var $depth2 = mm.find('> .mm_gnb\\.\\.\\.depth', _isCurrent)[0];
		var $depth3 = mm.find('> ul', $target)[0];

		// depth1 마우스오버 시
		if ($target.tagName === 'LI') {
			if (!$target.contains($depth2)) return;
			openCate(__e.type, $depth1, $depth1.offsetWidth + ((__e.type === 'mouseenter') ? $depth2.offsetWidth : 0));
		}
		// depth2 마우스오버 시
		else {
			if (!$target.contains($depth3)) return;
			openCate(__e.type, $target, $depth1.offsetWidth + $depth2.offsetWidth + ((__e.type === 'mouseenter') ? $depth3.offsetWidth : 0));
		}

	});

	function openCate(__type, __target, __width) {

		switch (__type) {
			case 'mouseenter':
				__target.classList.add(_classCateOn);
				gsap.to($cateBox, { width: __width, duration: mm.time._base, ease: 'sine.inOut', overwrite: true });
				break;
			case 'mouseleave':
				__target.classList.remove(_classCateOn);
				gsap.to($cateBox, { width: __width, duration: mm.time._fast, delay: 0.1, ease: 'sine.inOut', overwrite: true });
				break;
		}

	}

	// 카테고리 메뉴 마우스 컨트롤(숨김)
	mm.observer.on($cate, 'CATE_MENU_SWITCH', function (__e) {

		if ($cate.classList.contains('S=switch-on')) {
			mm.event.on($cate, 'mouseenter mouseleave', function cateMouseHandler(__e) {

				switch (__e.type) {
					case 'mouseenter':
						mm.delay.off('DELAY_CATE_OFF');
						break;
					case 'mouseleave':
						mm.delay.on(function () {

							mm.switch.off(mm.find('.btn_catemenu', $cate));
							mm.event.off($cate, 'mouseenter mouseleave', cateMouseHandler);

						}, { _time: 500, _name: 'DELAY_CATE_OFF', _isOverwrite: true });
						break;
				}

			});
		}
		else mm.event.off($cate, 'mouseenter mouseleave', 'cateMouseHandler');

	});

	// 최근본상품 마우스 컨트롤(숨김)
	var $recent = mm.find('.mm_header-quick-recent')[0];
	mm.observer.on($recent, 'RECENT_SWITCH', function (__e) {

		if ($recent.classList.contains('S=switch-on')) {
			mm.event.on($recent, 'mouseenter mouseleave', function cateMouseHandler(__e) {

				switch (__e.type) {
					case 'mouseenter':
						mm.delay.off('DELAY_RECENT_OFF');
						break;
					case 'mouseleave':
						mm.delay.on(function () {

							mm.switch.off(mm.find('.btn_recent', $recent));
							mm.event.off($recent, 'mouseenter mouseleave', cateMouseHandler);

						}, { _time: 500, _name: 'DELAY_RECENT_OFF', _isOverwrite: true });
						break;
				}

			});
		}
		else mm.event.off($recent, 'mouseenter mouseleave', 'cateMouseHandler');

	});

});
//> 레디

//< 인기검색어 스위칭
function searchPopularChange(__is) {

	mm.observer.dispatch('SEARCH_POPULAR_CHANGE', { _isLocal: true, data: { _is: __is } });

}
//> 인기검색어 스위칭