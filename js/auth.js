class AuthManager {
    constructor() {
        this.users = this.loadUsers();
        this.currentUser = this.getCurrentUser();
    }
    loadUsers() {
        const stored = localStorage.getItem('users');
        return stored ? JSON.parse(stored) : {};
    }
    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }
    saveCurrentUser(username) {
        sessionStorage.setItem('currentUser', username);
        this.currentUser = username;
    }
    getCurrentUser() {
        return sessionStorage.getItem('currentUser');
    }
    isLoggedIn() {
        return this.currentUser !== null;
    }
    register(username, email, password) {
        if (this.users[username]) {
            return { success: false, message: 'Username already exists' };
        }
        if (!username || !email || !password) {
            return { success: false, message: 'All fields are required' };
        }
        this.users[username] = { email, password };
        this.saveUsers();
        return { success: true, message: 'Registration successful' };
    }

    login(username, password) {
        if (!this.users[username]) {
            return { success: false, message: 'User not found' };
        }
        if (this.users[username].password !== password) {
            return { success: false, message: 'Incorrect password' };
        }
        this.saveCurrentUser(username);
        return { success: true, message: 'Login successful', username };
    }

    logout() {
        sessionStorage.removeItem('currentUser');
        this.currentUser = null;
        return { success: true, message: 'Logout successful' };
    }

    generateResetToken(username, email) {
        if (!this.users[username]) return { success: false, message: 'User not found' };
        if (this.users[username].email !== email) return { success: false, message: 'Email does not match' };
        
        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const resetTokens = JSON.parse(localStorage.getItem('resetTokens') || '{}');
        resetTokens[token] = { username, email, timestamp: Date.now() };
        localStorage.setItem('resetTokens', JSON.stringify(resetTokens));
        return { success: true, message: 'Reset token generated', token };
    }

    verifyResetToken(token) {
        const resetTokens = JSON.parse(localStorage.getItem('resetTokens') || '{}');
        const tokenData = resetTokens[token];
        if (!tokenData) return { success: false, message: 'Invalid token' };

        const tokenAge = Date.now() - tokenData.timestamp;
        if (tokenAge > 24 * 60 * 60 * 1000) {
            delete resetTokens[token];
            localStorage.setItem('resetTokens', JSON.stringify(resetTokens));
            return { success: false, message: 'Token expired' };
        }

        return { success: true, message: 'Token valid', username: tokenData.username };
    }

    resetPassword(token, newPassword) {
        const tokenVerification = this.verifyResetToken(token);
        if (!tokenVerification.success) return tokenVerification;

        const username = tokenVerification.username;
        this.users[username].password = newPassword;
        this.saveUsers();

        const resetTokens = JSON.parse(localStorage.getItem('resetTokens') || '{}');
        delete resetTokens[token];
        localStorage.setItem('resetTokens', JSON.stringify(resetTokens));

        return { success: true, message: 'Password reset successful' };
    }

    requestPasswordReset(username, email) {
        return this.generateResetToken(username, email);
    }
}

function saveScore(themeId, username, attempts) {
    let scoreboards = JSON.parse(localStorage.getItem('scoreboards')) || {};

    if (!scoreboards[themeId]) scoreboards[themeId] = [];

    scoreboards[themeId].push({
        user: username,
        attempts: attempts,
        date: new Date().toISOString()
    });

    scoreboards[themeId] = scoreboards[themeId]
        .sort((a, b) => a.attempts - b.attempts)
        .slice(0, 10);

    localStorage.setItem('scoreboards', JSON.stringify(scoreboards));
}

const auth = new AuthManager();
