// TODO

(function() {
    var window = this,
        document = window.document;

    /*------------------------------------ Event ------------------------------------*/

    var DOMEvent = new Type('DOMEvent', function(event, win) {
        win = win || window;
        event = event || win.event;

        if (event.$extended) {
            return event;
        }

        this.$extended = true;
        this.event = event;
        this.shift = event.shiftKey;
        this.control = event.ctrlKey;
        this.alt = event.altKey;
        this.meta = event.metaKey;
        this.page = {};
        this.client = {};

        var type = this.type = event.type,
            target = event.target || event.srcElement;

        while (target && target.nodeType !== 1) {
            target = target.parentNode;
        }

        this.target = document.id(target);

        // keyup, keydown, keypress, etc
        if (type.indexOf('key') === 0) {
            var code = this.code = (event.which || event.keyCode);

            this.key = DOMEvent.keyCodes[code];

            if (type === 'keydown' || type === 'keyup') {
                if (code > 111 && code < 124) {
                    this.key = 'f' + (code - 111);

                } else if (code > 95 && code < 106) {
                    this.key = code - 96;
                }
            }

            if (!this.key) {
                this.key = String.fromCharCode(code).toLowerCase();
            }

        // mouse clicks
        } else if (type === 'click' || type === 'dblclick' || type === 'contextmenu' || type === 'DOMMouseScroll' || type.indexOf('mouse') === 0) {
            var page = (!document.compatMode || document.compatMode == 'CSS1Compat') ? document.html : document.body;

            this.page = {
                x: event.pageX || (event.clientX + page.scrollLeft),
                y: event.pageY || (event.clientY + page.scrollTop)
            };

            this.client = {
                x: event.pageX ? event.pageX - win.pageXOffset : event.clientX,
                y: event.pageY ? event.pageY - win.pageYOffset : event.clientY
            };

            if (type === 'DOMMouseScroll' || type === 'mousewheel') {
                this.wheel = (event.wheelDelta) ? event.wheelDelta / 120 : -(event.detail || 0) / 3;
            }

            this.rightClick = (event.which === 3 || event.button === 2);

            if (type === 'mouseover' || type === 'mouseout') {
                var related = event.relatedTarget || event[(type === 'mouseover' ? 'from' : 'to') + 'Element'];

                while (related && related.nodeType !== 1) {
                    related = related.parentNode;
                }

                this.relatedTarget = document.id(related);
            }

        // touch screens
        } else if (type.indexOf('touch') === 0 || type.indexOf('gesture') === 0){
            this.rotation = event.rotation;
            this.scale = event.scale;
            this.targetTouches = event.targetTouches;
            this.changedTouches = event.changedTouches;
            this.touches = event.touches;

            if (this.touches && this.touches[0]) {
                var touch = this.touches[0];

                this.page = { x: touch.pageX, y: touch.pageY };
                this.client = { x: touch.clientX, y: touch.clientY };
            }
        }
    });

    DOMEvent.implement({

        /**
         * Stop bubbling and prevent default.
         *
         * @returns {DOMEvent}
         */
        stop: function() {
            return this.preventDefault().stopPropagation();
        },

        /**
         * Stop the even from bubbling up through targets.
         *
         * @returns {DOMEvent}
         */
        stopPropagation: function() {
            if (this.event.stopPropagation) {
                this.event.stopPropagation();
            } else {
                this.event.cancelBubble = true;
            }

            return this;
        },

        /**
         * Prevent the default functionality from executing.
         *
         * @returns {DOMEvent}
         */
        preventDefault: function() {
            if (this.event.preventDefault) {
                this.event.preventDefault();
            } else {
                this.event.returnValue = false;
            }

            return this;
        }

    });

    // Mapping of codes to keyboard keys
    DOMEvent.keyCodes = {};

    /**
     * Map a key and code together.
     *
     * @param {String} code
     * @param {String} key
     * @returns {DOMEvent}
     */
    DOMEvent.defineKey = function(code, key){
        this.keyCodes[code] = key;
        return this;
    };

    /**
     * Map multiple key codes.
     *
     * @param {Object} keys
     * @type {DOMEvent}
     */
    DOMEvent.defineKeys = DOMEvent.defineKey.overloadSetter(true);

    // Map the standard codes
    DOMEvent.defineKeys({
        '38': 'up', '40': 'down', '37': 'left', '39': 'right',
        '27': 'esc', '32': 'space', '8': 'backspace', '9': 'tab',
        '46': 'delete', '13': 'enter'
    });

}).bind(this);