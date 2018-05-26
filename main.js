/**
 * This func handles hidden msg 'The service ...'
 */
/*$(document).ajaxStart(function(event, request, settings){
	hideLiferayNotificationMessage($('.portlet-msg-error-selector'));
});*/

/*var isPageIntegrupted = false;
$(window).on("beforeunload", function() {
	isPageIntegrupted = true;
});*/

/**
 * This function to capture global ajax failed event
 */
// TODO: Technical debt: Should find the way to handle Global Ajax failure.
/*var globalMsgErrorForServiceFailed = "The service is temporarily unavailable. Please try again later.";
var globalMsgErrorForServiceTimeout = "The service is timeout. Please try again later.";
$(document).ajaxError(function(event, request, settings){
	if (!isPageIntegrupted) {
		console.log("Error handled global");
		$(".waiting").removeClass('waiting');
		$('.loading-animation').detach();
		
		var currentEl = event.currentTarget.activeElement;
		var anchorMsg = $(currentEl).parents('.mainWrapper').find('.portlet-msg-error-selector');
		if (anchorMsg.length == 0) {
			anchorMsg = $('.portlet-msg-error-selector');
		}
		
		if (request.statusText === 'timeout') {
			showLiferayNotificationMessage(anchorMsg, globalMsgErrorForServiceTimeout, ACM_Constants.common.messageTypeError);
		} else {
			showLiferayNotificationMessage(anchorMsg, globalMsgErrorForServiceFailed, ACM_Constants.common.messageTypeError);
		}
	}
});*/

/**
 * This function is used to check is a
 * variable is a number type.
 * 
 * @param n : variable to be checked.
 * **/

function replaceAll(find, replace, str) {
	return str.replace(new RegExp(find, 'g'), replace);
};
		
function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * This function is used to export dygraph into image
 * file.
 * 
 * @param g       : the dygraph object.
 * @param title   : filename of the image
 * @param type    : extension of the image
 * @param options : custom user options for dygraph object. 
 *                  Default empty object.
 * 
 * **/
function saveImageFromGraph(g, title, type, options) {
	var img = document.createElement('img');
	img.width = g.width_;
	img.height = g.height_ + Dygraph.Export.DEFAULT_ATTRS.legendHeight;
	
	Dygraph.Export.asImage(g, img, type, options);

	var canvas = document.createElement('canvas');
	canvas.width = img.width + 100;
	canvas.height = img.height + 100;

	var context = canvas.getContext("2d");
	img.onload = function(){
		context.fillStyle = "#FFFFFF";
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.drawImage(img, 50, 50, img.width, img.height);
		canvas.toBlob(function(blob) {
			saveAs(blob, title + "." + type);
		}, "image/" + type);
	 };
}

/**
 * This function is used to export multiple dygraph images 
 * in to a zipped file.
 * 
 * @param i       : index number of the image
 * @param g       : dygraph Object
 * @param title   : filename of the image
 * @param zip     : the JSZip Object
 * @param type    : extension of the image
 * @param options : custom user options for dygraph object. 
 *                  Default empty object.
 *                  
 * */
function zipImageFromGraph(i, g, title, type, zip, size, options) {
	var img = document.createElement('img');
	img.width = g.width_;
	img.height = g.height_;
	Dygraph.Export.asImage(g, img, type, options);

	var canvas = document.createElement('canvas');
	canvas.width = img.width + 100;
	canvas.height = img.height + 100;
	
	var context = canvas.getContext("2d");
	img.onload = function(){
		context.fillStyle = "#FFFFFF";
		context.fillRect(0, 0, canvas.width, canvas.height);
		context.drawImage(img, 50, 50, img.width, img.height);
		var dataURL = canvas.toDataURL("image/" + type);
		var startIndex = dataURL.indexOf("base64,") + 7;
		var dataBase64 = dataURL.substring(startIndex);
		zip.file(title + "." + type, dataBase64, {base64 : true});
		if (i == size) {
			var content = zip.generate({
				type : "blob"
			});

			saveAs(content, getGraphTitle() + ".zip");
		}
	};
}

