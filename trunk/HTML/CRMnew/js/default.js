/*
 * Copyright (c) 2009 Simo Kinnunen.
 * Licensed under the MIT license.
 *
 */
// ajax mode: abort
// usage: $.ajax({ mode: "abort"[, port: "uniqueport"]});
// if mode:"abort" is used, the previous request on that port (port can be undefined) is aborted via XMLHttpRequest.abort()
var CONSTANTS = {
    CouponType: {
        COUPON: 1,//优惠
        DISCOUNT: 2//折扣
    },
    MealType: {
        FIXED_PRICE: 601,//固定价格套餐
        UNFIXED: 602, //自选套餐
        UNMEAL: 603,//非套餐
        PEILIAO: 604,//配料
        DANPIN: 605,//单品
        FIXED_COMPOSITION: 606 //固定组成套餐
    },
    EatingStyle: {//就餐类型
        TAKEOUT: 701,//外带
        DELIVERY: 702//外送
    },
    SALESCHANNEL: {
        ONLINE: 109
    },
    MENUTYPE: {
        COMMON: 'ONLINE_COMMON_MENU',
        SPECIAL: 'ONLINE_SPECIAL_MENU'
    },
    COOKIE: {
        PARTYID: 'partyId',
        ADDRESSID: 'addressId',
        ADDRESS: 'addressId',
        ORDERTIME: 'orderTime',
        CART: 'cartData'
    },
    LANGUAGE: {
        CHINESE: 'zh_CN',
        ENGLISH: 'en_US'
    },
    LANCH_MODEL_TYPE: {
        ADD_ADDRESS: 'addAddress',
        ADD_STORE: 'addStore',
        ADD_ADDRESS_OR_STORE: 'addAddressOrStore',
        USER_MODIFY_ADDRESS: 'userModifyAddress',
        CHANGE_EATING_STYLE: 'changeEatingStyle',
        CHANGE_STORE: 'changeStore',
        SELECT_PICKER_CHANGE: 'selectPickerChange',
        OTHER_INFO: 'otherInfo'
    },
    ENCRYPPWD: 'This1sATest',
    DELIVERYFEE: 7
};
//常用正则表达式判断
var REGEXS = {
    email: /^([a-zA-Z0-9]+[_|\_|\.|\-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
    phone: /^(((13[0-9]{1})|(15[0-9]{1})|(14[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/,
    number: /^[0-9]*[1-9][0-9]*$/,
    tel: /^(([0\+]\d{2,3}-)?(0\d{2,3})-)?(\d{7,10})(-(\d{3,}))?$/,
    confirmPhone: /^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$/,
    isEmail: function (str) {
        return this.email.test(str);
    }, isPhone: function (str) {
        return this.phone.test(str);
    }, isNumber: function (str) {
        return this.number.test(str);
    }, isTel: function (str) {
        return this.tel.test(str);
    }, isTelphone: function (str) {
        return this.isPhone(str) || this.isTel(str);
    }, isConfirmPhone: function (str) {
        return this.confirmPhone.test(str);
    }
};
(function ($) {
    var ajax = $.ajax;
    var pendingRequests = {};
    $.ajax = function (settings) {
        // create settings for compatibility with ajaxSetup
        settings = $.extend(settings, $.extend({}, $.ajaxSettings, settings));
        var port = settings.port;
        if (settings.mode == "abort") {
            if (pendingRequests[port]) {
                pendingRequests[port].abort();
            }
            return (pendingRequests[port] = ajax.apply(this, arguments));
        }
        return ajax.apply(this, arguments);
    };
})(jQuery);
jQuery.Messages = {};
if (window.lang == CONSTANTS.LANGUAGE.ENGLISH) {
    $.ajax({
        type: "GET",
        url: baseUrl + "/assets/js/messages_en.js",
        dataType: "script",
        cache: true
    });
}
jQuery.extend({
    t: function (key) {
        if (key && jQuery.Messages[key]) {
            return jQuery.Messages[key].toString();
        }
        return key.toString();
    }, removeFromArray: function (elem, array) {
        var i = $.inArray(elem, array);
        if (i > -1) {
            array.splice(i, 1);
            return true;
        }
        return false;
    }
});
String.format = function () {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }
    return s;
};
(function (S) {
    /**
     * Returns true if the string contains a given sequence of characters
     * @param {String} sequence Character sequence to locate in the string.
     * @param {Boolean} caseSensitive Whether or not the search is case sensitive
     */
    S.contains = function (sequence, caseSensitive) {
        return caseSensitive ? (this.indexOf(sequence) > -1) : (this.toLowerCase().indexOf(sequence.toLowerCase()) > -1);
    };
    /**
     * Returns a copy of the string with a sequence of characters inserted into it
     * @param {Number} index The index at which to insert the sequence
     * @param {String} sequence The sequence of characters to insert
     */
    S.insert = function (index, sequence) {
        if (index == 0) return sequence + this;
        else return this.substring(0, index) + sequence + this.substring(index);
    };
    /**
     * Returns a copy of the string with leading and trailing whitespace removed
     */
    S.trim = function () {
        return this.replace(/^\s+/, '').replace(/\s+$/, '');
    };
    /**
     * Replace all strings to the target
     */
    S.replaceAll = function (search, replace, ignoreCase) {
        return this.replace(new RegExp(search, (ignoreCase ? "gi" : "g")), replace);
    };
    S.notEmpty = function () {
        return this.trim().length > 0;
    };
    S.endWith = function (suffix) {
        return (this.substr(this.length - suffix.length) === suffix);
    };
    S.startWith = function (prefix) {
        return (this.substr(0, prefix.length) === prefix);
    };
    S.t = function (key) {// translate string with args
        if (!key) {
            return $.t(this);
        }
        return String.format($.t(this), $.t(key));
    }
})(String.prototype);
/*

 JQuery Curvy Corners by Mike Jolley
 http://blue-anvil.com
 http://code.google.com/p/jquerycurvycorners/
 ------------
 Version 1.9

 Origionaly by: Cameron Cooke and Tim Hutchison.
 Website: http://www.curvycorners.net

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.

 */
//(function(A) {
//    if (!A.indexOf) {
//        /**
//         * Returns the first index at which a given element can be found in the array, or -1 if it is not present.
//         * @param {Object} item Element to locate in the array.
//         * @param {Number} fromIndex The index at which to begin the search. Defaults to 0, i.e. the whole array will be searched. If the index is greater than or equal to the length of the array, -1 is returned, i.e. the array will not be searched. If negative, it is taken as the offset from the end of the array. Note that even when the index is negative, the array is still searched from front to back. If the calculated index is less than 0, the whole array will be searched.
//         */
//        A.indexOf = function(item, fromIndex){
//            for (var i = (fromIndex >= 0 ? fromIndex : 0), j = this.length; i < j; i++) if (this[i] == item) return i;
//            return -1;
//        };
//    }
//
//    /**
//     * Returns the last index at which a given element can be found in the array, or -1 if it is not present.
//     * @param {Object} item Element to locate in the array.
//     * @param {Number} fromIndex The index at which to begin the search. Defaults to 0, i.e. the whole array will be searched. If the index is greater than or equal to the length of the array, -1 is returned, i.e. the array will not be searched. If negative, it is taken as the offset from the end of the array. Note that even when the index is negative, the array is still searched from front to back. If the calculated index is less than 0, the whole array will be searched.
//     */
//    A.lastIndexOf = function(item, fromIndex) {
//        for (var i = this.length - 1; i >= (fromIndex >= 0 ? fromIndex : 0); i--) if (this[i] == item) return i;
//        return -1;
//    };
//
//    /**
//     * Returns true if an object exists in this array
//     * @param {Object} item Element to locate in the array.
//     */
//    A.contains = function(item) {
//        return this.indexOf(item) > -1;
//    };
//
//    /**
//     * Removes an item from this array, if it exists in this array
//     * @param {Object} item Element to scan for and remove from this array
//     */
//    A.remove = function(item) {
//        var i = this.indexOf(item);
//        if (i > -1) {
//            this.splice(i, 1);
//            return true;
//        }
//        return false;
//    };
//
//    if (!A.filter) {
//        /**
//         * Creates a new array with all elements that pass the test implemented by the provided function.
//         * @param {Function} callback Function to test each element of the array.
//         * @param {Object} context (Optional) Object to use as this when executing callback.
//         */
//        A.filter = function(callback, context) {
//            var result = [], i, j = this.length >>> 0, val;
//            for (i = 0; i < j; i++) {
//                if (i in this) {
//                    val = this[i];
//                    if (callback.call(context, val, i, this)) result.push(val);
//                }
//            }
//            return result;
//        };
//    }
//
//    if (!A.forEach) {
//        /**
//         * Executes a provided function once per array element.
//         * @param {Object} callback Function to execute for each element.
//         * @param {Object} context (Optional) Object to use as this when executing callback.
//         */
//        A.forEach = function(callback, context) {
//            var len = this.length >>> 0, i;
//            for (i = 0; i < len; i++) if (i in this) callback.call(context, this[i], i, this);
//        };
//    }
//
//})(Array.prototype);

//Rf.Require
if (!this.Rf) this.Rf = {};
(function (ns, $) {
    /**
     * Requires that a class/object/function exists, or an error is thrown
     * @param {String} name The namespace of the object, from window.
     * @param {Object} current (Optional) The root object for namespace lookups, or window if this argument is omitted
     */
    ns.Require = function (name, current) {
        var namespaces = name.split('.'),
            currentNs = current ? current : window;
        for (var i = 0, j = namespaces.length; i < j; i++) {
            if (!(currentNs = currentNs[namespaces[i]])) throw ('Missing required name ' + name);
        }
        return currentNs;
    };
})(Rf, jQuery);

//RF.Event
if (!this.Rf) this.Rf = {};
(function (ns, $) {
    /**
     * Base event class
     * @param {String} type The type of the event
     * @param {String} target The dispatcher of the event
     * @param {Object} (Optional) Data associated with this event
     */
    ns.Event = function (type, target, data) {
        this.Type = type;
        this.Target = target;
        this.Data = data;
        this.TimeStamp = new Date();
        this._Canceled = false;
    };
    ns.Event.prototype = {
        constructor: ns.Event,
        /**
         * Prevents the event from being passed any further
         */
        Stop: function () {
            this._Canceled = true;
        },
        /**
         * Converts the event to a string
         */
        toString: function () {
            var result = '[Event[';
            for (var k in this) {
                if (this[k] instanceof Function) continue;
                result += k + '=' + this[k] + ';';
            }
            return result + ']]';
        }
    };

    /**
     * Base class for objects that can use events
     */
    ns.EventDispatcher = function (options) {
        this._Events = {};
        if (options) for (var prop in options) this[prop] = options[prop];
    };
    ns.EventDispatcher.prototype = {
        constructor: ns.EventDispatcher,
        /**
         * Associates a callback with one of this object's events
         * @param {String} type The type name of the event to listen for
         * @param {Function} callback A function to be executed when the event occurs.
         */
        Bind: function (type, callback) {
            var callbacks = this._Events[type];
            if (!callbacks) callbacks = this._Events[type] = [];
            callbacks.push(function (e) {
                try {
                    callback.call(this, e);
                }
                catch (err) {
                    setTimeout(function () { throw err.message }, 0);
                }
            });
            return this;
        },
        /**
         * Removes all callbacks or a specific callback from this object's event listeners
         * @param {String} type The type of event
         * @param {Function} callback (Optional) A specific callback to remove. If this argument is not supplied, all callbacks for that event type are removed.
         */
        Unbind: function (type, callback) {
            var callbacks = this._Events[type];
            if (callbacks && callbacks.length > 0) {
                if (callback) {
                    for (var i = callbacks.length - 1; i >= 0; i--) {
                        if (callbacks[i] == callback) callbacks.splice(i, 1);
                    }
                }
                else {
                    callbacks.splice(0, callbacks.length);
                }
            }
            return this;
        },
        /**
         * Generates an event
         * @param {Object} event Either an Rf.Event object or an event type name
         */
        Dispatch: function (event) {
            if (typeof event == 'string') event = new ns.Event(event, this);
            var callbacks = this._Events[event.Type],
                i, j;
            if (callbacks && (j = callbacks.length) > 0) {
                for (i = 0; i < j; i++) {
                    callbacks[i].call(this, event);
                    if (event._Canceled) break;
                }
            }
            return this;
        }
    };
})(Rf, jQuery);

//Rf.Ajax
if (!this.Rf) this.Rf = {};
(function (ns, $) {
    ns.Require('EventDispatcher', ns);

    /**
     * AJAX utility object
     */
    ns.Ajax = new ns.EventDispatcher({
        /**
         * All pending AJAX requests
         */
        Pending: [],
        /**
         * Indicates whether or not AJAX activity is going on
         */
        IsActive: false,
        /**
         * Gets the index of a pending XMLHttpRequest
         * @param {String/XMLHttpRequest} xhr The XMLHttpRequest or channel key to look for
         * @returns {Number} The index of the XHR in the pending array, or -1 if it is not found
         */
        _IndexOf: function (xhr) {
            var i,
                item;
            for (i = pending.length - 1; i > -1; i--) {
                if ((item = pending[i]).xhr == xhr || item.key == xhr) return i;
            }
            return -1;
        },
        /**
         * Aborts an XMLHttpRequest and triggers the document's ajaxAbort event
         * @param {Number} i The index of the pending request
         */
        _Abort: function (i) {
            var xhr = pending[i].xhr;
            xhr.abort();
            pending.splice(i, 1);
            $(document).triggerHandler('ajaxAbort', xhr);
        },
        /**
         * Sends a new AJAX request, canceling any AJAX requests that are using the same channel
         * @param {String} key The name of the channel on which to send the request
         * @param {Object} options AJAX options (See http://docs.jquery.com/Ajax/jQuery.ajax#options)
         * @returns {XMLHttpRequest} The AJAX request object
         */
        Send: function (key, options) {
            ajax.CancelChannel(key);
            var xhr = $.ajax(options);
            pending[ajax._IndexOf(xhr)].key = key;
            return xhr;
        },
        /**
         * Cancels any pending AJAX requests that are using a specified channel
         * @param {String} key The name of the channel
         */
        CancelChannel: function (key) {
            var i = ajax._IndexOf(key);
            if (i > -1) ajax._Abort(i);
        },
        /**
         * Cancels all pending AJAX requests that are using channels
         */
        CancelAllChannels: function () {
            var i;
            for (i = pending.length - 1; i > -1; i--) {
                if (pending[i].key) ajax._Abort(i);
            }
        }
    });

    /**
     * Events dispatched by the AJAX object
     */
    ns.Ajax.Events = {
        /**
         * Dispatched when AJAX activity starts on the page
         */
        Start: 'start',
        /**
         * Dispatched when AJAX activity stops on the page
         */
        Stop: 'stop'
    };

    /**
     * Attach a function to be executed whenever a channeled AJAX request is aborted
     * @param {Function} callback The function to execute
     */
    $.fn.ajaxAbort = function (f) {
        return this.bind('ajaxAbort', f);
    };

    var ajax = ns.Ajax,
        pending = ajax.Pending,
        onSend = function (e, xhr) {
            if (!ajax.IsActive) {
                ajax.IsActive = true;
                ajax.Dispatch(ajax.Events.Start);
            }
        },
        onEnd = function (e, xhr) {
            var pendingCount = pending.length,
                i;
            for (i = pendingCount - 1; i > -1; i--) {
                if (pending[i].xhr.readyState == 4 || pending[i].xhr.readyState == 0) pendingCount--;
            }
            if (pendingCount < 1 && ajax.IsActive) {
                ajax.IsActive = false;
                ajax.Dispatch(ajax.Events.Stop);
            }
        };

    $(document).ajaxSend(function (e, xhr) {
        pending.push({ xhr: xhr });
        onSend(e, xhr);
    }).ajaxComplete(function (e, xhr) {
        pending.splice(ajax._IndexOf(xhr), 1);
        onEnd(e, xhr);
    }).ajaxAbort(function (e, xhr) {
        onEnd(e, xhr);
    });
})(Rf, jQuery);

//Rf.ToolTip
if (!this.Rf) this.Rf = {};
(function (ns, $) {
    ns.Require('jQuery');
    /**
     * (Abstract) Base tooltip class. This class should not be instantiated directly
     * @param {Object} owner jQuery selector of the object to whom the tooltip pertains
     * @param {Object} options Settings used to initialize the tooltip
     */
    ns.Tooltip = function (owner, options) {
        ns.EventDispatcher.call(this, options);
        if (owner) this._Owner = $(owner);
        if (!this.ID) this.ID = 'Tooltip' + new Date().valueOf();
    };

    ns.Require('EventDispatcher', ns);
    /**
     * Events that can be dispatched by a tooltip
     */
    ns.Tooltip.Events = {
        /**
         * Dispatched when the tooltip appears on screen
         */
        Show: 'show',
        /**
         * Dispatched when the tooltip is removed from the screen
         */
        Hide: 'hide'
    };
    /**
     * Positions that the tooltip can be in, relative to its owner
     */
    ns.Tooltip.Anchor = {
        /**
         * ns.Tooltip appears to either the top or the bottom of its owner
         */
        Vertical: 'vertical',
        Top: 'top',
        Bottom: 'bottom',
        /**
         * ns.Tooltip appears to either the left or the right of its owner
         */
        Horizontal: 'horizontal'
    };
    /**
     * The tooltip that is currently being displayed
     */
    ns.Tooltip.Current = null;
    ns.Tooltip.prototype = new ns.EventDispatcher({
        constructor: ns.Tooltip,
        /**
         * (Protected) The element to which the tooltip pertains
         */
        _Owner: null,
        /**
         * (Protected) The physical element that houses the tooltip
         */
        _Self: null,
        /**
         * (Protected) When true, prevents the tooltip's Close method from removing the tooltip
         */
        _PreventClose: false,
        /**
         * The tooltip's positioning preference
         */
        Anchor: ns.Tooltip.Anchor.Vertical,
        /**
         * Indicates whether or not the tooltip is currently being displayed
         */
        IsOpen: false,
        /**
         * The ID to be given to the tooltip. (Autogenerated if null)
         */
        ID: null,
        /**
         * Class name to be given to the tooltip. (Defaults to 'tooltip')
         */
        ClassName: '',
        /**
         * HTML template used to render the tooltip. The tooltip's content will go into the element marked with role="tooltip".
         */
        Template: '<div><div role="tooltip"></div></div>',
        /**
         * The z-index used for tooltips
         */
        ZIndex: 6000,
        /**
         * The jQuery selector to find the parent element of all tooltips
         */
        ParentSelector: 'body',
        /**
         * The duration of the animation used when showing/hiding tooltips
         */
        AnimationDuration: 150,
        /**
         * The number of pixels of space between the tooltip and its owner
         */
        Margin: 5,
        /**
         * Load's the tooltip's content, and then displays the tooltip
         */
        Open: function () {
            if (ns.Tooltip.Current) ns.Tooltip.Current.Remove();
            ns.Tooltip.Current = this;
            this.AcquireContent(function (data) { this.Init(data); });
            return this;
        },
        OnShow: null,
        /**
         * Removes the tooltip from the screen, if allowed
         */
        Close: function () {
            var me = this;
            if (!me._PreventClose && me.IsOpen) {
                if (ns.Tooltip.Current == me) ns.Tooltip.Current = null;
                me.Dispatch(ns.Tooltip.Events.Hide);
                me._Self.addClass('transitioning').fadeOut(me.AnimationDuration, function () { me.Remove(); });
            }
            return me;
        },
        /**
         * Removes the tooltip from the DOM
         */
        Remove: function () {
            if (this._Self) this._Self.remove();
            this._Owner.removeAttr('aria-describedby');
            delete this._Self;
            this._PreventClose = this.IsOpen = false;
            if (ns.Tooltip.Current == this) ns.Tooltip.Current = null;
        },
        /**
         * Positions the tooltip relative to its owner and depending on available screenspace
         */
        Place: function () {
            var me = this,
                ownerP = me._Owner.offset(),
                ownerW = me._Owner.outerWidth(),
                ownerH = me._Owner.outerHeight(),
                myW = me._Self.outerWidth(),
                myH = me._Self.outerHeight(),
                winW,
                winH,
                marginT,
                marginB,
                newClass,
                css = { position: 'absolute', 'z-index': me.ZIndex };

            switch (me.Anchor) {
                case ns.Tooltip.Anchor.Horizontal:
                    winW = $(window).width();
                    css.top = ownerP.top - (myH - ownerH) / 2;
                    if (winW / 2 - ownerP.left < 0) {
                        newClass = 'right';
                        css.left = ownerP.left - myW - me.Margin - 20;
                    }
                    else {
                        newClass = 'left';
                        css.left = ownerP.left + ownerW + me.Margin;
                    }
                    break;
                case ns.Tooltip.Anchor.Vertical:
                case ns.Tooltip.Anchor.Top:
                case ns.Tooltip.Anchor.Bottom:
                default:
                    winH = $(window).height(),
                        marginT = ownerP.top - document.documentElement.scrollTop,
                        marginB = winH - marginT - ownerH;
                    css.left = ownerP.left - (myW - ownerW) / 2;
                    if (me.Anchor == ns.Tooltip.Anchor.Top || (me.Anchor == ns.Tooltip.Anchor.Vertical && marginB < marginT)) {
                        newClass = 'top';
                        css.top = ownerP.top - myH - me.Margin;
                    }
                    else {
                        newClass = 'bottom';
                        css.top = ownerP.top + ownerH + me.Margin;
                    }
                    break;
            }
            if (css.left < 0) css.left = 0;
            if (css.top < 0) css.top = 0;
            me._Self.addClass(newClass).css(css);
            return me;
        },
        /**
         * Meant to be overriden by descendant classes. Acquires the content for the tooltip
         * @param {Function} callback A function that is executed using the acquired data
         */
        AcquireContent: function (callback) {
            callback.call(this, 'Unimplemented');
            return this;
        },
        /**
         * Initializes and draws the tooltip
         * @param {String} data The content to place inside of the tooltip
         */
        Init: function (data) {
            var parent = $(this.ParentSelector),
                me = this,
                onmouseover = function (e) { me._PreventClose = true },
                onmouseout = function (e) { me._PreventClose = false; setTimeout(function () { me.Close(); }, 250); };
            me._Self = $(me.Template);
            me._Self.find('*[role="tooltip"]:first').html(data);
            me._Self.css({ position: 'absolute' })
                .hide()
                .addClass(me.ClassName)
                .attr('id', me.ID)
                .appendTo(parent)
                .mouseover(onmouseover)
                .mouseout(onmouseout)
                .focus(onmouseover)
                .blur(onmouseout)
                .addClass('transitioning')
                .fadeIn(me.AnimationDuration, function () { if (me && me._Self) me._Self.removeClass('transitioning'); });
            setTimeout(function () {
                if (me._Self && !me.IsOpen) {
                    me.Place()._Owner.attr('aria-describedby', me.ID);
                    me.IsOpen = true;
                    me.Dispatch(ns.Tooltip.Events.Show);
                }
            }, 0);
            return me;
        },
        /**
         * Sets a tooltip to show and hide on two different events
         * @param {Number} wait Number of milliseconds to wait before showing the tooltip
         * @param {String} selector (Optional) jQuery selector of the object(s) to watch. If null, then the tooltip's owner
         * @param {String} showEvent Type of the event that causes the tooltip to open
         * @param {String} hideEvent Type of the event that causes the tooltip to hide
         */
        WatchEvent: function (wait, selector, showEvent, hideEvent) {
            var target = selector ? $(selector) : this._Owner,
                me = this,
                isPrimed = false;
            target.bind(showEvent, function () {
                isPrimed = true;
                setTimeout(function () { if (isPrimed) me.Open(); }, wait);
            }).bind(hideEvent, function () {
                isPrimed = false;
                me.Close();
            });
            return me;
        },
        /**
         * Sets a tooltip to show on focus and hide on blur
         * @param {Number} wait (Optional) Number of milliseconds to wait before showing the tooltip
         * @param {String} selector (Optional) jQuery selector of the object(s) to watch. If null, then the tooltip's owner.
         */
        WatchFocus: function (wait, selector) {
            return this.WatchEvent(wait ? wait : 0, selector, 'focus', 'blur');
        },
        /**
         * Sets a tooltip to show on mouseover and hide on mouseout
         * @param {Number} wait (Optional) Number of milliseconds to wait before showing the tooltip
         * @param {String} selector (Optional) jQuery selector of the object(s) to watch. If null, then the tooltip's owner.
         */
        WatchHover: function (wait, selector) {
            return this.WatchEvent(wait ? wait : 250, selector, 'mouseover', 'mouseout');
        }
    });
})(Rf, jQuery);

//Rf.EmbeddedTooltip
if (!this.Rf) this.Rf = {};
(function (ns, $) {
    ns.Require('Tooltip', ns);
    /**
     * Tooltip class that displays content embedded on the page
     * @param {Object} owner jQuery selector of the object to whom the tooltip pertains
     * @param {Object} contentSelector jQuery selector of the content that will be placed in the tooltip
     * @param {Object} options Settings used to initialize the tooltip
     */
    ns.EmbeddedTooltip = function (owner, contentSelector, options) {
        ns.Tooltip.call(this, owner, options);
        if (contentSelector) this.ContentSelector = contentSelector;
    };
    ns.EmbeddedTooltip.prototype = new ns.Tooltip(null, {
        constructor: ns.EmbeddedTooltip,
        /**
         * jQuery select of the content that will be placed in the tooltip
         */
        ContentSelector: '.tooltip-content:first',
        /**
         * Copies the content out of the embedded container
         * @param {Function} callback A function that is executed using the acquired data
         */
        AcquireContent: function (callback) {
            var content = (typeof this.ContentSelector == 'string') ? this._Owner.find(this.ContentSelector) : $(this.ContentSelector);
            callback.call(this, content.html());
            return this;
        }
    });
})(Rf, jQuery);

//Rf.AjaxTooltip
if (!this.Rf) this.Rf = {};
(function (ns, $) {
    ns.Require('Tooltip', ns);
    /**
     * ns.Tooltip class that loads content from a URL, and then displays it in a tooltip
     * @param {Object} owner jQuery selector of the object to whom the tooltip pertains
     * @param {String} url The URL from which the tooltip's content is loaded
     * @param {Object} options Settings used to initialize the tooltip
     */
    ns.AjaxTooltip = function (owner, url, options) {
        ns.Tooltip.call(this, owner, options);
        this.Url = url;
    };
    /**
     * (Static) Stores tooltip data loaded by URL for quick re-display of a tooltip
     */
    ns.AjaxTooltip.Cache = {};
    /**
     * Events that can be dispatched by the AjaxTooltip
     */
    ns.AjaxTooltip.Events = {
        /**
         * Dispatched when data is loaded into the tooltip
         */
        Data: 'data'
    };
    ns.AjaxTooltip.prototype = new ns.Tooltip(null, {
        constructor: ns.AjaxTooltip,
        /**
         * The URL from which the tooltip's content is loaded
         */
        Url: null,
        /**
         * Whether or not the tooltip data can be cached for quick reuse
         */
        AllowCache: true,
        /**
         * Loads the tooltip's content from the URL or the cache and then displays the tooltip
         * @param {Function} callback A function that is executed using the acquired data
         */
        AcquireContent: function (callback) {
            var dataEvent,
                me = this,
                lastly = function (data) {
                    me.Dispatch(dataEvent = new ns.Event(ns.AjaxTooltip.Events.Data, me, data));
                    callback.call(me, dataEvent.Data)
                };
            if (me.AllowCache && ns.AjaxTooltip.Cache[me.Url]) {
                lastly.call(me, ns.AjaxTooltip.Cache[me.Url]);
            }
            else {
                $.ajax({
                    dataType: 'html',
                    url: me.Url,
                    success: function (response) {
                        if (me.AllowCache && response.length > 0) ns.AjaxTooltip.Cache[me.Url] = response;
                        lastly.call(me, response);
                    }
                });
            }
            return me;
        }
    });
})(Rf, jQuery);

//Rf.Modal
if (!this.Rf) this.Rf = {};
(function (ns, $) {
    ns.Require('jQuery');
    ns.Require('EventDispatcher', ns);
    /**
     * Class used for a dialog that loads in the same window as a page
     * @param {Object} url The URL of the data used to populate the modal window
     * @param {Object} options Settings used to initialize the modal
     */
    ns.Modal = function (url, options) {
        ns.EventDispatcher.call(this, options);
        this.Url = url;
        if (!this.DialogID) this.DialogID = 'Modal' + new Date().valueOf();
    }
    /**
     * (Static) Stores modal data loaded by URL for quick re-display of a modal
     */
    ns.Modal.Cache = {};
    /**
     * Constants that define different events that are part of the modal lifecycle
     */
    ns.Modal.Events = {
        /**
         * Dispatched when data is loaded by the modal
         */
        Data: 'data',
        /**
         * Dispatched when the modal has been initialized and is ready to display
         */
        Show: 'show',
        /**
         * Dispatched when the modal is displayed on screen
         */
        Render: 'render',
        /**
         * Dispatched when the modal is to be removed from screen
         */
        Hide: 'hide',
        /**
         * Dispatched when the modal is recentered on screen
         */
        Centered: 'centered'
    };
    ns.Modal.prototype = new ns.EventDispatcher({
        constructor: ns.Modal,
        /**
         * (Protected) The dialog component of the modal
         */
        _Dialog: null,
        /**
         * (Protected) The overlay component of the modal
         */
        _Overlay: null,
        /**
         * The URL used to load the modal's content and its key in the modal cache
         */
        Url: null,
        /**
         * The ID given to the modal's dialog. If null, then an auto-generated ID is used
         */
        DialogID: null,
        /**
         * The class name given to the modal's dialog. By default, "modalDialog"
         */
        DialogClassName: 'modal-dialog',
        /**
         * The template HTML used to construct the modal dialog. Templates must have a root element.
         * Templates should feature a close button. Templates should have a block element with the attribute
         * role="main". The role="main" element will contain content that is loaded by the modal.
         */
        Template: '<div><a href="#" class="close">{0}</a><div role="main"></div></div>'.t('关闭'),
        /**
         * How quickly the modal fades in and fades out, in milliseconds. By default, 250 ms.
         */
        AnimationDuration: 250,
        /**
         * Class name given to the overlay layer that covers the page's existing content. By default, "modalOverlay"
         */
        OverlayClassName: 'modal-overlay',
        /**
         * How opaque the overlay element appears. By default, 0.5 (50% opacity).
         */
        OverlayOpacity: 0.5,
        /**
         * Whether or not this modal should cache its data. When false, the modal cache is not
         * used and new data is loaded each time. By default, true.
         */
        AllowCache: true,
        /**
         * The jQuery selector used to identify elements that can close the modal when clicked.
         */
        CloseButtonSelector: '.close',
        /**
         * The starting z-index of the modal dialog and its overlay. Defaults to 3000.
         */
        ZIndex: 3000,
        /**
         * The jQuery selector used to identify the parent element of the modal. Defaults to body.
         */
        ParentSelector: 'body',
        /**
         * Loads the modal's data and then displays the modal
         */
        Open: function () {
            var me = this,
                dataEvent;
            if ((me.Url && me.AllowCache && ns.Modal.Cache[me.Url]) || !me.Url) {
                me.Dispatch(dataEvent = new ns.Event(ns.Modal.Events.Data, me, ns.Modal.Cache[me.Url]));
                me.Init(dataEvent);
            }
            else {
                $.ajax({
                    dataType: 'html',
                    url: me.Url,
                    cache: !($.browser.msie),
                    success: function (response) {
                        if (me.AllowCache && response.length > 0) {
                            ns.Modal.Cache[me.Url] = response;
                        }
                        me.Dispatch(dataEvent = new ns.Event(ns.Modal.Events.Data, me, response));
                        me.Init(dataEvent);
                    }
                });
            }
            return me;
        },
        /**
         * Removes the modal from the screen
         */
        Close: function () {
            var me = this;
            me.Dispatch(ns.Modal.Events.Hide);
            me._Overlay && me._Overlay.fadeOut(me.AnimationDuration, function () {
                if (me._Overlay) me._Overlay.remove();
                me._Overlay = null;
            });
            me._Dialog && me._Dialog.fadeOut(me.AnimationDuration, function () {
                if (me._Dialog) me._Dialog.remove();
                me._Dialog = null;
                if (me._OnScroll) $(window).unbind('scroll', me._OnScroll).unbind('resize', me._OnScroll);
            });
            return me;
        },
        /**
         * Detects how much screen space is available around the modal in the current viewport.
         */
        GetAvailableScreenSpace: function () {
            var space = { x: 0, y: 0 };
            if (this._Dialog) {
                var dialogH = this._Dialog.height(),
                    viewportH = window.innerHeight !== undefined ? window.innerHeight : document.documentElement.clientHeight,
                    dialogW = this._Dialog.width(),
                    viewportW = window.innerWidth !== undefined ? window.innerWidth : document.documentElement.clientWidth;
                space.y = viewportH - dialogH;
                space.x = viewportW - dialogW;
            }
            return space;
        },
        /**
         * Centers the modal within the viewport, if there is enough space to do so.
         */
        Center: function () {
            if (this._Dialog) {
                if (!this._Dialog.data('centered-once')) {
                    var deltas = this.GetAvailableScreenSpace(),
                        scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
                        scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft,
                        offsetY = deltas.y > 0 ? deltas.y / 2 + scrollTop : scrollTop,
                        offsetX = deltas.x > 0 ? deltas.x / 2 + scrollLeft : scrollLeft,
                        viewBottom = scrollTop + (window.innerHeight || document.documentElement.clientHeight),
                        css = {};
                    if (deltas.y > 0) {
                        css.top = Math.floor(offsetY) + 'px';
                    }
                    if (deltas.x > 0) {
                        css.left = Math.floor(offsetX) - 8 + 'px';
                    }
                    this._Dialog.css(css);
                    if (window.TouchEvent !== 'undefined') {
                        this._Dialog.data('centered-once', true);
                    }
                }
            }
            this.Dispatch(ns.Modal.Events.Centered);
            return this;
        },
        /**
         * Associates clicking an element with closing the modal
         * @param {String} selector A jQuery selector used to find the close button on the dialog
         */
        SetCloseButton: function (selector) {
            var me = this;
            this._Dialog.find(selector).click(function (e) {
                e && e.preventDefault();
                me.Close();
            });
            return me;
        },
        /**
         * Draws the modal window on screen when data is loaded
         * @param {ns.DataEvent} event The data event
         */
        Init: function (event) {
            var me = this,
                parent = $(me.ParentSelector),
                ie6 = navigator.userAgent.toLowerCase().indexOf('msie 6') > -1,
                scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            me._Overlay = $('<div class="' + me.OverlayClassName + '"></div>')
                .css({
                    cursor: 'wait',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: (window.TouchEvent !== 'undefined' ? 10000 + 'px' : '100%'),
                    visibility: 'hidden',
                    'z-index': me.ZIndex
                })
                .appendTo(parent);
            if (ie6) me._Overlay.css({ position: 'absolute', width: $(window).width(), height: $(document).height() });
            me._Dialog = $(me.Template)
                .attr('id', me.DialogID)
                .attr('class', me.DialogClassName)
                .attr('role', 'dialog')
                .css({
                    'z-index': me.ZIndex + 1,
                    visibility: 'hidden',
                    position: ie6 ? 'absolute' : 'fixed'//
                }).appendTo(parent);
            me._Dialog.find('*[role=main]:first').html(event.Data);
            if (me.CloseButtonSelector) me.SetCloseButton(me.CloseButtonSelector);
            me.Dispatch(ns.Modal.Events.Show);
            // document.body.offsetWidth;
            me.Dispatch(ns.Modal.Events.Render);
            me.Center();
            var viewTop = document.documentElement.scrollTop || document.body.scrollTop,
                viewBottom = viewTop + (window.innerHeight || document.documentElement.clientHeight),
                offsetTop = me._Dialog.offset().top;
            var topOffset = (window.screen.availHeight - 100 - me._Dialog.height()) / 2;
            if (topOffset < 0) {
                topOffset = 10;
            }
            //            if (offsetTop > viewBottom) {
            //                offsetTop = viewTop;
            //            }
            //            else {
            //                offsetTop = Math.max(viewTop, offsetTop);
            //            }
            if (me.DialogClassName == 'modal955') {
                me._Dialog.css('top', '10px');
                me._Dialog.css({ visibility: 'visible', opacity: 0 }).fadeTo(me.AnimationDuration, 1, function () { $(this).css('opacity', null) });
            } else {
                me._Dialog.css({ visibility: 'visible', opacity: 0, 'top': topOffset + 'px' }).fadeTo(me.AnimationDuration, 1, function () { $(this).css('opacity', null) });
            }
            if (!$.browser.msie || parseInt($.browser.version, 10) != 8) {
                //TODO: Temp fix issue in ie8 that background opacity can't work.
                me._Overlay.css({ visibility: 'visible', opacity: 0 }).fadeTo(me.AnimationDuration, me.OverlayOpacity);
            } else {
                me._Overlay.hide();
            }

            document.documentElement.scrollTop = document.body.scrollTop = scrollTop;
            me._OnScroll = function (event) { me.Center(); };
            $(window).scroll(me._OnScroll).resize(me._OnScroll);
            return me;
        }
    });
})(Rf, jQuery);

//Rf.Combobox
if (!this.Rf) this.Rf = {};
(function (ns, $) {
    ns.Require('EventDispatcher', ns);
    /**
     * Base class for child items of Rf.ComboBox
     * @param {String} template The HTML code used to generate the item
     * @param {String} content The HTML or text content used to populate the template. Content is inserted into the first element with role="listitem"
     * @param {Object} value A value associated with this item
     */
    ns.ComboBoxItem = function (template, content, value) {
        /**
         * The element that wraps the item
         */
        this.Container = $(template).attr('tabindex', -1);
        /**
         * The element that contains the text of the item (may be the same as Container)
         */
        this.Label = this.Container.is('*[role=listitem]') ? this.Container : this.Container.find('*[role=listitem]:first');
        this.Label.html(content);
        /**
         * The plain-text representation of the item
         */
        this.Text = this.Label.text();
        /**
         * The value associated with the item
         */
        this.Value = value;
    };

    /**
     * Drop-down select box class
     * @param {String/jQuery} selector A jQuery selector of the SELECT element to turn into the combo box
     * @param {Object} options Options used to initialize the combo box
     */
    ns.ComboBox = function (selector, options, isTouch) {
        this.ID = 'ComboBox' + new Date().getTime();
        if (isTouch) {
            this.IsTouch = isTouch;
        }
        ns.EventDispatcher.call(this, options);
        this.Items = [];
        this._Self = $(selector);
        this.Init();
    };
    /**
     * Events dispatched by a combo box
     */
    ns.ComboBox.Events = {
        /**
         * Dispatched when a value is selected
         */
        Change: 'Change',
        /**
         * Dispatched when the drop down menu is shown
         */
        Show: 'show',
        /**
         * Dispatched when the drop down menu is hidden
         */
        Hide: 'hide'
    };
    ns.ComboBox.OpenCombos = [];
    ns.ComboBox.prototype = new ns.EventDispatcher({
        constructor: ns.ComboBox,
        /**
         * The nodes that make up the combo box
         */
        _Self: null,
        /**
         * Form field associated with the combo box
         */
        _Input: null,
        /**
         * A UI component that displays the selected item, and may accept text input from the user
         */
        _Field: null,
        /**
         * A button which shows or hides the dropdown
         */
        _Button: null,
        /**
         * The dropdown container
         */
        _OptionContainer: null,
        /**
         * The dropdown container
         */
        OptionContainerZIndex: 2,
        /**
         * The container of the items inside of the dropdown (may be the same as _OptionContainer)
         */
        _OptionList: null,
        /**
         * ID assigned to the combo box. If not provided, an ID is auto-generated
         */
        ID: null,
        /**
         * The items that make up the combo box's select list
         */
        Items: null,
        /**
         * Whether or not the user is allowed to enter a value that is not on the list of options
         */
        AllowRawInput: false,
        /**
         * Whether or not the dropdown appears on a touch device
         */
        IsTouch: false,
        /**
         * Whether or not the dropdown is currently displayed
         */
        IsOpen: false,
        /**
         * HTML code used to draw the combo box. The root element should have role="combobox". The element that contains
         * the current selection should have aria-haspopup="true". A button used to open and close the menu should have role="button".
         */
        Template: '<div role="combobox"><input type="text" aria-haspopup="true"/><button role="button">V</button></div>',
        /**
         * HTML code used to draw the menu. The element that will contain individual options should have role="list"
         */
        OptionContainerTemplate: '<ul class="comboBoxOptions" role="list"/>',
        /**
         * The HTML code used to draw menu items. The element that will contain the item's content/name should have role="listitem"
         */
        OptionTemplate: '<li role="listitem"/>',
        /**
         * The index of the currently selected item, or -1 if no item is selected
         */
        SelectedIndex: -1,
        /**
         * The currently selected item, or null if no item is selected
         */
        SelectedItem: null,
        /**
         * The number of milliseconds for which to play an animation when the combo box is opening or closing
         */
        AnimationDuration: 0,
        /**
         * ComboBoxItem-derived class used for individual items (ComboBoxItem by default)
         */
        ItemClass: ns.ComboBoxItem,
        /**
         * Adds an item to the dropdown select list
         * @param {String} content Content to insert into the item
         * @param {Object} value A value associated with the item
         * @param {bool} 是否高亮当前项
         */
        AddItem: function (content, value, highlight) {
            var item = new this.ItemClass(this.OptionTemplate, content, value);
            this.Items.push(item);
            this._OptionList.append(item.Container);
            highlight && item.Container.find('.comboBoxItemWrapper').css('color', 'red');
            return item;
        },
        /**
         * Positions the dropdown list relative to its parent
         */
        _PlaceList: function () {
            var me = this,
                inputW = me._Field.outerWidth(),
                inputH = me._Field.outerHeight(),
                inputPos = me._Field.offset(),
                css = {
                    position: 'absolute',
                    top: inputH + inputPos.top,
                    left: inputPos.left,
                    'z-index': me.OptionContainerZIndex
                },
                parent = me._Field,
                z;
            do {
                z = parent.css('z-index');
                if (z && !isNaN(z) && z > 1) {
                    css['z-index'] = z + 1;
                    break;
                }
                else {
                    parent = parent.parent();
                }
            } while (null != parent && parent.length > 0 && !parent.is('body'));
            me._OptionContainer.css(css);
            return me;
        },
        /**
         * Plays an animation that opens the dropdown
         * @param {Number} duration The number of milliseconds that the animation should last
         * @param {Function} callback A function to execute when the animation is complete
         */
        _AnimateOpen: function (duration, callback) {
            var me = this;
            me._OptionContainer.slideDown(me.AnimationDuration, function () { if (callback) callback.call(me); });
        },
        /**
         * Rebuilds the combo box's options list
         */
        _RebuildOptions: function (options, defaultIndex, suppressChangeEvent) {
            var me = this;
            if (options) {
                var combo = me._Input;
                combo.find('option').remove();
                for (var i = 0; i < options.length; i++) {
                    combo.append('<option value="' + options[i] + '">' + options[i] + '</option>');
                }
            }
            me.Items = [];
            me._OptionList.empty();
            me._Input.find('option').each(function (i, opt) {
                var $this = $(opt);
                if (!$this.attr('disabled') && $this.css('display') != 'none') {
                    me.AddItem($this.text(), $this.val(), $this.attr('highlight'));
                }
            });
            if (defaultIndex || defaultIndex === 0) {
                me.Select(defaultIndex, suppressChangeEvent);
            }
            return me;
        },
        /**
         * Opens the dropdown select list
         * @param {Number} duration The number of milliseconds that the animation should last
         * @param {Function} callback A function to execute when the animation is complete
         */
        Open: function (duration, callback) {
            var me = this,
                lastly = function () {
                    me._OptionList.attr('aria-hidden', false);
                    $.each(me.Items, function (i, item) {
                        item.Container.removeClass('over')
                            .unbind('click').click(function (e) {
                                e.preventDefault();
                                me.Select(item);
                            }).mouseover(function (e) {
                                $(this).addClass('over');
                            }).mouseout(function (e) {
                                $(this).removeClass('over');
                            });
                    });
                    //                    me.Items.forEach(function(item) {
                    //                        item.Container.removeClass('over')
                    //                            .unbind('click').click(function(e) {
                    //                                e.preventDefault();
                    //                                me.Select(item);
                    //                            }).mouseover(function(e) {
                    //                                $(this).addClass('over');
                    //                            }).mouseout(function(e) {
                    //                                $(this).removeClass('over');
                    //                            });
                    //                    });
                    if (callback) callback.call(me);
                    me.Dispatch(ns.ComboBox.Events.Show);
                };
            if (me.IsOpen) return me;
            $.each(ns.ComboBox.OpenCombos, function (i, item) { item.Close(); });
            //ns.ComboBox.OpenCombos.forEach(function(item) { item.Close(); });
            me.IsOpen = true;
            me._RebuildOptions();
            me._OptionContainer.appendTo(document.body);
            me._PlaceList();
            me._Self.addClass('open');
            ns.ComboBox.OpenCombos.push(me);
            if (duration > 0) me._OptionContainer.slideUp(0);
            duration > 0 ? me._AnimateOpen.call(me, duration, lastly) : lastly.call(me);
            return me;
        },
        /**
         * Plays an animation that closes the dropdown
         * @param {Number} duration The number of milliseconds that the animation should last
         * @param {Function} callback A function to execute when the animation is complete
         */
        _AnimateClose: function (duration, callback) {
            var me = this;
            me._OptionContainer.slideUp(me.AnimationDuration, function () { if (callback) callback.call(me); });
        },
        /**
         * Closes the dropdown select list
         * @param {Number} duration The number of milliseconds that the animation should last
         * @param {Function} callback A function to execute when the animation is complete
         */
        Close: function (duration, callback) {
            var me = this,
                lastly = function () {
                    me._OptionList.attr('aria-hidden', true);
                    me.IsOpen = false;
                    me._OptionContainer.remove();
                    if (callback) callback.call(me);
                    me.Dispatch(ns.ComboBox.Events.Hide);
                },
                openIndex = $.inArray(me, ns.ComboBox.OpenCombos);
            if (!me.IsOpen) return me;
            me._Self.removeClass('open');
            if (openIndex > -1) ns.ComboBox.OpenCombos.splice(openIndex, 1);
            duration > 0 ? me._AnimateClose(duration, lastly) : lastly.call(me);
            return me;
        },
        /**
         * If the dropdown is open, closes it. If the dropdown is closed, opens it.
         */
        ToggleOpen: function () {
            if (this.IsOpen) this.Close(this.AnimationDuration);
            else this.Open(this.AnimationDuration);
            return this;
        },
        /**
         * If an item is selected, marks it as no longer selected
         * @param {ComboBoxItem} item The item to deselect
         */
        Deselect: function (item) {
            item.Container.removeClass('current');
            item.Label.attr('aria-activedescendant', false);
            if (this.SelectedItem == item) {
                this.SelectedItem = null;
                this.SelectedIndex = -1;
                this._Input.attr('value', null);
            }
            return this;
        },
        /**
         * Gets the value of the form element associated with the combo box
         */
        GetValue: function () {
            return this._Input.val();
        },
        /**
         * Sets the value of the form element associated with the combo box
         * @param {Object} value The value to assign to the element
         * @param {Boolean} suppressChangeEvent Whether or not to stop the change event from firing
         */
        SetValue: function (value, suppressChangeEvent) {
            this._Input.val(value);
            this._Input.change().trigger('focusout');
            if (!suppressChangeEvent) this.Dispatch(new ns.Event(ns.ComboBox.Events.Change, this, value));
        },
        /**
         * Marks an item as selected
         * @param {ComboBoxItem} item The item to select
         * @param {Boolean} suppressChangeEvent Whether or not to stop the change event from firing
         */
        Select: function (item, suppressChangeEvent) {
            var me = this,
                i;
            if (me.SelectedItem) me.Deselect(me.SelectedItem);
            if (me.Items.length < 1) me._RebuildOptions();
            switch ((typeof item).toLowerCase()) {
                case 'number':
                    item = me.Items[item];
                    break;
                case 'string':
                    for (i = me.Items.length - 1; i > -1; i--) {
                        if (me.Items[i].Value == item) {
                            item = me.Items[i];
                            break;
                        }
                    }
                    break;
            }
            if (item == null || item.Container == null) {
                return null;
            }
            item.Container.addClass('current');
            item.Label.attr('aria-activedescendant', true);
            me.SelectedIndex = $.inArray(me.SelectedItem = item, me.Items);//me.Items.indexOf(me.SelectedItem = item);
            me._Field.is('input[type=text]') ? me._Field.val(item.Text) : me._Field.text(item.Text);
            me.SetValue(item.Value, suppressChangeEvent);
            if ($('#' + me.ID + ' option').eq(me.SelectedIndex).attr('highlight')) { me._Field.css('color', 'red') }
            else { me._Field.css('color', '#414141'); }
            if (me.IsOpen) me.Close();
            return me;
        },
        _SelectNextInOrder: function (modifier, preventClose) {
            var index = -1;
            for (var i = this.Items.length - 1; i > -1; i--) {
                if (this.Items[i].Container.hasClass('over')) {
                    index = i;
                    this.Items[i].Container.removeClass('over');
                }
            }
            if (index == -1) {
                index = this.SelectedIndex;
            }
            index += modifier;
            if (index < 0) index = this.Items.length - 1;
            else if (index >= this.Items.length) index = 0;

            if (preventClose) {
                this.Items[index].Container.addClass('over');
            }
            else {
                return this.Select(index);
            }
        },
        /**
         * Selects the next item in the list
         */
        SelectNext: function (preventClose) {
            this._SelectNextInOrder(1, preventClose);
        },
        /**
         * Selects the previous item in the list
         */
        SelectPrevious: function (preventClose) {
            this._SelectNextInOrder(-1, preventClose);
        },
        /**
         * Finds an item in the list that starts with a given character sequence
         * @param {String} startsWith The first few letters of the item's text
         */
        Find: function (startsWith) {
            startsWith = startsWith.toLowerCase();
            for (var i = 0, j = this.Items.length; i < j; i++) {
                if (this.Items[i].Text.toLowerCase().indexOf(startsWith) == 0) return this.Items[i];
            }
            return null;
        },
        /**
         * Returns whether or not the default value is the current value
         */
        DefaultValueSelected: function () {
            return this._Input.find('option[rfprompt=true]:selected').length == 0 && this._Input.val();
        },
        /**
         * Initializes the widget
         */
        Init: function () {
            var me = this,
                orig = me._Self;
            me._Self = $(me.Template).attr('id', me.ID);
            me._Field = (me._Self.is('*[aria-haspopup=true]') ? me._Self : me._Self.find('*[aria-haspopup=true]:first'))
                .attr('id', me.ID + '-Field')
                .attr('tabindex', orig.attr('tabindex') || 0)
                .attr('aria-autocomplete', 'list')
                .attr('aria-owns', me.ID + '-List')
                .addClass(orig.attr('class'))
                .click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    me.ToggleOpen();
                })
                .keydown(function (e) {
                    me._KeyDownCode = e.keyCode;
                    if (!me.AllowRawInput) {
                        if (me.SelectedItem) me._Field.val(me.SelectedItem.Text);
                        if (e.keyCode != 9) e.preventDefault();
                    }
                    if (e.keyCode == 9) {
                        if (me.IsOpen) {
                            for (var i = me.Items.length - 1; i > -1; i--) {
                                if (me.Items[i].Container.hasClass('over')) {
                                    me.Select(i);
                                    break;
                                }
                            }
                            me.Close();
                        }
                    }
                })
                .keyup(function (e) {
                    if (me._KeyDownCode != e.keyCode) return;
                    switch (e.keyCode) {
                        case 38: // Up
                            e.preventDefault();
                            if (e.altKey) me.ToggleOpen();
                            else me.SelectPrevious(me.IsOpen);
                            break;
                        case 40: // Down
                            e.preventDefault();
                            if (e.altKey) me.ToggleOpen();
                            else me.SelectNext(me.IsOpen);
                            break;
                        case 36: // Home
                            if (me.IsOpen) {
                                e.preventDefault();
                                me.Select(0);
                            }
                            break;
                        case 35: // End
                            if (me.IsOpen) {
                                e.preventDefault();
                                me.Select(me.Items.length - 1);
                            }
                            break;
                        case 13: // Enter
                        case 32: // Spacebar
                            e.preventDefault();
                            if (me.IsOpen) {
                                for (var i = me.Items.length - 1; i > -1; i--) {
                                    if (me.Items[i].Container.hasClass('over')) {
                                        me.Select(i);
                                        break;
                                    }
                                }
                                me.Close();
                            }
                            break;
                    }
                });
            me._OptionContainer = $(me.OptionContainerTemplate).css('position', 'absolute');
            me._OptionList = (me._OptionContainer.is('*[role=list]') ? me._OptionContainer : me._OptionContainer.find('*[role=list]:first'))
                .attr('id', me.ID + '-List')
                .attr('aria-hidden', 'true');
            me._Button = me._Self.find('[role=button]:first')
                .attr('id', me.ID + '-Button')
                .attr('tabindex', 0)
                .click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!me.IsOpen) {
                        me._Field.focus();
                        me.Open();
                    }
                    else {
                        me._Field.focus();
                    }
                })
                .keyup(function (e) {
                    me._KeyDownCode = null;
                    switch (e.keyCode) {
                        case 13: // Enter
                        case 32: // Spacebar
                            e.preventDefault();
                            $(this).click();
                            break;
                    }
                });
            if (!this.IsTouch) {
                me._Input = orig.hide();
            }
            else {
                me._Input = orig;
            }
            me._Self.insertAfter(orig);

            $(window).scroll(function (e) {
                if (me.IsOpen) me._PlaceList();
            }).resize(function (e) {
                me.Close();
            });

            $(document).click(function (e) {
                if (me.IsOpen) me.Close();
            }).focus(function (e) {
                if (me.IsOpen) me.Close();
            }).keyup(function (e) {
                switch (e.keyCode) {
                    case 27: // Escape
                        if (me.IsOpen) {
                            e.preventDefault();
                            me.Close();
                            if (me._SelectedBeforeOpen) me.Select(me._SelectedBeforeOpen);
                        }
                        break;
                }
            });

            return me;
        }
    });
})(Rf, jQuery);

