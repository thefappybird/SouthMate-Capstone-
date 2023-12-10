$(document).ready(function () {
  $(".toggle").click(function () {
    $(".nav").toggleClass("nav--visible");
  });
  // signin modal
  $(".signin").click(function () {
    $(".modal--signin").removeClass("hide");
  });
  $(".close").click(function () {
    location.reload();
  });
  //end of signin modal

  $(".history--content").click(function () {
    $(".activate").toggleClass("hide");
    $(".activated").toggleClass("hide");
    $(".history--list-active").slideToggle();
  });
  $("#showBank").click(function () {
    $(".activateBanks").toggleClass("hide");
    $(".activatedBanks").toggleClass("hide");
    $(".bank--list").slideToggle();
  });
  //register form js
  $(".submit--Btn").prop("disabled", true);
  var conf = 0;
  var i = 1;
  $(".next--step").click(function () {
    if (i === 1) {
      $(".slidepage-1").addClass("next-page");
      $(".bullet1").removeClass("bullet-enlarge");
      $(".bullet2").addClass("bullet-enlarge");
      i++;
    } else if (i === 2) {
      $(".slidepage-2").addClass("next-page");
      $(".bullet2").removeClass("bullet-enlarge");
      $(".bullet3").addClass("bullet-enlarge");
      i++;
    } else if (i === 3) {
      $(".slidepage-3").addClass("next-page");
      $(".bullet3").removeClass("bullet-enlarge");
      $(".bullet4").addClass("bullet-enlarge");
      i++;
    }
  });
  $(".prev--step").click(function () {
    if (i === 2) {
      $(".slidepage-1").removeClass("next-page");
      $(".bullet2").removeClass("bullet-enlarge");
      $(".bullet1").addClass("bullet-enlarge");
      i--;
    } else if (i === 3) {
      $(".slidepage-2").removeClass("next-page");
      $(".bullet3").removeClass("bullet-enlarge");
      $(".bullet2").addClass("bullet-enlarge");
      i--;
    } else if (i === 4) {
      $(".slidepage-3").removeClass("next-page");
      $(".bullet4").removeClass("bullet-enlarge");
      $(".bullet3").addClass("bullet-enlarge");
      i--;
    }
  });
  $(".submit--Btn").click(function () {
    $(".reg--modal").removeClass("hide");
    i = 0;
  });
  //register form password check
  defaultDisable();
  $("#password").keyup(function () {
    passwordMatch();
  });
  $("#confirmPassword").keyup(function () {
    passwordMatch();
  });
  function defaultDisable() {
    if ($("#password").val() === "" || $("#confirmPassword").val() === "") {
      $(".submit--Btn").prop("disabled", true);
      $(".submit--Btn").addClass("submit--Btn-inactive");
      $(".passCon").addClass("hide");
    }
  }
  function passwordMatch() {
    var passwordValue = $("#password").val();
    var confirmPass = $("#confirmPassword").val();

    if (passwordValue === confirmPass) {
      $(".passCon").removeClass("hide");
      $(".passConfirm ").addClass("hide");
      $(".submit--Btn").prop("disabled", false);
      $(".submit--Btn").removeClass("submit--Btn-inactive");
    } else {
      $(".passConfirm").removeClass("hide");
      $(".passCon").addClass("hide");
      $(".submit--Btn").prop("disabled", true);
      $(".submit--Btn").addClass("submit--Btn-inactive");
    }
    defaultDisable();
  }
  // end of password check and reg form

  let generatedOTP;
  function handleGenerateOTP() {
    if (!isFormFilled()) {
      alert("Please fill out the form before generating OTP.");
      return;
    }
    const transType = $("#transactionType").val();
    $.ajax({
      type: "POST",
      url: "/sendOtp",
      data: {
        transType: transType
      },
      success: function (response) {
        generatedOTP = response.otp;
        $(".otp-modal").removeClass("hide");
        $("#submitOTP").on("click", function () {
          handleVerifyOTP($("#otpInput").val());
        });
      },
      error: function (error) {
        console.error("Error generating OTP", error);
      },
    });
  }

  function handleVerifyOTP(userInput) {
    if (userInput === generatedOTP.toString()) {
      $(".mainForm").submit();
    } else {
      alert("Incorrect OTP. Please try again.");
    }
    $("#otpModal").addClass("hide");
  }

  $("#generateOtp").click(function () {
    handleGenerateOTP();
  });

  $(".close").click(function () {
    location.reload();
  });
  $(window).on("click", function (event) {
    if (event.target === $("#otpModal")[0]) {
      $("#otpModal").addClass("hide");
    }
  });
  function isFormFilled() {
    const bankOptionSelected = $("input[name='bankOption']:checked").val();
    const accountNumber = $(".transaction--text").val().trim();

    if (!bankOptionSelected && accountNumber === "") {
      return false;
    }
    return true;
  }
  function captchaCheck(e, url) {
    e.preventDefault();
    const captchaResponse = grecaptcha.getResponse();

    if (!captchaResponse.length > 0) {
      throw new Error("Captcha not Complete");
    }

    const fd = new FormData(e.target);
    const params = new URLSearchParams(fd);

    fetch(url, {
      method: "POST",
      body: params,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.captchaSuccess) {
          console.log("Validation Success");
          window.location.href = "/landing";
        } else {
          console.error("Validation Failed");
        }
      })
      .catch((err) => console.error(err));
  }

  const cashin = $("#cashinForm");
  $(cashin).submit(function (e) {
    captchaCheck(e, "http://localhost:3001/cashin");
  });
  const cashout = $("#cashoutForm");
  $(cashout).submit(function (e) {
    captchaCheck(e, "http://localhost:3001/cashout");
  });
  const sendMoney = $("#sendForm");
  $(sendMoney).submit(function (e) {
    captchaCheck(e, "http://localhost:3001/sendMoney");
  });
  const regBank = $("#bankRegForm");
  $(regBank).submit(function (e) {
    captchaCheck(e, "http://localhost:3001/registerBank");
  });
});
