'use strict';

/**
 * 상품 상세
 * 옵션선택, 탭메뉴, 찜하기
**/

// 베스트 리뷰 슬라이더 ready
function reviewBestReady() {

	var $slider = this;
	var $controls = mm.find('.mm_slider-control', $slider)[0];
	var $count = mm.find('.mm_slider-count', $slider);

	var slider = mm.data.get($slider).slider;
	mm.find('.text_slider-index', $count)[0].innerText = slider._index + 1;
	mm.find('.text_slider-total', $count)[0].innerText = slider.__._total;

	if (slider.__._total <= 2) $count[0].remove();

	// 컨트롤 동작시 count 업데이트
	mm.event.on(mm.find(slider.control._prev, $controls)[0], 'click', function (__e) {

		var slider = mm.data.get($slider).slider;
		var _total = slider.__._total;
		var _index = slider._index;
		var _changeIndex = (_index === 0) ? _total : _index;

		mm.find('.text_slider-index', $count)[0].innerText = _changeIndex;
		mm.find('.text_slider-total', $count)[0].innerText = _total;

	});

	mm.event.on(mm.find(slider.control._next, $controls)[0], 'click', function (__e) {

		var slider = mm.data.get($slider).slider;
		var _total = slider.__._total;
		var _index = slider._index + 1;
		var _changeIndex = (_index === 1) ? _index + 1 : (_index === _total) ? 1 : _index + 1;

		mm.find('.text_slider-index', $count)[0].innerText = _changeIndex;
		mm.find('.text_slider-total', $count)[0].innerText = _total;

	});

}

// 베스트리뷰 슬라이더 드래그 전환시 index값 변경
function reviewBestChange() {

	var $slider = this;

	var $count = mm.find('.mm_slider-count', $slider);
	var _index = Number(mm.find('.S=on', $slider)[0].getAttribute('data-slider-index')) + 1;

	mm.find('.text_slider-index', $count)[0].innerText = _index;

}

// 하단 구매옵션 열기/닫기 이벤트
function changeSidePosition (__is) {

	var $sidebar = mm.find('.mm_sidebar')[0];

	var _classSideOptionUp = 'S=sidebar-up';
	var _classSideOptionOpen = 'S=sidebar-upper';

	// 옵션창이 열려서 노출될 때 사이드바 위치 변경
	if (__is) {
		$sidebar.classList.remove(_classSideOptionUp);
		$sidebar.classList.add(_classSideOptionOpen);
	}
	else {
		$sidebar.classList.remove(_classSideOptionOpen);
		$sidebar.classList.add(_classSideOptionUp);
	}

	// 셀렉트형 옵션 드롭다운 닫기
	var $optionDropdown = mm.find('.m_prodetail-buy .mm_dropdown');
	if ($optionDropdown[0]) mm.dropdown.close($optionDropdown);

}

