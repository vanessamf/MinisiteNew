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

    var $m_btn = $('.more-btn')
        ,$more_bx = $(".more-box")
    $('body').on('click',function(e){
        ( $more_bx.css('display') === "block" ) && $more_bx.hide()
    })

    //优惠券管理 更多
    $m_btn.on('click','i',function(e){
        $more_bx.toggle()
        e = e||event,e.stopPropagation?e.stopPropagation():e.cancelBubble=true;
    }),
   $m_btn.on('click','p',function(e){
       $more_bx.hide();
    })

    /*
    * 开关操作--状态
    *
    * */
   /* $('table .op-list').on('click','.state-toggle',function(e){
        var _this = $(this)
            ,parent_tr = _this.closest('tr')
            ,m_state =  parent_tr.find('.mk-state')
        _this.toggleClass('active')
        m_state.text().indexOf('启用') > -1 ? m_state.text('已停用') : m_state.text('已启用')
    });*/

    $('table .op-list').on('click','.btn',function(e){
        var $this = $(this)
            ,pt_tr = $this.closest('tr')
        if($this.hasClass('btn-state')){
            var mk_state = pt_tr.find('.mk-state')
            mk_state.text().indexOf('停用') > -1 ? mk_state.text('已启用') : mk_state.text('已停用')
            $this.text().indexOf('停用') > -1 ? $this.text('启用') : $this.text('停用')
            return;
        }else if($this.hasClass('btn-delete')){
            pt_tr.remove()
        }
    })
});