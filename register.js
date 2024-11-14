// Simple client-side validation
function validateRegister() {
    let email = document.getElementById('email').value;
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let confirmPassword = document.getElementById('confirm-password').value;

    // Get error display elements
    let emailError = document.getElementById('email-error');
    let usernameError = document.getElementById('username-error');
    let passwordError = document.getElementById('password-error');
    let confirmPasswordError = document.getElementById('confirm-password-error');

    // Clear previous error messages
    emailError.textContent = '';
    usernameError.textContent = '';
    passwordError.textContent = '';
    confirmPasswordError.textContent = '';

    // Validate password length
    if (password.length < 6) {
        passwordError.textContent = 'Password must be at least 6 characters!';
        return false;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        confirmPasswordError.textContent = 'Passwords do not match!';
        return false;
    }

    // Simple email validation
    let emailPattern = /^[^@]+@[^@]+\.[^@]+$/;
    if (!email.match(emailPattern)) {
        emailError.textContent = 'Invalid email format!';
        return false;
    }

    // Load users from localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if email or username is already taken
    let emailExists = users.some(user => user.email === email);
    let usernameExists = users.some(user => user.username === username);
    
    if (emailExists) {
        emailError.textContent = 'Email is already in use!';
        return false;
    }
    if (usernameExists) {
        usernameError.textContent = 'Username is already taken!';
        return false;
    }

    // Save user data if validation passes
    users.push({ email, username, password });
    localStorage.setItem('users', JSON.stringify(users));

    // Redirect to the homepage after successful registration
    window.location.href = 'homepage.html';
    return false;
}
