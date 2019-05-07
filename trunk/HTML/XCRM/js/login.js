$(function(){

    //login顶部图片
    $(".bg").height($(window).height());
    $(window).resize(function(){
        $(".bg").height($(window).height());
    })

    //验证登录信息--用户名
    $('#userErrorText').hide();
    $("#userName").blur(function(){
        if ($(this).val() == '') {
            $("#userErrorText").hide();
            //$(".userName").css('background','url(images/user_icon.png) 5px center no-repeat');
        } else if (!/[a-zA-Z0-9_]{2,20}/.test($(this).val())) { //修改正则即可
            $("#userErrorText").show();
            //$(".userName").css('background','url(images/user_icon_e.png) 5px center no-repeat');
        } else {
            $("#userErrorText").hide();
            //$(".userName").css('background','url(images/user_icon.png) 5px center no-repeat');
        }
    });
    //验证登录信息--密码
    $('#PWErrorText').hide();
    $("#passWord").blur(function(){
        if ($(this).val() == '') {
            $("#PWErrorText").hide();
           // $(".passWord").css('background','url(images/lock_icon.png) 5px center no-repeat');
        } else if (!/[a-zA-Z0-9_]{2,20}/.test($(this).val())) { //修改正则即可
            $("#PWErrorText").show();
           // $(".passWord").css('background','url(images/lock_icon_e.png) 5px center no-repeat');
        } else {
            $("#PWErrorText").hide();
            //$(".passWord").css('background','url(images/lock_icon.png) 5px center no-repeat');
        }
    });

})
