var i = 1;
$(document).ready(function () {
    $(".toggle").click(function () {
        $(".nav").toggleClass("nav--visible");
    });
    $(".next--step").click(function () {
        if(i === 1){
            $(".slidepage-1").addClass("next-page");
            $(".bullet-2").addClass("hide");
            $(".check-2").removeClass("hide");
            i++;
        }else if(i === 2){
            $(".slidepage-2").addClass("next-page");
            $(".bullet-3").addClass("hide");
            $(".check-3").removeClass("hide");
            i++;
        }
        console.log(i);
    });
    $(".prev--step").click(function () {
        if(i === 2){
            $(".slidepage-1").removeClass("next-page");
            $(".bullet-2").removeClass("hide");
            $(".check-2").addClass("hide");
            i--;
        }else if(i === 3){
            $(".slidepage-2").removeClass("next-page");
            $(".bullet-3").removeClass("hide");
            $(".check-3").addClass("hide");
            i--;
        }
        console.log(i);
    });
    $(".submit--Btn").click(function(){
        $(".reg--modal").removeClass("hide--modal");
        i=0;
    });
});
