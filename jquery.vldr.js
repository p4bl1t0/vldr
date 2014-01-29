/*!
* vldr v0.1
* @author Pablo Botta
*/

; (function ($) {
    //Variables

    //Functions
    function validateOnSubmit($form){
        if($form && $form != null){
            $form.submit(function(event){
                var $thisForm = $(this);
	        if(!(vldrRequireds($thisForm) & vldrPatterns($thisForm))){
                    event.preventDefault();
                    //Posiblemente Scroll to Error
                    return false;
                } else {
                	$form.trigger("vldrSuccess");
                }
	     });
        }
    }
    function cbClear(){
        var $base = $(this);
		if ($base.hasClass('vldr-input-error')) {
			$base.removeClass('vldr-input-error');
		}
        if($base.parent().find('.vldr-error-msg').length > 0){
            $base.parent().find('.vldr-error-msg').remove();
        }
        if ($base.hasClass('vldr-input-error-inside')) {
			$base.removeClass('vldr-input-error-inside');
            var msg = $input.attr('data-vldr-required-msg-inside');
            $input.attr('placeholder', $input.attr('placeholder').toString().replace(' - ' +msg,''));
            $input.attr('placeholder', $input.attr('placeholder').toString().remove(msg,''));
		}
    }
    function vldrRequireds($form) {
		var incomplete = false;
        //Input text y SELECTs
		$form.find("input.vldr-required,textarea.vldr-required,select.vldr-required").not('input[type=radio],input[type=checkbox]').each(function () {
			var $input = $(this);
            var compareTo = ""; 
			var attr = $input.attr('data-vldr-required-empty');
			if ((typeof attr !== 'undefined' && attr !== false)) {
                compareTo = attr;
            }
			if ($input.val() === compareTo) {
				incomplete = true;
				$input.addClass("vldr-input-error");
                //Tengo que fijarme si tiene mensaje y lo muestro
			    var attr = $input.attr('data-vldr-required-msg');
			    if ((typeof attr !== 'undefined' && attr !== false) && $input.parent().find('.vldr-error-msg').length == 0) {
                    var msg = $input.attr('data-vldr-required-msg');
                    $input.after($(document.createElement('div')).html(msg).addClass('vldr-error-msg'));
                }
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
				/*$input.focus(function () {
					var $base = $(this);
					if ($base.hasClass('vldr-input-error')) {
						$base.removeClass('vldr-input-error');
					}
                    if($base.parent().find('.vldr-error-msg').length > 0){
                        $base.parent().find('.vldr-error-msg').remove();
                    }
                    if ($base.hasClass('vldr-input-error-inside')) {
						$base.removeClass('vldr-input-error-inside');
                        var msg = $input.attr('data-vldr-required-msg-inside');
                        $input.attr('placeholder', $input.attr('placeholder').toString().replace(' - ' +msg,''));
                        $input.attr('placeholder', $input.attr('placeholder').toString().remove(msg,''));
					}
				});*/
                $input.focus(cbClear);
                $input.trigger('vldrRequired');
			} else {
                $input.parent().find('.vldr-error-msg').remove();
            }
        });
        //Para checkboxes
        $form.find('input.vldr-required[type=checkbox]').each(function () {
            var $cbx = $(this);
            if(!$cbx.is(':checked')){
                incomplete = true;
                $cbx.addClass("vldr-input-error");
                //Tengo que fijarme si tiene mensaje y lo muestro
			    var attr = $cbx.attr('data-vldr-required-msg');
			    if ((typeof attr !== 'undefined' && attr !== false) && $cbx.parent().find('.vldr-error-msg').length == 0) {
                    var msg = $cbx.attr('data-vldr-required-msg');
                    $cbx.after($(document.createElement('div')).html(msg).addClass('vldr-error-msg'));
                }
                $cbx.trigger('vldrRequired');
                /*$cbx.click(function () {
					var $base = $(this);
					if ($base.hasClass('vldr-input-error')) {
						$base.removeClass('vldr-input-error');
					}
                    if($base.parent().find('.vldr-error-msg').length > 0){
                        $base.parent().find('.vldr-error-msg').remove();
                    }
				});*/
                $cbx.focus(cbClear);
            }
		});
        //Radios
        var names = [];
        $form.find('input.vldr-required[type=radio]').each(function () {
            var name = this.name;
            if(names.indexOf(name) == -1){
                //No lo encontre
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
                    var attr = $radio.attr('data-vldr-required-msg');
			        if ((typeof attr !== 'undefined' && attr !== false) && $radio.parent().find('.vldr-error-msg').length == 0) {
                        var msg = $radio.attr('data-vldr-required-msg');
                        $radio.after($(document.createElement('div')).html(msg).addClass('vldr-error-msg'));
                    }
                
                });
                $radios.trigger('vldrRequired');
                $radios.click(cbClear);
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
				//Si hay algo en su valor
				var patron = $input.attr('data-vldr-pattern');
				var valor = $input.val();
				re = new RegExp(patron);
				if (re.test(valor)) {
                    //Aca no deber�a pasar nada
                    $input.parent().find('.vldr-error-msg').remove();
				}
				else {
					invalid = true;
					$input.addClass("vldr-input-error");
                    //Tengo que fijarme si tiene mensaje y lo muestro
			        var attr = $input.attr('data-vldr-pattern-msg');
			        if ((typeof attr !== 'undefined' && attr !== false) && $input.parent().find('.vldr-error-msg').length == 0) {
                        var msg = $input.attr('data-vldr-pattern-msg');
                        $input.after($(document.createElement('div')).html(msg).addClass('vldr-error-msg'));
                    }
					//Meto al campo el error
					$input.focus(function () {
						var $base = $(this);
						if ($base.hasClass('vldr-input-error')) {
							$base.removeClass('vldr-input-error');
						}
					});
                    $input.trigger('vldrPatternInvalid');
				}


			}
		});
		if (invalid) {
			return false;
		} else {
			return true;
		}
	}
    //Events
    $(document).ready(function(){
        if($('.vldr-submit').length == 0){
            var $form = $('form');
		    validateOnSubmit($form);
        } else {
            $('.vldr-submit').click(function(){
                var $btn = $(this);
                validateOnSubmit($btn.parents('form'));
            });
        }
	});
		
		
} (jQuery));
