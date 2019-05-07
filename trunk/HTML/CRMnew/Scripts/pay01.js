$(function () {
    $(".ftc_wzsf").show();
    $(".close01").click(function () {
        $(".ftc_wzsf").hide();
    });
    //----
    //支付框的相关内容
    var i = 0;
    var strPWD = "";
    var requestAgainFlag = 0;
    $(".nub_ggg li a").click(function () {
        if (i > 6) {
            return;
        }
        //requestAgainFlag用于防止重复点击
        if (requestAgainFlag == 1) {
            return;
        }
        requestAgainFlag = 1;

        i++;
        strPWD = strPWD + $(this).html();

        $(".mm_box li").eq(i - 1).addClass("mmdd");
        if (i > 5) {
            //alert(strPWD);
            setTimeout(function () {
                //调用卡消费密码支付接口
                requestAgain(strPWD);

                //把所有参数置于初始状态
                i = 0;
                strPWD = "";
                clear();

                //设置按钮可用
                setTimeout(function () {
                    requestAgainFlag = 0;
                }, 500);
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

//清空所有输入内容
function clear() {
    for (var j = 0; j < 6; j++) {
        $(".mm_box li").eq(j).removeClass("mmdd");
    }
}