/**
 * This function is used to export a dygraph object to img tag
 */
function exportDygraphObjectToImg(g, type) {
	var img = document.createElement('img');
	img.width = g.width_;
	img.height = g.height_;
	var options = {};
	Dygraph.Export.asImage(g, img, type, options);
	return img;
}

function exportDygraphObjectToImgForBandwidthProjection(g, type) {
	var img = document.createElement('img');
	img.width = g.width_;
	img.height = g.height_;
	var options = {
		/* Customize to do not display legend title. */	
		legendHeight: 0
		//options.labelsDivWidth = 0;
	};
	Dygraph.Export.asImage(g, img, type, options);
	return img;
}


/**
 * This function is used to toggle between placeholder text and 
 * drop-down value of a HTML select object. Only needed for 
 * drop-down with a placeholder text.
 * 
 * @param: html control object
 * 
 * **/
function toggleDropdownPlaceHolder(control) {
	if ('' == control.val() || null == control.val()) {
		control.siblings("span").css('visibility', '');
	} else {
		control.siblings("span").css('visibility', 'hidden');
	}
}

/**
 * Display loading icon inside a wrapper Div element
 * 
 * @param wrapperElement : wrapper div element in which the loading icon
 *                         is to be displayed.
 * **/
function showLoadingIcon(wrapperElement) {
	$('<div class="loading-animation"></div>').appendTo(wrapperElement);
}

/**
 * Hide all loading icons
 * 
 * **/
function hideLoadingIcon() {
	$(".waiting").removeClass('waiting');
	$('.loading-animation').detach();
}

/**
 * Display loading icon inside a wrapper Div element
 * And fade the div
 * 
 * @param wrapperElement : wrapper div element in which the loading icon
 *                         is to be displayed.
 * **/
function showLoadingIconAndWaiting(wrapperElement, loadingFunction, params) {
	if (wrapperElement) {
		var loadingAnimation = $('<div class="loading-animation"></div>').appendTo(wrapperElement);
		wrapperElement.css("position", "relative");
		if (wrapperElement.selector == "html") {
			loadingAnimation.css("position", "fixed");
			loadingAnimation.css("top", $(window).height() / 2 - 16);
			loadingAnimation.css("left", $(window).width() / 2 - 16);
		} else {
			loadingAnimation.css("position", "absolute");
			loadingAnimation.css("top", wrapperElement.height() / 2 - 16);
			loadingAnimation.css("left", wrapperElement.width() / 2 - 16);
		}
		wrapperElement.addClass("waiting");
	} else {
		showLoadingIconAndWaiting($("html"));
	}
	if (typeof(loadingFunction) !== 'undefined' && typeof(params) !== 'undefined') {
		loadingFunction(params);
		hideLoadingIconAndWaiting(wrapperElement);
	}
}

/**
 * Display loading icon inside a wrapper Div element
 * And fade the div
 * 
 * @param wrapperElement : wrapper div element in which the loading icon
 *                         is to be displayed.
 * **/
function hideLoadingIconAndWaiting(wrapperElement) {
	if (wrapperElement) {
		wrapperElement.find(".loading-animation").remove();
		wrapperElement.removeClass("waiting");
	} else {
		hideLoadingIconAndWaiting($("html"));
	}
}


/**
 * Return date time in YYYYMMDD_HHMMSS format
 * 
 * @param time : Date object
 * **/
function formatDateTime(dateObject) {
	var formattedTime = "";
	
	formattedTime += dateObject.getFullYear();
	var month = dateObject.getMonth() + 1;
	formattedTime += month < 10 ? "0" + month : month;
	formattedTime += dateObject.getDate() < 10 ? "0" + dateObject.getDate() : dateObject.getDate();
	
	formattedTime += "_";
	
	formattedTime += dateObject.getHours() < 10 ? "0" + dateObject.getHours() : dateObject.getHours();
	formattedTime += dateObject.getMinutes() < 10 ? "0" + dateObject.getMinutes() : dateObject.getMinutes();
	formattedTime += dateObject.getSeconds() < 10 ? "0" + dateObject.getSeconds() : dateObject.getSeconds();
	
	return formattedTime;
}


