/**
Ezidebit Application form sign up validations.
**/

//= require footable/footable.all.min.js
//= require iCheck/icheck.min.js
//= require validate/jquery.validate.min.js
//= require select2/select2.full.min.js
//= require jasny/jasny-bootstrap.min.js
//= require sweetalert/sweetalert.min
//= require dataTables/datatables.min
//= require payments_credit_card_process.js
//= require payments_bank_account_process.js
//= require payments_form_validation.js

var Ezidebit = {
  init: function () {
    this.bindConfirmationModalOnConfirmedClick();
    this.bindSavePaymentMethodOnConfirmation();
  },

  bindConfirmationModalOnConfirmedClick: function () {
    $('#submit_ezidebit_form').click(function(){
    $.validator.addMethod("regx", function(value, element, regexpr) {
      return regexpr.test(value);
    }, "Please enter a valid email address.");
    $('#ezidebitForm').validate({
      rules: {
        ezFirstName: {
          required: true
        },
        ezLastName: {
          required: true
        },
        ezOrganizationName: {
          required: true
        },
        ezBusinessPhone: {
          required: true,
          minlength:10,
          maxlength:12,
          number: true
        },
        ezEmailAddress:{
          required: true,
          email: true,
          regx:/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/
        },
        ezPostcode: {
          required: true,
          minlength: 4,
          maxlength: 4,
          number: true
        },
        ezCountry:{
          required: true
        },
        ezIndustry:{
          required: true
        },
        ezUser:{
          required: true
        },
        ezcFullName:{
          required: true
        },
        ezcEmailAddress:{
          required: true,
          email: true,
          regx: /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/
        },
        ezcPhoneNo:{
                required: true,
                minlength:10,
                maxlength:12,
                number: true
        }
      },
      submitHandler: function (form) {
        $('#paymentMethodSavingConfirmationModal').modal('show');
          return false;
      }
  });
    });
  },

  bindSavePaymentMethodOnConfirmation: function () {
    $('#save_ezidebit').click(function(){
      if($("#ezPassword").val() == ""){
        sweetAlert("Password can't be blank.");
      }else{
          $.ajax({
        type: "POST",
        url: "/valid_password",
        dataType: "json",
        async: true,
        enctype: 'multipart/form-data',
        cache: false,
        data: {password: $("#ezPassword").val()},
        success:function(result){
          if(result["status"] == false){
        swal(
          'Entered password is not matched!',
          'Something went wrong!',
          'error'
        );
          }
          else{
            $.ajax({
              type: "POST",
              url: "/payments/submit_ezidebit",
              dataType: "json",
              async: true,
              enctype: 'multipart/form-data',
              cache: false,
              data: {ezdebit: {ezFirstName: $("input[name=ezFirstName]").val(), ezLastName: $("input[name=ezLastName]").val(), ezOrganizationName: $("input[name=ezOrganizationName]").val(), ezBusinessPhone: $("input[name=ezBusinessPhone]").val(), ezEmailAddress: $("input[name=ezEmailAddress]").val(), ezPostcode: $("input[name=ezPostcode]").val(), ezCountry: $("select[name=ezCountry] option:selected").val(), ezIndustry: $("select[name=ezIndustry] option:selected").val(), ezUser: $("select[name=ezUser] option:selected").val(), ezCommentNote: $("textarea[name=ezCommentNote]").val(), ezcFullName: $("input[name=ezcFullName]").val(), ezcEmailAddress: $("input[name=ezcEmailAddress]").val(), ezcPhoneNo: $("input[name=ezcPhoneNo]").val()}},
              success:function(result){
                if(result["status"] == "success"){
                  $('#paymentMethodSavingConfirmationModal').modal('hide');
                  swal({
                      title: "Our Payment Gateway Service Application form has been submitted!",
                      type: "success",
                      confirmButtonColor: "#18a689",
                      confirmButtonText: "Done"
                    },
                    function(){
                      window.location.replace('/');
                    });
            }else{
                  swal('Unable to submit the Ezidebit Sign up form, Please try after some time!','Something went wrong!','error');
                }
              }
            });
          }
         }
       });
      }
    });
  }
}
