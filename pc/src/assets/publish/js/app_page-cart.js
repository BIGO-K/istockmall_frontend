'use strict';

/**
 * 장바구니
 * 옵션 변경
**/


//< 레디
mm.ready(function () {

	// 옵션 변경 레이어 닫기
	mm.event.on(document, 'click', function (__e) {

		var $target = __e.target;

		if (!mm.find('.mm_layer.S=on')[0] || $target.closest('.mm_bom')) return;

		var $parent = mm.find('.mm_layer.S=on')[0].closest('.m_cart-option');
		if ($target.closest('.btn_layer-close') || (!$target.closest('.mm_layer') && !$target.classList.contains('btn_option-change'))) mm.event.dispatch(mm.find('.btn_option-change ', $parent), 'click');

	});

});
//> 레디
