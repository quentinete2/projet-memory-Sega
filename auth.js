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
        localStorage.setItem('currentUser', username);
        this.currentUser = username;
    }

    getCurrentUser() {
        return localStorage.getItem('currentUser');
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
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        return { success: true, message: 'Logout successful' };
    }
}

const auth = new AuthManager();
