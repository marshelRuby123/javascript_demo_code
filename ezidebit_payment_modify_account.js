// This is to execute the Credit Card
//= require sweetalert/sweetalert.min
//= require ezidebit.min.js

$(document).ready(function(){

  var publicKey = "SDSF232SD-SDF2-FSD2-FS32-DSFF34123434";
  var endpoint = "https://api.demo.ezidebit.com.au/V3-5/public-rest";


  $("#credit_card_number").inputmask({
    placeholder: ' ',
    mask: '9999 9999 9999 9999'
  });

  $("#credit_card_number").keydown(function(){
    ValidateCreditCardNumber("credit_card_number");
  });  

  $.validator.addMethod("validateCard", function(value, element){
    var ccNum = value.replace(/\s/g, '');
    var visaRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
    var mastercardRegEx = /^(?:5[1-5][0-9]{14})$/;
    var amexpRegEx = /^(?:3[47][0-9]{13})$/;
    var discovRegEx = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
    var isValid = false;
    if (visaRegEx.test(ccNum)) {
      isValid = true;
    } else if(mastercardRegEx.test(ccNum)) {
      isValid = true;
    } else if(amexpRegEx.test(ccNum)) {
      isValid = true;
    } else if(discovRegEx.test(ccNum)) {
      isValid = true;
    }

    if(isValid) {
      return true;
    } else {
      return false;
    }        
  }, "Please provide a valid card number.");

  function payment_type_model(mod_type, type){
    if(mod_type == "mod_card"){
      $('#finalCardModPaymentModel').modal(type);
    }else if(mod_type == "mod_bank")
      $('#finalBankModPaymentModel').modal(type);
  }


  var displayCardSubmitCallback = function(data) {
    
    if(data['Data'] != null && data["Data"] == "S") {
      swal({
        title: "Card details updated successfully!",
        text: "",
        type: "success",
        confirmButtonColor: "#18a689",
        confirmButtonText: "Done"
      }, function(){
        window.location.replace('/payments');
      });
    }
  }
  
  var displayBankSubmitCallback = function(data) {
    
    if(data['Data'] != null && data["Data"] == "S") {
      swal({
        title: "Bank details updated successfully!",
        text: "",
        type: "success",
        confirmButtonColor: "#18a689",
        confirmButtonText: "Done"
      }, function(){
        window.location.replace('/payments');
      });
    }
  }  

  var displaySubmitError = function (data) {
    swal({
      title: "Submit Error:\n",
      text: data,
      type: "error",
      confirmButtonColor: "#c9302c",
      confirmButtonText: "Done"
    }, function(){
      $("#payment_modify_password").val("");
    });
  }


  $("#modify_card").click(function(){
    $('#payment-form-cc').validate({
      rules: {
        credit_card_number: {
          required: true,
          validateCard: true
        },
        mod_expiry_year: {
          required: true
        },
        mod_expiry_month: {
          required: true
        },
        mod_ccv: {
          required: true,
          maxlength: 3,
          minlength: 3,
          number: true
        },
        mod_name_on_card: {
          required: true
        }
      },
      submitHandler: function (form) {
        $("#paymentCreditSavingConfirmationModal").modal("show");
        $("#mod_type").val("mod_card");

        eziDebit.init(publicKey, {
          submitAction: "ChangeCustomerPaymentInfo",
          submitButton: "update_final_card_payment",
          submitCallback: displayCardSubmitCallback,
          submitError: displaySubmitError,
          customerRef: "customerRefCard", // This is Ezidebit's unique identifier for the customer. This is known as the EziDebitCustomerID. In Ezidebit Online this is known as the Contract ID
          customerReference: "systemReference", // In Ezidebit Online this is known as the Client Contract Ref. This is your reference for the customer
          nameOnCard: "mod_name_on_card",
          cardNumber: "credit_card_number",
          cardExpiryMonth: "mod_expiry_month",
          cardExpiryYear: "mod_expiry_year"
        }, endpoint);


        return false;
      }
    });

  });

  $("#modify_bank").click(function(){
    $('#payment-form-bc').validate({
      rules: {
        mod_bsb: {
          required: true,
          number: true,
          maxlength: 6,
          minlength: 6
        },
        mod_account_number: {
          required: true,
          number: true,
          maxlength: 10
        },
        mod_account_name: {
          required: true
        }
      },
      submitHandler: function (form) {

        $("#paymentCreditSavingConfirmationModal").modal("show");
        $("#mod_type").val("mod_bank");
        eziDebit.init(publicKey, {
          submitAction: "ChangeCustomerPaymentInfo",
          submitButton: "update_final_mod_bank_payment",
          submitCallback: displayBankSubmitCallback,
          submitError: displaySubmitError,
          customerRef: "customerRefBank", // This is Ezidebit's unique identifier for the customer. This is known as the EziDebitCustomerID. In Ezidebit Online this is known as the Contract ID
          customerReference: "systemReference", // In Ezidebit Online this is known as the Client Contract Ref. This is your reference for the customer
          accountName: "mod_account_name",
          accountBSB: "mod_bsb",
          accountNumber: "mod_account_number"
        }, endpoint);        
        return false;
      }
    });

  });



  $("#payment_credit_authorised").click(function(){
    if($("#payment_modify_password").val() == ""){
      sweetAlert("Password can't be blank.");
    }else{
      $.ajax({
        type: "POST",
        url: "/valid_password",
        dataType: "json",
        async: true,
        enctype: 'multipart/form-data',
        cache: false,
        data: { password: $("#payment_modify_password").val() },
        success:function(result){
          if(result["status"] == false){
            swal('Entered password is not matched!',
              'Something went wrong!',
              'error');
          }else{
            $('#paymentCreditSavingConfirmationModal').modal('hide');
            payment_type_model($("#mod_type").val(), 'show');
          }
        }
      });
    }
  });

  $(".btn_bank_cancel").click(function(){
    window.location.replace("/payments");
  });  

});