/**
 * Return the date before today in "MM/DD/YYYY" format
 * @returns {String}
 */
function getTheDayBeforeInString() {
	var yesterday = new Date();
	yesterday.setDate(yesterday.getDate() - 1);
	var month = yesterday.getMonth() + 1;
	var dateString = formatTimeLeadingZero(month) + '/'
		+ formatTimeLeadingZero(yesterday.getDate()) + '/'
		+ yesterday.getFullYear();
	return dateString;
}

/**
 * Format input number into two character format
 * @param input the number that < 10
 * @returns {String} with format "00"
 */
function formatTimeLeadingZero(input) {
	return input < 10 ? '0' + input : input;
}

/**
 * Get time from datepicker and convert to format YYYYMMDD_HHMMUTC to used for export
 * @param jQuery element initialized as datepicker
 * @returns {String} with format "YYYYMMDD_2330UTC"
 */
function getTimeInString(element) {
	var selectedTime = element.datepicker("getDate");
	var year = selectedTime.getFullYear();
	var month = selectedTime.getMonth() + 1;
	var date = selectedTime.getDate();
	var timeString = year.toString() + formatTimeLeadingZero(month).toString()
				 + formatTimeLeadingZero(date).toString();
		
	timeString += "_2330";
	
	return timeString;
}

/**
 * Validates that the input string is a valid date formatted as "MM/DD/YYYY"
 * @param String in formatted "MM/DD/YYYY"
 * @returns boolean
 */
function isValidDate(dateString)
{
    // First check for the pattern
    if(!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString))
        return false;

    // Parse the date parts to integers
    var parts = dateString.split("/");
    var day = parseInt(parts[1], 10);
    var month = parseInt(parts[0], 10);
    var year = parseInt(parts[2], 10);

    // Check the ranges of month and year
    if(year < 1000 || year > 3000 || month == 0 || month > 12)
        return false;

    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    // Adjust for leap years
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
};

/**
 * Validates that the input string is a valid network string
 * Rule [OR-201]
 * @param strInput
 * @returns {isValid: boolean, invalidCode: boolean}
 * isValid: check if network string valid or not
 * invalidCode:
 * 		0: Valid
 * 		1: Not follow pre-defined format
 * 		2: The length of network is over 5 characters which is not make sense
 */
function checkValidNetworks(strInput) {
	var isValid = false;
	var invalidCode = 1;
	strInput = strInput.replace(/\s{2,}/g, ' ').trim();
	
	//Test all basic criteria
	var regex = /^[0-9]+\s*([\,\-]\s*[0-9]+\s*)*$/;
	if (regex.test(strInput)) {
		isValid = true;
		invalidCode = 0;
	}
	
	//Test some semantics condition (Ex. 3-4-5, 5-3)
	if (isValid) {
		var itemArr = strInput.replace(/ /g, '').split(",");
		_.each(itemArr, function(item) {
			if (item && item.indexOf("-") != -1) {
				var hyphenArr = item.split("-");
				if (hyphenArr.length !== 2) {
					isValid = false;
					invalidCode = 1;
				}
				var firstNum = Number.parseInt(hyphenArr[0]);
				var secondNum = Number.parseInt(hyphenArr[1]);
				
				if (firstNum > secondNum) {
					isValid = false;
					invalidCode = 1;
				}
			}
		});
	}
	
	//Test the length of network
	if (isValid) {
		var networkArr = strInput.replace(/ /g, '').split(/\,|\-/g);
		_.each(networkArr, function(network) {
			if (network.length > 5) {
				isValid = false;
				invalidCode = 2;
			}
		});
	}
	return {
		isValid : isValid,
		invalidCode: invalidCode
	};
}

/**
 * Help to round number into precision
 * @param number
 * @param precision
 */
function roundNumber(number, precision) {
	var m = Math.pow(10, precision);
	number *= m;
	return Math.round(number) / m;
}

