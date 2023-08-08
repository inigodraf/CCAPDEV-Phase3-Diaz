function goBack1() {
    setTimeout(function () {
        window.location.href = '/start';
    }, 500);
}

function showSignup() {
    var container = document.querySelector('.container');
    var logo = document.querySelector('.logo');
    var buttons = document.querySelector('.button-container');
    logo.style.transform = 'translateY(200px)';
    buttons.style.opacity = '0';

    setTimeout(function () {
        console.log('showSignup() function executed.');
        window.location.href = "/signup";
    }, 500);
}

function showLogin() {
    var container = document.querySelector('.container');
    var logo = document.querySelector('.logo');
    var buttons = document.querySelector('.button-container');
    buttons.style.opacity = '0';
    logo.style.transform = 'translateY(200px)';


    setTimeout(function () {
        console.log('showLogin() function executed.');
        window.location.href = "/login";
    }, 500);
}