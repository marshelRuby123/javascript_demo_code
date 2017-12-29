// This is to execute the Credit Card
//= require sweetalert/sweetalert.min
//= require ezidebit.min.js

$(document).ready(function() {

  var publicKey = "SDSF232SD-SDF2-FSD2-FS32-DSFF34123434";
  var endpoint = "https://api.demo.ezidebit.com.au/V3-5/public-rest";

  function payment_type_model(payment_type, type){
    if(payment_type == "card_payment"){
      $('#finalCardPaymentModel').modal(type);
    }else if(payment_type == "bank_payment"){
      $('#finalBankPaymentModel').modal(type);
    }
  }

  var displaySubmitCallback = function(data) {

    swal({title: "Error Code: \n"+data['Error'],
      text: "Error Message: \n"+ data['ErrorMessage'],
      type: "error",
      confirmButtonColor: "#18a689",
      confirmButtonText: "Done"});
    
    if(data['Data'] != null) {
        swal({
          title: "Customer Ref. No.: \n"+ data['Data']['CustomerRef'],
          text: "",
          type: "success",
          confirmButtonColor: "#1ab394",
          confirmButtonText: "Done"
        }, function(){

        $.ajax({
          type: "POST",
          url: "/payments",
          dataType: "json",
          async: true,
          enctype: 'multipart/form-data',
          cache: false,
          data: { payment: {customer_token: data['Data']['CustomerRef'] } },
          success:function(result){
            if(result["status"] == "created"){
              $('#finalPaymentModel').modal('hide');
              window.location.replace('/payments');          
            }else{
              swal(result["errors"],
              'Something went wrong!',
              'error');
            }
          }
        });
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
    });
  }

  $('#save_payment').click(function(){
      if($("#payment_password").val() == ""){
        sweetAlert("Password can't be blank.");
      }else{
        $.ajax({
          type: "POST",
          url: "/valid_password",
          dataType: "json",
          async: true,
          enctype: 'multipart/form-data',
          cache: false,
          data: { password: $("#payment_password").val() },
          success:function(result){
            if(result["status"] == false){
              swal('Entered password is not matched!',
                'Something went wrong!',
                'error');
            }else{
              $('#paymentMethodSavingConfirmationModal').modal('hide');
              payment_type_model($("#paymentType").val(), 'show');
            }
          }
        });

        //Create customer using card data
        eziDebit.init(publicKey, {
          submitAction: "SaveCustomer",
          submitButton: "save_final_card_payment",
          submitCallback: displaySubmitCallback,
          submitError: displaySubmitError,
          customerReference: "systemReference", 
          customerLastName: "lastname",
          customerFirstName: "firstName", 

          customerAddress1: "address1",
          customerAddress2: "address2",
          customerSuburb: "suburb",
          customerState: "state",
          customerPostcode: "postcode",
          nameOnCard: "nameOnCard",
          cardNumber: "cardNumber",
          cardExpiryMonth: "expiryMonth",
          cardExpiryYear: "expiryYear",
          cardCCV: "ccv",
          paymentAmount: "amount",
          paymentReference: "paymentReference"
        }, endpoint);

        //Create customer using bank data.
        eziDebit.init(publicKey, {
          submitAction: "SaveCustomer",
          submitButton: "save_final_bank_payment",
          submitCallback: displaySubmitCallback,
          submitError: displaySubmitError,
          customerReference: "systemReference", 
          customerLastName: "lastname",
          customerFirstName: "firstName", 

          customerAddress1: "address1",
          customerAddress2: "address2",
          customerSuburb: "suburb",
          customerState: "state",
          customerPostcode: "postcode",                     
          accountName: "accountName",
          accountBSB: "bsb",
          accountNumber: "accountNumber"
        }, endpoint);
        
      }
  });

  $(".btn_card_cancel").click(function(){
    window.location.replace("/payments/new");
  });

});