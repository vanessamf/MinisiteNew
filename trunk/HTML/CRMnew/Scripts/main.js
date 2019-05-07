$(function () {
    var value = $(".card-top h1").text().replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, "$1 ");
    $(".card-top h1").text(value);

    $(".deposit li").not(".deposit li:last").click(function () {
        //$(this).addClass("active");
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
        } else {
            $(this).addClass("active").siblings().removeClass("active");
            $("#num-text").show();
            $("#num-input").hide();
        }
    })

    $("#num-input").hide();
    $(".deposit li:last").click(function () {
        $(this).addClass("active").siblings().removeClass("active");
        $("#num-text").hide();
        $("#num-input").show().focus().css({ "color": "#fff" });
        $("#num-input").blur(function () {
            //$(this).val("");
        })
    });

    var menuList = $('.menuList');
    $('.ListTitle').each(function (i) {
        $(this).click(function () {
            if ($(menuList[i]).css('display') == 'none') {
                $(menuList[i]).slideDown(300);
                $(this).addClass("down");
            }
            else {
                $(menuList[i]).slideUp(300);
                $(this).removeClass("down");
            }
        });
    });

})

function snNewsTab(name, cursel, n) {
    for (i = 0; i < n; i++) {
        var menu = document.getElementById(name + i);
        var con = document.getElementById("con_" + name + "_" + i);
        menu.className = i == cursel ? "sn_hover" : "";
        con.style.display = i == cursel ? "block" : "none";
    }
}

function Tab(name, cursel, n) {
    for (i = 0; i < n; i++) {
        var menu = document.getElementById(name + i);
        var hot = document.getElementById("tab_" + name + "_" + i);
        menu.className = i == cursel ? "tab_hover" : "";
        hot.style.display = i == cursel ? "block" : "none";
    }
}