(function (D) {
    /**
     * 返回格式化后的时间格式 d.format('yyyy-MM-dd');
     * @param {Date} 时间.
     * @param {format} 格式字符串
     */
    D.format = function (format) {
        var o = {
            "M+": this.getMonth() + 1, //month
            "d+": this.getDate(),    //day
            "h+": this.getHours(),   //hour
            "m+": this.getMinutes(), //minute
            "s+": this.getSeconds(), //second
            "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
            "S": this.getMilliseconds() //millisecond
        }
        if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o) if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1,
                RegExp.$1.length == 1 ? o[k] :
                    ("00" + o[k]).substr(("" + o[k]).length));
        return format;
    }
})(Date.prototype);

$.fn.monobind = function (eventType, callback) {
    return this.unbind(eventType, callback).bind(eventType, callback);
};

//Use Online namespace for all JS code
var Online = {
    ajax: function (url, settings) {
        Online.InitAjaxIndicator();
        $.ajax(url, settings);
    },
    //Touch : window.TouchEvent !== undefined,
    Async: {
        ReadyPassed: false,
        Queue: [],
        Load: function (url) {
            Online.Async.Queue.push(url);
            if (Online.Async.ReadyPassed) {
                Online.Async.Flush();
            }
        },
        Flush: function () {
            Online.Async.ReadyPassed = true;
            var i,
                j,
                script;
            for (i = 0, j = Online.Async.Queue.length; i < j; i++) {
                script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = Online.Async.Queue[i];
                document.getElementsByTagName('head')[0].appendChild(script);
            }
            Online.Async.Queue = [];
        }
    },
    OnAjaxStart: function () {
        var me = this,
            parent = $(document.body),
            ie6 = navigator.userAgent.toLowerCase().indexOf('msie 6') > -1,
            scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        me.OverlayClassName = 'modal-overlay';
        me.OverlayOpacity = 0;
        me.AnimationDuration = 5;
        me.ZIndex = 3000;
        me._Overlay = $('<div class="' + me.OverlayClassName + '"></div>')
            .css({
                cursor: 'wait',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: (window.TouchEvent !== 'undefined' ? 10000 + 'px' : '100%'),
                visibility: 'hidden',
                'z-index': me.ZIndex
            }).appendTo(parent);
        if (ie6) me._Overlay.css({ position: 'absolute', width: $(window).width(), height: $(document).height() });
        if (!$.browser.msie || parseInt($.browser.version, 10) != 8) {
            //TODO: Temp fix issue in ie8 that background opacity can't work.
            me._Overlay.css({ visibility: 'visible', opacity: 0 }).fadeTo(me.AnimationDuration, me.OverlayOpacity);
        }
        $('#ajaxIndicator').show();
    },
    OnAjaxStop: function () {
        var me = this;
        $('#ajaxIndicator').hide();
        me._Overlay && me._Overlay.fadeOut(me.AnimationDuration, function () {
            if (me._Overlay) me._Overlay.remove();
            me._Overlay = null;
        });
    },
    InitAjaxIndicator: function (forceInitialized) {
        if (!this.AjaxIndicatorInitialized || forceInitialized) {
            Rf.Ajax.Unbind(Rf.Ajax.Events.Start, Online.OnAjaxStart)
                .Bind(Rf.Ajax.Events.Start, Online.OnAjaxStart)
                .Unbind(Rf.Ajax.Events.Stop, Online.OnAjaxStop)
                .Bind(Rf.Ajax.Events.Stop, Online.OnAjaxStop);
            this.AjaxIndicatorInitialized = true;
        }
    }, CloseAjaxIndicator: function () {
        Online.OnAjaxStop();
        Rf.Ajax.Unbind(Rf.Ajax.Events.Start, Online.OnAjaxStart)
            .Unbind(Rf.Ajax.Events.Stop, Online.OnAjaxStop);
        this.AjaxIndicatorInitialized = false;
    }, ShowAjaxResponseAlert: function (response) {
        if (response.alert && response.alert.length) {
            var message = '',
                i,
                j;
            for (i = 0, j = response.alert.length; i < j; i++) {
                message += response.alert[i].message + '\n';
            }
            if (message) {
                alert(message);
            }
        }
    },
    OnAjaxError: function (xhr) {
        me._Overlay && me._Overlay.fadeOut(me.AnimationDuration, function () {
            if (me._Overlay) me._Overlay.remove();
            me._Overlay = null;
        });
        if (xhr.status == 403) {
            alert('Session已过期，请重新登录!');
            window.location.href = baseUrl;
        }
        else {
            alert('抱歉，提交失败，请稍后重试.');
        }
    },
    SyncAjax: function (settings) {
        settings = $.extend({
            async: false,
            type: 'POST',
            cache: false,
            dataType: 'json',
            error: Online.OnAjaxError
        }, settings);
        if (settings['closeIndicator']) {
            Online.CloseAjaxIndicator();
        }
        var origOnSuccess = settings.success;
        settings.success = function (response) {
            origOnSuccess.call(this, response);
        };
        $.ajax(settings);
    },
    Unload: {
        Handle: function () {
            if (Online.Unload.Active) {
                Online.RemoveEmptyModal();
                return Online.Unload.Message;
            }
        },
        Watch: function (msg) {
            Online.Unload.Message = msg;
            Online.Unload.Active = true;
        },
        Unwatch: function () {
            Online.Unload.Active = false;
        },
        Init: function () {
            window.onbeforeunload = Online.Unload.Handle;
        }
    },
    RemoveEmptyModal: function () {
        $('div[role=dialog], div.modal-overlay, div.modalOverlay').remove();
    },
    CurrentModal: null,
    ShowConfirmationModal: function (url, title, id, className, onshow) {
        var modal = Online.CreateModal(url, title, id, className);
        modal.Bind(Rf.Modal.Events.Show, Online.OnShowConfirmationModal);
        if (onshow) {
            Online.CurrentModal = modal;
            modal.Bind(Rf.Modal.Events.Show, onshow);
        }
        modal.Open();
    },
    OnShowConfirmationModal: function () {
        setTimeout(function () { $(window).trigger('scroll'); }, 0);
    },
    CreateModal: function (url, title, id, className) {
        var modal = new Rf.Modal(url, {
            DialogID: id,
            DialogClassName: className,
            Template: '<div><div class="header" style="margin-bottom:0;"><h1 id="modaltitle" class="replace">' + title + '</h1><a href="#" class="close">Close</a></div><div class="content modal clr" role="main"></div><div class="footer clr"></div></div>'
            /*ParentSelector: /msie [0-8]\./i.test(navigator.userAgent) ? 'div.ie' : 'body'*/
        });
        return modal;
    }
};
//http get方法
jQuery.each(["get", "post", 'put', 'delete'], function (i, method) {
    Online[method] = function (url, data, callback, type) {
        // shift arguments if data argument was omitted
        if (jQuery.isFunction(data)) {
            type = type || callback;
            callback = data;
            data = undefined;
        }

        return Online.ajax({
            type: method,
            url: url,
            data: data,
            success: callback,
            dataType: type
        });
    };
});
//http get 脚本方法
Online.getScript = function (url, callback) {
    return Online.get(url, undefined, callback, "script");
};
//http get json方法
Online.getJSON = function (url, data, callback) {
    return Online.get(url, data, callback, "json");
}

