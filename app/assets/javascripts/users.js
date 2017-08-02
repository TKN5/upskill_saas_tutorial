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
    event.preventDefault();
    submitBtn.val("Processing").prop('disabled', true);
    
    // Collect the cc fields.
    var ccNum = $('#card_number').val(),
        cvcNum = $('#card_code').val(),
        expMonth = $('#card_month').val(),
        expYear = $('#card_year').val();
        
    // Use Stripe JS Library to check for cc errors.
    var error = false;
    
    // Validate cc number.
    if(!Stripe.card.validateCardNumber(ccNum)) {
      error = true;
      alert('The credit card number appears to be invalid');
    }
    
    // Validate CVC number
    if(!Stripe.card.validateCVC(cvcNum)) {
      error = true;
      alert('The cvc number appears to be invalid');
    }
    
    // Validate the expiration date.
    if(!Stripe.card.validateExpiry(expMonth, expYear)) {
      error = true;
      alert('The expiry date appears to be invalid');
    }
    
    if (error) {
      // If there are cc errors don't send to Stripe
      submitBtn.prop('disabled', false).val("Sign Up");
    } else {
      // Send the cc info to Stripe.
      Stripe.createToken({
        month: ccNum,
        cvc: cvcNum,
        exp_month: expMonth,
        exp_year: expYear
      }, stripeResponseHandler);
    }
    return false;
  });
  
  // Stripe will return a cc token.
  function stripeResponseHandler(status, response) {
    // Get the token from the response.
    var token = response.id;
    
    // Inject cc token as a hidden field into the form.
    theForm.append( $('<input type="hidden" name="user[stripe_card_token]">').val(token) );
    
    // Submit form to our Rails app.
    theForm.get(0).submit();
  }
});