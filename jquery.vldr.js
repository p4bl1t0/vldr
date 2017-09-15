/*!
* jQuery vldr plugin
* @link http://awar.com.ar
* @author Pablo Botta
* @description JavaScriptless validation plugin
*/

; (function ($) {
    // Variables
    var triggerButton = null;
    var firstTime = true;
    // Functions
    function validateForm() {
        var $form = null;
        if ($('.vldr-submit').length == 0){
            var $form = $('form');
        } else {
            var $form = $('.vldr-submit').parents('.vldr-form');
            if ($form.length == 0 || !$form.is('form')) {
                $form = $btn.parents('form');
            }
        }
        return (vldrRequireds($form) & vldrPatterns($form));
    }

    function validateOnSubmit($form, checkTriggerButton) {
        if (firstTime) {
            if ($form && $form != null) {
                if (!$form.is('form')) {
                    var $root = $form;
                    $form = $form.parents('form');
                }
                $form.submit(function(event) {
                    var proceed = false;
                    if (checkTriggerButton) {
                        if (triggerButton != null && $(triggerButton).hasClass('vldr-submit')) {
                            proceed = true;
                        }
                    } else {
                        proceed = true;
                    }
                    if (proceed) {
                        var $thisForm = $(this);
                        if ($root && $root != null && $root.length > 0) {
                            $thisForm = $root;
                        }
                        if (!(vldrRequireds($thisForm) & vldrPatterns($thisForm))) {
                            event.preventDefault();
                            //Temporal scroll solution.
                            $('html,body').scrollTop($('.vldr-input-error').offset().top - 100);
                            return false;
                        } else {
                            $thisForm.trigger("vldrSuccess");
                        }
                    }
                });
            }
            firstTime = false;
        }
    }
    function cbClear(){
        var $base = $(this);
        $base.off('focus', cbClear);
		if ($base.hasClass('vldr-input-error')) {
			$base.removeClass('vldr-input-error');
		}
        if($base.parent().find('.vldr-error-msg').length > 0){
            $base.parent().find('.vldr-error-msg').remove();
        }
        if ($base.hasClass('vldr-input-error-inside') || $base.attr('data-vldr-msg-place') === 'inside' ) {
			$base.removeClass('vldr-input-error-inside');
            var msg = $base.attr('data-vldr-required-msg-inside') || $base.attr('data-vldr-required-msg');
            $base.attr('placeholder', $input.attr('placeholder').toString().replace(' - ' + msg,''));
            $base.attr('placeholder', $input.attr('placeholder').toString().remove(msg,''));
		}
    }

    function removeMessage($input) {
        var whereToInsert = "after";
        var attrWhere = $input.attr('data-vldr-msg-place');
        if ((typeof attrWhere !== 'undefined' && attrWhere !== false)) {
            whereToInsert = attrWhere;
        }
        var $toRemove = $input.siblings().filter('.vldr-error-msg');
        if (whereToInsert === 'after') {
            $toRemove = $input.next();
        } else {
            if(whereToInsert === 'before') {
                $toRemove = $input.prev();
            } else {
                if(whereToInsert === 'append'){
                    $toRemove = $input.children(":last");
                } else {
                    if(whereToInsert === 'prepend'){
                        $toRemove = $input.children(":first");
                    } 
                }
            }
        }
        if ($toRemove.hasClass('vldr-error-msg')) {
            $toRemove.remove();
        }    
    }

    function vldrRequireds($form) {
		var incomplete = false;
        //Input text y selects
		$form.find("input.vldr-required,textarea.vldr-required,select.vldr-required").not('input[type=radio], input[type=checkbox], .vldr-hidden').each(function () {
			var $input = $(this);
            var compareTo = ""; 
			var attr = $input.attr('data-vldr-required-empty');
			if ((typeof attr !== 'undefined' && attr !== false)) {
                compareTo = attr;
            }
			if ($input.val() === compareTo) {
				incomplete = true;
				$input.addClass("vldr-input-error");
                // data-vldr-msg-place == [after, before, append, prepend, inside]
                var whereToInsert = "after";
                var attrWhere = $input.attr('data-vldr-msg-place');
                if ((typeof attrWhere !== 'undefined' && attrWhere !== false)) {
                    whereToInsert = attrWhere;
                }
			    var attrMsg = $input.attr('data-vldr-required-msg');
			    if ((typeof attrMsg !== 'undefined' && attrMsg !== false)) {
                    var msg = attrMsg;
                    var $msg = $(document.createElement('div')).html(msg).addClass('vldr-error-msg');
                    if(whereToInsert === 'after' && $input.next(".vldr-error-msg").length === 0) {
                        $input.after($msg);
                    } else {
                        if(whereToInsert === 'before' && $input.prev(".vldr-error-msg").length === 0) {
                            $input.before($msg);
                        } else {
                            if(whereToInsert === 'append' && $input.parent.find(".vldr-error-msg").length === 0){
                                $input.parent().append($msg);
                            } else {
                                if(whereToInsert === 'prepend' && $input.parent.find(".vldr-error-msg").length === 0){
                                    $input.parent().prepend($msg);
                                } else {
                                    //Finally 'inside'
                                    var ph = $input.attr('placeholder');
                                    if(ph !== null && ph !== undefined && ph !== "" && !$input.hasClass('vldr-input-error')) {
                                        $input.attr('placeholder', $input.attr('placeholder') + " - " + msg);
                                    } else {
                                        $input.attr('placeholder', msg);
                                    }
                                }
                            }
                        }
                    }
                }
                // Out of use ?
                var attrRqMsgInside = $input.attr('data-vldr-required-msg-inside');
			    if ((typeof attrRqMsgInside !== 'undefined' && attrRqMsgInside !== false) && !$input.hasClass('vldr-input-error-inside')) {
                    var msg = $input.attr('data-vldr-required-msg-inside');
                    $input.addClass('vldr-input-error-inside');
                    if($input.attr('placeholder') != "") {
                        $input.attr('placeholder', $input.attr('placeholder') + " - " + msg);
                    } else {
                        $input.attr('placeholder', msg);
                    }
                }
                $input.off('focus', cbClear);
                $input.trigger('vldrRequired');
                $input.on('focus', cbClear);
            } else {
                removeMessage($input);
            }
        });
        // For checkboxes
        $form.find('input.vldr-required[type=checkbox]').not('.vldr-hidden').each(function () {
            var $cbx = $(this);
            if(!$cbx.is(':checked')){
                incomplete = true;
                $cbx.addClass("vldr-input-error");
                // Check if have error's message and show it
			    var attr = $cbx.attr('data-vldr-required-msg');
			    if ((typeof attr !== 'undefined' && attr !== false) && $cbx.parent().find('.vldr-error-msg').length == 0) {
                    var msg = $cbx.attr('data-vldr-required-msg');
                    $cbx.after($(document.createElement('div')).html(msg).addClass('vldr-error-msg'));
                }
                $input.off('focus', cbClear);
                $input.trigger('vldrRequired');
                $input.on('focus', cbClear);
            }
		});
        // Radios
        var names = [];
        $form.find('input.vldr-required[type=radio]').not('.vldr-hidden').each(function () {
            var name = this.name;
            if (names.indexOf(name) == -1){
                //Not found
                names.push(name);
            }
		});
        for (var i = 0; i < names.length; i++) {
            var $radios = $form.find('input.vldr-required[type=radio][name=' + names[i] + ']');
            var $check = $form.find('input.vldr-required[type=radio][name=' + names[i] + ']:checked');
            if($check.length == 0){
                incomplete = true;
                $radios.addClass("vldr-input-error");
                $radios.each(function(){
                    var $radio = $(this);
                    var whereToInsert = "after";
                    var attrWhere = $radio.attr('data-vldr-msg-place');
                    if ((typeof attrWhere !== 'undefined' && attrWhere !== false)) {
                        whereToInsert = attrWhere;
                    }
                    var attr = $radio.attr('data-vldr-required-msg');
			        if ((typeof attr !== 'undefined' && attr !== false) && $radio.parent().find('.vldr-error-msg').length == 0) {
                        var msg = $radio.attr('data-vldr-required-msg');
                        var $msg = $(document.createElement('div')).html(msg).addClass('vldr-error-msg');
                        if(whereToInsert === 'after') {
                            $input.after($msg);
                        } else {
                            if(whereToInsert === 'before') {
                                $input.before($msg);
                            } else {
                                if(whereToInsert === 'append'){
                                    $input.parent().append($msg);
                                } else {
                                    if(whereToInsert === 'prepend'){
                                        $input.parent().prepend($msg);
                                    } else {
                                        // If is not able to be INSIDE, must be AFTER
                                        $input.after($msg);
                                    }
                                }
                            }
                        }
                    }
                
                });
                $input.off('focus', cbClear);
                $input.trigger('vldrRequired');
                $input.on('focus', cbClear);
            }
        }
		if (incomplete) {
			return false;
		} else {
			return true;
		}
    }
    
    function vldrPatterns($form) {
		var invalid = false;
		$form.find("input.vldr-pattern").each(function () {
            var $input = $(this);
			var attr = $input.attr('data-vldr-pattern');
			if ($input.val() !== "" && (typeof attr !== 'undefined' && attr !== false)) {
				// value?
                var patron = $input.attr('data-vldr-pattern');
				var valor = $input.val();
                try {
				    var re = new RegExp(patron);
                } catch (err) {
                    var re = null;
                }
				if (re != null && re.test(valor)) {
                    removeMessage($input);
				}
                else {
					invalid = true;
					$input.addClass("vldr-input-error");
                    var whereToInsert = "after";
                    var attrWhere = $input.attr('data-vldr-msg-place');
                    if ((typeof attrWhere !== 'undefined' && attrWhere !== false)) {
                        whereToInsert = attrWhere;
                    }
			        var attr = $input.attr('data-vldr-pattern-msg');
			        if ((typeof attr !== 'undefined' && attr !== false)) {
                        var msg = $input.attr('data-vldr-pattern-msg');
                        var $msg = $(document.createElement('div')).html(msg).addClass('vldr-error-msg');
                        if(whereToInsert === 'after' && $input.next(".vldr-error-msg").length === 0) {
                            $input.after($msg);
                        } else {
                            if(whereToInsert === 'before' && $input.prev(".vldr-error-msg").length === 0) {
                                $input.before($msg);
                            } else {
                                if(whereToInsert === 'append' && $input.parent.find(".vldr-error-msg").length === 0){
                                    $input.parent().append($msg);
                                } else {
                                    if(whereToInsert === 'prepend' && $input.parent.find(".vldr-error-msg").length === 0){
                                        $input.parent().prepend($msg);
                                    } else {
                                        //Este no puede ir inside, entonces AFTER
                                        $input.after($msg);
                                    }
                                }
                            }
                        }
                    }
                    $input.off('focus', cbClear);
                    $input.trigger('vldrRequired');
                    $input.on('focus', cbClear);
				}


			}
		});
		if (invalid) {
			return false;
		} else {
			return true;
		}
    }
    
    function bindingEvents() {
        if ($('.vldr-submit').length == 0){
            var $form = $('form');
		    validateOnSubmit($form, false);
        } else {
            $('.vldr-submit').click(function() {
                var $btn = $(this);
                var $container = $btn.parents('.vldr-form');
                if($container.length == 0) {
                    $container = $btn.parents('form');
                }
                validateOnSubmit($container, true);
            });
        }
        $('[type=submit], .vldr-submit').click(function(event) {
            triggerButton = event.target;
        });
    }
    // Events
    $(document).ready(function() {
        bindingEvents();
	});
	$["vldr"] =  {
        reBind: bindingEvents,
        validate: validateForm
    }
} (jQuery));