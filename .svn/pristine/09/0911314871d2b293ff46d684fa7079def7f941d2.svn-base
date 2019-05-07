$(function () {
    $(".ftc_wzsf").hide();
    $(".close01").click(function () {
        $(".ftc_wzsf").hide();
    });

    //支付框的相关内容
    var i = 0;
    var strPWD = "";
    var requestAgainFlag = 0;
    $(".nub_ggg li a").click(function () {
        //requestAgainFlag用于防止重复点击
        if (requestAgainFlag == 1) {
            return;
        }
        requestAgainFlag = 1;

        i++;
        strPWD = strPWD + $(this).html();
        $(".mm_box li").eq(i - 1).addClass("mmdd");

        if (i > 5) {
            setTimeout(function () {
                //调用卡消费密码支付接口
                requestAgain(strPWD, token, transactionType);

                //把所有参数置于初始状态
                i = 0;
                strPWD = "";
                clear();
                requestAgainFlag = 0;
            }, 500);
        }
        else {
            requestAgainFlag = 0;
        }
    });

    $(".nub_ggg li .del").click(function () {
        if (i > 0) {
            i--;
            strPWD = strPWD.substr(0, strPWD.length - 1);
            $(".mm_box li").eq(i).removeClass("mmdd");
        }
    });
})

//输入完密码之后再次请求服务器
function requestAgain(PWD, accessToken, transType) {
    var strURL;
    if (transType == 0) {
        strURL = __api_url + 'Payment/TransactionPwdValidate';
    }
    if (transType == 1) {
        strURL = __api_url + 'Card/TransactionPwdValidate';
    }
    $.ajax({
        url: strURL,
        type: 'POST', //POST
        async: false,    //或false,是否异步
        beforeSend: function (request) {
            request.setRequestHeader("access_token", accessToken);
        },
        data: {
            membershipId: tempData.MembershipId.toUpperCase(),
            membershipPwd: PWD,
            transactionId: tempTransId
        },
        timeout: __const_timeout,    //超时时间（暂时设置为10秒）
        dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
        success: function (data, textStatus, jqXHR) {
            if (data.code == 0) {
                if (data.deductionpoint == null || data.deductionpoint == "" || data.deductionpoint == "0") {
                    location.href = "../Card/paymentSuccess?deductionAmount=" + data.deductionamount + "&enterpriseid=" + getUrlParam("enterpriseid") + "&storeName=" + encodeURIComponent(data.storename);
                }
                else {
                    location.href = "../Card/paymentSuccess?deductionPoint=" + data.deductionpoint + "&enterpriseid=" + getUrlParam("enterpriseid") + "&storeName=" + encodeURIComponent(data.storename);
                }
            }
            else {
                alert(data.errormsg);
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            alert("操作失败：调用接口异常");
        },
        complete: function () {
        }
    });
}

//清空所有输入内容
function clear() {
    for (var j = 0; j < 6; j++) {
        $(".mm_box li").eq(j).removeClass("mmdd");
    }
}
