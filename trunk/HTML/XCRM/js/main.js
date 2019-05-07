$(function(){

    //退出显示隐藏
    var u = 1;
    $(".user").click(function(){
        if(u==1){
            $(".dropDown").show();
            u=2;
        }else if(u==2){
            $(".dropDown").hide();
            u=1;
        }
    });

    $(".main-b").height($(window).height()-160);
    $(window).resize(function(){
        $(".main-b").height($(window).height()-160);
    });

    //采购单-查询表单的显示隐藏
    $("#purchaseInfo").hide();
    var flag = 1;
    $("#search,.btn-box button").click(function(){
        if(flag==1){
            $("#purchaseInfo").show();
            flag=2;
        }else if(flag==2){
            $("#purchaseInfo").hide();
            flag=1;
        }
    });


    $(".wrapper-table").height($(window).height()-252);
    $(window).resize(function(){
        $(".wrapper-table").height($(window).height()-252);
    });

    //复选按钮的全选、全不选
    $("#checkAll").click(function(){
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

    //删除采购单时的错误提醒信息
    $("#del-btn").click(function(){
        var h = $(".w500").height()/2*(-1);
        var w = $(".w500").width()/2*(-1);
        $(".w500").css({
            'margin-top':h + 'px',
            'margin-left':w + 'px'
        });
        $("#purchase").show();
        $(".pop_bg").show();
    });
    $("#pur_cancel").click(function(){
        $("#purchase").hide();
        $(".pop_bg").hide();
    });
    $("#pur_submit").click(function(){
        $("#purchase").hide();
        $(".pop_bg").hide();
        $(".error_text p").slideDown();
        setTimeout(function(){
            $(".error_text p").slideUp();
        },2000);
    });

    //更多查询条件的显示及隐藏
    $("#items").hide();
    var i = 1;
    $(".more-btn").click(function(){
        if(i==1){
            $("#items").slideDown();
            i=2;
        }else if(i==2){
            $("#items").slideUp();
            i=1;
        }
    });
    //添加采购单后信息提醒功能
    $("#submit-btn").click(function(){
        $(".error_text p").slideDown();
        setTimeout(function(){
            $(".error_text p").slideUp();
            window.history.go(-1);
        },2000);
    });
    $("#receivingGoods").click(function(){
        $(".error_text p").slideDown();
        setTimeout(function(){
            $(".error_text p").slideUp();
            window.history.go(-1);
        },2000);
    });


    //添加采购单保存成功提醒功能
    $("#save-btn").click(function(){
        var h = $(".w500").height()/2*(-1);
        var w = $(".w500").width()/2*(-1);
        $(".w500").css({
            'margin-top':h + 'px',
            'margin-left':w + 'px'
        });
        $("#save-box").show();
        $(".pop_bg").show();
        setTimeout(function(){
            $("#save-box").fadeOut();
            $(".pop_bg").fadeOut();
        },1000);
    });


    $(".box").height($(window).height()-273);
    $(window).resize(function(){
        $(".box").height($(window).height()-273);
    });

    //添加采购单，商品编号查询按钮的显示
    $(".f-td").click(function(){
        $(this).parent().children().children(".s").show();
        $(this).parent().siblings().children().children(".s").hide();
    });

    $(".hide-td").hide();
    var h_i = 1;
    $(".show-td").click(function(){
        if(h_i==1){
            $(".hide-td").show();
            $(this).addClass("show-td-h");
            h_i=2;
        }else if(h_i==2){
            $(".hide-td").hide();
            $(this).removeClass("show-td-h");
            h_i=1;
        }
    });

    //添加商品
    $(".s, #add-product-btn").click(function(){
        var h = $("#add-product").height()/2*(-1);
        $("#add-product").css({
            'margin-top':h + 'px'
        });
        $("#add-product").show();
        $(".pop_bg").show();
    });
    $("#add-btn,.pop h1 a,#add-md-btn").click(function(){
        $("#receive-refuse").hide();
        $("#add-product").hide();
        $("#time").hide();
        $("#batch-import-box").hide();
        $("#batch-import-error").hide();
        $(".pop_bg").hide();
        $("#add-md").hide();
    });
    //添加门店
    $("#add-md-btton").click(function(){
        var h = $("#add-md").height()/2*(-1);
        $("#add-md").css({
            'margin-top':h + 'px'
        });
        $("#add-md").show();
        $(".pop_bg").show();
    });

    //采购单退出功能
    $("#quit-btn").click(function(){
        var h = $(".w500").height()/2*(-1);
        var w = $(".w500").width()/2*(-1);
        $(".w500").css({
            'margin-top':h + 'px',
            'margin-left':w + 'px'
        });
        $("#quit").show();
        $(".pop_bg").show();
    });
    $("#add-pur-cancel").click(function(){
        $("#quit").hide();
        $(".pop_bg").hide();
        if(u==1){
            $(".dropDown").show();
            u=2;
        }else if(u==2){
            $(".dropDown").hide();
            u=1;
        }
    });
    $("#add-pur-submit").click(function(){
        $("#quit").hide();
        $(".pop_bg").hide();
        setTimeout(function(){
            //window.history.go(-1);
            window.open('login.html','_parent')
        },300);
        if(u==1){
            $(".dropDown").show();
            u=2;
        }else if(u==2){
            $(".dropDown").hide();
            u=1;
        }
    });

    //打印功能
    $("#print").click(function(){
        window.print();
    });

    //开业库存
    $("#submit-stock").click(function(){
        var h = $(".w500").height()/2*(-1);
        var w = $(".w500").width()/2*(-1);
        $(".w500").css({
            'margin-top':h + 'px',
            'margin-left':w + 'px'
        });
        $("#stock").show();
        $(".pop_bg").show();
    });
    $("#stock-cancel,#stock-submit").click(function(){
        $("#stock").hide();
        $(".pop_bg").hide();
    });

    //开始盘点
    $("#startTaking").click(function(){
        $("#time").show();
        $(".pop_bg").show();
    });
    $("#t-cancel,#t-submit").click(function(){
        $("#time").hide();
        $(".pop_bg").hide();
    });


    //------------------------------------------------------收货单-------------------------------------------------------

    //收货按钮，只能单个收货提醒框
    $("#receiving-btn").click(function(){
        var h = $(".w500").height()/2*(-1);
        var w = $(".w500").width()/2*(-1);
        $(".w500").css({
            'margin-top':h + 'px',
            'margin-left':w + 'px'
        });
        $("#receiving").show();
        $(".pop_bg").show();
    });
    $("#receive-submit").click(function(){
        $("#receiving").hide();
        $(".pop_bg").hide();
    });

    //确认收货按钮
    $("#receive-btn").click(function(){
        var h = $(".w500").height()/2*(-1);
        var w = $(".w500").width()/2*(-1);
        $(".w500").css({
            'margin-top':h + 'px',
            'margin-left':w + 'px'
        });
        $("#receive").show();
        $(".pop_bg").show();
    });
    $("#re-cancel").click(function(){
        $("#receive").hide();
        $(".pop_bg").hide();
    });
    $("#re-submit").click(function(){
        $("#receive").hide();
        $(".pop_bg").hide();
        setTimeout(function(){
            window.history.go(-1);
        },300)
    });

    //拒绝收货按钮
    $("#refuse-btn").click(function(){
        var h = $(".w500").height()/2*(-1);
        var w = $(".w500").width()/2*(-1);
        $(".w500").css({
            'margin-top':h + 'px',
            'margin-left':w + 'px'
        });
        $("#receive-refuse").show();
        $(".pop_bg").show();
    });
    $("#receive-refuse-cancel").click(function(){
        $("#receive-refuse").hide();
        $(".pop_bg").hide();
    });
    $("#receive-refuse-submit").click(function(){
        $("#receive-refuse").hide();
        $(".pop_bg").hide();
        setTimeout(function(){
            window.history.go(-1);
        },300)
    })

    //批量导入
    $("#batch-import-btn").click(function(){
        var h = $("#batch-import-box").height()/2*(-1);
        $("#batch-import-box").css({
            'margin-top':h + 'px'
        });
        $("#batch-import-box").show();
        $(".pop_bg").show();
    });
    $("#batch-cancel").click(function(){
        $("#batch-import-box").hide();
        $("#file_error").hide();
        $(".pop_bg").hide();
    });
    $("#batch-submit").click(function(){

        var file = $("#UpFile").val();
        var strFileName=file.replace(/^.+?\\([^\\]+?)(\.[^\.\\]*?)?$/gi,"$1");  //正则表达式获取文件名，不带后缀
        var FileExt=file.replace(/.+\./,"");   //正则表达式获取后缀

        if(FileExt=="xls" || FileExt=="xlsx"){
            $("#batch-import-box").hide();
            var h = $("#batch-import-error").height()/2*(-1);
            $("#batch-import-error").css({
                'margin-top':h + 'px'
            });
            $("#batch-import-error").show();
        }else{
            $("#batch-import-box").hide();
            var h = $("#file_error").height()/2*(-1);
            var w = $("#file_error").width()/2*(-1);
            $("#file_error").css({
                'margin-top':h + 'px',
                'margin-left':w + 'px'
            });
            $("#file_error").show();
            setTimeout(function(){
                $("#batch-import-box").show();
            },1500)
        }

    })
    $("#batch-close").click(function(){
        $("#batch-import-error").hide();
        $("#batch-import-box").show();
        $("#file_error").hide();
    })


})

//首页顶部Tab菜单
function Tab(name, cursel, n) {
    for (i = 0; i < n; i++) {
        var menu = document.getElementById(name + i);
        var con = document.getElementById( name + "_" + i);
        menu.className = i == cursel ? "hover" : "";
        con.style.display = i == cursel ? "block" : "none";
    }
}