Online.OnloadEvents = {
    Register: function (f) {
        this.events.push(f);
    },
    Init: function () {
        var me = this;
        $.each(me.events, function (i) {
            if (typeof me.events[i] == 'function') {
                me.events[i]();
            }
        });
    },
    events: []
};

Online.UserStates = {
    COLD: 'COLD',
    LUKEWARM: 'LUKEWARM',
    WARM: 'WARM',
    VERY_WARM: 'VERY_WARM',
    HOT: 'HOT'
};

Online.UserState = {
    Init: function () {
        Online.UserState.State = $('#userState').val() || Online.UserStates.COLD;
    },
    State: Online.UserStates.HOT
};

Online.InitFormWidgets = function (context) {
    context = $(context || document.body);
    Online.ComboBox.DrawAll(context.find('select'));
    Online.RadioCheck.InitAll('.replaceRadio, .replaceCheckBox', context);
    $('.spinner', context).each(function () { new Online.NumericSpinner(this); });
    //$('.ctaContainer', context).monobind('click', Online.OnClickCtaContainer);
};
Online.ComboBoxes = {};

Online.ComboBox = function (selector, options, isTouch) {
    Rf.ComboBox.call(this, selector, options, isTouch);
    Online.ComboBoxes[this.ID] = this;
    var selectedIndex = this._Input[0].selectedIndex,
        selectedOption,
        defaultValue;
    if (selectedIndex > 0) {
        selectedOption = this._Input[0].options[selectedIndex];
        this.Select(selectedOption.value);
    }
    else if (defaultValue = this._Input.find('option[rfprompt=true]:first').text()) {
        this._Field.text(defaultValue);
    }
    else {
        this.Select(0);
    }
    this._Field.keyup($.proxy(Online.ComboBox.OnKeyUp, this));
    Online.ComboBox.OnChange.call(this);
};
(function () {
    var ctor = function () { };
    ctor.prototype = Rf.ComboBox.prototype;
    Online.ComboBox.prototype = new ctor;
    Online.ComboBox.prototype.constructor = Online.ComboBox;
})();
Online.ComboBox.prototype.Template = '<div class="comboBox rounded" role="combobox"><span aria-haspopup="true"></span><a role="button" tabindex="-1">Open</a></div>';
Online.ComboBox.prototype.OptionTemplate = '<li><div class="comboBoxItemWrapper" role="listitem"/></li>';
Online.ComboBox.prototype.OptionContainerZIndex = 7000;
Online.ComboBox.prototype.ItemClass = function (template, content, value) {
    this.Container = $(template).attr('tabindex', -1);
    this.Label = this.Container.is('*[role=listitem]') ? this.Container : this.Container.find('*[role=listitem]:first');
    this.Text = content;
    this.Label.html(content.replace(/(.+)(\$\d+\.\d+)/, '<span class="description">$1</span><span class="price">$2</span>'));
    this.Value = value;
};
Online.ComboBox.prototype._PlaceList = function () {
    var me = this,
        inputW = me._Field.outerWidth(),
        inputH = me._Field.outerHeight(),
        inputPos = me._Field.offset(), // bug in jQuery's offset() for iPad.
        css = {
            position: 'absolute',
            top: inputH + inputPos.top,
            'min-width': me.Items[0].Container[0].scrollWidth,
            left: inputPos.left,
            'z-index': me.OptionContainerZIndex
        },
        parent = me._Field,
        z,
        maxWidth,
        maxHeight = Math.min(me.Items.length, 6) * 26,
        minWidth = inputW;
    $.each(me.Items, function (i) {
        var width = 20;
        this.Label.children().each(function () {
            width += Math.max(this.offsetWidth, this.scrollWidth);
        });
        minWidth = maxWidth = Math.max(minWidth, width);
    });
    if (me.Items.length * 26 <= 156) {
        //used to remove redundant scroll bars
        css['overflow-x'] = 'visible';
        css['overflow-y'] = 'visible';
    }
    css.height = maxHeight;
    css['min-width'] = minWidth + 36;
    css['max-width'] = maxWidth;

    if (/MSIE 6/i.test(navigator.userAgent)) {
        css.width = css['min-width'];
    }
    do {
        z = parent.css('z-index');
        if (z && !isNaN(z) && z > 1) {
            css['z-index'] = z + 1;
            break;
        }
        else {
            parent = parent.parent();
        }
    } while (parent && parent.length > 0 && !parent.is('body'));
    me._OptionContainer.css(css);
    return me;
};

Online.ComboBox.prototype.OnBeforeSelect = null;

Online.ComboBox.prototype.Open = function (duration, callback) {
    var me = this,
        lastly = function () {
            me._OptionList.attr('aria-hidden', false);
            $.each(me.Items, function (i, item) {
                item.Container.removeClass('over')
                    .unbind('click').click(function (e) {
                        e.preventDefault();
                        if (me.OnBeforeSelect) {
                            var result = me.OnBeforeSelect.call(me, e);
                            if (typeof result != 'undefined' && !result) {
                                return false;
                            }
                            else {
                                me.Select(item);
                            }
                        }
                        else {
                            me.Select(item);
                        }
                    }).mouseover(function (e) {
                        $(this).addClass('over');
                    }).mouseout(function (e) {
                        $(this).removeClass('over');
                    });
            });
            //            me.Items.forEach(function(item) {
            //                item.Container.removeClass('over')
            //                    .unbind('click').click(function(e) {
            //                        e.preventDefault();
            //                        if (me.OnBeforeSelect) {
            //                            var result = me.OnBeforeSelect.call(me, e);
            //                            if (typeof result != 'undefined' && !result) {
            //                                return false;
            //                            }
            //                            else {
            //                                me.Select(item);
            //                            }
            //                        }
            //                        else {
            //                            me.Select(item);
            //                        }
            //                    }).mouseover(function(e) {
            //                        $(this).addClass('over');
            //                    }).mouseout(function(e) {
            //                        $(this).removeClass('over');
            //                    });
            //            });
            if (callback) {
                callback.call(me);
            }
            me.Dispatch(Rf.ComboBox.Events.Show);
        };
    if (me.IsOpen) {
        return me;
    }
    $.each(Rf.ComboBox.OpenCombos, function (i, item) { item.Close(); });
    //Rf.ComboBox.OpenCombos.forEach(function(item) { item.Close(); });
    me.IsOpen = true;
    me._RebuildOptions();
    if ($('.ie').length > 0) {
        me._OptionContainer.appendTo('.ie');
    }
    else {
        me._OptionContainer.appendTo('body');
    }
    me._PlaceList();
    me._Self.addClass('open');
    Rf.ComboBox.OpenCombos.push(me);
    if (duration > 0) {
        me._OptionContainer.slideUp(0);
    }
    duration > 0 ? me._AnimateOpen.call(me, duration, lastly) : lastly.call(me);
    return me;
};

Online.ComboBox.OnChange = function (e) {
    var maxChars = Math.ceil(this._Field.width() / 6),
        text = this._Field.text();
    if (text && maxChars > 2 && text.length > maxChars) {
        var sliceEnd = Math.min(text.indexOf('$'), maxChars - 1);
        if (sliceEnd < 0) {
            sliceEnd = maxChars - 1;
        }
        this._Field.text(text.slice(0, sliceEnd));
    }
};
Online.ComboBox.OnKeyUp = function (e) {
    var input = String.fromCharCode(e.which).toLowerCase(),
        i = 0,
        j;
    if (/\s|\d|\w/i.test(input)) {
        if (this.Items.length < 1) {
            this._RebuildOptions();
        }
        if (this.SelectedItem && this.SelectedItem.Text.toLowerCase().indexOf(input) == 0) {
            i = this.SelectedIndex + 1;
        }
        for (j = this.Items.length; i < j; i++) {
            if (this.Items[i].Text.toLowerCase().indexOf(input) == 0) {
                this.Select(i);
                return;
            }
        }
        for (i = 0, j = this.Items.length; i < j; i++) {
            if (this.Items[i].Text.toLowerCase().indexOf(input) == 0) {
                this.Select(i);
                return;
            }
        }
    }
    else if (this.keydownCode == e.which) {
        switch (e.keyCode) {
            case 38: // Up
                e.preventDefault();
                if (e.altKey) {
                    this.ToggleOpen();
                }
                else {
                    this.SelectPrevious();
                }
                break;
            case 40: // Down
                e.preventDefault();
                if (e.altKey) {
                    this.ToggleOpen();
                }
                else {
                    this.SelectNext();
                }
                break;
            case 36: // Home
                if (this.IsOpen) {
                    e.preventDefault();
                    this.Select(0);
                }
                break;
            case 35: // End
                if (this.IsOpen) {
                    e.preventDefault();
                    this.Select(this.Items.length - 1);
                }
                break;
            case 13: // Enter
            case 32: // Spacebar
                e.preventDefault();
                if (this.IsOpen) {
                    for (var i = this.Items.length - 1; i > -1; i--) {
                        if (this.Items[i].Container.hasClass('over')) {
                            this.Select(i);
                            break;
                        }
                    }
                    this.Close();
                }
                break;
        }
    }
};
Online.ComboBox.DrawAll = function (selector) {
    $(selector).each(function (i, select) {
        select = $(select);
        var id = select.attr('id');
        if (!id) {
            id = 'rfcombo' + new Date().valueOf();
            select.attr('id', id);
        }
        if (Online.ComboBoxes[id]) {
            $('div#' + id).remove();
        }
        return new Online.ComboBox(select, { ID: id }, Online.Touch)
            .Bind(Rf.ComboBox.Events.Change, Online.ComboBox.OnChange);
    });
};
Online.RadioCheck = {
    Config: {
        OnBeforeToggle: null
    },
    Classes: {
        RADIO: 'radio',
        CHECKBOX: 'checkbox'
    },
    Refresh: function (radio) {
        var img = $('#' + radio.id + '-img').attr('aria-checked', radio.checked);
        if (radio.checked) {
            if (img.hasClass('radio')) {
                img.addClass('selected');
            }
            else {
                img.addClass('checked');
            }
        }
        else {
            if (img.hasClass('radio')) {
                img.removeClass('selected');
            }
            else {
                img.removeClass('checked');
            }
        }
    },
    All: function (input) {
        return $(document.getElementsByName(input.name));
    },
    OnChange: function (e) {
        //alert(e);
        Online.RadioCheck.All(this).each(function (i, elem) {
            Online.RadioCheck.Refresh(elem);
        });
    },
    OnToggle: function (e) {
        if ($(e.target).siblings('input[disabled]').length > 0 || $(e.target).parent('label').length > 0) {
            return;
        }
        if (e.which == 1 || e.which == 32 || e.type == 'click') {
            e.preventDefault();
            var target = $(this),
                targetId = target.is('label') ? target.attr('for') : target.attr('id').replace('-img', ''),
                input = $('#' + targetId);
            if (!input.is(':radio') || !input.is(':checked')) {
                if (Online.RadioCheck.Config.OnBeforeToggle) {
                    var result = Online.RadioCheck.Config.OnBeforeToggle.call(input);
                    if (typeof result != 'undefined' && !result) {
                        return false;
                    }
                    else {
                        input.prop('checked', !input.is(':checked'));
                        $(input).trigger('change');
                    }
                }
                else {
                    input.prop('checked', !input.is(':checked'));
                    $(input).trigger('change');
                }
            }
        }
    },
    Toggle: function (element) {
        element = $(element);
        //var spanId = id+ '-img';
        element.trigger('click');
        if ($.browser.msie && $.browser.version < 9.0) {//IE 7.8 bug
            //element.prop('checked', false);
            element.trigger('change');
        }
    },
    Init: function (input, className, config) {
        if (config) {
            $.extend(this.Config, config);
        }
        input = $(input);
        var id = input.attr('id'),
            tabindex = input.attr('tabindex'),
            checkedClass = input.hasClass('replaceRadio') || input.attr('type') == 'radio' ? 'selected' : 'checked';
        if (!id) {
            input.attr('id', id = 'rfradiocheck' + new Date().valueOf());
        }
        var checked = input[0].checked,
            image = $('<span id="' + id + '-img" class="inputReplacement ' + className + ' ' + (checked ? checkedClass : '') + '" aria-checked="' + (checked ? 'true' : 'false') + '" tabindex="' + tabindex + '"></span>').insertAfter(input),
            label = $(input.get(0).form).find('label[for=' + id + ']');
        image.add(label).monobind('click', Online.RadioCheck.OnToggle).monobind('keypress', Online.RadioCheck.OnToggle);
        input.monobind('change', Online.RadioCheck.OnChange);
    },
    InitAll: function (selector, context, config) {
        $(selector, context).each(function () {
            Online.RadioCheck.Init(this, this.type == 'radio' ? Online.RadioCheck.Classes.RADIO : Online.RadioCheck.Classes.CHECKBOX, config);
        });
    }
};
Online.OnloadEvents.Register(function () {
    // Online.InitToolTips();
});
Online.ToolTipOptions = {
    ID: 'OnlineTooltips',
    Anchor: Rf.Tooltip.Anchor.Top,
    Template: '<div class="tooltipContainer_240"><div class="content"><div role="tooltip" class="body"></div></div><div class="footer"></div></div>',
    Margin: 12,
    OptionContainerZIndex: 100003,
    _TemplateCvv: '<div class="tooltipContainer_cvv"><div class="content"><div role="tooltip" class="body"></div></div><div class="footer"></div></div>',
    _TemplateLg: '<div class="tooltipContainer_500"><div class="content"><div role="tooltip" class="body"></div></div><div class="footer"></div></div>'
};

Online.InitToolTips = function () {
    $('.toolTip2, .toolTipText, .toolTipLg, .toolTipAbout, .toolTipCvv').each(function () {
        var item = $(this),
            isIe6 = $('#ie6'),
            ttContent = item.next('.tooltipContent').get(0)
                || item.parent().find('.toolTipContent').get(0)
                || item.parents('.tooltipContainer:first').find('.toolTipContent').get(0),
            tt = new Rf.EmbeddedTooltip(item, ttContent, Online.ToolTipOptions)
                .WatchHover(250)
                .Bind(Rf.Tooltip.Events.Show, Online.InitToolTips.OnShow);
        if (isIe6.length > 0) {
            tt.ParentSelector = isIe6;
        }
        if (item.hasClass('toolTipLg')) {
            tt.Anchor = Rf.Tooltip.Anchor.Bottom;
        }
        tt.Template = item.hasClass('toolTipLg') ? Online.ToolTipOptions._TemplateLg : item.hasClass('toolTipCvv') ? Online.ToolTipOptions._TemplateCvv : Online.ToolTipOptions.Template;
    });
    $('.toolTipScroll').each(function () {
        var ie6 = navigator.userAgent.toLowerCase().indexOf('msie 6') > -1;
        new Rf.AjaxTooltip(this, $(this).attr('href'), {
            Template: '<div class="tooltipContainer_500"><div class="content"><div role="tooltip" class="body"></div></div><div class="footer"></div></div>',
            Anchor: Rf.Tooltip.Anchor.Vertical,
            ParentSelector: ie6 ? '#ie6' : 'body'
        }).Bind(Rf.Tooltip.Events.Show, Online.InitToolTips.OnShowLg);
        $(this).click($.proxy(Online.InitToolTips.OnClickShow, this));
    });
};
Online.InitToolTips.OnClickShow = function (e) {
    e.preventDefault();
    this.Open();
};
Online.InitToolTips.OnShowLg = function (e) {
    this._Self.unbind('mouseover').unbind('mouseout').unbind('focus').unbind('blur');
    this._Self.find('.close').click($.proxy(Online.InitToolTips.OnClickClose, this));
};
Online.InitToolTips.OnShow = function (e) {
    if ($('.isOverlay').length > 0) {
        this._Self.css('zIndex', 11000);
    }
    this._Self.find('h3').addClass('replace');
    if (Online.Touch) {
        $('<a class="close" href="#">关闭</a>').appendTo(this._Self.find('div.body'));
    }
};
Online.InitToolTips.OnClickClose = function (e) {
    e.preventDefault();
    this.Close();
};
Online.UIOverlay = {
    IsBusy: false,
    IsShowing: false,
    ElevateModule: function () {
        var module = $('#setLocationModule').addClass('uiOverlayTarget'),
            overlay = $('<div id="uiOverlay" class="uiOverlay"></div>');
        if (/MSIE [0-8]\./i.test(navigator.userAgent)) {
            overlay.attr('style', 'filter:alpha(opacity=65); width:100%; min-height:100%; background-color:#000;').prependTo('.ie');
        }
        else {
            overlay.addClass('uiOverlayColor').prependTo('body');
        }
        overlay.monobind('click', Online.UIOverlay.OnClickOverlay);
        $(document).monobind('keypress', Online.UIOverlay.OnKeyPressEscape);
        $('html, body').animate({ scrollTop: 0 }, 500);
        if (!module.find('div:first').is(':visible')) {
            Online.LocationBar.Init();
            Online.LocationBar.SlideDown();
        }
        overlay.fadeIn(500, function () {
            Online.UIOverlay.IsBusy = false;
            $('#streetAddress').focus();
        });
    },
    Show: function () {
        if (Online.UIOverlay.IsBusy || Online.UIOverlay.IsShowing) {
            return;
        }
        else {
            Online.UIOverlay.IsShowing = Online.UIOverlay.IsBusy = true;
        }
        if ($('#setLocationModule').length) {
            Online.UIOverlay.ElevateModule();
        }
    },
    Hide: function () {
        Online.UIOverlay.IsShowing = false;
        $('#uiOverlay').remove();
        $('#setLocationModule').removeClass('uiOverlayTarget');
        $(document).unbind('keypress', Online.UIOverlay.OnKeyPressEscape);
    },
    OnKeyPressEscape: function (e) {
        if (e.keyCode == 27) {
            Online.UIOverlay.Hide();
        }
    },
    OnClickOverlay: function (e) {
        Online.UIOverlay.Hide();
        $(this).unbind('click', Online.UIOverlay.OnClickDocument);
    },
    OnForbiddenEvent: function (e) {
        //e.preventDefault();
        //e.stopImmediatePropagation();
        //        if (this.href) {
        //            Online.LocationBar.SetReturnURL($(this).attr("href"));
        //        }
        //Online.UIOverlay.Show();
    }
};

