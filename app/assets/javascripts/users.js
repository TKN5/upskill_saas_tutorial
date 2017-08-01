/* global $, global Document, Stripe */
// Document ready.
$(Document).on('turbolinks:load', function(){
  var theForm = $('#pro_form');
  var submitBtn = $('#form-submit-btn');
  
  // Set Stripe public key.
  Stripe.setPublishable.key( $('meta[name="stripe-key"]').attr('content'));
  
  // When user clicks form submit btn
  submitBtn.click(function(event){
    //prevent default submission be_haviour.
    event.preventDefault()
  
    // Collect the cc fields.
    var ccNum = $('#card_number').val(),
        cvcNum = $('#card_code').val(),
        expMonth = $('#card_month').val(),
        expYear = $('#card_year').val();

    // Send the cc info to Stripe.
    Stripe.createToken({
      month: ccNum,
      cvc: cvcNum,
      exp_month: expMonth,
      exp_year: expYear
    }, stripeResponseHandler);
    
  });
  // Stripe will return a cc token.
  // Inject cc token as a hidden field into the form.
  // Submit form to our Rails app.
});