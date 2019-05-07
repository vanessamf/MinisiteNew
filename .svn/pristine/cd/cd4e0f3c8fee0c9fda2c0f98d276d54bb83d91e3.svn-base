var $html = $('html');
var $body = $('body'),
	$modal = $('.modal'),
	$bg_md = $('.bg-modal'),
	$side_days = $('.pt-side'),
	val_day = ''
var stop_flag = false; //标识，初始为0
var cur_date = new Date(),
	c_day = cur_date.getDay()


function stopPropagationAp(e) {
	e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
}

function getYMD(day) {
	var today = new Date();
	var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;

	today.setTime(targetday_milliseconds);
	var tYear = today.getFullYear(),
		tMonth = today.getMonth(),
		tDate = today.getDate();
	tMonth = doHandleMonth(tMonth + 1);
	tDate = doHandleMonth(tDate);
	return (tYear + '-' + tMonth + '-' + tDate).trim();
}

function doHandleMonth(month) {
	var m = month;
	if (month.toString().length == 1) {
		m = "0" + month;
	}
	return m;
}
//字符串转为时间对象
function getDate(strDate) {
	var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/,
		function(a) {
			return parseInt(a, 10) - 1;
		}).match(/\d+/g) + ')');
	return date;
}
//绑定右侧时间
function defaultSeled(timeList) {
	$('.pt-time-period').empty();
	//selectTime = getYMD($(".sel-which-day.active").attr('addDay')) + " " + $(".itime.active").text();
	var selTime = $("#txtEstimatedArriveTime").attr("data-dateTime"); //获取时间data-dateTime
	var setTimeText = $("#txtEstimatedArriveTime").text(); //控件的text
	$.each(timeList, function(key, value) {
		if (key != 0) {
			// debugger;
			if (value == setTimeText) {
				$('.pt-time-period').append('<div class="itime active">' + value + '</div>')
			} else {
				var matchTime = getYMD($(".sel-which-day.active").attr('addDay')) + " " + value;
				// $.contains( matchTime, selTime)
				if (matchTime.indexOf(selTime.split(" ")[0]) != -1&&matchTime.indexOf(selTime.split(" ")[1]) != -1)
					$('.pt-time-period').append('<div class="itime active">' + value + '</div>')
				else
					$('.pt-time-period').append('<div class="itime">' + value + '</div>')
			}
		}
	})
}
//首次绑定右侧时间
function FirstDefaultSeled(timeList) {
	$('.pt-time-period').empty();
	$.each(timeList, function(key, value) {
		if (key != 0) {
			if (key == 1)
				$('.pt-time-period').append('<div class="itime active" >' + value + '</div>')
			else
				$('.pt-time-period').append('<div class="itime" >' + value + '</div>')
		}
	})
	var curTime = getYMD(0) + " " + timeList[0];
	// $("#txtEstimatedArriveTime").val(timeList[0]);
	$("#txtEstimatedArriveTime").attr("value", timeList[0]);
	$("#txtEstimatedArriveTime").text(timeList[0]);
	$("#txtEstimatedArriveTime").attr("data-dateTime", timeList[0]);
}

//首次绑定左侧时间
function FirstLefttSeled(timeList) {
	$side_days.empty();
	$.each(timeList, function(key, value) {
		var active = (key === 0 ? 'active' : '');
		var strArray = value.split('|');
		$side_days.append('<div class="sel-which-day ' + active + '" key=' + key + ' addDay=' + strArray[1] + '>' +
			strArray[0] + '</div>')
	})
}
// var timeList={1:"17:32",2:"17:45",3:"18:00"};
// var timeList=["17:00","17:32","17:45","18:00"];
var timeList = {
	Item0: ["今日（周一）|0", "明日（周二）|1", "28日（周三）|2", "29日（周四）|3", "30日（周五）|4", "31日（周六）|5", "1日（周日）|6"],
	Item1: ["立即取餐|预计 17:32", "立即取餐|预计 17:32", "17:45", "18:00"],
	Item2: ["07:30", "07:45", "08:00", "08:15", "08:30", "08:45", "09:00", "09:15", "09:30", "09:45", "10:00", "10:15",
		"10:30", "10:45", "11:00", "12:15", "12:30", "12:45", "13:00", "13:15", "13:30", "13:45", "14:00", "14:15", "14:30",
		"14:45", "15:00", "15:15", "15:30", "16:45", "17:00", "17:15", "17:30", "17:45", "18:00", "18:15", "18:30", "18:45",
		"19:00", "19:15", "19:30", "19:45", "20:00", "20:15", "20:30", "20:45", "21:00", "21:15", "21:30"
	]
}

