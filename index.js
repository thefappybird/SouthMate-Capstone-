$(document).ready(function(){
    $(".owl-carousel").owlCarousel({
        items:1,
        loop:true,
        nav:true,
        dots: false,
        autoplay:true,
        autoplaySpeed:1000,
        smartSpeed:1500,
        autoplayHoverPause:true
    });
});
$(document).ready(function () {
    $(".toggle").click(function () {
        $(".nav").toggleClass("nav--visible");
    });
});
