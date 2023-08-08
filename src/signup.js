const signupForm = document.querySelector('#signup-form');

function goBack1() {
    setTimeout(function () {
        window.location.href = '/start';
    }, 500);
}

signupForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const signupForm = document.querySelector('#signup-form'); 

    const formData = new FormData(signupForm);

    fetch('/signup', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {

        if (data.success) {
            window.location.href='/home';
        } else {
            console.log('Signup failed:', data.error);
        }
    })
    .catch(error => {
        console.error('/signup', error);
    });
});