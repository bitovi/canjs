steal('can/util', 'can/route', 'can/control', function (can) {

	// ## control/route.js
	// _Controller route integration._

	can.Control.processors.route = function (el, event, selector, funcName, controller) {
		
		//!steal-remove-start
		can.dev.warn("can/control/route is a deprecated plugin and will be removed in a future release.");
		//!steal-remove-end
		
		selector = selector || "";
		if (!can.route.routes[selector]) {
			if (selector[0] === '/') {
				selector = selector.substring(1);
			}
			can.route(selector);
		}
		var batchNum,
			check = function (ev, attr, how) {
				if (can.route.attr('route') === (selector) &&
					(ev.batchNum === undefined || ev.batchNum !== batchNum)) {

					batchNum = ev.batchNum;

					var d = can.route.attr();
					delete d.route;
					if (can.isFunction(controller[funcName])) {
						controller[funcName](d);
					} else {
						controller[controller[funcName]](d);
					}

				}
			};
		can.route.bind('change', check);
		return function () {
			can.route.unbind('change', check);
		};
	};

	return can;
});
