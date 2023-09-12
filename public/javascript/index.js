$(document).ready(function () {    
    $(".toggle").click(function () {
        $(".nav").toggleClass("nav--visible");
    });
    // signin modal
    $(".signin").click(function(){
        $(".modal--signin").removeClass("hide");
    });
    $(".close").click(function(){
        location.reload();
    });
    //end of signin modal

    //register form js
    $(".submit--Btn").prop('disabled',true);
    var conf = 0;
    var i = 1;
    $(".next--step").click(function () {
        if(i === 1){
            $(".slidepage-1").addClass("next-page");
            $(".bullet1").removeClass("bullet-enlarge");
            $(".bullet2").addClass("bullet-enlarge");
            i++;
        }else if(i === 2){
            $(".slidepage-2").addClass("next-page");
            $(".bullet2").removeClass("bullet-enlarge");
            $(".bullet3").addClass("bullet-enlarge");
            i++;
        }else if(i === 3){
            $(".slidepage-3").addClass("next-page");
            $(".bullet3").removeClass("bullet-enlarge");
            $(".bullet4").addClass("bullet-enlarge");
            i++;
        }
    });
    $(".prev--step").click(function () {
        if(i === 2){
            $(".slidepage-1").removeClass("next-page");
            $(".bullet2").removeClass("bullet-enlarge");
            $(".bullet1").addClass("bullet-enlarge");
            i--;
        }else if(i === 3){
            $(".slidepage-2").removeClass("next-page");
            $(".bullet3").removeClass("bullet-enlarge");
            $(".bullet2").addClass("bullet-enlarge");
            i--;
        }else if(i === 4){
            $(".slidepage-3").removeClass("next-page");
            $(".bullet4").removeClass("bullet-enlarge");
            $(".bullet3").addClass("bullet-enlarge");
            i--;
        }
    });
    $(".submit--Btn").click(function(){
        $(".reg--modal").removeClass("hide");
        i=0;
    });
    //register form password check
    defaultDisable();
    $("#password").keyup(function () { 
        passwordMatch();
    });
    $("#confirmPassword").keyup(function () { 
        passwordMatch();
    });
    function defaultDisable(){
        if ($("#password").val() === '' || $("#confirmPassword").val() === ''){
            $(".submit--Btn").prop('disabled',true);
            $(".submit--Btn").addClass("submit--Btn-inactive");
            $(".passCon").addClass("hide");
        }
    }
    function passwordMatch(){
        var passwordValue = $("#password").val();
        var confirmPass = $("#confirmPassword").val();
        
        if(passwordValue === confirmPass){
            $(".passCon").removeClass("hide");
            $(".passConfirm ").addClass("hide");
            $(".submit--Btn").prop('disabled',false);
            $(".submit--Btn").removeClass("submit--Btn-inactive");
        }else{
            $(".passConfirm").removeClass("hide");
            $(".passCon").addClass("hide");
            $(".submit--Btn").prop('disabled',true);
            $(".submit--Btn").addClass("submit--Btn-inactive");
        }
        defaultDisable();
    }
    //end of password check and reg form
});
