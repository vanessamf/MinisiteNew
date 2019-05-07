$(function(){
    var h = $(window).height();
    $(".leftSidebar_box").css({"height":h-72 + "px"});

    $(window).resize(function(){
        var h = $(window).height();
        $(".leftSidebar_box").css({"height":h-72 + "px"});
    });



    //复选按钮的全选、全不选
    $("#checkAll").click(function () {
        if(this.checked){
            $(".table tbody :checkbox").prop("checked", true);
            $(".table tbody tr td").addClass("odd");
        }else{
            $(".table tbody :checkbox").prop("checked", false);
            $(".table tbody tr td").removeClass("odd");
        }
    });

    $(".table tbody input[type=checkbox]").click(function(){
        if ($(this).prop("checked")) {
            $(this).parent().parent().children("td").addClass("odd");
        }else{
            $(this).parent().parent().children("td").removeClass("odd");
        }
    });

    //nav bar
    $(".ny_zblb1 ul li").click(function(){
        var thisSpan=$(this);
        $(".ny_zblb1 ul li ul").prev("a").removeClass("cur");
        $("ul", this).prev("a").addClass("cur");
        $(this).children("ul").slideDown("fast");
        $(this).siblings().children("ul").slideUp("fast");
    })
    //--------------------------------------------------------------------------------


    $(".tab em").click(function () {
        $(this).addClass("active").siblings().removeClass("active")
    })
    //用户中心展示 更多
    var u = 1;
    $(".user").click(function(){
        if(u==1){
            $(".dropDown").show();
            $(".user label").addClass("active");
            u=2;
        }else if(u==2){
            $(".dropDown").hide();
            $(".user label").removeClass("active");
            u=1;
        }
    });

    //优惠券管理 更多
    $(".more-btn i").click(function(){
        $(".more-box").show();
    });
    $(".more-box p").click(function () {
        $(".more-box").hide();
    });

});