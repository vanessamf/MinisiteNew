$(function () {
    $(".ftc_wzsf").show();
    $(".close01").click(function(){
        $(".ftc_wzsf").hide();
    });
    //----
    var i = 0;
    $(".nub_ggg li a").click(function(){
        i++
        if(i<6){
            $(".mm_box li").eq(i-1).addClass("mmdd");
        }else{
            $(".mm_box li").eq(i-1).addClass("mmdd");
            setTimeout(function(){
                location.href="cg.html";
            },500);
            //window.document.location="cg.html"
        }
    });

    $(".nub_ggg li .del").click(function(){

        if(i>0){
            i--
            $(".mm_box li").eq(i).removeClass("mmdd");
            i==0;
        }
        //alert(i);
    });
})
