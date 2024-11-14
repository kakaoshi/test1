function validateLogin() {
    let username = document.getElementById('login-username').value;
    let password = document.getElementById('login-password').value;

    // Elements for showing error messages
    let usernameError = document.getElementById('username-error');
    let passwordError = document.getElementById('password-error');

    // Clear previous error messages
    usernameError.textContent = '';
    passwordError.textContent = '';

    // Retrieve users from local storage
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if user exists
    let user = users.find(user => user.username === username);
    if (!user) {
        usernameError.textContent = 'Username does not exist.';
        return false;
    }

    // Check if password matches
    if (user.password !== password) {
        passwordError.textContent = 'Incorrect password.';
        return false;
    }

    // If successful login, redirect to homepage
    window.location.href = 'homepage.html';
    return false;
}
