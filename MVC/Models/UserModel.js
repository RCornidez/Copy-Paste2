import DatabaseContext from './DatabaseContext.js';

class UserModel {
    constructor() {
        this.db = DatabaseContext;
    }

    async createUser(username, password) {
        const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
        return await this.db.run(query, [username, password]);
    }

    async getUserByUsername(username) {
        const query = 'SELECT * FROM users WHERE username = ?';
        return await this.db.get(query, [username]);
    }

    async updateUserPassword(username, newPassword) {
        const query = 'UPDATE users SET password = ? WHERE username = ?';
        return await this.db.run(query, [newPassword, username]);
    }

    async deleteUser(username) {
        const query = 'DELETE FROM users WHERE username = ?';
        return await this.db.run(query, [username]);
    }
}

export default new UserModel();