mm.ready(function () {

	// 품절임박 숨김
	(function (__$stock) {

		if (!__$stock) return;

		gsap.fromTo('.m_prodetail-head-stock .mco_clock', { rotate: -15 }, { rotate: 15, duration: 0.05, ease: 'linear.none', yoyo: true, yoyoEase: 'linear.none', repeat: 100 });
		gsap.to('.m_prodetail-head-stock .mco_clock', { scale: 1.4, duration: 0.4, delay: 0.5, ease: 'bounce.out', yoyo: true, repeat: 5, yoyoEase: 'back.in',
			onComplete: function () {

				gsap.to(__$stock, { autoAlpha: 0, height: 0, duration: 0.4, delay: 2, ease: 'cubic.inOut' });

			},
		});

	})(mm.find('.m_prodetail-head-stock')[0]);

	// 탭메뉴
	_.forEach(mm.find('.m_prodetail-tab'), function (__$tab) {

		var $option = mm.find('.m_prodetail-buy')[0];
		var $header = mm.find('.mm_header')[0];
		var $sidebar = mm.find('.mm_sidebar')[0];

		var _classSticky = 'S=tab-sticky';
		var _classStickyEnd = 'S=tab-stickyEnd';
		var _classBuySticky = 'S=buy-sticky';
		var _classBuySwitch = 'S=switch-on';
		var _classSideOptionUp = 'S=sidebar-up';
		var _classSideOptionOpen = 'S=sidebar-upper';

		// 스크롤
		mm.event.on(mm.scroll.el, 'load scroll', function (__e) {

			var _tabTop = mm.element.offset(__$tab).top;
			if (_tabTop - $header.offsetHeight - mm.element.offset($header).top < 0) {
				if (_tabTop > -__$tab.offsetHeight + document.documentElement.offsetHeight * 0.33) {
					__$tab.classList.remove(_classStickyEnd);
					__$tab.classList.add(_classSticky);
				}
				else {
					__$tab.classList.remove(_classSticky);
					__$tab.classList.add(_classStickyEnd);
				}

				$sidebar.classList.add(_classSideOptionUp);
				if ($option) $option.classList.add(_classBuySticky);
			}
			else {
				__$tab.classList.remove(_classSticky);
				mm.class.remove($sidebar, [_classSideOptionUp, _classSideOptionOpen]);

				if ($option) {
					mm.class.remove($option, [_classBuySticky, _classBuySwitch]);

					var $optionDropdown = mm.find('.m_product-option-select .mm_dropdown',  $option);
					if ($optionDropdown[0]) mm.dropdown.close($optionDropdown[0]);
				}
			}

		});

	});

	// 공동구매 하단옵션 스크롤 이벤트
	(function (__$coopbuy) {

		if (!__$coopbuy) return;

		var $option = mm.find('.m_prodetail-buy')[0];
		var $header = mm.find('.mm_header')[0];
		var $sidebar = mm.find('.mm_sidebar')[0];

		var _classBuySticky = '__buy-sticky';
		var _classBuySwitch = 'S=switch-on';
		var _classSideOptionUp = 'S=sidebar-up';
		var _classSideOptionOpen = 'S=sidebar-upper';

		// 스크롤
		mm.event.on(mm.scroll.el, 'load scroll', function (__e) {

			var _coopbuyTop = mm.element.offset(__$coopbuy).top;
			if (_coopbuyTop - $header.offsetHeight - mm.element.offset($header).top < 0) {
				$sidebar.classList.add(_classSideOptionUp);
				if ($option) $option.classList.add(_classBuySticky);
			}
			else {
				mm.class.remove($sidebar, [_classSideOptionUp, _classSideOptionOpen]);
				mm.class.remove($option, [_classBuySticky, _classBuySwitch]);

				var $optionDropdown = mm.find('.m_product-option-select .mm_dropdown',  $option);
				if ($optionDropdown[0]) mm.dropdown.close($optionDropdown);
			}

		});

	})(mm.find('.m_prodetail-coopbuy')[0]);

	// 상품 360도
	(function (__$multiangle) {

		var $list = mm.find('.m_prodetail-multiangle-image', __$multiangle)[0];

		if (!$list) return;

		mm.intersection.force(mm.find('data-lazyload', $list));
		mm.class.add($list.children, 'S=on');// 화면에 처음 노출될 때 깜빡이는 이슈로 첫 실행 시 노출 적용

		// 상품 이미지 360도 보기
		mm.event.on(mm.find('.btn_multiangle-view')[0], 'click', function () {

			var $multiangleBtn = this;
			var _classOn = 'S=multiangle-on';

			if (!__$multiangle || __$multiangle.classList.contains(_classOn)) return;

			$multiangleBtn.disabled = true;
			mm.event.on(mm.find('.btn_close', __$multiangle)[0], 'click', function () {

				$multiangleBtn.disabled = false;
				__$multiangle.classList.remove(_classOn);

			}, { _isOnce: true });

			var $multiangleNote = mm.find('.m_prodetail-multiangle-note', __$multiangle)[0];
			$multiangleNote.classList.add('S=note-on');
			__$multiangle.classList.add(_classOn);

			mm.delay.on(mm.class.remove, { _time: 2.5, _isSec: true, _name: 'DELAY_360_NOTE_HIDE', _isOverwrite: true, params: [$multiangleNote, 'S=note-on'] });

			mm.class.remove($list.children, 'S=on');
			$list.firstElementChild.classList.add('S=on');

		});

		// 상품 이미지 360도 드래그
		var _sensitive = 2 * (32 / $list.childElementCount);
		var _dragCount = 0;
		var _previewIndex = 0;

		mm.event.on(__$multiangle, 'mousedown', function (__e) {

			_dragCount = 0;
			_previewIndex = mm.element.index($list.children, '.S=on');
			var _prevX = __e.clientX;

			mm.event.on(document, 'mousemove mouseup', function view360MouseInlineHandler(__e) {

				__e.preventDefault();

				switch (__e.type) {
					case 'mousemove':
						var _moveX = __e.clientX - _prevX;
						_prevX = __e.clientX;

						if (_moveX > 0) _dragCount++;
						else _dragCount--;

						if (Math.abs(_dragCount) > _sensitive) {
							_dragCount = 0;
							_previewIndex = (_moveX > 0) ? _previewIndex + 1 : _previewIndex - 1;
							if (_previewIndex >= $list.childElementCount) _previewIndex = 0;
							if (_previewIndex < 0) _previewIndex = $list.childElementCount - 1;

							mm.class.remove($list.children, 'S=on');
							$list.children[_previewIndex].classList.add('S=on');
						}
						break;
					case 'mouseup':
						mm.event.off(document, 'mousemove mouseup', view360MouseInlineHandler);
						break;
				}

			});

		});

	})(mm.find('.m_prodetail-multiangle')[0]);

});