Online.OnloadEvents.Register(function () {//TODO: NEED TO PROCESS Forbiden event
    //switch (Online.UserState.State) {
    //    case Online.UserStates.COLD:
    //    case Online.UserStates.LUKEWARM:
    //        $('#topNavBtnOrder, .coldState, .productForm a').monobind('click', Online.UIOverlay.OnForbiddenEvent);
    //        break;
    //}
});
Online.NumericSpinners = {
    Spinners: {}
};
Online.Index = 1;

Online.NumericSpinner = function (inputElement) {
    this.Input = $(inputElement);
    this.MaxLength = this.Input.attr('maxlength') || '2';
    this.MaxValue = 50;
    this.MinValue = 1;
    this.Spinner = $('<div class="spinnerWrapper rounded clr"></div>');
    this.ButtonTemplate = $('<div class="buttonContainer"><span class="incrementButton button" role="button" tabindex="-1">Increase value</span><span class="decrementButton button" role="button" tabindex="-1">Decrease value</span></div>');
    this.IncrementButton = null;
    this.DecrementButton = null;
    this.Action = null;
    this.Actions = {
        INCREMENT: 'increment',
        DECREMENT: 'decrement',
        INCREMENT10: 'increment10',
        DECREMENT10: 'decrement10',
        MAX: 'max',
        MIN: 'min'
    };
    this.Init();
    return this;
};

Online.NumericSpinner.prototype = {
    ChangeValue: function (button) {
        var me = this,
            value = me.Input.val();
        if (me.IsValid(value)) {
            value = parseInt(value);
            switch (me.Action) {
                case me.Actions.INCREMENT:
                    value += 1;
                    if (value > me.MaxValue) {
                        value = me.MaxValue;
                    }
                    break;
                case me.Actions.DECREMENT:
                    value -= 1;
                    if (value < me.MinValue) {
                        value = me.MinValue;
                    }
                    break;
                case me.Actions.INCREMENT10:
                    value += 10;
                    if (value > me.MaxValue) {
                        value = me.MaxValue;
                    }
                    break;
                case me.Actions.DECREMENT10:
                    value -= 10;
                    if (value < me.MinValue) {
                        value = me.MinValue;
                    }
                    break;
                case me.Actions.MAX:
                    value = me.MaxValue;
                    break;
                case me.Actions.MIN:
                    value = me.MinValue;
                    break;
            }
            me.Input.attr('value', value);
        }
        else {
            me.Input.attr('value', me.MinValue);
        }
    },
    Init: function () {
        var me = this,
            defaultValue = me.Input.val() > 0 ? me.Input.val() : 1;
        if (me.Input.attr('rfspinner')) {
            return false;//already init'd
        }
        me.MaxValue = me.Input.attr('aria-valuemax') ? me.Input.attr('aria-valuemax') : me.MaxValue;
        me.MinValue = me.Input.attr('aria-valuemin') ? me.Input.attr('aria-valuemin') : me.MinValue;
        me.Id = 'spinner' + new Date().getTime() + Online.Index;
        Online.Index += 1;
        me.Spinner.attr('id', me.Id);
        if (!Online.Touch) {
            me.Input.wrap(me.Spinner).after(me.ButtonTemplate);
        }
        me.Spinner = $('#' + me.Id);
        me.Spinner.find('input').attr('value', defaultValue);
        me.Input.attr('autocomplete', 'off').attr('rfspinner', 'true').attr('aria-valuenow', defaultValue).attr('role', 'spinbutton');
        Online.NumericSpinners.Spinners[me.Input.attr('id')] = this;
        me.IncrementButton = me.Spinner.find('.incrementButton');
        me.DecrementButton = me.Spinner.find('.decrementButton');
        if (!Online.Touch) {
            me.InitEvents();
            me.Input.css({ 'border': 'none' }).removeClass('rounded');
        }
        else {
            me.InitTouchEvents();
        }
    },
    InitTouchEvents: function () {
        var me = this;
        me.Input.monobind('focus', function (e) {
            var target = $(e.currentTarget),
                defaultVal = target.attr('value');
            function onblurInput(e) {
                var val = target.val();
                if (val == '') target.val(defaultVal);
            };
            target.val('');
            me.Input.monobind('blur', onblurInput);
        });
    },
    InitEvents: function () {
        var me = this;
        me.IncrementButton.click(function (e) {
            me.Action = me.Actions.INCREMENT;
            me.ChangeValue();
        });
        me.DecrementButton.click(function (e) {
            me.Action = me.Actions.DECREMENT;
            me.ChangeValue();
        });
        me.Input.keydown(function (e) {
            me.Action = null;
            switch (e.keyCode) {
                case 38://up
                case 39://left
                    me.Action = me.Actions.INCREMENT;
                    break;
                case 37://right
                case 40://down
                    me.Action = me.Actions.DECREMENT;
                    break;
                case 35://end
                    me.Action = me.Actions.MIN;
                    break;
                case 36://home
                    me.Action = me.Actions.MAX;
                    break;
                case 33://page up
                    me.Action = me.Actions.INCREMENT10;
                    break;
                case 34://page down
                    me.Action = me.Actions.DECREMENT10;
                    break;
                default:
                    return;
            }
            me.ChangeValue();
        });
        me.Input.keyup(function (e) {
            if (me.Input.val() > 50) {
                me.Input.val('50');
                alert('Quantity cannot exceed 50.');
            }
        });
    },
    IsValid: function (value) {
        return /^\d+$/.test(value);
    }
};
Online.LocationForm = {
    Contact: null, //当前联系人
    Contacts: null, //全部联系人信息
    Modal: null,
    Init: function (context) {
        context = $(context || document.body);
    },
    IsDelivery: function (form) {
        form = $(form);
        return form.find('#delivery:checked').length > 0 || form.find('input[type=hidden][name=selectedMethod]').val() == 'DELIVERY';
    },
    DestroyModal: function () {
        if (Online.LocationForm.Modal) {
            if (Online.LocationForm.Modal._Dialog) {
                Online.LocationForm.Modal.Unbind(Rf.Modal.Events.Show);
                Online.LocationForm.Modal.Unbind(Rf.Modal.Events.Render);
                Online.LocationForm.Modal.Close();
            }
            Online.LocationForm.Modal = null;
            //Online.LocationForm.Contact = null;
        }
    },
    CreateModal: function (url, title) {
        if (Online.LocationForm.Modal) {
            Online.LocationForm.DestroyModal();
        }
        //Online.LocationForm.DestroyModal();
        var modal = new Rf.Modal(url, {
            DialogID: 'modal955',
            OverlayClassName: 'modal-overlay',
            OverlayOpacity: 0.5,
            DialogClassName: 'modal955',
            Template: '<div><div class="header" style="margin-bottom:0;"><h1 class="replace">' + title + '</h1><a href="#" class="btnModal422Close close"></a></div><div class="content clr" role="main"></div><div class="footer clr"></div></div>'
        });
        Online.LocationForm.Modal = modal;
        modal.Unbind(Rf.Modal.Events.Show);
        modal.Unbind(Rf.Modal.Events.Render);
        modal.Unbind(Rf.Modal.Events.Hide);
        modal.Bind(Rf.Modal.Events.Show, Online.LocationForm.OnShowModal);
        modal.Bind(Rf.Modal.Events.Hide, function () {
            Online.LocationForm.Contact = null;
        });
        modal.Bind(Rf.Modal.Events.Render, function () {
            setTimeout(function () {
                // IE absolutely will not hide the frame border unless you do the following
                if (/MSIE [0-8]\./i.test(navigator.userAgent)) {
                    var iframe = modal._Dialog.find('iframe')[0];
                    if (iframe) {
                        var newFrame = document.createElement('iframe');
                        newFrame.frameBorder = 0;
                        newFrame.id = iframe.id;
                        newFrame.src = iframe.src;
                        newFrame.scrolling = 'no';
                        newFrame.allowTransparency = true;
                        iframe.parentNode.appendChild(newFrame);
                        iframe.parentNode.removeChild(iframe);
                    }
                }
            }, 0);
        });
        return modal;
    }, LaunchModal: function (url, title, param) {
        Online.Cookie.setChangeAddressJspParam(param);
        if (!Online.LocationForm.Modal) {
            Online.LocationForm.CreateModal(url, title);
        }
        Online.LocationForm.Modal.Open();
        $("#modal955 h1.replace").html(title);
    }, OnShowModal: function (e) {
        //var context = this._Dialog || $(document.body);
        //context.find('.btnForgotPassword').monobind('click', Online.SignIn.OnClickForgotPassword);
        //if(window.BMap){
        //    initBaiduMap();
        //}else{
        //    Online.getScript('http://api.map.baidu.com/getscript?v=1.3',function(){//http://api.map.baidu.com/api?v=1.3
        //        initBaiduMap();
        //    });
        //}
    }, FindContact: function (id) {
        if (!id) {
            return null;
        }
        if (Online.LocationForm.Contacts) {
            for (var i = 0; i < Online.LocationForm.Contacts.length; i++) {
                if (Online.LocationForm.Contacts[i].orderContactInfoId == id) {
                    return Online.LocationForm.Contacts[i];
                }
            }
        }
        return null;
    }, SaveContactInfo: function (contact, context) {//保存联系信息，包括修改和添加
        if (!contact) {
            return;
        }
        if (!context) {
            context = $(document);
        }
        var operation = contact.orderContactInfoId ? 'update' : 'create';
        contact.createPartyId = contact.partyId;
        if (!contact.isDefault) {
            contact.isDefault = 'N';
        }
        var contactStr = encodeURIComponent(JSON.stringify(contact).trim());

        Online.SyncAjax({
            type: "POST",
            url: baseUrl + '/api/mc/customer/orderContactInfo/' + operation + '.json',
            cache: false,
            data: contactStr,
            dataType: "json",
            error: function () {
                Online.Alert('提示'.t(), '抱歉, 网络故障，请稍后重试'.t());
                return null;
            },
            success: function (response) {
                if (response && response.success) {
                    //add by wangll start  只有在切换就餐类型的情况下，才记录新增的联系方式ID
                    if (operation == 'create' && Online.Cookie.getChangeAddressJspParam() == CONSTANTS.LANCH_MODEL_TYPE.CHANGE_EATING_STYLE) {
                        Online.Cookie.setNewContactIdByChangeEatingStyle(response.result.orderContactInfoId);
                    }
                    //add by wangll end

                    contact.orderContactInfoId = contact.orderContactInfoId ?
                        contact.orderContactInfoId : response.result.orderContactInfoId;
                    //Online.LocationForm.SaveContactToLocal(contact);
                    Online.LocationForm.SyncContactInfo(context);
                }
            }, complete: function () {
            }
        });
    }, SaveContactToLocal: function (contact, serviceTime) {//将当前联系人信息保存到本地Cookie中
        if (contact) {
            Online.LocationForm.Contact = contact;
            Online.Cookie.Save('contact', contact);
            var cartData = Online.Cart.GetData();
            cartData.orderHeader.contactPerson = contact.contactPerson;
            cartData.orderHeader.deliveryAddressId = contact.postalAddress.deliveryAddressId;
            if (contact.telecomNumber) {
                cartData.orderHeader.contactPhone = contact.telecomNumber.contactNumber;
            }
            Online.Cart.SetData(cartData);
            //Online.log(Online.LocationForm.Contact);
            var addr = DeliveryAddress.getAddress();

            if (addr && addr.productStoreId && contact.postalAddress &&
                !(contact.postalAddress.productStoreId) &&
                addr.deliveryAddressId == contact.postalAddress.deliveryAddressId) {
                contact.postalAddress.productStoreId = addr.productStoreId;
            }
            DeliveryAddress.save(contact.postalAddress);
        }
    }, LoadContactFromLocal: function () {//从Cookie中构造联系人对象
        Online.LocationForm.Contact = Online.Cookie.Get('contact');
        if (Online.LocationForm.Contact) {
            return Online.LocationForm.Contact;
        }
        var cartData = Online.Cart.GetData();
        Online.LocationForm.Contact = {
            'contactPerson': cartData.orderHeader.contactPerson, 'telecomNumber':
            { 'contactNumber': cartData.orderHeader.contactPhone }
        };
        Online.LocationForm.Contact.postalAddress = DeliveryAddress.getAddress();
        Online.LocationForm.Contact.NeedShowUserInfo = false;
        return Online.LocationForm.Contact;
    }, IsContactEqual: function (contact1, contact2) {//check if two contact info is equal
        if (contact1 == contact2) {
            return true;
        }
        if (contact1 == null || contact2 == null) {
            return false;
        }
        return contact1.contactPerson == contact2.contactPerson &&
            contact1.telecomNumber.contactNumber == contact2.telecomNumber.contactNumber &&
            DeliveryAddress.isAddressEqual(contact1.postalAddress, contact1.postalAddress);
    }, SyncContactInfo: function (context, cache) {//同步联系人地址信息，需要设置回调函数
        if (!context) {
            context = $(document);
        }
        if (!Online.LocationForm.SyncCallBack) {
            return;
        }
        var uid = $.cookies.get('userId');
        if (!uid) {
            var address = DeliveryAddress.toString();
            if (address) {
                var yourAddress = context.show();
                yourAddress.find('.deliveryAddress span').html(address);
            } else {
                $('#headerNavLink0').attr('href', baseUrl + '/yhkonline/order/orderAddress.jsp');
                $('#headerNavLink1').attr('href', baseUrl + '/yhkonline/product/menu.jsp');
            }
            return false;
        }

        var cond = { customerId: $.cookies.get('partyId') };
        if (!cond.customerId) {
            return false;
        }

        //如果是订单提交界面，将就餐类型加上去
        if (window.location.href.contains('checkoutCustomer.jsp')) {
            cond.eatingStyleEnumId = Online.Cookie.getEatingStyleEnumId();
        }

        if (cache && Online.LocationForm.Contacts) {
            for (var callbackKey in Online.LocationForm.SyncCallBack) {
                var callback = Online.LocationForm.SyncCallBack[callbackKey];
                callback(Online.LocationForm.Contacts, context);
            }
            return;
        }
        if (window.location.href.contains('account.jsp')) {//如果在用户中心，则不允许用户直接在右侧购物车中修改送餐地址
            $('.locationOptions').remove();
        }
        Online.get(baseUrl + '/api/mc/customer/orderContactInfo/list.json',
            cond,
            function (data) {
                if (data && data.success) {
                    Online.LocationForm.Contacts = data.result.orderContactInfoList;
                    var callback;
                    for (var callbackKey in Online.LocationForm.SyncCallBack) {
                        callback = Online.LocationForm.SyncCallBack[callbackKey];
                        callback(Online.LocationForm.Contacts, context);
                    }
                } else {
                    Online.Alert('提示', '抱歉，获取数据失败，请稍后重试'.t());
                }
            }
        );
    }, SyncCallBack: {
        'locationPicker': function (list, context) {
            if (list && list.length > 0) {
                if (!context || context.length == 0) {
                    context = $('#rightChannel');
                }
                context.show();
                //context = $('#yourAddress');
                $('#headerNavLink0').attr('href', baseUrl + '/yhkonline/product/index.jsp');
                $('#headerNavLink1').attr('href', baseUrl + '/yhkonline/product/index.jsp?code=special');
                var iniSelectedContact = context.find('select#locationPicker option:selected').data('contact');

                if (!iniSelectedContact) {
                    iniSelectedContact = Online.LocationForm.LoadContactFromLocal();
                }

                delete Online.ComboBoxes['locationPicker'];
                context.find('.deliveryAddress').html('<select id="locationPicker" style="display: none;"></select>');
                var combo = context.find('#locationPicker');
                var defaultContact = $.grep(list, function (p, i) { return p && p.isDefault == 'Y' })[0];
                if (!defaultContact) {
                    defaultContact = list[0];
                }
                // add by lis start
                if (defaultContact.postalAddress.city != $.cookies.get("city")) {
                    for (var j = 0; j < list.length; j++) {
                        if (list[j].postalAddress.city == $.cookies.get("city")) {
                            defaultContact = list[j];
                            break;
                        }
                    }
                }
                if (null != iniSelectedContact && null != iniSelectedContact.postalAddress && iniSelectedContact.postalAddress.city != $.cookies.get("city")) {
                    iniSelectedContact = defaultContact;
                }
                // add by lis end
                //add by wangll start  切换就餐类型后，选择新添加的就餐类型
                var newOrderContactInfoId = Online.Cookie.getNewContactIdByChangeEatingStyle();
                var isChangeEatingStyle = false;
                if (CONSTANTS.LANCH_MODEL_TYPE.CHANGE_EATING_STYLE == Online.Cookie.getChangeAddressJspParam()
                    && null != newOrderContactInfoId) {
                    Online.Cookie.Del("newContactIdByChangeEatingStyle");

                    var tempObj = $.grep(list, function (p, i) { return p && p.orderContactInfoId == newOrderContactInfoId })[0];
                    if (tempObj) {
                        defaultContact = tempObj;
                        isChangeEatingStyle = true;
                    }
                }
                //add by wangll end

                var addressJsonStr = defaultContact['orderContactInfoId'] + '" data-contact="' +
                    JSON.stringify(defaultContact).replaceAll('"', '&quot;') +
                    '">' + DeliveryAddress.toString(true, defaultContact.postalAddress);
                combo.append('<option selected="selected" value="' + addressJsonStr + '</option>');
                for (var i = 0; i < list.length; i++) {
                    if (list[i] == defaultContact) {
                        continue;
                    }
                    addressJsonStr = list[i]['orderContactInfoId'] + '" data-contact="' +
                        JSON.stringify(list[i]).replaceAll('"', '&quot;') +
                        '">' + DeliveryAddress.toString(true, list[i].postalAddress);
                    if (iniSelectedContact['orderContactInfoId'] == list[i]['orderContactInfoId']
                        && !isChangeEatingStyle) {
                        combo.find('option').prop('selected', false);
                        combo.append('<option selected="selected" value="' + addressJsonStr + '</option>');
                        //iniSelectedContact = list[i];
                    } else {
                        combo.append('<option value="' + addressJsonStr + '</option>');
                    }
                }
                context.find('.addAddress').show();
                Online.ComboBox.DrawAll(context.find('select'));
                // add By Lis start
                $('select#locationPicker').live('change', function (e) {
                    var option = $(this).find('option:selected');
                    var c = option.data('contact');
                    $.cookies.set("city", c.postalAddress.city);
                    $("#showCity").html(c.postalAddress.city);
                });
                // add By Lis end
                //start add by wangll
                var option = $('select#locationPicker').find('option:selected');
                defaultContact = option.data('contact');// current contact info

                if (defaultContact) {
                    Online.Cookie.setEatingStyleEnumId(defaultContact['eatingStyleEnumId']);
                    Online.Cookie.updateCartOrderHeaderEatingStyleId(defaultContact['eatingStyleEnumId']);
                    var carryoutStr = CONSTANTS.EatingStyle.TAKEOUT + "";
                    if (carryoutStr == defaultContact['eatingStyleEnumId']) {
                        Online.Cookie.setIsCarryOut("yes");
                        var store = new Object();
                        store.productStoreId = defaultContact['productStoreId'];
                        store.address = defaultContact['storeAddress'];
                        store.storeName = defaultContact.postalAddress['business'];
                        Online.Cookie.setStoreInfo(store);

                        $("#yourStoreInfo").show();
                        $("#changeAddressInfoLi").hide();
                        $("#cartStoreName").html(store.storeName);
                        $("#cartStoreAddr").html(store.address);

                        $(".addStore").show();
                        Online.RadioCheck.Toggle($("#carryoutCart"));
                    } else {
                        Online.Cookie.setIsCarryOut("no");
                        Online.RadioCheck.Toggle($("#deliveryCart"));
                    }
                    Online.Cookie.setUserHaveAddress("yes");
                }

                if (window.location.href.contains('account.jsp') ||
                    window.location.href.contains('yhkonline/index.jsp')) {
                    $('#carryoutCart').prop('disabled', true);
                    $('#deliveryCart').prop('disabled', true);
                }
                //end add by wangll
            } else {
                var address = DeliveryAddress.toString();
                if (address) {
                    context.find('.deliveryAddress span').html(address);
                    $('#yourAddress').show();
                } else {
                    $('#headerNavLink0,#headerNavLink1').attr('href', baseUrl + '/yhkonline/order/orderAddress.jsp');
                }
                var customerMsgForm = $('#customerMsgForm');
                var uid = $.cookies.get('userId');
                if (customerMsgForm.length > 0 && uid) {
                    Online.LocationForm.SyncTime();
                    Online.LocationForm.SyncUserBasicInfo(customerMsgForm);
                }
            }
        }
    }, SyncUserBasicInfo: function (context, callback) {
        Online.get(baseUrl + '/api/mc/sys/user/detail.json', { 'userId': $.cookies.get('userId') }, function (response) {
            if (callback) {
                return callback(response.result);
            }

            var contact = Online.LocationForm.LoadContactFromLocal();

            if (contact) {
                contact.contactPerson = response.result.cn;
                contact.telecomNumber.contactNumber = response.result.telecomNumber;
                Online.LocationForm.LoadContactBasicInfo(context, contact);
                Online.LocationForm.SaveContactToLocal(contact);
            }
        });
    }, LoadContactBasicInfo: function (context, contact) {//称呼和联系电话初始化
        if (!contact) {
            contact = Online.LocationForm.LoadContactFromLocal();
        }
        var name = contact.contactPerson;
        if (name) {
            if (name.endWith('先生') || name.contains('Mr.')) {
                context.find('.contactPerson').val(name.replace('先生', '').replace('Mr.', '').trim());
                Online.RadioCheck.Toggle(context.find('.male'));
                //context.find('.male').prop('checked', true);
            } else if (name.endWith('女士') || name.contains('Ms.')) {
                context.find('.contactPerson').val(name.replace('女士', '').replace('Ms.', '').trim());
                Online.RadioCheck.Toggle(context.find('.female'));
                //context.find('.female').prop('checked', true);
            } else {
                context.find('.contactPerson').val(name);
            }
        }

        if (contact.telecomNumber != null && contact.telecomNumber.contactNumber) {
            context.find('.phoneNumber').val(contact.telecomNumber.contactNumber).focus();
        }
    }, RebuildTimeComboBox: function (context, selectDate, hour, min) {//重置时间选择控件
        //Online.log(selectDate);
        selectDate = DeliveryServiceTime.getDateFromStr(selectDate);
        var hours = DeliveryServiceTime.getHours(selectDate.format('yyyyMMdd'));
        if (!hours || hours.length == 0) {
        }
        var item, id, combo;
        if (hours && $.inArray(hour, hours) == -1) {
            hour = hours[0];
            min = '00';
        }
        if (hour == null || min != null) {
            hour = hour ? hour : hours[0];
            item = $('select.deliveryHour');
            item.unbind('change', Online.LocationForm.OnHourSelect);
            combo = Online.ComboBoxes[item.attr('id')];
            if (combo) {
                combo._RebuildOptions(hours, hour + '');
            }
            item.bind('change', Online.LocationForm.OnHourSelect);
        }
        var mins = DeliveryServiceTime.getMins(selectDate.format('yyyyMMdd'), hour);
        if (!mins) {
            return;
        }
        if (!min || $.inArray(min, mins) == -1) {
            min = mins[0];
        }
        item = $('select.deliveryMin');
        combo = Online.ComboBoxes[item.attr('id')];
        if (combo) {
            combo._RebuildOptions(mins, min + '');
        }
    }, InitTimeControl: function (context) {//初始化服务时间控件
        context.find('input.deliveryTime, input.deliveryTimeConfig').monobind('change', function () {
            if ($(this).val() == 2) {
                // context.find('.selectTimeCon').show();
            } else {
                context.find('.selectTimeCon').hide();
                //Online.RadioCheck.Toggle($('input.deliveryTime').not($(this)));
            }
        });
        var maxDate = new Date();
        maxDate.setDate(serverTime.getDate() + 6);
        // var selectDP = force ? $('.datePicker'): $('.datePicker:visible');
        $('.datePicker').datepicker({
            dateFormat: "yy-mm-dd",
            minDate: serverTime, maxDate: maxDate,
            hideIfNoPrevNext: true,
            constrainInput: true,
            defaultDate: serverTime,
            onSelect: function (dateText, inst) {
                var selectDate = dateText.replaceAll('-', '');
                var hours = DeliveryServiceTime.getHours(selectDate);
                if (!hours || hours.length == 0) {
                    Online.Alert("温馨提示".t(), "抱歉,门店当天不营业,请选择其他日期!".t());
                    $('.datePicker').datepicker('setDate', $.cookies.get("estimatedDeliveryDate"));
                } else {
                    $.cookies.set("estimatedDeliveryDate", new String(dateText), Online.Cookie.GetExpireTime(1));
                    $('.datePicker').not($(this)).val(dateText).datepicker('setDate', DeliveryServiceTime.getDateFromStr(selectDate));
                    Online.LocationForm.RebuildTimeComboBox(context, selectDate);
                }
            }//end of onSelect
        });
        context.find('.deliveryHour').monobind('change', Online.LocationForm.OnHourSelect);
    }, OnHourSelect: function (e) {
        var context = $(e.currentTarget).parents('.deliveryTimeCon');
        var selectDate = context.find('.datePicker').val().replaceAll('-', '');
        if (selectDate.length == 0) {
            return;
        }
        Online.LocationForm.RebuildTimeComboBox(context, selectDate, $(this).val());
    }, SetDeliveryDate: function (dDate) {
        if ($('.datePicker').val() == dDate.format('yyyy-MM-dd')) {
            return;
        }
        $('.datePicker').val(dDate.format('yyyy-MM-dd'));
        $.cookies.set("estimatedDeliveryDate", new String($('.datePicker').val()), Online.Cookie.GetExpireTime(1));

        $('.datePicker').datepicker('setDate', dDate);
    }, RefreshTimeControl: function (serviceTime, context) {//更新时间选择控件
        if (!serviceTime.canService) {
            Online.Alert('友情提示'.t(), '非常抱歉，当前门店因故已停止营业，您可以继续查询其他地址。'.t());
            return;
        }
        context.show(); //显示预送达
        var cartData = Online.Cart.GetData();
        DeliveryServiceTime.init(serviceTime);
        var defaultDate = DeliveryServiceTime.getLatestTime(); //默认的预送达时间date
        if (!defaultDate) {
            Online.Alert("提示".t(), "不能大于7天的服务时间范围！".t());
            return;
        }
        //$('.datePicker:visible').datepicker("option", "minDate", defaultDate);//初始化后 设置最小日期
        $('.datePicker').datepicker("option", "minDate", defaultDate);//初始化后 设置最小日期
        var processingTime = parseInt(serviceTime.processingTime);
        context.find(".processingMin").html(serviceTime.processingTime);//设置默认预送达
        var bfDeliveryTime = cartData.orderHeader.estimatedDeliveryTime;//用户设置的时间
        //如果预送达时间为空，则说明超营业 ,则只显示预约送达时间
        //如果未到营业时间，则只显示预约送达时间
        if (serviceTime.estimatedDeliveryTime && serviceTime.isBusinessHours) {
            context.find(".processingTime").html(DeliveryServiceTime.estimatedDeliveryTime.format('hh:mm'));//设置默认预送达
            if (processingTime && processingTime > 35 && (DeliveryServiceTime.estimatedDeliveryTime - serverTime) < 45 * 60000) {
                $('.processingTimeLongTip').show();
            } else {
                $('.processingTimeLongTip').hide();
            }
            context.find('#defTime').show();
            context.find('.selectTimeCon').hide();
        } else {
            context.find(".processingTime").html(DeliveryServiceTime.getLatestTime().format('hh:mm'));
            context.find('#defTime').hide();
            //  context.find('.selectTimeCon').show();
            Online.RadioCheck.Toggle($('#deliveryTimeConfig'));
        }
        var selectDate = $.cookies.get("estimatedDeliveryDate");
        if (bfDeliveryTime && bfDeliveryTime.endWith('1')) {
            if (selectDate && selectDate.length > 7 && !bfDeliveryTime.startWith(selectDate.replaceAll('-', ''))) {
                bfDeliveryTime = selectDate.replaceAll('-', '') + "0600";
            }
            var bfDate = DeliveryServiceTime.getDateFromStr(bfDeliveryTime); //用户设置的时间  date类型
            var bfSelHour = bfDeliveryTime.substr(8, 2); //小时
            var bfSelMin = bfDeliveryTime.substr(10, 2); //分钟
            if (bfDate < defaultDate) {
                //Online.Alert('友情提示'.t(), ('您好！您的订单最早在{0}送到，请修改您的预定时间，谢谢！').t(defaultDate.format('hh:mm'))); //如果客户选择的时间晚于现在最早的时间 给提示 重新设值
                bfDate = defaultDate;
                bfSelHour = bfDate.getHours() + '';
                bfSelMin = bfDate.getMinutes() + '';
                Online.RadioCheck.Toggle($('input.deliveryTime'));
            } else {
                Online.RadioCheck.Toggle($('input.deliveryTimeConfig'));
                //   $('.selectTimeCon').show();
            }
            Online.LocationForm.RebuildTimeComboBox(context, bfDate.format('yyyyMMdd'), bfSelHour, bfSelMin);
            Online.LocationForm.SetDeliveryDate(bfDate);
        } else if (selectDate && selectDate.length > 7 && defaultDate.format('yyyyMMdd') < selectDate.replaceAll('-', '')) {
            Online.RadioCheck.Toggle($('input.deliveryTimeConfig'));
            //  $('.selectTimeCon').show();
            //context.find('.datePicker').val(selectDate);
            selectDate = selectDate.replaceAll('-', '');
            Online.LocationForm.RebuildTimeComboBox(context, selectDate);
            Online.LocationForm.SetDeliveryDate(DeliveryServiceTime.getDateFromStr(selectDate));
        } else {
            Online.LocationForm.RebuildTimeComboBox(context, defaultDate.format('yyyyMMdd'));
            Online.LocationForm.SetDeliveryDate(defaultDate);
        }
    }, SyncTime: function (context, cache) {
        if (window.location.href.contains('account.jsp') && $("#modal955 h1.replace").html() != '非常感谢您订购永和大王，您的送餐地址因商圈调整，目前不在送餐范围内。请尝试其他送餐地址。谢谢！'.t()) {
            return;
        }

        context = $(context || document.body);
        if (cache) {
            var serviceTime = $('select#locationPicker option:selected').data('time');
            if (serviceTime) {
                Online.LocationForm.RefreshTimeControl(serviceTime, context.find('.deliveryTimeCon'));
                return;
            }
        }
        var contact = $('select#locationPicker option:selected').data('contact');
        if (contact) {
            Online.LocationForm.Contact = contact;
        }
        var cond = {};
        //送餐地址id 用于查询当前服务地址属于哪个门店服务范围
        if (!Online.LocationForm.Contact) {
            Online.LocationForm.Contact = Online.LocationForm.LoadContactFromLocal();
        }
        var address = Online.LocationForm.Contact.postalAddress;
        if (!address) {
            return;
        }

        cond.deliveryAddressId = address.deliveryAddressId;
        cond.eatingStyleEnumId = Online.Cookie.getEatingStyleEnumId();

        Online.get(baseUrl + '/api/mc/ds/detail.json', cond, function (data) {
            if (!data || !data.success) {
                //Online.Alert('友情提示'.t(),data.result.errorMsg);
                $("#modal955 h1.replace").html('非常感谢您订购永和大王，您的送餐地址因商圈调整，目前不在送餐范围内。请尝试其他送餐地址。谢谢！'.t());
                var cartData = $.cookies.get('cartData');
                if (cartData) {
                    delete cartData.orderHeader.estimatedDeliveryTime;
                    $.cookies.set('cartData', cartData, Online.Cookie.GetExpireTime(2));
                }
                //如果当前方法是由订单提交第二屏调用并且当前地址不服务则弹出修改地址页面。
                if (context.attr('id') == 'customerMsgForm') {
                    Online.RightChannel.OnClickChangeLocation();
                }
                $('.deliveryTimeCon').hide();
                return;
            }
            $('select#locationPicker option:selected').data('time', data.result);//缓存获取的时间
            Online.LocationForm.RefreshTimeControl(data.result, context.find('.deliveryTimeCon'));

            //add by wangll start update store info
            if (window.location.href.contains('checkoutCustomer.jsp')
                && $('select#locationPicker option:selected').data('contact')) {
                var c = $('select#locationPicker option:selected').data('contact');// current contact info
                var carryoutStr = CONSTANTS.EatingStyle.TAKEOUT + "";
                if (carryoutStr == c['eatingStyleEnumId']) {
                    Online.Cookie.setIsCarryOut("yes");
                    var store = new Object();
                    store.productStoreId = c['productStoreId'];
                    store.storeName = c.postalAddress['business'];
                    store.address = c['storeAddress'];
                    Online.Cookie.setStoreInfo(store);

                    $('#storeDetail').html(store.storeName + '<br>' + store.address);
                }
            }
            // add by wangll end update store info
        });
    }, SyncTime1: function (context, cache) {
        if (window.location.href.contains('account.jsp') && $("#modal955 h1.replace").html() != '非常感谢您订购棒约翰，您的送餐地址因商圈调整，目前不在送餐范围内。请尝试其他送餐地址。谢谢！'.t()) {
            return;
        }

        context = $(context || document.body);
        if (cache) {
            var serviceTime = $('select#locationPicker option:selected').data('time');
            if (serviceTime) {
                Online.LocationForm.RefreshTimeControl(serviceTime, context.find('.deliveryTimeCon'));
                return;
            }
        }
        var contact = $('select#locationPicker option:selected').data('contact');
        if (contact) {
            Online.LocationForm.Contact = contact;
        }
        var cond = {};
        //送餐地址id 用于查询当前服务地址属于哪个门店服务范围
        if (!Online.LocationForm.Contact) {
            Online.LocationForm.Contact = Online.LocationForm.LoadContactFromLocal();
        }
        var address = Online.LocationForm.Contact.postalAddress;
        if (!address) {
            return;
        }

        cond.deliveryAddressId = address.deliveryAddressId;
        cond.eatingStyleEnumId = Online.Cookie.getEatingStyleEnumId();

        Online.get(baseUrl + '/api/mc/ds/detail1.json', cond, function (data) {
            if (!data || !data.success) {
                //Online.Alert('友情提示'.t(),data.result.errorMsg);
                $("#modal955 h1.replace").html('非常感谢您订购棒约翰，您的送餐地址因商圈调整，目前不在送餐范围内。请尝试其他送餐地址。谢谢！'.t());
                var cartData = $.cookies.get('cartData');
                if (cartData) {
                    delete cartData.orderHeader.estimatedDeliveryTime;
                    $.cookies.set('cartData', cartData, Online.Cookie.GetExpireTime(2));
                }
                //如果当前方法是由订单提交第二屏调用并且当前地址不服务则弹出修改地址页面。
                if (context.attr('id') == 'customerMsgForm') {
                    Online.RightChannel.OnClickChangeLocation();
                }
                $('.deliveryTimeCon').hide();
                return;
            }
            $('select#locationPicker option:selected').data('time', data.result);//缓存获取的时间
            Online.LocationForm.RefreshTimeControl(data.result, context.find('.deliveryTimeCon'));

            //add by wangll start update store info
            if (window.location.href.contains('checkoutCustomer.jsp')
                && $('select#locationPicker option:selected').data('contact')) {
                var c = $('select#locationPicker option:selected').data('contact');// current contact info
                var carryoutStr = CONSTANTS.EatingStyle.TAKEOUT + "";
                if (carryoutStr == c['eatingStyleEnumId']) {
                    Online.Cookie.setIsCarryOut("yes");
                    var store = new Object();
                    store.productStoreId = c['productStoreId'];
                    store.storeName = c.postalAddress['business'];
                    store.address = c['storeAddress'];
                    Online.Cookie.setStoreInfo(store);

                    $('#storeDetail').html(store.storeName + '<br>' + store.address);
                }
            }
            // add by wangll end update store info
        });
    }
};
Online.OnloadEvents.Register(function () {
    //Online.LocationBar.Init('#setLocationWrapper');
});

