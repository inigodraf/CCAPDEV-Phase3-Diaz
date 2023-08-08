function goBack() {
    setTimeout(function () {
        window.location.href = '/start';
    }, 500);
}

async function login() {
    var usernameInput = document.getElementById('username-input');
    var passwordInput = document.getElementById('password-input');
    var errorMessage = document.getElementById('error-message');
    var username = usernameInput.value.trim();
    var password = passwordInput.value.trim();

    console.log(username, password);

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data.error || !data.success) {
            errorMessage.textContent = 'Invalid username or password.';
            errorMessage.style.display = 'block';
        } else {
            window.location.href = '/home';
        }
    } catch (error) {
        console.error('Error:', error);
        errorMessage.textContent = 'An error occurred. Please try again later.';
        errorMessage.style.display = 'block';
    }
}