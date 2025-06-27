document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    emailjs.init('GFktXS-2plDn9lgcr');
    console.log('EmailJS Initialized:', emailjs);

    // Get the form element
    const form = document.getElementById('email-form');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();  // Prevent the default form submission

            // Check if form is valid (it will be automatically validated due to required attributes)
            if (form.checkValidity()) {
                // Get the form values
                const message_ = document.getElementById('message_').value;
                const subject_ = "Inquiry about your Website";
                const fromname = document.getElementById('fromname').value;
                const emailfrom = document.getElementById('emailfrom').value;

                // Prepare the parameters for EmailJS
                const templateParams = {
                    // to_email: 'willie.estrada@regent-trg.com', 
                    to_email: 'e.estrada@remaxcapital.ph', // Owner's email
                    message: message_,     // Message content
                    subject: subject_,     // Subject of the email
                    from_name: fromname,   // Sender's Name
                    emailfrom: emailfrom   // Sender's email
                };

                // Send the email using EmailJS
                emailjs.send('service_h1fn1di', 'template_tvkz92s', templateParams)
                    .then((response) => {
                        console.log('Email sent successfully:', response);

                        // Reset the form fields after successful email sending
                        form.reset();

                        showNotification('Email sent successfully!');
                    }, (error) => {
                        console.error('Failed to send email:', error);
                        alert('Failed to send email. Please try again.');
                    });
            } else {
                // If form is not valid, alert the user to fill out the required fields
                alert('Please fill out all required fields.');
            }
        });
    } else {
        console.error('Form not found in the DOM');
    }
});