Online.LocationBar = {
    Init: function (context) {
        context = $(context);
        Online.InitToolTips();
        if (context.find("#animateSetLocation").length) {
            setTimeout(Online.LocationBar.SlideDown, 300);
            context.find('#streetAddress').focus();
        }
        else {
            context.removeClass("hidden");
        }
        Online.LocationForm.Init(context);
        //context.find('#streetAddress').focus();
    },
    SlideDown: function () {
        var wrapper = $('#setLocationWrapper');
        if ($("#ie7").length > 0) {
            wrapper.show();
            wrapper.find('#streetAddress').focus();
        }
        else if (!$("#ie6").length) {
            wrapper.slideDown(function () {
                wrapper.find('#streetAddress').focus();
            });
        }
    },
    SetContainerHeights: function (containers) {
        if (containers) {
            var height = containers[0].offsetHeight;
            for (var i = 0; i < containers.length; i++) {
                if (containers[i].offsetHeight > height) {
                    height = containers[i].offsetHeight;
                }
            }
            return height;
        }
    },
    OnClickPageLink: function (e) {
        e.preventDefault();
    }
};
Online.OnloadEvents.Register(function () {
    Online.SignIn.Init();
    //    Online.ApliPay.Init();
});

Online.SignIn = {
    Modal: null,
    CreateModal: function (url, title) {
        Online.SignIn.DestroyModal();
        var modal = new Rf.Modal(url, {
            DialogID: 'modal422',
            OverlayClassName: 'modal-overlay',
            OverlayOpacity: 0.5,
            DialogClassName: 'modal422',
            Template: '<div><div class="header"  style="margin-bottom:0;"><h1 class="replace">' + title + '</h1><a href="#" class="btnModal422Close close"></a></div><div class="content clr" role="main"></div><div class="footer clr"></div></div>'
        });
        Online.SignIn.Modal = modal;
        modal.Bind(Rf.Modal.Events.Show, Online.SignIn.OnShowModal);
        modal.Bind(Rf.Modal.Events.Render, function () {
            setTimeout(function () {
                // IE absolutely will not hide the frame border unless you do the following
                if (/MSIE [0-8]\./i.test(navigator.userAgent)) {
                    var iframe = modal._Dialog.find('iframe')[0];
                    if (iframe) {
                        var newFrame = document.createElement('iframe');
                        newFrame.frameBorder = 0;
                        newFrame.id = iframe.id;
                        newFrame.src = iframe.src;
                        newFrame.scrolling = 'no';
                        newFrame.allowTransparency = true;
                        iframe.parentNode.appendChild(newFrame);
                        iframe.parentNode.removeChild(iframe);
                    }
                }
            }, 0);
        });
        return modal;
    },
    OnClickSignInDialog: function (e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        $('.errorTooltip').remove();
        var url = $('#topNavBtnSignIn').attr('href');
        if (url) {
            Online.SignIn.DestroyModal();
            var modal = new Rf.Modal(url, {
                DialogID: 'modal422',
                OverlayClassName: 'modal-overlay',
                OverlayOpacity: 0.5,
                DialogClassName: 'modal422',
                Template: '<div><div class="header" style="margin-bottom:0;"><h1 class="replace">' + '登录' + '</h1><a href="#" class="btnModal422Close close"></a></div><div class="content clr" role="main"></div><div class="footer clr"></div></div>'
            });
            Online.SignIn.Modal = modal;
            modal.Bind(Rf.Modal.Events.Show, Online.SignIn.OnShowModal);
            modal.Bind(Rf.Modal.Events.Render, function () {
                setTimeout(function () {
                    // IE absolutely will not hide the frame border unless you do the following
                    if (/MSIE [0-8]\./i.test(navigator.userAgent)) {
                        var iframe = modal._Dialog.find('iframe')[0];
                        if (iframe) {
                            var newFrame = document.createElement('iframe');
                            newFrame.frameBorder = 0;
                            newFrame.id = iframe.id;
                            newFrame.src = iframe.src;
                            newFrame.scrolling = 'no';
                            newFrame.allowTransparency = true;
                            iframe.parentNode.appendChild(newFrame);
                            iframe.parentNode.removeChild(iframe);
                        }
                    }
                }, 0);
            });
            return modal.Open();
        }
    },
    OnSubmitForm: function (e) {
    },
    OnClickClose: function (e) {
        e.preventDefault();
        Online.SignIn.DestroyModal();
    },
    Init: function (context) {
        context = $(context || document.body);
        $('.signInDialog', context).monobind('click', Online.SignIn.OnClickSignInDialog);
    },
    DestroyModal: function () {
        if (Online.SignIn.Modal) {
            if (Online.SignIn.Modal._Dialog) {
                Online.SignIn.Modal.Close();
            }
            Online.SignIn.Modal = null;
        }
    },
    CreateModalForBigWindow: function (url, title) {
        Online.SignIn.DestroyModal();
        var modal = new Rf.Modal(url, {
            DialogID: 'modal422',
            OverlayClassName: 'modal-overlay',
            OverlayOpacity: 0.5,
            DialogClassName: 'modal422',
            Template: '<div><div class="header" style="margin-bottom:0;"><h1 class="replace">' + title + '</h1><a href="#" class="btnModal422Close close"></a></div><div class="content2 clr" role="main"></div><div class="footer clr"></div></div>'
        });
        Online.SignIn.Modal = modal;
        modal.Bind(Rf.Modal.Events.Show, Online.SignIn.OnShowModal);
        modal.Bind(Rf.Modal.Events.Render, function () {
            setTimeout(function () {
                // IE absolutely will not hide the frame border unless you do the following
                if (/MSIE [0-8]\./i.test(navigator.userAgent)) {
                    var iframe = modal._Dialog.find('iframe')[0];
                    if (iframe) {
                        var newFrame = document.createElement('iframe');
                        newFrame.frameBorder = 0;
                        newFrame.id = iframe.id;
                        newFrame.src = iframe.src;
                        newFrame.scrolling = 'no';
                        newFrame.allowTransparency = true;
                        iframe.parentNode.appendChild(newFrame);
                        iframe.parentNode.removeChild(iframe);
                    }
                }
            }, 0);
        });
        return modal;
    },

    OnShowModal: function (e) {
        var context = this._Dialog || $(document.body);
        context.find('#signInDialogForm').monobind('submit', Online.SignIn.OnSubmitForm);
        // context.find('.btnForgotPassword').monobind('click', Online.SignIn.OnClickForgotPassword);
        // context.find('#btnModalForgotPassword').monobind('click', Online.SignIn.OnClickForgotPasswordSubmit);
        context.find('.close').unbind('click').monobind('click', Online.SignIn.OnClickClose);
    },
    LoadModalContent: function (content, title) {
        if (Online.SignIn.Modal) {
            Online.SignIn.Modal._Dialog.find('.content').html(content);
            Online.SignIn.Modal._Dialog.find('h1.replace, h2.replace').html(title);
            //$('#cantRememberEmail').monobind('click', Online.SignIn.OnClickCantRememberEmail);
            Online.SignIn.OnShowModal.call(Online.SignIn.Modal._Dialog);
        }
    },
    OnClickCantRememberEmail: function (e) {
        e.preventDefault();
        var url = $(this).attr('href'),
            message = $(this).attr('title');
        Online.SignIn.DestroyModal();
        Online.ShowConfirmationModal(url, message, 'modal422', 'modal422');
    },
    OnAjaxSuccess: function (response) {
        if (!response.success) {
            Online.SignIn.LoadModalContent(response.content);
        }
    },
    OnSignInSubmitAjaxSuccess: function (response) {
        Online.SignIn.DestroyModal();
        window.location.reload();
    },
    AjaxCall: function (url, params, successCallback, errorCallback) {
        Online.SyncAjax({
            type: 'POST',
            url: url,
            cache: false,
            data: params,
            dataType: 'json',
            error: function (xhr) {
                if (errorCallback) {
                    errorCallback.call(this);
                }
                Online.OnAjaxError(xhr);
            },
            success: function (response) {
                if (response.hasServerSideErrors) {
                    Online.SignIn.LoadModalContent(response.content);
                    if (errorCallback) {
                        errorCallback.call(this);
                    }
                }
                else if (successCallback) {
                    Online.ShowAjaxResponseAlert(response);
                    successCallback.call(this, response);
                }
            }
        });
    }
};
Online.ApliPay = {
    Modal: null,
    OnClickApliPayDialog: function (e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        $('.errorTooltip').remove();
        // var url = $('#topNavBtnApliPay').attr('href');
        var url = 'aliPay.jsp';
        if (url) {
            Online.ApliPay.CreateModal(url, $.t('支付')).Open();
        }
    },
    OnSubmitForm: function (e) {
    },
    OnClickClose: function (e) {
        e.preventDefault();
        Online.ApliPay.DestroyModal();
    },
    Init: function (context) {
        context = $(context || document.body);
        $('.apliPayDialog', context).monobind('click', Online.ApliPay.OnClickApliPayDialog);
    },
    DestroyModal: function () {
        if (Online.ApliPay.Modal) {
            if (Online.ApliPay.Modal._Dialog) {
                Online.ApliPay.Modal.Close();
            }
            Online.ApliPay.Modal = null;
        }
    },
    CreateModal: function (url, title) {
        Online.ApliPay.DestroyModal();
        var modal = new Rf.Modal(url, {
            DialogID: 'modal423',
            OverlayClassName: 'modal-overlay',
            OverlayOpacity: 0.5,
            DialogClassName: 'modal423',
            Template: '<div><div class="header" style="margin-bottom:0;"><h1 class="replace">' + title + '</h1><a href="#" class="btnModal423Close close"></a></div><div class="content clr" role="main"></div><div class="footer clr"></div></div>'
        });
        Online.ApliPay.Modal = modal;
        modal.Bind(Rf.Modal.Events.Show, Online.ApliPay.OnShowModal);
        modal.Bind(Rf.Modal.Events.Render, function () {
            setTimeout(function () {
                // IE absolutely will not hide the frame border unless you do the following
                if (/MSIE [0-8]\./i.test(navigator.userAgent)) {
                    var iframe = modal._Dialog.find('iframe')[0];
                    if (iframe) {
                        var newFrame = document.createElement('iframe');
                        newFrame.frameBorder = 0;
                        newFrame.id = iframe.id;
                        newFrame.src = iframe.src;
                        newFrame.scrolling = 'no';
                        newFrame.allowTransparency = true;
                        iframe.parentNode.appendChild(newFrame);
                        iframe.parentNode.removeChild(iframe);
                    }
                }
            }, 0);
        });
        return modal;
    },
    OnShowModal: function (e) {
        var context = this._Dialog || $(document.body);
        context.find('#apliPayForm').monobind('submit', Online.ApliPay.OnSubmitForm);
        // context.find('.btnForgotPassword').monobind('click', Online.ApliPay.OnClickForgotPassword);
        // context.find('#btnModalForgotPassword').monobind('click', Online.ApliPay.OnClickForgotPasswordSubmit);
        context.find('.close').unbind('click').monobind('click', Online.ApliPay.OnClickClose);
    },
    LoadModalContent: function (content, title) {
        if (Online.ApliPay.Modal) {
            Online.ApliPay.Modal._Dialog.find('.content').html(content);
            Online.ApliPay.Modal._Dialog.find('h1.replace, h2.replace').html(title);
            //$('#cantRememberEmail').monobind('click', Online.ApliPay.OnClickCantRememberEmail);
            Online.ApliPay.OnShowModal.call(Online.ApliPay.Modal._Dialog);
        }
    },
    OnClickCantRememberEmail: function (e) {
        e.preventDefault();
        var url = $(this).attr('href'),
            message = $(this).attr('title');
        Online.ApliPay.DestroyModal();
        Online.ShowConfirmationModal(url, message, 'modal422', 'modal422');
    },
    OnAjaxSuccess: function (response) {
        if (!response.success) {
            Online.ApliPay.LoadModalContent(response.content);
        }
    },
    OnApliPaySubmitAjaxSuccess: function (response) {
        Online.ApliPay.DestroyModal();
        window.location.reload();
    },
    AjaxCall: function (url, params, successCallback, errorCallback) {
        Online.SyncAjax({
            type: 'POST',
            url: url,
            cache: false,
            data: params,
            dataType: 'json',
            error: function (xhr) {
                if (errorCallback) {
                    errorCallback.call(this);
                }
                Online.OnAjaxError(xhr);
            },
            success: function (response) {
                if (response.hasServerSideErrors) {
                    Online.ApliPay.LoadModalContent(response.content);
                    if (errorCallback) {
                        errorCallback.call(this);
                    }
                }
                else if (successCallback) {
                    Online.ShowAjaxResponseAlert(response);
                    successCallback.call(this, response);
                }
            }
        });
    }
};
Online.ApliPay_One = {
    Modal: null,
    OnClickApliPayDialog: function (e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        $('.errorTooltip').remove();
        // var url = $('#topNavBtnApliPay').attr('href');
        var url = 'aliPay_one.jsp';
        if (url) {
            Online.ApliPay_One.CreateModal(url, $.t('友情提示')).Open();
        }
    },
    OnSubmitForm: function (e) {
    },
    OnClickClose: function (e) {
        e.preventDefault();
        Online.ApliPay_One.DestroyModal();
    },
    Init: function (context) {
        context = $(context || document.body);
        $('.apliPayDialog', context).monobind('click', Online.ApliPay_One.OnClickApliPayDialog);
    },
    DestroyModal: function () {
        if (Online.ApliPay_One.Modal) {
            if (Online.ApliPay_One.Modal._Dialog) {
                Online.ApliPay_One.Modal.Close();
            }
            Online.ApliPay_One.Modal = null;
        }
    },
    CreateModal: function (url, title) {
        Online.ApliPay_One.DestroyModal();
        var modal = new Rf.Modal(url, {
            DialogID: 'modal423',
            OverlayClassName: 'modal-overlay',
            OverlayOpacity: 0.5,
            DialogClassName: 'modal423',
            Template: '<div><div class="header" style="margin-bottom:0;"><h1 class="replace">' + title + '</h1><a href="#" class="btnModal423Close close"></a></div><div class="content clr" role="main"></div><div class="footer clr"></div></div>'
        });
        Online.ApliPay_One.Modal = modal;
        modal.Bind(Rf.Modal.Events.Show, Online.ApliPay_One.OnShowModal);
        modal.Bind(Rf.Modal.Events.Render, function () {
            setTimeout(function () {
                // IE absolutely will not hide the frame border unless you do the following
                if (/MSIE [0-8]\./i.test(navigator.userAgent)) {
                    var iframe = modal._Dialog.find('iframe')[0];
                    if (iframe) {
                        var newFrame = document.createElement('iframe');
                        newFrame.frameBorder = 0;
                        newFrame.id = iframe.id;
                        newFrame.src = iframe.src;
                        newFrame.scrolling = 'no';
                        newFrame.allowTransparency = true;
                        iframe.parentNode.appendChild(newFrame);
                        iframe.parentNode.removeChild(iframe);
                    }
                }
            }, 0);
        });
        return modal;
    },
    OnShowModal: function (e) {
        var context = this._Dialog || $(document.body);
        context.find('#apliPayForm').monobind('submit', Online.ApliPay_One.OnSubmitForm);
        // context.find('.btnForgotPassword').monobind('click', Online.ApliPay.OnClickForgotPassword);
        // context.find('#btnModalForgotPassword').monobind('click', Online.ApliPay.OnClickForgotPasswordSubmit);
        context.find('.close').unbind('click').monobind('click', Online.ApliPay_One.OnClickClose);
    },
    LoadModalContent: function (content, title) {
        if (Online.ApliPay_One.Modal) {
            Online.ApliPay_One.Modal._Dialog.find('.content').html(content);
            Online.ApliPay_One.Modal._Dialog.find('h1.replace, h2.replace').html(title);
            //$('#cantRememberEmail').monobind('click', Online.ApliPay.OnClickCantRememberEmail);
            Online.ApliPay_One.OnShowModal.call(Online.ApliPay_One.Modal._Dialog);
        }
    },
    OnClickCantRememberEmail: function (e) {
        e.preventDefault();
        var url = $(this).attr('href'),
            message = $(this).attr('title');
        Online.ApliPay_One.DestroyModal();
        Online.ShowConfirmationModal(url, message, 'modal423', 'modal423');
    },
    OnAjaxSuccess: function (response) {
        if (!response.success) {
            Online.ApliPay_One.LoadModalContent(response.content);
        }
    },
    OnApliPaySubmitAjaxSuccess: function (response) {
        Online.ApliPay_One.DestroyModal();
        window.location.reload();
    },
    AjaxCall: function (url, params, successCallback, errorCallback) {
        Online.SyncAjax({
            type: 'POST',
            url: url,
            cache: false,
            data: params,
            dataType: 'json',
            error: function (xhr) {
                if (errorCallback) {
                    errorCallback.call(this);
                }
                Online.OnAjaxError(xhr);
            },
            success: function (response) {
                if (response.hasServerSideErrors) {
                    Online.ApliPay_One.LoadModalContent(response.content);
                    if (errorCallback) {
                        errorCallback.call(this);
                    }
                }
                else if (successCallback) {
                    Online.ShowAjaxResponseAlert(response);
                    successCallback.call(this, response);
                }
            }
        });
    }
};
/*
 * Online.Validation : A helper class for initializing and managing form validation,
 * based on the jQuery Validate plug-in.
 */

