import modernizr from 'modernizr';
import $ from 'jquery';

/*

	Swap imgs that use svg to use png if svg is not supported

*/

class SvgFix {
	constructor() {
		if (modernizr.svg) {
			return false;
		}

		$('img').each((i, item) => {
			let $item = $(item);
			let src = $item.attr('src');
			$item.attr('src', src.split('.svg').join('.png'));
		});

	}
}

new SvgFix();

export default {};