/**
 * This function is to handle event keypress to allow only numeric input
 * 
 * @param e : the event object fired by keypress function
 */
function inputNumericOnly(e) {
	if((e.which != 8 // backspace
			&& e.which != 9// tab
			&& e.which != 0 //FF Tab
			) 
			&& isNaN(String.fromCharCode(e.which))
			|| String.fromCharCode(e.which) == " " // No space allowed 
	) {
		e.preventDefault();
	}
}

/**
 * This function is to handle event keypress to allow only numeric input
 * and  comma, dash, space
 * 
 * @param e : the event object fired by keypress function
 */
function isNumericGroup(e) {
	if(!(e.which == 8 // backspace
			&& e.which != 9 // tab
			&& e.which == 44 // comma
			&& e.which == 45 // dash
			&& e.which == 32  // space
			)) {
		if(isNaN(String.fromCharCode(e.which))){
			e.preventDefault();
		}
	} 
}


function onPaste(e) {
	let input = e.clipboardData.getData('text/plain');
	if (!isNumber(input)) {
		e.preventDefault();
	} else if (input < 0) {
		e.preventDefault();
	}
	// Trim white spaces from paste
	setTimeout(function () {
		let textbox = $(e.target);
		textbox.val(textbox.val().split(' ').join(''));
	}, 0);
},

/**
 * This function validates if the param is a positive number (including 0)
 * 
 * @param number : the event object fired by keypress function
 */
function isValidPossitiveNumber(number) {
	if(isNumber(number) && number >= 0 && number % 1 == 0) {
		if (number.toString().toLowerCase().indexOf("e") == -1) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
}

/**
 * This function is to handle event keypress to allow only character input
 * and  comma
 * 
 * @param e : the event object fired by keypress function
 */
function isCharacterGroup(e) {
	if(!(e.which == 8 // backspace
			&& e.which != 9 // tab
			&& e.which == 44 // comma
			&& e.which == 32  // space
			)) {
		if(isNumber(String.fromCharCode(e.which))){
			e.preventDefault();
		}
	} 
}

/**
 * This function is to highlight input controls border 
 * with red color when that field is empty.
 * 
 * @param selector : the jQuery selector for either a class or id
 * */
function markEmptyFields(selector) {
	$.each(selector, function(i, control) {
		if ($(control).val() == "" || $(control).val() == null) {
			$(control).addClass('hasError');
		} else {
			$(control).removeClass('hasError');
		}
	}); 
}

/**
 * This function is to highlight input controls border 
 * with red color when that field value exceeds Java 
 * max integer value.
 * 
 * @param selector : the jQuery selector for either a class or id
 * */
function markErrorForTooLargeNumber(selector) {
	$.each(selector, function(i, control) {
		if ($(control).val() > ACM_Constants.common.JavaMaxIntegerValue) {
			$(control).addClass('hasError');
		} else {
			$(control).removeClass('hasError');
		}
	}); 
}

/**
 * This function is to highlight input controls border 
 * with red color.
 * 
 * @param selector : the jQuery selector for either a class or id
 * */
function markErrorFields(selector) {
	$.each(selector, function(i, control) {
		$(control).addClass('hasError');
	}); 
}

/**
 * This function is used to remove red border highlight from
 * all error elements
 * 
 * */
function unhighlightErrorFields() {
	$('.hasError').removeClass('hasError');
}

function showLiferayNotificationMessage(wrapper, message, type, duration){
	
	var $elMsg = $('<div>'+message+'</div>');
	var timer = null;
	$elMsg.removeClass('portlet-msg-success').removeClass('portlet-msg-error').removeClass('portlet-msg-info');
	
	switch(type) {
	case ACM_Constants.common.messageTypeSuccess :
		$elMsg.addClass('portlet-msg-success');
		timer = ACM_Constants.common.messageTypeSuccessTimer;
		break;
	case ACM_Constants.common.messageTypeError :
		$elMsg.addClass('portlet-msg-error');
		timer = ACM_Constants.common.messageTypeErrorTimer;
		break;
	case ACM_Constants.common.messageTypeInfo :
		$elMsg.addClass('portlet-msg-info');
		timer = ACM_Constants.common.messageTypeInfoTimer;
		break;
	}
	
	if (typeof(duration) === "undefined") {
		duration = timer;
	}
	
	$(wrapper).html('').append($elMsg);
	
	$('html, body').animate({
        scrollTop: $(wrapper).offset().top - 200
    }, 500);
	
	if (typeof(duration) !== "undefined") {
		//Set timer to hide message
		setInterval(function(){
			$elMsg.remove();
		}, duration);
	}
}

function hideLiferayNotificationMessage(wrapper) {
	$(wrapper).removeClass('portlet-msg-success').removeClass('portlet-msg-error').removeClass('portlet-msg-info').html('');
}

function escapeHtml(string) {
	var entityMap = {
	    "&": "&amp;",
	    "<": "&lt;",
	    ">": "&gt;",
	    '"': '&quot;',
	    "'": '&#39;',
	    "/": '&#x2F;'
	};
	return String(string).replace(/[&<>"'\/]/g, function (s) {
		return entityMap[s];
	});
};


/**
 * Get URL param value
 * 
 * @param name: name of the param to retrieve value
 * 
 * **/
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};