(function () {
    try {
        // IE hates this code in an iframe
        if (undefined === document.activeElement && window.addEventListener) {
            window.addEventListener('focus', function (e) {
                document.activeElement = e.target;
            }, true);
            window.addEventListener('blur', function (e) {
                document.activeElement = null;
            }, true);
        }
    }
    catch (e) { }
})();
Online.RightChannel = {
    CurrentModal: null,
    ModalCaller: null,
    OnShowModal: function () {
        // TODO - need to find a way to use this
        var searchForm = $(this._Dialog.find('#searchForm')),
            results = searchForm.find('.result');
        Online.InitToolTips();
        Online.InitFormWidgets('#formWrapper');
        Online.LocationForm.Init(this._Dialog);
        //this._Dialog.find('#prev, #next').monobind('click', Online.RightChannel.OnClickPageLink);
        //this._Dialog.find('#proceed').monobind('click', Online.RightChannel.OnClickProceed);
        //this._Dialog.find('a.cancelChangeStore').monobind('click', Online.RightChannel.OnClickCancelChangeStore);
        if (results.length > 0) {
            setTimeout(function () {
                results.height(Online.LocationBar.SetContainerHeights(results));
            }, 250);
        }
    },
    Toggle: function () {
        var channel = $('#rightChannel'),
            content = channel.find('#channelContent'),
            isClosed = channel.hasClass('closed'),
            isLocked = channel.hasClass('locked'),
            isAnimating = content.data('isAnimating');
        if (isLocked || isAnimating) {
            return;
        } else {
            content.data('isAnimating', true);
            if (isClosed) {
                content.slideDown(550, function () {
                    $(this).data('isAnimating', false);
                    Online.RightChannel.SetContentHeight('open');
                    Online.RightChannel.TagAlong.Suppress(false);
                });
                channel.removeClass('closed');
            }
            else {
                Online.RightChannel.TagAlong.Suppress(true);
                content.slideUp(550, function () {
                    $(this).data('isAnimating', false);
                    Online.RightChannel.SetContentHeight('closed');
                });
                channel.addClass('closed');
            }
        }
    },
    OnClickToggleOpen: function (e) {
        e.preventDefault();
        Online.RightChannel.Toggle();
    },
    OnClickToggleSection: function (e) {
        if (e) {
            e.preventDefault();
        }
        var control = $(this),
            isAnimating = control.data('isAnimating');
        if (!isAnimating) {
            control.toggleClass('closed').data('isAnimating', true);
            if (control.parents('#rightChannel').length > 0) {
                control.siblings('.sectionContent:first').slideToggle(500);
            }
            else {
                control.parents('.rightChannelWrap').find('#channelContent').slideToggle(500);
            }
            control.data('isAnimating', false);
            if (control.hasClass('closed')) {
                control.removeClass('show');
            }
            else {
                control.addClass('show');
            }
        }
    },
    OnClickShowHideSection: function (e) { // handles sections in ie6
        e.preventDefault();
        var control = $(this),
            container = control.siblings('.sectionContent:first');
        control.toggleClass('closed');
        if (!container.hasClass('hidden')) {
            container.addClass('hidden');
        } else {
            container.removeClass('hidden');
        }
    },
    OnClickViewDetail: function (e) {
        e.preventDefault();
        var control = $(this),
            content = control.siblings('.description:first');
        if (!content.data('isAnimating')) {
            content.slideToggle(function () {
                $(this).toggleClass('open').data('isAnimating', false);
                control.html($(this).hasClass('open') ? $.t('隐藏') : $.t('详情'));
            });
        }
    },
    OnClickChangeLocation: function (e, args) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        $('.errorTooltip').remove();
        var url = $(this).attr('href');
        if (!url) {
            url = baseUrl + '/yhkonline/order/changeAddress.jsp';
        }
        if (url) {
            DeliveryAddress.clean();
            $.jStorage.reInit();
            var title = args ? args : '修改地址'.t();
            var locationPicker = $('select#locationPicker');
            var param = null;
            if ($(this).hasClass('addAddress') || $(this).hasClass('addStore')) {//用户管理添加新地址
                Online.LocationForm.Contact = {
                    'contactPerson': $('#accountMain #cn').val(),
                    'telecomNumber': { 'contactNumber': $('#accountMain #telecomNumber').val() }
                };
                Online.LocationForm.Contact.postalAddress = null;
                Online.LocationForm.Contact.NeedShowUserInfo = true;
                title = '添加地址'.t();
                param = CONSTANTS.LANCH_MODEL_TYPE.ADD_ADDRESS_OR_STORE;
            } else if ($(this).data('cid')) {//用户管理修改地址
                Online.LocationForm.Contact = Online.LocationForm.FindContact($(this).data('cid'));
                Online.LocationForm.Contact.NeedShowUserInfo = true;
                param = CONSTANTS.LANCH_MODEL_TYPE.USER_MODIFY_ADDRESS;
                Online.Cookie.setUserManageAddressCid($(this).data('cid'));
            } else if ($(this).hasClass('changeEatingStyle')) {
                if (Online.Auth.IsAnonymousUser()) {
                    Online.LocationForm.Contact = Online.LocationForm.LoadContactFromLocal();
                    Online.LocationForm.Contact.NeedShowUserInfo = false;
                } else {
                    Online.LocationForm.Contact = {
                        'contactPerson': $('#accountMain #cn').val(),
                        'telecomNumber': { 'contactNumber': $('#accountMain #telecomNumber').val() }
                    };
                    Online.LocationForm.Contact.postalAddress = null;
                    Online.LocationForm.Contact.NeedShowUserInfo = true;
                }
                param = CONSTANTS.LANCH_MODEL_TYPE.CHANGE_EATING_STYLE;
                title = '添加地址';
            } else if (locationPicker.length > 0) {//下拉框修改地址 [注册用户修改门店或地址]
                Online.LocationForm.Contact = locationPicker.find('option:selected').data('contact');
                Online.LocationForm.Contact.NeedShowUserInfo = false;
                param = CONSTANTS.LANCH_MODEL_TYPE.SELECT_PICKER_CHANGE;
            } else if ($(this).hasClass('changeStore')) {  //修改门店 [匿名用户修改门店]
                Online.LocationForm.Contact = Online.LocationForm.LoadContactFromLocal();
                Online.LocationForm.Contact.NeedShowUserInfo = false;
                title = '修改门店';
                param = CONSTANTS.LANCH_MODEL_TYPE.CHANGE_STORE;
            } else {
                Online.LocationForm.Contact = Online.LocationForm.LoadContactFromLocal();
                Online.LocationForm.Contact.NeedShowUserInfo = false;
                param = CONSTANTS.LANCH_MODEL_TYPE.OTHER_INFO;
            }
            Online.LocationForm.LaunchModal(url, title, param);
            //Online.LocationForm.CreateModal(url,'修改地址').Open();
        }
    },
    TagAlong: {
        SuspendOnScroll: false,
        CountCartItems: function () {
            var total = Online.Order.GetTotalQuantity();
            $('#viewCartJumpLink > .count, #topNavCount').text(total);
            return total;
        },
        ShowHideElem: function (elem, doShow, animSpeed) {
            elem = $(elem);
            if (elem.data('isBusy') || elem.data('isShowing') == doShow) {
                return;
            }
            else {
                animSpeed = animSpeed == undefined ? 500 : animSpeed;
                if (animSpeed > 0) {
                    elem.data('isBusy', true).css({ display: 'block', opacity: doShow ? 0 : 100 }).animate({ opacity: doShow ? 100 : 0 }, 500, function () {
                        elem.data('isBusy', false).data('isShowing', doShow).css({ display: doShow ? 'block' : 'none' });
                    });
                }
                else {
                    elem[doShow ? 'show' : 'hide'](0);
                }
            }
        },
        ShowHideJumpLink: function (doShow, animSpeed) {
            Online.RightChannel.TagAlong.ShowHideElem('#viewCartJumpLink', doShow, animSpeed);
        },
        ShowHideMessage: function (message, animSpeed) {
            var tagAlongMessage = $('#tagAlongMessage');
            if (message) {
                tagAlongMessage.text(message);
            }
            Online.RightChannel.TagAlong.ShowHideElem(tagAlongMessage, message, animSpeed);
        },
        Show: function (message, animSpeed) {
            var itemsInCart = Online.RightChannel.TagAlong.CountCartItems() > 0;
            if (!Online.RightChannel.TagAlong.IsLocked) {
                Online.RightChannel.TagAlong.ShowHideJumpLink(itemsInCart, animSpeed);
                Online.RightChannel.TagAlong.ShowHideMessage(message, animSpeed);
                Online.RightChannel.TagAlong.Place();
            }
            $('#topNavSubMenuInner .count').css({ display: itemsInCart ? 'block' : 'none' });
        },
        Suppress: function (doSuppress) {
            Online.RightChannel.TagAlong.SuppressOnScroll = true;
            $('#tagAlong')[doSuppress ? 'hide' : 'show'](0);
            if (!doSuppress) {
                Online.RightChannel.TagAlong.Place();
            }
            Online.RightChannel.TagAlong.IsLocked = doSuppress;
        },
        Place: function () {
            var rhc = document.getElementById('rightChannel'),
                upsell = document.getElementById('bannerModule'),
                tagAlong = document.getElementById('tagAlong');
            if (tagAlong) {
                tagAlong.style.top = Math.max(rhc.offsetHeight + rhc.offsetTop + (upsell ? upsell.offsetHeight : 0) + 20, (document.documentElement.scrollTop || document.body.scrollTop)) + 'px';
            }
        },
        OnClickJumpLink: function (e) {
            e && e.preventDefault();
            Online.RightChannel.TagAlong.SuspendOnScroll = true;
            var cartControl = $('#yourCart > h3');
            if (cartControl.hasClass('closed')) {
                Online.RightChannel.OnClickToggleSection.call(cartControl, e);
            }
            $('html, body').animate({ scrollTop: $('#yourCart').offset().top }, 500, function () {
                Online.RightChannel.TagAlong.SuspendOnScroll = false;
                Online.RightChannel.TagAlong.Place();
            });
        },
        OnScroll: function (e) {
            if (!Online.RightChannel.TagAlong.SuspendOnScroll) {
                Online.RightChannel.TagAlong.Place();
            }
        },
        Init: function () {
            $('#viewCartJumpLink').monobind('click', Online.RightChannel.TagAlong.OnClickJumpLink);
            $(window).monobind('scroll', Online.RightChannel.TagAlong.OnScroll);
            var rhc = $('#rightChannel');
            if (rhc.length > 0) {
                if (rhc.hasClass('closed')) {
                    Online.RightChannel.TagAlong.Suppress(true);
                }
                $('#tagAlong').css('display', 'block').find('#viewCartJumpLink, #tagAlongMessage').css('display', 'none');
                Online.RightChannel.TagAlong.Show(null, 0);
            }
        }
    },
    ContentOriginalHeight: null,
    SetContentHeight: function (status) {
        if ($('.wideCol').length > 0 || $('#wrapperHeroBg').length > 0 || $('#ie6').length > 0) {
            var content = $('.contentWrap'),
                rhcWrap = $('.rightChannelWrap');
            if (status == 'open') {
                Online.RightChannel.ContentOriginalHeight = content.height();
                content.height(Math.max(rhcWrap.height(), content.height()));
            }
            else {
                content.css('height', null);
            }
        }
    },
    GetRightChannelStatus: function (rhc) {
        rhc = $(rhc);
        return rhc.hasClass('closed') ? 'closed' : 'open';
    },
    Init: function (context) {
        context = $(context || '#rightChannel');
        var wrap = $('.rightChannelWrap');
        var curUrl = window.location.href;
        if (curUrl.contains('product/index.jsp')) {
            $('#rightChannel').removeClass('closed');
        }
        if (!curUrl.contains('index.jsp') && !curUrl.contains('account.jsp')) {
            $('#rightChannel').addClass('locked');
        }
        //      if (!context.hasClass('locked')) {
        //          wrap.siblings('#topNavSubMenu').monobind('click', Online.RightChannel.OnClickToggleOpen);
        //      }
        Online.RightChannel.SetContentHeight(Online.RightChannel.GetRightChannelStatus(wrap.find('#rightChannel')));
        wrap.find('#topNavSubMenu').monobind('click', Online.RightChannel.OnClickToggleOpen);
        context.delegate('.section h3', 'click', Online.RightChannel.OnClickToggleSection);
        context.delegate('.changeStore,.changeEatingStyle,.addStore,.changeLocation,.addAddress', 'click', Online.RightChannel.OnClickChangeLocation);
    }
};