FirstLefttSeled(timeList.Item0);
FirstDefaultSeled(timeList.Item1);

function IsHaveOtherChar(str) {
	var regCH = new RegExp("[\\u4E00-\\u9FFF]+", "g");
	var regEN = new RegExp("[a-zA-Z]");
	if (regCH.test(str) || regEN.test(str))
		return true;
	return false;
}

/*var ModalHelper = (function(bodyCls) {
	var scrollTop;
	return {
	  afterOpen: function() {
		scrollTop = document.scrollingElement.scrollTop;
		document.body.classList.add(bodyCls);
		document.body.style.top = -scrollTop + 'px';
	  },
	  beforeClose: function() {
		document.body.classList.remove(bodyCls);
		document.scrollingElement.scrollTop = scrollTop;
	  }
	};
})('modal-open');*/

$('.time-info').on('click', '#txtEstimatedArriveTime', function(e) {
	//$side_days.empty();
	var _self = $(this),
		this_val = _self.val(),
		seled_time = this_val && getDate(this_val),
		mark_week, inx;

	//防止页面滑动 注：必须对html和body都设置overflow:hidden，移动端才能禁止滑动
	$('html').css({
		"overflow": "hidden"
	}) && $('body').addClass('in') && $(".pop-bg").show() && $('#selTablewareModal').show()
	// ModalHelper.afterOpen();
})

//监听滚动事件
//$('.modal-container')[0].addEventListener('touchmove',stopBodyScroll,false);
$('.main-cont').on('click', '.sel-which-day', function(e) {
	e.stopPropagation();
	var _self = $(this)
	_self.addClass('active').siblings().removeClass('active') && $('.pt-time-period').animate({
		scrollTop: 0
	}, 500);

	//动态改变时间段
	if (_self.attr("key") != 0)
		defaultSeled(timeList.Item2)
	else
		defaultSeled(timeList.Item1)
})

//选择送达时间
$('.main-cont').on('click', '.itime', function() {
	var _self = $(this)
	_self.addClass('active').siblings().removeClass('active')
	var datetime = $side_days.find('.active').data('vtime')
	datetime += ' ' + $('.pt-time-period').find('.active').text()
	$('#appTime').val(datetime) && $html.css({
		"overflow": "auto"
	}) && $body.removeClass('in') && $(".pop-bg").hide() && $('#selTablewareModal').hide();
	// ModalHelper.beforeClose();
	//var key = $(".sel-which-day.active").attr('key');
	var selectTime
	var attrDateTime
	if (!IsHaveOtherChar($(".itime.active").text())) {
		selectTime = getYMD($(".sel-which-day.active").attr('addDay')) + " " + $(".itime.active").text();
		attrDateTime = getYMD($(".sel-which-day.active").attr('addDay')) + " " + $(".itime.active").text();
	} else {
		selectTime = $(".itime.active").text();
		attrDateTime = getYMD($(".sel-which-day.active").attr('addDay')) + " " + $(".itime.active").text().replace(
			/[\u4e00-\u9fa5a-zA-Z\|]/g, '').trim();
	}

	// $("#txtEstimatedArriveTime").val(selectTime);
	$("#txtEstimatedArriveTime").attr("value", selectTime);
	$("#txtEstimatedArriveTime").text(selectTime);
	$("#txtEstimatedArriveTime").attr("data-dateTime", attrDateTime);

})

//关闭时间弹框
$modal.on('click', function(e) {
	stopPropagationAp(e);
	$html.css({
		"overflow": "auto"
	}) && $body.removeClass('in') && $(".pop-bg").hide()
	// ModalHelper.beforeClose();
})
$modal.on('click', '.datetime-picker-box', function(e) {
	stopPropagationAp(e);
})