/**
 * Convert long to time format ACM_Constants.common.timestampFormat
 * 
 * @param dateInLong: Date in long format
 * 
 * **/
function getDisplayTime(dateInLong) {
	var pattern = ACM_Constants.common.timestampFormat;
    var date = new Date(dateInLong);
    var month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
    var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var year = date.getFullYear();
    var hour = (date.getHours() < 10) ? "0" + date.getHours() : date.getHours();
    var minute = (date.getMinutes() < 10) ? "0" + date.getMinutes() : date.getMinutes();
    var output = pattern.replace("MM", month).replace("dd", day).
    			replace("yyyy", year).replace("hh", hour).replace("mm", minute);
    return output;
};


/**
 * Compare 2 objects
 * @return {boolean}
 * **/
function objectEquals(x, y) {
    'use strict';

    if (x === null || x === undefined || y === null || y === undefined) { return x === y; }
    // after this just checking type of one would be enough
    if (x.constructor !== y.constructor) { return false; }
    // if they are functions, they should exactly refer to same one (because of closures)
    if (x instanceof Function) { return x === y; }
    // if they are regexps, they should exactly refer to same one (it is hard to better equality check on current ES)
    if (x instanceof RegExp) { return x === y; }
    if (x === y || x.valueOf() === y.valueOf()) { return true; }
    if (Array.isArray(x) && x.length !== y.length) { return false; }

    // if they are dates, they must had equal valueOf
    if (x instanceof Date) { return false; }

    // if they are strictly equal, they both need to be object at least
    if (!(x instanceof Object)) { return false; }
    if (!(y instanceof Object)) { return false; }

    // recursive object equality check
    var p = Object.keys(x);
    return Object.keys(y).every(function (i) { return p.indexOf(i) !== -1; }) &&
        p.every(function (i) { return objectEquals(x[i], y[i]); });
}

/**
 * Open confirm dialog when leaving page
 * 
 * **/
function openPopupConfirmLeavePage(options) {
	AUI().use('aui-dialog', function(A) {
		var buttons = [{
			handler: function() {
				this.close();
			},
			label: options.buttonLabels_NO
			},{
			handler: function() {
				if (options["callback"] && typeof options["callback"] == "function") {
					options["callback"]();
				} else {
					var context = options["context"];
					context.click();
				}
				this.close();
			},
			label: options.buttonLabels_YES
		}];
	    
	    var dialog = new A.Dialog({
	    	  bodyContent: _.template("<span style='margin-left: 10px;'><#= message #></span>", {message: options.message}),
	          buttons: buttons,
	          centered: true,
	          draggable: false,
	          resizable: false,
	          title: options.title,
	          width: 600,
	          destroyOnClose: true,
	          modal: true
        }).render();
	    registerCloseDialogEvent(dialog);
	});
};

/**
 * @memberOf Popup
 */	
