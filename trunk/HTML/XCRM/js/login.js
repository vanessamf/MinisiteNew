$(function(){

    //login����ͼƬ
    $(".bg").height($(window).height());
    $(window).resize(function(){
        $(".bg").height($(window).height());
    })

    //��֤��¼��Ϣ--�û���
    $('#userErrorText').hide();
    $("#userName").blur(function(){
        if ($(this).val() == '') {
            $("#userErrorText").hide();
            //$(".userName").css('background','url(images/user_icon.png) 5px center no-repeat');
        } else if (!/[a-zA-Z0-9_]{2,20}/.test($(this).val())) { //�޸����򼴿�
            $("#userErrorText").show();
            //$(".userName").css('background','url(images/user_icon_e.png) 5px center no-repeat');
        } else {
            $("#userErrorText").hide();
            //$(".userName").css('background','url(images/user_icon.png) 5px center no-repeat');
        }
    });
    //��֤��¼��Ϣ--����
    $('#PWErrorText').hide();
    $("#passWord").blur(function(){
        if ($(this).val() == '') {
            $("#PWErrorText").hide();
           // $(".passWord").css('background','url(images/lock_icon.png) 5px center no-repeat');
        } else if (!/[a-zA-Z0-9_]{2,20}/.test($(this).val())) { //�޸����򼴿�
            $("#PWErrorText").show();
           // $(".passWord").css('background','url(images/lock_icon_e.png) 5px center no-repeat');
        } else {
            $("#PWErrorText").hide();
            //$(".passWord").css('background','url(images/lock_icon.png) 5px center no-repeat');
        }
    });

})
