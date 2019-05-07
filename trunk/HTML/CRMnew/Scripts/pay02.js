$(function () {
    $(".ftc_wzsf").show();
    $(".close01").click(function(){
        $(".ftc_wzsf").hide();
    });
    //----
    //支付框的相关内容
    var i = 0;
    $(".nub_ggg li a").click(function () {
        if (i<=5) {
            i++;
            strPWD = strPWD + $(this).html();
            $(".mm_box li").eq(i - 1).addClass("mmdd");
        }
    });

    $(".nub_ggg li .del").click(function(){
        if(i>0){
            i--;
            strPWD = strPWD.substr(0, strPWD.length - 1);
            $(".mm_box li").eq(i).removeClass("mmdd");
        }
    });
})