function registerCloseDialogEvent(dialog) {
	 $(document).keyup(function(e) {
		if (e.keyCode == 27) { /* escape key */
			dialog.close();
		}
	});
};

/**
 * @memberOf Utility
 */
function getCaretPosition(oField) {

	// Initialize
	var iCaretPos = 0;

	// IE Support
	if (document.selection) {

		// Set focus on the element
		oField.focus();

		// To get cursor position, get empty selection range
		var oSel = document.selection.createRange();

		// Move selection start to 0 position
		oSel.moveStart('character', -oField.value.length);

		// The caret position is selection length
		iCaretPos = oSel.text.length;
	}

	// Firefox support
	else if (oField.selectionStart || oField.selectionStart == '0')
		iCaretPos = oField.selectionStart;

	// Return results
	return (iCaretPos);
};

function isKeyDownPrintableChar(e) {
	var keycode = e.keyCode;

    var valid = 
        (keycode > 47 && keycode < 58)   || // number keys
        keycode == 32 || keycode == 13   || // spacebar & return key(s) (if you want to allow carriage returns)
        (keycode > 64 && keycode < 91)   || // letter keys
        (keycode > 95 && keycode < 112)  || // numpad keys
        (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
        (keycode > 218 && keycode < 223);   // [\]' (in order)

    return valid;
};

function wordwrap(str, maxLength, breakChar, mode){
    var i, j, l, s, r;
    if(maxLength < 1)
        return str;
    for(i = 0, l = (r = str.split("\n")).length; i < l; i++) {
        for(s = r[i], r[i] = ""; s.length > maxLength; r[i] += s.slice(0, j) + ((s = s.slice(j)).length ? breakChar : "")) {
        	j = mode == 2 || (j = s.slice(0, maxLength + 1).match(/\S*(\s)?$/))[1] ? maxLength : j.input.length - j[0].length
        			|| mode == 1 && maxLength || j.input.length + (j = s.slice(maxLength).match(/^\S*/)).input.length;
        }
        r[i] += s;
    }
    return r.join("\n");
};

/**
 * This function changes default jqgrid header style
 */
function removeDefaultCssJqgrid() {
	$('.ui-jqgrid .ui-jqgrid-hdiv').removeClass('ui-jqgrid-hdiv').addClass('ui-jqgrid-hdiv2');
};

/**
 * This function show all sort icon without enable sort
 */
function showSortIconJGrid(tableWrapper) {
	$('.s-ico').show();
	$('.s-ico').addClass('ui-state-highlight');
   /* $('#gbox_' + $.jgrid.jqID($(tableWrapper)[0].id) +' tr.ui-jqgrid-labels th.ui-th-column').each(function (i) {
    	$(this).find('>div.ui-jqgrid-sortable>span.s-ico').show();
    	$(this).addClass('ui-state-highlight');
    });*/
};

//function renderDialog(titlePopup, templateHtml, templateRenderObj, btnLabels, btnHandlers) {
//	var noHandler = btnHandlers.no;
//	var yesHandler = btnHandlers.yes;
//	if (typeof(noHandler) === 'undefined') {
//		noHandler = function() {
//			this.close();
//		}
//	}
//	
//	AUI().use('aui-dialog', function(A) {
//		var buttons = [{
//				handler: noHandler,
//				label: btnLabels.no
//			},{
//				handler: yesHandler,
//				label: btnLabels.yes
//		}];
//	    
//	    var dialog = createDialog(titlePopup, templateHtml, templateRenderObj, buttons, A).render();
//	    registerCloseDialogEvent(dialog);
//     });
//};

function renderDialog(titlePopup, templateRenderObj, templateHtml, buttons) {

	AUI().use('aui-dialog', function(A) {
		var dialog = new A.Dialog({
			bodyContent : _.template(templateHtml, templateRenderObj),
			buttons : buttons,
			centered : true,
			draggable : false,
			resizable : false,
			title : titlePopup,
			width : 600,
			destroyOnClose : true,
			modal : true
		}).render();
		registerCloseDialogEvent(dialog);
	});
};