Online.Cart = {
    Ajax: function (url, action, amt, callback) {
        if (!Online.Cart.IsAjaxing) {
            Online.Cart.IsAjaxing = true;
            Online.SyncAjax({
                url: url,
                success: function (response) {
                },
                complete: function () {
                    Online.Cart.IsUpdating = false;
                    Online.Cart.IsAjaxing = false;
                    Online.Cart.DetectUserIntent = false;
                }
            });
        }
    },
    IsAjaxing: false,
    SetSpinnerValues: function (content) {
        var forms = content.find('.selectedProduct');
        for (var i = 0; i < forms.length; i++) {
            var form = $(forms[i]),
                val = form.attr('data-quantity'),
                spinner = form.find('.spinner');
            spinner.val(val);
        }
    },
    MessageArray: [],
    ShowMessage: function (message, slideTimeOut) {
        var status = $('.cartStatus'),
            hasMessage = status.data('hasMessage');
        if (hasMessage) {
            Online.Cart.MessageArray.push(message);
        }
        else {
            slideTimeOut = slideTimeOut == undefined ? 500 : slideTimeOut;
            status.data('hasMessage', true);
            status.find('span').html(message);
            status.slideDown(slideTimeOut, function () {
                setTimeout(function () {
                    //Online.RightChannel.TagAlong.ShowHideMessage(false);
                    if (Online.Cart.MessageArray.length) {
                        var nextMessage = Online.Cart.MessageArray.shift();
                        status.data('hasMessage', false);
                        Online.Cart.ShowMessage(nextMessage);
                    }
                    else {
                        //var comboBoxOption = $('.comboBoxOptions');
                        //Rf.ComboBox.OpenCombos.forEach(function(comboBoxOption) { comboBoxOption.Close(); });
                        status.slideUp(500, function () {
                            $(this).data('hasMessage', false);
                            $('.cartStatus').hide();
                            //Online.RightChannel.TagAlong.Place();
                        });
                    }
                }, 2500);
            });
            //Online.RightChannel.TagAlong.Show(message);
        }
    },
    Alert: function (action, article) {
        var subject = 'item',
            direction = 'to',
            verb = 'was',
            message;
        if (article > 1 || article == 'All') {
            subject = 'items';
            verb = 'were';
        }
        else {
            article = 'An';
        }
        switch (action) {
            case 'removed':
                direction = 'from';
                break;
            case 'updated':
                direction = 'in';
                break;
        }
        message = article + ' ' + subject + ' ' + verb + ' ' + action + ' ' + direction + ' your cart.';
        Online.Cart.ShowMessage(message);
        return message;
    }, AddItemToCart: function (product) {
        if (!product || !product.productId) {
            return;
        }

        var cartData = Online.Cart.GetData();

        if (product == Online.Order.Update(product)) {
            //为新产品
            product.seq = Online.Order.NewSeq();
            if (cartData.orderItemList == null || typeof cartData.orderItemList == 'string') {
                cartData.orderItemList = [];
            }
            !product.quantity && (product.quantity = 1);

            cartData.orderItemList.push(product);
        }

        Online.Cart.ShowMessage('订购产品成功'.t());

        cartData.version++;
        Online.Cart.OnUpdate(cartData);
    }, OnUpdate: function (cartData) {
        if (!cartData) {
            cartData = Online.Cart.GetData();
        }

        Online.Order.Save(cartData.orderItemList);

        cartData.orderHeader.totalAmount = Online.Order.GetTotalAmount();
        cartData.orderHeader.totalProductQuantity = 0;
        for (var i = 0 ; i < cartData.orderItemList.length; i++) {
            cartData.orderHeader.totalProductQuantity += parseInt(cartData.orderItemList[i].quantity);
        }

        Online.Cart.Render(cartData);

        Online.Cart.SetData(cartData);
    }, OnRefresh: function (force) {//刷新购物车地址和产品列表
        //Online.Cart.SyncProducts();
    }, Render: function (cartData) {
        if (cartData.orderHeader.totalProductQuantity < 1) {
            $('#yourCart').hide();
            //$('#cartContentWrapper a.checkout').addClass('disabled');
        } else {
            $('#yourCart').show();
        }
        $('#topNavCount').html(cartData.orderHeader.totalProductQuantity);
        if (cartData.orderHeader.totalProductQuantity > 0) {
            $('#topNavSubMenuInner .count').show();
        } else {
            $('#topNavSubMenuInner .count').hide();
        }
        $('#cartContentWrapper form.lineItemForm').remove();

        var productTotal = parseFloat(cartData.orderHeader.totalAmount - cartData.orderDelivery.amount).toFixed(2);
        var deliveryFee = cartData.orderDelivery.amount;
        var orderTotal = parseFloat(cartData.orderHeader.totalAmount).toFixed(2);

        var needDeliveryChargeAmount = $.cookies.get('needDeliveryChargeAmount');
        if (needDeliveryChargeAmount && productTotal >= needDeliveryChargeAmount) {
            deliveryFee = 0;
            orderTotal = productTotal;
            cartData.orderHeader.totalAmount = orderTotal;
        }
        $('#productTotal span').html('¥' + productTotal);
        $('#deliveryFee span').html('¥' + deliveryFee);
        $('.orderTotal span').html('¥' + orderTotal);
        if ("yes" == Online.Cookie.getIsCarryOut()) {
            $("#deliveryFee").hide();
        }

        if (!cartData.orderItemList) {
            return;
        }

        $('.orderTotalWrap').before($("#cartProductTemplate").
            render(cartData.orderItemList));
        $.each(cartData.orderItemList, function (i, n) {
            if (n && (typeof n != 'function')) {
                var cartContainer = $('#cart-item-' + n.seq);
                cartContainer.data('product', n);
                var dd = cartContainer.find('.descriptionList dd');
                var content = $.trim(dd.html());
                if (content.endWith(',')) {//去掉套餐产品描述最后一个多出的,
                    dd.html(content.substr(0, content.length - 1));
                }
            }
        });
    }, SetData: function (cartData) {//从cookie中获取购物车数据
        Online.Order.Save(cartData.orderItemList);
        delete cartData.orderItemList;
        var ca = $.cookies.get('cartData');
        if (ca && ca.version > cartData.version) {
            cartData.version = ca.version;
        }
        $.cookies.set('cartData', cartData, Online.Cookie.GetExpireTime(2));
    }, GetData: function (fromServer) {//从cookie中获取购物车数据
        var result = $.cookies.get('cartData');
        if (!result || !result.orderHeader) {
            result = { 'orderHeader': { 'language': window.lang == CONSTANTS.LANGUAGE.ENGLISH ? '英文' : '中文' } };
        }

        result.orderItemList = Online.Order.Load(fromServer);

        result.orderDelivery = { amount: Online.Order.GetDeliveryFee() };
        result.orderHeader.totalAmount = result.orderDelivery.amount;

        return result;
    }, ClearData: function () {// clearn all cart data
        Online.Order.Clear();
        var cd = $.cookies.get('cartData');
        cd.orderHeader.totalAmount = cd.orderDelivery.amount = Online.Order.GetDeliveryFee();
        delete cd["estimatedDeliveryTime"];
        delete cd["orderCouponList"];
        delete cd["orderDiscount"];
        Online.Cart.SetData(cd);
    },
    IsSubmitting: false,
    OnClickDelete: function (e) {
        e && e.preventDefault();
        var form = $(e.target).parents('.selectedProduct:first');
        var product = form.data('product');
        if (!product) {
            return;
        }
        Online.Order.RemoveBySeq(product.seq);
        Online.Cart.OnUpdate();
    },
    OnChangeQuantity: function (e) {
        e && e.preventDefault();
        var form = $(e.target).parents('.selectedProduct:first'),
            productId = form.find('input[name=productId]:first').val(),
            qtyInput = form.find('input.spinner'),
            qty = parseInt(qtyInput.val(), 10),
            originalValue = parseInt(qtyInput.data('originalValue'), 10);

        var newVal = qty > 0 ? qty : originalValue;
        if (newVal > 9999) {
            return;
        }
        if (!$(e.target).hasClass('spinner')) {
            var creaseVal = $(e.target).hasClass('incrementButton') ? 1 : -1;
            newVal = parseInt(newVal, 10) + creaseVal;
        }
        if (newVal < 1) {
            newVal = 1;
        }
        qtyInput.val(newVal);
        var cartProductData = form.data('product');
        if (cartProductData) {
            cartProductData.quantity = newVal;
            //cartProductData.amount = (cartProductData.quantity)*cartProductData.unitPrice;
            //form.data('product',cartProductData);
            //form.find('.itemPrice').html('&yen;'+ cartProductData.amount);
        }
        var product = Online.Order.FindBySeq(cartProductData.seq);
        Online.Order.Update(product);
        Online.Cart.OnUpdate();
    },
    OnFocusSpinnerInput: function (e) {
        var control = $(e.target).parents('.selectedProduct:first').find('input.spinner');
        control.data('originalValue', control.val());
    },
    OnKeyDownQuantitySpinner: function (e) {
        e = e || window.event;
        var code = e.which ? e.which : e.keyCode;
        var form = $(e.target).parents('form:first');
        var originalValue = parseInt($(e.target).val(), 10);
        if (originalValue > 0) {
            $(e.target).data('originalValue', $(e.target).val());
        } else {
            $(e.target).data('originalValue', 1);
        }
        if (code < 48 || code > 57) {
            if (code == 38) { //up
                form.find('.spinnerWrapper .incrementButton').trigger('click');
            } else if (code == 40) { //down
                form.find('.spinnerWrapper .decrementButton').trigger('click');
            } else if (code == 13) { //enter
                var nextSpinner = form.next().find('input.spinner');
                if (nextSpinner.length > 0) {
                    nextSpinner.focus();
                }
                return false;
            } else if (code == 8 || code == 37 || code == 39 || (code >= 96 && code <= 105)) {
                return true;
            } else {
                window.event ? e.returnValue = false : e.preventDefault();
                return false;
            }
        }
    },
    OnShowCartErrors: function () {
        if ($('#cartErrorContent .errors').length > 0) {
            var errorContent = $('#cartErrorContent');
            errorContent.slideDown();
        }
    },
    OnAcceptClearCart: function (e) {
        e && e.preventDefault();
        var cartData = Online.Cart.GetData();
        cartData.orderItemList = [];
        cartData.version++;
        Online.Cart.OnUpdate(cartData);
        Online.Order.Clear(Online.Order.NeedSyncToServer());
    },
    OnClickClearCartLink: function (e) {
        e && e.preventDefault();
        if ($('#cartContentWrapper .selectedProduct').length == 0) {
            return false;
        }
        Online.showConfirmDialog($.t('清空购物车'),
            { "content": $.t("该操作将删除购物车中的全部产品，确认清空?"), "yes": $.t("确认"), "no": $.t("取消") },
            { "yes": Online.Cart.OnAcceptClearCart });
    },
    DealsAllowed: null,
    BuildSubmitInfo: function (cartData) {//TODO: 生成提交数据
        if (!cartData) {
            return cartData;
        }
        if (!cartData.orderItemList) {
            cartData.orderItemList = Online.Order.Load(Online.Order.NeedSyncToServer());
        }
        cartData.orderHeader.totalProductQuantity = 0;
        for (var i = 0; i < cartData.orderItemList.length; i++) {
            cartData.orderHeader.totalProductQuantity += cartData.orderItemList[i].quantity;
            var orderItem = cartData.orderItemList[i];
            delete orderItem.comments;
            orderItem.amount2 = orderItem.amount;
            //orderItem.netPrice = orderItem.amount;//TODO: 去掉OrderItem的NetPrice值
            orderItem.order_item_name = orderItem.productName;
            if (!orderItem.unitPrice && orderItem.amount) {
                orderItem.unitPrice = orderItem.amount / orderItem.quantity;
            }
            if (!orderItem.orderSubitem || orderItem.orderSubitem.length == 0) {
                //单品需要将自己加到资产品列表中
                orderItem.orderSubitem = new Array();
                orderItem.orderSubitem.push(Online.Order.BuildAtomProductSubItem(orderItem));
            }
            Online.Order.FormatSubItem(orderItem);
            orderItem.netSales = Online.Order.calculateNetSales2(orderItem);
            //orderCouponList
            //orderDiscount
        }
        cartData.orderDelivery = Online.Order.BuildDeliverySubItem();
        // var address = Online.Cookie.GetAddressInfo();
        var address = DeliveryAddress.getAddress();
        cartData.orderHeader.deliveryAddress = DeliveryAddress.toString(true, address, true);
        if ($.cookies.get('userId') == null) {//匿名用户不保存送餐地址
            delete cartData.orderHeader['deliveryAddressId'];
        }
        cartData.orderHeader.language = (lang == CONSTANTS.LANGUAGE.ENGLISH ? '英文' : '中文');
        cartData.orderHeader.salesChannelEnumId = CONSTANTS.SALESCHANNEL.ONLINE;
        cartData.orderHeader.grossAmount = cartData.orderHeader.totalAmount;
        cartData.postalAddress = Online.Cookie.GetAddress();
        if (cartData.postalAddress && !cartData.postalAddress.city) {
            cartData.postalAddress.city = $.cookies.get('city');
        }
        return encodeURIComponent(JSON.stringify(cartData).trim());
    }, AddOrders: function (orderItemList, eatingStyleId) {
        //start add by wangll
        if (null != eatingStyleId) {
            switch (eatingStyleId) {
                case '701':  //订单类型为外带情况
                    if ("no" == Online.Cookie.getIsCarryOut()) {
                        Online.Alert('提示', '该订单类型与当前就餐类型不一致！');
                        return;
                    }
                    break;
                case '702':  //订单类型为外送情况
                    if ("yes" == Online.Cookie.getIsCarryOut()) {
                        Online.Alert('提示', '该订单类型与当前就餐类型不一致！');
                        return;
                    }
                    break;
            }
        }
        //end add by wangll
        if ($.type(orderItemList) == 'string') {
            orderItemList = JSON.parse(decodeURIComponent(orderItemList));
        }

        var callback = function () {
            for (var i = 0 ; i < orderItemList.length; i++) {
                if (orderItemList[i]) {
                    orderItemList[i].orderDiscount = null;
                    orderItemList[i].seq = null; //将需要添加到购物车中产品的seq清空，以免影响现在产品的seq.
                    if (orderItemList[i].mealTypeId == CONSTANTS.MealType.DANPIN) {
                        delete orderItemList[i].orderSubitem;
                    }
                    Online.Cart.AddItemToCart(orderItemList[i]);
                }
            }
            Online.Order.Save(Online.Order.Load(), true);
            var channel = $('#rightChannel'),
                content = channel.find('#channelContent'),
                isClosed = channel.hasClass('closed'),
                isAnimating = content.data('isAnimating');
            if (isClosed && !isAnimating) {
                content.data('isAnimating', true);
                content.slideDown(1000, function () {
                    content.slideUp(550, function () {
                        $(this).data('isAnimating', false);
                        Online.RightChannel.SetContentHeight('closed');
                        channel.addClass('closed');
                    });
                });
                //                Online.RightChannel.Toggle();
                //                setTimeout(function(){
                //                    Online.RightChannel.Toggle();
                //                }, 1500);
            }
        }
        Online.Auth.LoginByPartyId(false, callback);
    }, changeContact: function (c, i) {
        if (Online.Cookie.getEatingStyleEnumId() != c['eatingStyleEnumId']) {
            Online.Cart.OnAcceptClearCart();
        }
        //如果当前选择的地址与上次地址一样则不重新刷新页面
        if (Online.Cookie.GetAddressId() && (Online.Cookie.GetAddressId() != c.postalAddress.deliveryAddressId)) {
            //start add by wangll
            Online.Cookie.setEatingStyleEnumId(c['eatingStyleEnumId']);
            Online.Cookie.updateCartOrderHeaderEatingStyleId(c['eatingStyleEnumId']);
            var carryoutStr = CONSTANTS.EatingStyle.TAKEOUT + "";
            // alert("c['eatingStyleEnumId']:" + c['eatingStyleEnumId'] + ",carryoutStr: " + carryoutStr + (carryoutStr == c['eatingStyleEnumId']));
            if (carryoutStr == c['eatingStyleEnumId']) {
                Online.Cookie.setIsCarryOut("yes");
                var store = new Object();
                store.productStoreId = c['productStoreId'];
                store.storeName = c.postalAddress['business'];
                store.address = c['storeAddress'];
                Online.Cookie.setStoreInfo(store);
                $(".addStore").show();
            } else {
                Online.Cookie.setIsCarryOut("no");
            }
            //end add by wangll
            // window.location.href.contains('product/index.jsp') && window.location.reload();
            window.location.reload();
        }

        if (i && c.orderContactInfoId == i.orderContactInfoId) {
            //c.contactPerson = i.contactPerson;  //TODO by wangll(导致订单提交第二屏用户信息无法被带入)
            c.telecomNumber = i.telecomNumber;
        }
        Online.LocationForm.SaveContactToLocal(c);
    }, Init: function (context) {
        context = $(context || document.body);
        if (window.location.href.indexOf('checkout') < 0) {
            var cartData = Online.Cart.GetData(Online.Order.NeedSyncToServer());
            Online.Cart.OnUpdate(cartData);
            Online.LocationForm.SyncContactInfo($('#yourAddress'));
            $('select#locationPicker').live('change', function (e) {
                var i = Online.LocationForm.LoadContactFromLocal();//initial contact info
                var select = $(this);
                var option = $(this).find('option:selected');
                var c = option.data('contact');// current contact info

                if (Online.Cookie.getChangeAddressJspParam() == CONSTANTS.LANCH_MODEL_TYPE.CHANGE_EATING_STYLE
                    || Online.Cookie.getChangeAddressJspParam() == CONSTANTS.LANCH_MODEL_TYPE.SELECT_PICKER_CHANGE
                     ) {
                    Online.Cookie.Del("changeAddressJspParam");
                    Online.Cart.changeContact(c, i);
                } else if (Online.Cookie.getEatingStyleEnumId() != c['eatingStyleEnumId']
                        && window.location.href.contains('product/index.jsp')
                        && i.postalAddress.deliveryAddressId != c.postalAddress.deliveryAddressId) {
                    Online.showConfirmDialog('提示'.t(), '切换外送外带后购物车将被清空，确认切换？'.t(),
                        function () {
                            Online.Cart.OnAcceptClearCart();
                            Online.Cart.changeContact(c, i);
                        },
                        function () {
                            select[0].value = i.orderContactInfoId + "";
                            window.location.reload();
                        });
                } else {
                    Online.Cart.changeContact(c, i);
                    //add by lis start
                    if ($("#productCategory").length > 0) {
                        var sumeCity = false;
                        var list = Online.LocationForm.Contacts;
                        for (var j = 0; j < list.length; j++) {
                            if (list[j].postalAddress.city == $.cookies.get("city")) {
                                sumeCity = true;
                            }
                        }
                        if (sumeCity) {
                            $.cookies.set("city", c.postalAddress.city);
                            $("#showCity").html(c.postalAddress.city);
                        } else {
                            $.cookies.set("addCityAddress", "addCityAddress");
                            window.location.href = baseUrl + "/yhkonline/account/account.jsp";
                        }
                    }
                    //add by lis start
                }
            });

            $('#yourCart .checkout').click(function () {
                var orderItemList = Online.Order.Load();
                var ordersNotPresents = $.grep(orderItemList, function (n, i) {//礼品
                    return n.productId < 4114 || n.productId > 4118;
                });
                if ("no" == Online.Cookie.getIsCarryOut()) {
                    if (!$.cookies.get('estimatedDeliveryDate')) {
                        Online.RightChannel.OnClickChangeLocation();
                        return false;
                    }
                }
                if (ordersNotPresents.length == 0) {
                    Online.Alert('友情提示'.t(), '购物车中至少应该有一个以上非礼品'.t());
                    return false;
                }
                if (Online.Order.NeedSyncToServer()) {
                    //IE8以下将购物车产品提交到服务器
                    return Online.Order.Save(orderItemList, true);
                }
            });
            context.delegate('.lineItemForm .spinnerWrapper .spinner',
                {
                    'keydown': Online.Cart.OnKeyDownQuantitySpinner,
                    'keyup': Online.Cart.OnChangeQuantity,
                    'blur': Online.Cart.OnChangeQuantity,
                    'focus': Online.Cart.OnFocusSpinnerInput
                });
        }
        context.delegate('.lineItemForm .spinnerWrapper .incrementButton, .lineItemForm .spinnerWrapper .decrementButton',
            { 'click': Online.Cart.OnChangeQuantity, 'mousedown': Online.Cart.OnFocusSpinnerInput });
        //.monobind('mousedown', Online.Cart.OnFocusSpinnerInput);
        //context.find('form .productCta, form .customizeBtn').monobind('click', Online.Cart.OnClickProductCta);
        //context.find('form.productForm').monobind('submit', Online.Cart.OnClickProductCta);
        context.delegate('.closer', 'click', Online.Cart.OnClickDelete);
        context.delegate('.remove', 'click', Online.Cart.OnClickDelete);
        context.delegate('.removeDeal', 'click', Online.Cart.OnClickDelete);
        context.delegate('#clearCartLink', 'click', Online.Cart.OnClickClearCartLink);
        //context.find('.containsVisualPromoRHC').bind('click', Online.PromoCode.OnClickVisualPromo);
        //context.find('#papaRewardsEnrollRHC').click(Online.Cart.OnClickPapaRewardsEnrollRHC);
        //context.find('.lineItemForm').monobind('submit', Online.Cart.OnSubmitChangeQuantity);
        context.delegate('.detail', 'click', Online.RightChannel.OnClickViewDetail);
        //context.find('#saveAsFave .save').monobind('click', Online.Cart.OnClickSaveAsFave);
        //context.find('.containsDeal').bind('click', Online.Cart.OnClickDealItem);
        //context.find('.commPrefChanged').bind('click', Online.Cart.OnClickPrefChanged);
        //$('#cartContentWrapper').hasClass('dealsAllowed-false') ? Online.Cart.SetDealsNotAllowed() : Online.Cart.SetDealsAllowed();
        //Online.Cart.InitSaveAsFaveForm(context);
        //Online.Cart.SetSpinnerValues(context);
        Online.Cart.OnShowCartErrors();
    }
};
Online.Order = {//订单管理对象
    Data: null,
    NeedSyncToServer: function () {//是否需要同步产品数据到服务器
        return true;
        //return $.browser.msie && parseInt($.browser.version, 10) < 8;
    }, BuildProductPriceSelect: function () {
        //alert(lang);
        var c = { salesChannelEnumId: CONSTANTS.SALESCHANNEL.ONLINE, language: CONSTANTS.LANGUAGE.ENGLISH };
        //c.eatingStyleEnumId =  Online.Cookie.getEatingStyleEnumId();
        var eatingStyleIdFromCookie = Online.Cookie.getEatingStyleEnumId();
        if (null != eatingStyleIdFromCookie) {
            c.eatingStyleEnumId = eatingStyleIdFromCookie;
        } else {    //默认为外送
            c.eatingStyleEnumId = CONSTANTS.EatingStyle.DELIVERY;
            Online.Cookie.setEatingStyleEnumId(CONSTANTS.EatingStyle.DELIVERY);
        }
        //修改人:chenfy 获取门店id直接从送餐地址对象中取，不需要区分就餐类型 start
        /*if( !(Online.Cookie.getIsCarryOut() == "no")) {    //外带或堂食
             var storeInfo = Online.Cookie.getStoreInfo();
             if(null != storeInfo) {
                 c.productStoreId = storeInfo.productStoreId;
             }
         }*/
        var address = DeliveryAddress.getAddress();
        if (address) {
            c.productStoreId = address.productStoreId ? address.productStoreId : 1;
        }
        //修改人:chenfy 获取门店id直接从送餐地址对象中取，不需要区分就餐类型 start

        var selectDate = $.cookies.get("estimatedDeliveryDate");
        if (selectDate && selectDate.length > 8) {
            c.estimatedDeliveryDate = selectDate.replaceAll('-', '');
        }
        return c;
    }, Load: function (fromServer, callBack) {
        var isIE7 = $.browser.msie && $.browser.version == 7.0;
        var isIE6 = $.browser.msie && $.browser.version == 6.0;
        if (Online.Order.Data && Online.Order.Data.length > 0) {
            return Online.Order.Data;
        }

        if (fromServer) {
            Online.Order.Data = false;
            Online.SyncAjax({
                type: "GET",
                url: baseUrl + '/api/mc/cart/all.json',
                data: Online.Order.BuildProductPriceSelect(),
                cache: false,
                dataType: "json",
                error: function () {
                    Online.Alert('提示'.t(), '抱歉, 网络故障，请稍后重试'.t());
                },
                success: function (response) {
                    if (response && response.success) {
                        var cartData = Online.Cart.GetData(false);
                        Online.Cookie.Save('orderTelphone', response.result.orderHeader.contactPhone);
                        if (cartData.version < response.result.version) {
                            Online.Order.Data = response.result.orderItemList;
                            Online.Cookie.Save('order', Online.Order.Data);
                        }
                        if (isIE7) {
                            Online.Order.Data = response.result.orderItemList;
                            Online.Cookie.Save('order', Online.Order.Data);
                        }
                        if (isIE6) {
                            Online.Order.Data = response.result.orderItemList;
                            Online.Cookie.Save('order', Online.Order.Data);
                        }
                        cartData = response.result;
                        delete cartData.orderItemList;
                        $.cookies.set('cartData', cartData, Online.Cookie.GetExpireTime(2));
                        if (!Online.Order.Data || Online.Order.Data.length == 0) {
                            Online.Order.Data = Online.Cookie.Get('order');
                        }
                        if (!Online.Order.Data) {
                            Online.Order.Data = [];
                        }
                        if (callBack) {
                            callBack(Online.Order.Data);
                        }
                    }
                }
            });
        }
        if (!Online.Order.Data || Online.Order.Data.length == 0) {
            Online.Order.Data = Online.Cookie.Get('order');
        }
        if (!Online.Order.Data) {
            Online.Order.Data = [];
        }
        return Online.Order.Data;
    },
    Save: function (orders, toServer) {
        Online.Order.Data = orders;
        Online.Cookie.Save('order', Online.Order.Data);
        if (toServer) {
            var result = false;
            var c = Online.Order.BuildProductPriceSelect();
            c.orders = encodeURIComponent(JSON.stringify(Online.Order.Data));
            Online.SyncAjax({
                type: "POST",
                url: baseUrl + '/api/mc/cart/save.json',
                data: c,
                dataType: "json",
                error: function () {
                    Online.Alert('提示'.t(), '抱歉, 网络故障，请稍后重试'.t());
                },
                success: function (response) {
                    result = response && response.success;
                    if (result) {
                        Online.Cookie.Save('order', response.result.orderItemList);
                        Online.Cart.Render(response.result);
                    }
                }
            });
            return result;
        }
        return true;
    }, Clear: function (toServer) {
        Online.Cookie.Del('order');
        if (toServer) {
            var result = true;
            //Online.SyncAjax({
            //    type: "POST",
            //    url: baseUrl +'/api/mc/cart/clear.json',
            //    cache: false,
            //    dataType: "json",
            //    error: function(){
            //        Online.Alert('提示'.t(),'抱歉, 网络故障，请稍后重试'.t());
            //    },
            //    success: function(response){
            //        result = response && response.success;
            //    }
            //});
            return result;
        }
        return true;
    }, GetTotalQuantity: function () {
        var data = Online.Order.Load();
        var result = 0;
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                result += parseInt(data[i].quantity);
            }
        }
        return result;
    }, GetTotalAmount: function () {//获取产品总价，包括外卖费
        var data = Online.Order.Load();
        var totalAmount = Online.Order.GetDeliveryFee();
        var netAmount = 0;
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                totalAmount += data[i].amount;
                if (data[i].mealTypeId == CONSTANTS.MealType.DANPIN || data[i].mealTypeId == CONSTANTS.MealType.UNFIXED) {
                    netAmount += data[i].amount;
                }
                var j = 0;
                if (data[i].orderCouponList) {
                    for (j = 0; j < data[i].orderCouponList.length; j++) {
                        totalAmount += data[i].orderCouponList[j].amount;
                    }
                }
                if (data[i].orderDiscount) {
                    totalAmount += data[i].amount * (data[i].orderDiscount.percentage - 1);
                }
            }
        }
        var cd = $.cookies.get('cartData');
        if (cd) {
            if (cd.orderCouponList) {
                for (j = 0; j < cd.orderCouponList.length; j++) {
                    totalAmount += cd.orderCouponList[j].amount;
                }
            }
            if (cd.orderDiscount) {
                totalAmount += netAmount * (cd.orderDiscount.percentage - 1);
            }
        }

        return totalAmount.toFixed(2);
    }, FindById: function (pid) {//根据产品ID从购物车中查找相应产品
        var data = Online.Order.Load();
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                if (data[i] && pid == data[i].productId && !data[i].orderDiscount) {
                    return data[i];
                }
            }
        }
        return null;
    }, FindBySeq: function (seq) {//根据产品ID从购物车中查找相应产品
        if (!seq) {
            return null;
        }
        var data = Online.Order.Load();
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                if (data[i] && seq == data[i].seq) {
                    return data[i];
                }
            }
        }
        return null;
    }, Remove: function (product) {
        if (!product) {
            return;
        }
        var data = Online.Order.Load();
        $.removeFromArray(product, data);//data.remove(product);
        Online.Order.Save(data);
    }, RemoveBySeq: function (seq, toServer) {
        var product = Online.Order.FindBySeq(seq);
        Online.Order.Remove(product);
        var result = Online.Order.Load();
        var c = Online.Order.BuildProductPriceSelect();
        c.seq = seq;
        if (toServer) {
            Online.SyncAjax({
                type: "POST",
                url: baseUrl + '/api/mc/cart/delete.json',
                data: c,
                dataType: "json",
                error: function () {
                    Online.Alert('提示'.t(), '抱歉, 网络故障，请稍后重试'.t());
                },
                success: function (response) {
                    if (response && response.success) {
                        result = response.result.orderItemList;
                        delete response.result.orderItemList;
                        $.cookies.set('cartData', response.result);
                    }
                }
            });
            return result;
        }
        return result;
    }, NewSeq: function () {//生成最新的seq值
        var data = Online.Order.Load();
        var result = 1;
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                if (data[i] != undefined && data[i].seq > result) {
                    result = data[i].seq;
                }
            }
            result++;
        }
        return result;
    }, Update: function (product) {//修改产品,目前只有套餐产品存在修改
        var initProduct = Online.Order.FindBySeq(product.seq);

        if (initProduct) {//套餐，更新子产品并按照产品数量更新价格
            initProduct.seq = Online.Order.NewSeq();
            initProduct.productId = product.productId;
            initProduct.productName = product.productName;
            initProduct.unitPrice = product.unitPrice;
            initProduct.amount = product.amount;
            initProduct.code = product.code;
            //Online.Order.Remove(initProduct);
            //product.seq = Online.Order.NewSeq();
            //initProduct = product;

            if (initProduct.mealTypeId == CONSTANTS.MealType.DANPIN || initProduct.isDirectMeal) {//单品直接更新数量和总价
                if (initProduct !== product) {
                    initProduct.quantity = initProduct.quantity + product.quantity;
                }

                initProduct.amount = initProduct.quantity * product.unitPrice;
                if (initProduct.orderSubitem) {
                    $.each(initProduct.orderSubitem, function (i, n) {
                        n.quantity = initProduct.quantity * n.unitQuantity;
                        n.amount = n.quantity * n.unitPrice;
                    });
                }
                return initProduct;
            } else if (initProduct.mealTypeId == CONSTANTS.MealType.UNFIXED ||
                initProduct.mealTypeId == CONSTANTS.MealType.FIXED_PRICE) {
                initProduct.quantity = product.quantity;
                initProduct.orderSubitem = product.orderSubitem;
                if (product.quantity == 1) {//修改套餐
                    initProduct.seq = Online.Order.NewSeq();
                }
                var calculateAmount = 0;
                $.each(initProduct.orderSubitem, function (i, n) {
                    n.quantity = product.quantity * n.unitQuantity;
                    n.amount = n.quantity * n.unitPrice;
                    calculateAmount += n.amount;
                });
                if (initProduct.mealTypeId == CONSTANTS.MealType.UNFIXED) {
                    initProduct.amount = calculateAmount;
                    initProduct.unitPrice = initProduct.amount / initProduct.quantity;
                } else {
                    initProduct.amount = initProduct.quantity * product.unitPrice;//非固定价格套餐可能在修改子产品之后单品价格有更新，需要重新计算总价
                }
                return initProduct;
            }
        } else if (!(product.mealTypeId == CONSTANTS.MealType.UNFIXED ||
            product.mealTypeId == CONSTANTS.MealType.FIXED_PRICE)) {//单品,只需要更新数量和总价
            initProduct = Online.Order.FindById(product.productId);

            if (null != initProduct && null != initProduct.orderCouponList && initProduct.orderCouponList.length > 0) {
                return product;
            }
            if (initProduct) {
                initProduct.quantity = initProduct.quantity + product.quantity;
                initProduct.amount = (initProduct.quantity) * initProduct.unitPrice;
                return initProduct;
            }
        }
        return product;
    }, FormatSubItem: function (product) {
        if (!product.orderSubitem) {
            return;
        }
        //product.orderSubitem = product.orderSubitem.filter(function(p){return p;});
        var discount = Online.Order.CalculateDiscount(product);
        var netSalesTmp = 0;
        for (var i = 0; i < product.orderSubitem.length; i++) {
            product.orderSubitem[i].seq = i + 1;
            //对应 mapping3
            //orderItem.orderSubitem[index].unitQuantity = orderItem.orderSubitem[index].quantity;
            product.orderSubitem[i].field1 = product.orderSubitem[i].unitQuantity;
            //对应 +/-
            //orderItem.field2 = orderItem.field2;
            //对应 HALF1/HALF2/WHOLE
            //orderItem.field3 = orderItem.field3;
            product.orderSubitem[i].parentQuantity = product.quantity;
            product.orderSubitem[i].levelQuantity = 1;//TODO: need confirm

            // 当产品类型为单品时，修改子产品的数量和订单金额 chenfy start
            if (product.mealTypeId == CONSTANTS.MealType.DANPIN) {
                product.orderSubitem[i].quantity = product.quantity;
                product.orderSubitem[i].amount = product.orderSubitem[i].quantity * product.orderSubitem[i].unitPrice;
            }

            // 修改子产品的数量和订单金额 chenfy end

            product.orderSubitem[i].productAssocQty = product.orderSubitem[i].quantity * product.quantity;
            Online.Order.SetSubItemNetSales(product.orderSubitem[i], discount);
            if (i < product.orderSubitem.length - 1) {
                netSalesTmp += product.orderSubitem[i].netSales;
            }
        }
        var length = product.orderSubitem.length - 1;
        if (length > 0 && (netSalesTmp + product.orderSubitem[length].netSales) != product.amount) {
            var netSales = parseFloat(product.amount - netSalesTmp).toFixed(2);
            product.orderSubitem[length].netSales = netSales;
            product.orderSubitem[length].netPrice = product.orderSubitem[length].netSales / product.quantity;
        }
    }, SetSubItemNetSales: function (subItem, discount) {
        var netSales = parseFloat((subItem.amount * discount).toFixed(2));
        subItem.netSales = netSales;
        subItem.netPrice = (netSales / subItem.parentQuantity).toFixed(2);// TODO: 目前无配料，二者一致
    }, CalculateDiscount: function (orderItem) {//计算套餐折扣，即子产品价格之和
        var amount = 0;
        if (orderItem.mealTypeId == CONSTANTS.MealType.DANPIN) {
            return 1;
        }
        if (orderItem.orderSubitem) {
            $.each(orderItem.orderSubitem, function (index, subItem) {
                amount += subItem.amount;
            });
        } else {
            amount = orderItem.amount;
        }
        return orderItem.amount / amount;//实际价格/原价
    }, //不包含配料的折扣金额
    calculateNetSales2: function (orderItem) {
        if (orderItem.mealTypeId == CONSTANTS.MealType.FIXED_PRICE) {
            return orderItem.amount;
        }
        if (orderItem.mealTypeId == CONSTANTS.MealType.UNFIXED) {
            return orderItem.amount;
        }
        var netSalesTmp = 0;
        $.each(orderItem.orderSubitem, function (index, subItem) {
            netSalesTmp += subItem.netSales;
        });
        return parseFloat(netSalesTmp);
    }, BuildAtomProductSubItem: function (orderItem) {
        var data = {};
        data.parentSeq = orderItem.seq;
        data.orderSubitemId = orderItem.orderSubitemId;
        data.productId = orderItem.productId;
        data.productName = orderItem.productName;
        data.uomId = orderItem.uomId;
        data.quantity = orderItem.quantity;
        data.unitPrice = orderItem.unitPrice;
        data.amount = orderItem.amount;
        data.seq = orderItem.seq;
        data.mealTypeId = orderItem.mealTypeId;
        data.netPrice = 0;//orderItem.netPrice;
        data.netSales = 0;//orderItem.amount;//TODO: orderItem.netSales;
        data.unitQuantity = 1;//orderItem.quantity;
        data.levelQuantity = 1;//orderItem.levelQuantity;TODO:单品赋值 为“1”。如果是套餐值为“1” (cc现在赋值的方式为：product.count ,)，如果是配料需要计算
        data.parentQuantity = orderItem.quantity;
        //对应 mapping3
        data.field1 = data.unitQuantity;
        //对应 +/-
        data.field2 = orderItem.field2;
        //对应 HALF1/HALF2/WHOLE
        data.field3 = orderItem.field3;
        data.allowModifier = orderItem.allowModifier;
        return data;
    }, BuildDeliverySubItem: function () {
        var orderItem = {
            "seq": 1000000,
            "productId": 1000000,
            "productName": '外卖费',
            "orderItemName": '外卖费',
            "unitPrice": Online.Order.GetDeliveryFee(),
            "amount": Online.Order.GetDeliveryFee(),
            "quantity": 1,
            "mealTypeId": 605,
            "netPrice": Online.Order.GetDeliveryFee(),
            "netSales": Online.Order.GetDeliveryFee(),
            "canChange": false
        };
        orderItem.netSales = orderItem.unitPrice; //外送费无折扣
        var subData = {
            "productId": orderItem.productId,
            "productName": orderItem.productName,
            "unitPrice": orderItem.unitPrice,
            "quantity": 1,
            "seq": 1,
            "mealTypeId": orderItem.mealTypeId,
            "netPrice": orderItem.unitPrice,
            "netSales": orderItem.unitPrice,
            "unitQuantity": 1,
            "levelQuantity": 1,
            "parentQuantity": 1,
            "amount": orderItem.amount,
            //对应 mapping3
            "field1": 1,
            //对应 +/-
            //"field2" : this.deliveryChange.field2,
            //对应 HALF1/HALF2/WHOLE
            "field3": "WHOLE",
            "allowModifier": orderItem.allowModifier,
            "isCalculateQuantity": 0
        };
        orderItem.orderSubitem = new Array();
        orderItem.orderSubitem.push(subData);
        return orderItem;
    }, IsProductValid: function (product) {//验证产品是否合法
        if (!product || !product.productName || !product.productId || !product.unitPrice || !product.quantity) {
            return false;
        }
        return true;
    }, FormatContactName: function (contactName) {//根据区域语言转化性别和称呼
        if (lang == 'en_US') {
            if (contactName.contains('先生')) {
                contactName = contactName.replace('先生', '');
                return 'Mr. ' + contactName;
            } else if (contactName.contains('女士')) {
                contactName = contactName.replace('女士', '');
                return 'Ms. ' + contactName;
            }
        } else {
            if (contactName.contains('Mr.')) {
                contactName = contactName.replace('Mr.', '');
                return contactName + '先生';
            } else if (contactName.contains('Ms.')) {
                contactName = contactName.replace('Ms.', '');
                return contactName + '女士';
            }
        }
        return contactName;
    }, GetDeliveryFee: function () {
        if ("no" == Online.Cookie.getIsCarryOut()) {   //外送
            var result = $.cookies.get("deliveryFee");
            if (result == null) {
                return CONSTANTS.DELIVERYFEE;
            }
            return result;
        } else {
            return 0;
        }
    }
}
Online.UserState.State = Online.UserStates.HOT;
Online.OnloadEvents.Register(function () {
    //switch (Online.UserState.State) {
    //    case Online.UserStates.WARM:
    //    case Online.UserStates.VERY_WARM:
    //    case Online.UserStates.HOT:
    //        Online.RightChannel.Init();
    //        Online.Cart.Init();
    //        Online.RightChannel.TagAlong.Init();
    //        break;
    //}
    //$('#topNavBtnSignOff').monobind('click', Online.Auth.SignOff);
}); if (!this.Online) var Online = {};
Online.Auth = {//页面授权相关
    IsAnonymousUser: function () {//是否匿名用户
        //modified by wangll
        //return !($.cookies.get('userId') || $.cookies.get('partyId'));
        return !($.cookies.get('userId'));
    },//根据party id 获取用户送餐地址，仅对登录用户有效
    LoginByPartyId: function (addressRedirectUrl, callback) {
        var condition = new Object();

        if (Online.Cookie.GetAddressId() != null) {
            condition.deliveryAddressId = Online.Cookie.GetAddressId();
        }
        condition.eatingStyleEnumId = Online.Cookie.getEatingStyleEnumId();
        Online.ajax({
            type: "GET",
            url: baseUrl + '/api/mc/sys/loginByClient.json',
            data: condition,
            statusCode: {
                404:
                    function () {
                        Online.Order.Clear(false);
                        window.location.href = addressRedirectUrl;
                    }
            },
            success: function (response) {
                if (response && response.success) {
                    //Online.Cookie.SetAddressInfo(response.result.deliveryAddressId, response.result.address1);
                    var address = DeliveryAddress.getAddress();
                    if (!address) {
                        if (response.result.postalAddress) {
                            address = response.result.postalAddress;
                            DeliveryAddress.save(address);
                        } else {//no address
                            Online.Order.Clear(false);
                            window.location.href = addressRedirectUrl;
                        }
                    }
                    if (response.result.productStoreId) {
                        address.productStoreId = response.result.productStoreId;
                    }
                    DeliveryAddress.save(address);
                    if (window.location.href.indexOf('checkout') < 0) {
                        var yourAddress = $('#yourAddress').show();
                        yourAddress.find('.deliveryAddress span').html(DeliveryAddress.toString());
                    }
                    DeliveryServiceTime.init(response.result);
                    var defaultDate = DeliveryServiceTime.getLatestTime(); //默认的预送达时间date
                    if (defaultDate) {
                        defaultDate = defaultDate.format('yyyy-MM-dd');
                        var cookieDate = $.cookies.get('estimatedDeliveryDate');
                        if (!cookieDate || (cookieDate && cookieDate < defaultDate)) {//cookie未设置预送达日期或者设置日期早于当前最早送餐日期，则重置
                            $.cookies.set('estimatedDeliveryDate', defaultDate);
                        }
                    }

                    if (callback) {
                        callback(address.productStoreId);
                    }
                } else {
                    $.cookies.del('estimatedDeliveryDate');
                    //如果当前送餐地址信息不为空，则弹出修改地址页面。否则跳转到送餐地址确认页面。
                    if ($.cookies.get('postalAddress')) {
                        if (!(window.location.href.contains('checkoutCustomer.jsp') && $.cookies.get('partyId'))) {
                            Online.RightChannel.OnClickChangeLocation(false, '非常感谢您订购永和大王，您的送餐地址因商圈调整，目前不在送餐范围内。请尝试其他送餐地址。谢谢！'.t());
                        }
                    } else {
                        $.cookies.del('partyId');//用户登陆失败
                        Online.Order.Clear(false);
                        window.location.href = addressRedirectUrl;
                    }
                }
            }
        });
    },
    ConfirmStoreService: function (callback) {//重新确认送餐时间信息并登记
        Online.Auth.LoginByPartyId(baseUrl + '/yhkonline/order/orderAddress.jsp', callback);
    },
    SignOff: function () {
        Online.post(baseUrl + '/api/mc/sys/logout.json',
            function (data) {
                if (data.success) {
                    Online.Cookie.Clear();
                    window.location = "/yhkonline/yhkonline/index.jsp";
                } else {
                    Online.Alert('提示'.t(), data.result.errorMsg);
                }
            }
        );
    }, RefreshCheckCode: function (imgId) {//刷新验证码
        $('#' + imgId).attr('src', baseUrl + '/yhkonline/common/image.jsp?' + Math.random());
    }
};
//log
Online.log = function (info) {
    //window.console && console.log(info);
}
/**显示对话框*/
Online.showDialog = function (title, content, size) {
    var className = size && size == 'mid' ? 'modal422' : 'modal955';
    var containerId = size && size == 'mid' ? 'signInDialogForm' : 'modalContentContainer';
    var dialog = new Rf.Modal(null, {
        Template: '<div><div class="header"><h1 id="modaltitle" class="">' + title + '</h1><a href="#" class="close">关闭</a></div><div id="' + containerId + '" class="content clr" role="main"></div><div class="footer"></div></div>',
        DialogClassName: className, DialogID: className, OverlayClassName: "modalOverlay", ParentSelector: "body"
    });
    dialog.Bind(Rf.Modal.Events.Show, function () {
        this._Dialog.find("div[role=main]").html(content);
    });

    dialog.Open();
    return dialog;
}
Online.Notify = function (title, content, callback) {
    var dialog = Online.showConfirmDialog(title, { "content": content });
    setTimeout(function () {
        if (callback) {
            callback();
            callback = null;
        }
        dialog.Close();
    }, 2000);
}
Online.Alert = function (title, content, callback, dialogCloseCallback) {
    Online.showConfirmDialog(title, { "content": content, "yes": "确认".t() }, { "yes": callback }, dialogCloseCallback);
}
Online.showConfirmDialog = function (title, content, callbacks, dialogCloseCallback) {
    if (typeof content == 'string') {
        content = { content: content, yes: '确认'.t(), no: '取消'.t() };
    }
    var html = $('#basicDialogTemplate').render(content);
    var dialog = Online.showDialog(title, html, 'mid');
    if (typeof callbacks == 'function') {
        callbacks = { 'yes': callbacks, 'no': dialogCloseCallback };
    }
    $('.header').on('click', function () {
        dialog.Close();
        if (dialogCloseCallback) {
            dialogCloseCallback();
        }
        dialogCloseCallback = null;
        callbacks = null;
    });

    $('#clearCartFormModal a.yes').on('click', function () {
        dialog.Close();
        if (callbacks && callbacks['yes']) {
            callbacks['yes']();
        }
        callbacks = null;
    });
    $('#clearCartFormModal .cancelLink').on('click', function () {
        dialog.Close();
        if (callbacks && callbacks['no']) {
            callbacks['no']();
        }
        callbacks = null;
        return false;
    });
    return dialog;
}
Online.setTitle = function (title) {
    document.title = title;
}
//当前选中主菜单
Online.ActiveMenu = function (index) {
    $('#topNav .topNavContainer li').removeClass('active').eq(index).addClass('active');
}
//页面跟踪方法
Online.Track = function (category, action, opt_label, opt_value) {
    window._hmt && _hmt.push(['_trackEvent', category, action, opt_label]);
}
//Order
Online.Encrypt = function (str, pwd) {
    if (str == "") return "";
    str = encodeURIComponent(str);
    if (!pwd || pwd == "") { pwd = "1234Abcdef"; }
    pwd = encodeURIComponent(pwd);
    if (pwd == null || pwd.length <= 0) {
        alert("A salt error");
        return null;
    }
    var prand = "";
    for (var I = 0; I < pwd.length; I++) {
        prand += pwd.charCodeAt(I).toString();
    }
    var sPos = Math.floor(prand.length / 5);
    var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4) + prand.charAt(sPos * 5));
    var incr = Math.ceil(pwd.length / 2);
    var modu = Math.pow(2, 31) - 1;
    if (mult < 2) {
        alert("error");
        return null;
    }
    var salt = Math.round(Math.random() * 1000000000) % 100000000;
    prand += salt;
    while (prand.length > 10) {
        prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
    }
    prand = (mult * prand + incr) % modu;
    var enc_chr = "";
    var enc_str = "";
    for (var I = 0; I < str.length; I++) {
        enc_chr = parseInt(str.charCodeAt(I) ^ Math.floor((prand / modu) * 255));
        if (enc_chr < 16) {
            enc_str += "0" + enc_chr.toString(16);
        } else
            enc_str += enc_chr.toString(16);
        prand = (mult * prand + incr) % modu;
    }
    salt = salt.toString(16);
    while (salt.length < 8) salt = "0" + salt;
    enc_str += salt;
    return enc_str;
}
Online.Decrypt = function (str, pwd) {
    if (str == "") return "";
    if (!pwd || pwd == "") { pwd = "1234Abcdef"; }
    pwd = encodeURIComponent(pwd);
    if (str == null || str.length < 8) {
        alert("A salt error");
        return;
    }
    if (pwd == null || pwd.length <= 0) {
        alert("Please enter a password with which to decrypt the message.");
        return;
    }
    var prand = "";

    for (var I = 0; I < pwd.length; I++) {
        prand += pwd.charCodeAt(I).toString();
    }
    var sPos = Math.floor(prand.length / 5);
    var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4) + prand.charAt(sPos * 5));
    var incr = Math.round(pwd.length / 2);
    var modu = Math.pow(2, 31) - 1;
    var salt = parseInt(str.substring(str.length - 8, str.length), 16);
    str = str.substring(0, str.length - 8);
    prand += salt;
    while (prand.length > 10) {
        prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
    }
    prand = (mult * prand + incr) % modu;
    var enc_chr = "";
    var enc_str = "";
    for (var I = 0; I < str.length; I += 2) {
        enc_chr = parseInt(parseInt(str.substring(I, I + 2), 16) ^ Math.floor((prand / modu) * 255));
        enc_str += String.fromCharCode(enc_chr);
        prand = (mult * prand + incr) % modu;
    }
    return decodeURIComponent(enc_str);
}
var DeliveryAddress = {
    init: function (jsonObj) {
        if (jsonObj) {
            this.PostalAddress = jsonObj;
        } else if (!this.PostalAddress) {
            this.PostalAddress = Online.Cookie.GetAddress();
        }
    },
    clean: function () {
        this.PostalAddress = null;
    },
    toString: function (isShow, address, withoutComments) {
        if (!address) {
            address = this.getAddress();
        }
        var result = '';
        if (!address) {
            return result;
        }
        //TODO: 与CC保持一致，不显示省份
        //        if(address.province){
        //            result+=address.province;
        //        }
        //        if(address.city && address.city +'市' != address.province){
        //            result += address.city;
        //        }
        if (address.city) {
            result += address.city;
        }
        if (address.region) {
            result += address.region;
        }
        if (address.street) {
            result += address.street;
            if (address.streetNumber) {
                result += address.streetNumber + '号';
            }
            if (address.business) {
                if (address.business != address.street) {
                    result += address.business;
                }
            }
        }
        if (!address.street) {
            if (address.business) {
                result += address.business;
            }
        }
        if (address.comments && !withoutComments) {
            if (!isShow && address.isHidden) {
                result += '******';
            } else {
                result += address.comments;
            }
        }
        return result;
    },
    getAddress: function () {
        this.init();
        return this.PostalAddress;
    },
    setAddress: function (address) {
        this.PostalAddress = address;
    }, isAddressEqual: function (address1, address2) {
        if (address1 == address2) {
            return true;
        }
        if (address1 == null || address2 == null) {
            return false;
        }
        return DeliveryAddress.toString(true, address1) == DeliveryAddress.toString(true, address2);
    },
    getComments: function (isShow) {
        this.init();
        //        var result ='请补充详细地址，如:8号楼207室';
        var result = '';
        if (this.PostalAddress.comments) {
            if (!isShow && this.PostalAddress.isHidden) {
                result = '******';
            } else {
                result = this.PostalAddress.comments;
            }
        }
        return result;
    },
    getSearchKeyword: function (address) {
        var result = '';
        if (!address) {
            address = this.PostalAddress;
        }
        if (!address) {
            return '';
        }

        if (address.street) {
            result += address.street;
            if (address.streetNumber != address.streetNumberTo && address.streetNumberTo != undefined) {//有开始结束街号
                if (address.business) {
                    if (address.business != address.street) {
                        result += address.business;
                    }
                }
            } else if (address.streetNumber == address.streetNumberTo && address.streetNumberTo != undefined) {     //开始街号 与结束街号相同
                result += address.streetNumber + '号';
                if (address.business) {
                    if (address.business != address.street) {
                        result += address.business;
                    }
                }
            }
            else if (address.streetNumber) {//只有开始街号
                result += address.streetNumber + '号';
                if (address.business) {
                    if (address.business != address.street) {
                        result += address.business;
                    }
                }
            } else {
                if (address.business) {
                    if (address.business != address.street) {
                        result += address.business;
                    }
                }
            }
        } else {           //没有街道
            if (address.business) {
                result += address.business;
            }
        }
        if (result.length == 0) {
            result = "请输入地址关键字".t();
        }
        return result;
    },
    save: function (jsonObj) {
        this.init(jsonObj);
        delete jsonObj['address1'];
        delete jsonObj['numberTypeDesc'];
        delete jsonObj['searchBtnId'];
        Online.Cookie.SetAddress(jsonObj);
        Online.Cookie.SetAddressId(jsonObj.deliveryAddressId);
    }, buildSearchCondition: function (keyword, city) {//将关键字分割为路和号/弄
        if (!keyword || !city) {
            return {};
        }
        city = city.t();
        keyword = keyword.replace(city + '市', '');
        var condition = { city: city, keyword: keyword, searchValue: keyword };
        //var addressReg = /([\s\S]*?路)([\s\S]*?)(弄|号)/;Can't work in IE 7,8
        var from = keyword.indexOf('路');
        if (from > 0) {
            var afterStreet = keyword.replace(keyword.substring(0, from + 1), '').trim();//路后面的
            afterStreet = parseInt(afterStreet);
            if (afterStreet > 0) {
                condition.keyword = keyword.substring(0, from + 1);
                condition.startCode = afterStreet;
            }
        }
        return condition;
    }
}
Online.Cookie = {
    Clear: function () {
        try {
            $.jStorage.flush();
            //清楚所有cookie
            if (document.cookie.length == 0) {
                return;
            }
            var ck = document.cookie.split(";"), re = /.*?=/, ne = [], exp = new Date();
            exp.setTime(exp.getTime() - 1);
            for (var i = 0; i < ck.length; i++) {
                ne[i] = re.exec(ck[i])[0];
                if (ne[i]) {
                    ne[i] = ne[i].replace('=', '');
                    if (ne[i].trim() != 'lang' && ne[i].trim() != 'password') {
                        $.cookies.del(ne[i]);
                    }
                }
            }
        } catch (e) {
            Online.log(e);
        }
    }, Save: function (key, value) {
        if (Online.Order.NeedSyncToServer() && key != 'order') {
            $.cookies.set(key, value, Online.Cookie.GetExpireTime());
        } else {
            $.jStorage.set(key, value, { TTL: 3600000 });
        }
    }, Get: function (key) {
        if (Online.Order.NeedSyncToServer() && key != 'order') {
            return $.cookies.get(key);
        } else {
            return $.jStorage.get(key);
        }
    }, Del: function (key) {
        if (Online.Order.NeedSyncToServer() && key != 'order') {
            //TODO: IE6 have bug to store data
            $.cookies.del(key);
        } else {
            $.jStorage.deleteKey(key);
        }
    }, GetExpireTime: function (hour) {
        if (!hour) {
            hour = 1;
        }
        var expireDate = new Date();
        expireDate.setHours(expireDate.getHours() + hour);//一小时过期
        return {
            expiresAt: expireDate,
            secure: false
        };
    },
    GetAddressId: function () {
        return $.cookies.get('deliveryAddressId');
    }, SetAddressId: function (deliveryAddressId) {
        if (deliveryAddressId) {
            $.cookies.set('deliveryAddressId', deliveryAddressId, Online.Cookie.GetExpireTime());
        }
    }, SetAddress: function (address) {
        if (address) {
            Online.Cookie.Save('postalAddress', address);
            //$.cookies.set('postalAddress', address, expireAt);
        }
    }, GetAddress: function () {
        return Online.Cookie.Get('postalAddress');
        //return $.cookies.get('postalAddress');
    },
    SetUserInfo: function (email, phone) {
        if (email) {
            Online.Cookie.Save('userName', email);
        }
        if (phone) {
            Online.Cookie.Save('contactPhone', phone);
        }
    }, SetLang: function (language) {// 设置语言
        if (language) {
            $.cookies.set('lang', language, Online.Cookie.GetExpireTime(720));
        }
    }, GetLang: function () {
        var result = $.cookies.get('lang');
        return result ? result : CONSTANTS.LANGUAGE.CHINESE;
    }, setIsCarryOut: function (value) {
        if (value) {
            $.cookies.set('isCarryOut', value, Online.Cookie.GetExpireTime(720));
        }
    }, getIsCarryOut: function () {
        return Online.Cookie.Get('isCarryOut');
    }, setStoreInfo: function (value) {
        if (value) {
            $.cookies.set('storeInfo', value, Online.Cookie.GetExpireTime(720));
        }
    }, getStoreInfo: function () {
        return Online.Cookie.Get('storeInfo');
    }, setEatingStyleEnumId: function (value) {
        if (value) {
            $.cookies.set('eatingStyleEnumId', value, Online.Cookie.GetExpireTime(720));
        }
    }, getEatingStyleEnumId: function () {
        return Online.Cookie.Get('eatingStyleEnumId');
    }, updateCartOrderHeaderEatingStyleId: function (value) {
        var cartData = Online.Cart.GetData();
        cartData.orderHeader.eatingStyleEnumId = value;
        Online.Cart.SetData(cartData);
    }, setMapCurrentCity: function (value) {
        if (value) {
            $.cookies.set('currentCity', value, Online.Cookie.GetExpireTime(720));
        }
    }, getMapCurrentCity: function () {
        return Online.Cookie.Get('currentCity');
    }, setChangeAddressJspParam: function (value) {
        if (value) {
            $.cookies.set('changeAddressJspParam', value, Online.Cookie.GetExpireTime(720));
        }
    }, getChangeAddressJspParam: function () {
        return Online.Cookie.Get('changeAddressJspParam');
    }, setNewContactIdByChangeEatingStyle: function (value) {
        if (value) {
            $.cookies.set('newContactIdByChangeEatingStyle', value, Online.Cookie.GetExpireTime(720));
        }
    }, getNewContactIdByChangeEatingStyle: function () {
        return Online.Cookie.Get('newContactIdByChangeEatingStyle');
    }, setUserManageAddressCid: function (value) {
        if (value) {
            $.cookies.set('userManageAddressCid', value, Online.Cookie.GetExpireTime(720));
        }
    }, getUserManageAddressCid: function () {
        return Online.Cookie.Get('userManageAddressCid');
    }, setUserHaveAddress: function (value) {
        if (value) {
            $.cookies.set('userHaveAddress', value, Online.Cookie.GetExpireTime(720));
        }
    }, getUserHaveAddress: function () {
        return Online.Cookie.Get('userHaveAddress');
    }
};

