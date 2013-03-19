(function($) {

    var listening = false;
    var listeners = {};

    // credit to http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery#answer-7616484
    var hashCode = function(str){
        var hash = 0, i, char;
        if (str.length == 0) return hash;
        for (i = 0; i < str.length; i++) {
            char = str.charCodeAt(i);
            hash = ((hash<<5)-hash)+char;
            // Convert to 32bit integer
            hash = hash & hash;
        }
        return hash;
    };

    $.fn.approaching = function(handler, options) {
        
        // listner ID
        var hash = hashCode(this.context + this.selector);

        // stop listening on current element
        if (arguments[0] == 'destroy') {
            listeners[hash] = null;
            delete listeners[hash];
            // stop listening on everything
            if (this.attr('nodeName') == '#document') {
                $(document).off('mousemove.approaching');
                listeners = {};
                listening = false;
            }
            return this;
        }

        // register element listener
        handler = $.isFunction(handler) ? handler : null;
        options = options || {};
        // listening threshhold [top, right, bottom, left]
        options.threshhold = options.threshhold || [25, 25, 25, 25]; 
        listeners[hash] = {
            'element': this,
            'handler': handler,
            'options': options,
            'active': false
        };

        if (!listening) {
            $(document).on('mousemove.approaching', function(ev) {
                listening = true;
                var args = arguments;
                // if the mouse currently locates within 
                // any of the element's listening range
                // call the corresponding handler
                $.each(listeners, function(hash, item) {
                    setTimeout(function() {
                        var
                        thrTop = item.options.threshhold[0],
                        thrRight = item.options.threshhold[1],
                        thrBottom = item.options.threshhold[2],
                        thrLeft = item.options.threshhold[3],
                        mouseX = ev.pageX,
                        mouseY = ev.pageY,
                        eleOffset = item.element.offset(),
                        eleWidth = item.element.outerWidth(),
                        eleHeight = item.element.outerHeight(),

                        leftX  = eleOffset.left - thrLeft,
                        rightX = eleOffset.left + eleWidth + thrRight,
                        topY   = eleOffset.top  - thrTop,
                        bottomY = eleOffset.top + eleHeight + thrBottom;

                        // already ran
                        if (item.active) {
                            if (mouseX < leftX
                                || mouseX > rightX
                                || mouseY < topY
                                || mouseY > bottomY) {
                                item.active = false;
                            }
                            return;
                        }
                        
                        // run
                        if (mouseX > leftX 
                            && mouseX < rightX
                            && mouseY < bottomY
                            && mouseY > topY) {
                            item.active = true;
                            item.handler.apply(item.element, args);
                        }
                    }, 0);

                });
            });
        }


        return this;
    };

    $.event.special.approaching = {
        add: function(handlerObj) {
            $(this).approaching(handlerObj.handler, handlerObj.data);
            return false;
        },
        remove: function() {
            $(this).approaching('destroy');            
            return false;
        }
    };

})(jQuery);
