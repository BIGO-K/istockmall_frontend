'use strict';

/**
 * 헤더 타입 A(커스텀)
**/

//< 레디
mm.ready(function () {

	// 헤더 검색
	(function (__$search) {

		if (!__$search) return;

		var $searchInput = mm.find('data-text', __$search)[0];// 검색어 입력창
		var $recentWord = mm.find('.mm_header-search-keyword', __$search)[0];// 최근검색어
		var $recommendWord = mm.find('.mm_header-search-auto', __$search)[0];// 추천검색어
		var _classOn = 'S=search-on';

		mm.event.off($searchInput, 'click change keydown keyup');

		mm.event.on($searchInput, 'click change keydown keyup', function (__e) {


			var _recommendHeight = 0;
			_.forEach($recommendWord.children, function (__$el) {

				_recommendHeight += __$el.offsetHeight;

			});
			_recommendHeight = (_recommendHeight <= 550) ? 550 : 750;

			var _isKeyword = this.value.trim().length > 0;
			switch (__e.type) {
				case 'click':
				case 'keydown':
					if (__$search.classList.contains(_classOn)) return;// 이미 열려있으면 리턴

					__$search.classList.add(_classOn);
					gsap.to([$recentWord, $recommendWord], { alpha: 1, height: _recommendHeight, duration: mm.time._fast, ease: 'cubic.inOut' });

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

	})(mm.find('.mm_header-search')[0]);

});
//> 레디