Online.Index_One = {
    Modal: null,
    OnClickApliPayDialog: function (e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        $('.errorTooltip').remove();
        // var url = $('#topNavBtnApliPay').attr('href');
        var url = 'common/index_one.jsp';
        if (url) {
            Online.Index_One.CreateModal(url, $.t('友情提示')).Open();
        }
    },
    OnSubmitForm: function (e) {
    },
    OnClickClose: function (e) {
        e.preventDefault();
        Online.Index_One.DestroyModal();
    },
    Init: function (context) {
        context = $(context || document.body);
        $('.apliPayDialog', context).monobind('click', Online.Index_One.OnClickApliPayDialog);
    },
    DestroyModal: function () {
        if (Online.Index_One.Modal) {
            if (Online.Index_One.Modal._Dialog) {
                Online.Index_One.Modal.Close();
            }
            Online.Index_One.Modal = null;
        }
    },
    CreateModal: function (url, title) {
        Online.Index_One.DestroyModal();
        var modal = new Rf.Modal(url, {
            DialogID: 'modal423',
            OverlayClassName: 'modal-overlay',
            OverlayOpacity: 0.5,
            DialogClassName: 'modal423',
            Template: '<div><div class="header" style="margin-bottom:0;"><h1 class="replace">' + title + '</h1><a href="#" class="btnModal423Close close"></a></div><div class="content clr" role="main"></div><div class="footer clr"></div></div>'
        });
        Online.Index_One.Modal = modal;
        modal.Bind(Rf.Modal.Events.Show, Online.Index_One.OnShowModal);
        modal.Bind(Rf.Modal.Events.Render, function () {
            setTimeout(function () {
                // IE absolutely will not hide the frame border unless you do the following
                if (/MSIE [0-8]\./i.test(navigator.userAgent)) {
                    var iframe = modal._Dialog.find('iframe')[0];
                    if (iframe) {
                        var newFrame = document.createElement('iframe');
                        newFrame.frameBorder = 0;
                        newFrame.id = iframe.id;
                        newFrame.src = iframe.src;
                        newFrame.scrolling = 'no';
                        newFrame.allowTransparency = true;
                        iframe.parentNode.appendChild(newFrame);
                        iframe.parentNode.removeChild(iframe);
                    }
                }
            }, 0);
        });
        return modal;
    },
    OnShowModal: function (e) {
        var context = this._Dialog || $(document.body);
        context.find('#apliPayForm').monobind('submit', Online.Index_One.OnSubmitForm);
        // context.find('.btnForgotPassword').monobind('click', Online.ApliPay.OnClickForgotPassword);
        // context.find('#btnModalForgotPassword').monobind('click', Online.ApliPay.OnClickForgotPasswordSubmit);
        context.find('.close').unbind('click').monobind('click', Online.Index_One.OnClickClose);
    },
    LoadModalContent: function (content, title) {
        if (Online.Index_One.Modal) {
            Online.Index_One.Modal._Dialog.find('.content').html(content);
            Online.Index_One.Modal._Dialog.find('h1.replace, h2.replace').html(title);
            //$('#cantRememberEmail').monobind('click', Online.ApliPay.OnClickCantRememberEmail);
            Online.ApliPay_One.OnShowModal.call(Online.Index_One.Modal._Dialog);
        }
    },
    OnClickCantRememberEmail: function (e) {
        e.preventDefault();
        var url = $(this).attr('href'),
            message = $(this).attr('title');
        Online.Index_One.DestroyModal();
        Online.ShowConfirmationModal(url, message, 'modal423', 'modal423');
    },
    OnAjaxSuccess: function (response) {
        if (!response.success) {
            Online.Index_One.LoadModalContent(response.content);
        }
    },
    OnApliPaySubmitAjaxSuccess: function (response) {
        Online.Index_One.DestroyModal();
        window.location.reload();
    },
    AjaxCall: function (url, params, successCallback, errorCallback) {
        Online.SyncAjax({
            type: 'POST',
            url: url,
            cache: false,
            data: params,
            dataType: 'json',
            error: function (xhr) {
                if (errorCallback) {
                    errorCallback.call(this);
                }
                Online.OnAjaxError(xhr);
            },
            success: function (response) {
                if (response.hasServerSideErrors) {
                    Online.Index_One.LoadModalContent(response.content);
                    if (errorCallback) {
                        errorCallback.call(this);
                    }
                }
                else if (successCallback) {
                    Online.ShowAjaxResponseAlert(response);
                    successCallback.call(this, response);
                }
            }
        });
    }
};

//add global JS functionality here
$(document).ready(function () {
    //$('.replace').css({visibility:'visible'});
    //$('#topNav li a, ul.topNavSubMenu, #hero, .tierIcon').ifixpng();
    if (/MSIE 6/i.test(navigator.userAgent)) {
        document.execCommand("BackgroundImageCache", false, true);
    }
    $('.changeLang').click(function () {
        Online.Cart.ClearData();
    });
    Online.UserState.Init();
    //$(document.body).ifixpng();
    Online.InitAjaxIndicator();
    Online.InitFormWidgets();
    Online.Unload.Init();
    Online.OnloadEvents.Init(); /* run this last */
    Online.Async.Flush();
});