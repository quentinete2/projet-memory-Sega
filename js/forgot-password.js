let resetToken = null;

document.getElementById('requestResetForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    
    const result = auth.requestPasswordReset(username, email);
    
    const messageDiv = document.getElementById('message');
    if (result.success) {
        resetToken = result.token;
        messageDiv.textContent = 'Reset token generated! Proceed to enter your new password.';
        messageDiv.style.color = 'green';
        
        setTimeout(() => {
            document.getElementById('resetStage1').style.display = 'none';
            document.getElementById('resetStage2').style.display = 'block';
            document.getElementById('token').value = resetToken;
            messageDiv.textContent = '';
        }, 1500);
    } else {
        messageDiv.textContent = result.message;
        messageDiv.style.color = 'red';
    }
});

document.getElementById('resetPasswordForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (newPassword !== confirmPassword) {
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = 'Passwords do not match!';
        messageDiv.style.color = 'red';
        return;
    }
    
    if (newPassword.length < 3) {
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = 'Password must be at least 3 characters long!';
        messageDiv.style.color = 'red';
        return;
    }
    
    const result = auth.resetPassword(resetToken, newPassword);
    
    const messageDiv = document.getElementById('message');
    if (result.success) {
        messageDiv.textContent = result.message + ' Redirecting to login...';
        messageDiv.style.color = 'green';
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    } else {
        messageDiv.textContent = result.message;
        messageDiv.style.color = 'red';
    }
});

document.getElementById('startOverButton').addEventListener('click', () => {
    resetToken = null;
    document.getElementById('requestResetForm').reset();
    document.getElementById('resetPasswordForm').reset();
    document.getElementById('message').textContent = '';
    document.getElementById('resetStage1').style.display = 'block';
    document.getElementById('resetStage2').style.display = 'none';
});
