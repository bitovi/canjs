steal.apps('jquery').then(function(){
	var liveHandler = null, event = jQuery.event;
	
	
	/**
	 * Finds event handlers of a given type on an element.
	 * @param {Object} el
	 * @param {Object} types
	 * @param {Object} selector
	 */
	event.find  = function(el, types, selector){
		var events = $.data(el, "events"), handlers = [];
		if(!events) return handlers;
		
		if(selector){
			if( !events.live) return [];
			var live = events.live, handlers = [];

			for (var t = 0; t < live.length; t++) {
				var liver = live[t];
				if(  liver.selector == selector &&  $.inArray(liver.origType, types  ) !== -1 ){
					handlers.push(liver.origHandler || liver.handler)
				}
			}
		}else{
			for(var t =0; t< types.length; t++){
				var typeHandlers = events[types[t]];
				if(!typeHandlers) continue;
				
				for(var h = 0; h <typeHandlers.length; h++ ){
					if(typeHandlers[h].selector == selector)
						handlers.push(typeHandlers[h].origHandler || typeHandlers[h].handler)
				}
			}
			
			
		}
		return handlers;
	}
	/**
	 * Only attaches one 
	 * @param {Array} types llist of types that will delegate here
	 * @param {Object} startingEvent the first event to start listening to
	 * @param {Object} onFirst a function to call 
	 */
	event.setupHelper = function(types, startingEvent, onFirst){
		if(!onFirst) {
			onFirst = startingEvent;
			startingEvent = null;
		}
		var add = function(handleObj){
			
			var selector = handleObj.selector || "";
			if (selector) {
				var bySelector = event.find(this, types, selector);
				if (!bySelector.length) {
					$(this).delegate(selector,startingEvent, onFirst );
				}
			}
			else {
				//var bySelector = event.find(this, types, selector);
				event.add(this, startingEvent, onFirst, {
					selector: selector,
					delegate: this
				})
			}
			
		}
		var remove = function(handleObj){
			var selector = handleObj.selector || ""
			if (selector) {
				var bySelector = event.find(this, types, selector);
				if (!bySelector.length) {
					$(this).undelegate(selector,startingEvent, onFirst );
				}
			}
			else {
				event.remove(this, startingEvent, onFirst, {
					selector: selector,
					delegate: this
				})
			}
		}
		$.each(types, function(){
			event.special[this] = {
				add:  add,
				remove: remove,
				setup : function(){}
			}
		})
	}
	
	
	
})