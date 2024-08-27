import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config'

import UserModel from '../MVC/Models/UserModel.js'; 

class AuthService {
    constructor() {
        this.secretKey = process.env.AUTH_SECRET_KEY;

        // Bind the method to maintain the context
        this.authenticateToken = this.authenticateToken.bind(this);
    }

    async register(username, password) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        try {
            await UserModel.createUser(username, hashedPassword);
            return { success: true };
        } catch (error) {
            if (error.code === 'SQLITE_CONSTRAINT') {
                return { success: false, message: 'Username already exists' };
            }
            throw error;
        }
    }

    async login(username, password) {
        const user = await UserModel.getUserByUsername(username);

        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user.id, username: user.username }, this.secretKey, { expiresIn: '15s' });
            return { success: true, token };
        }

        return { success: false, message: 'Invalid username or password' };
    }

    authenticateToken(req, res, next) {
        const cookie = req.headers.cookie;
        let token;

        if (!cookie) {
            console.log('No token available, redirection to login.');
            return res.redirect(`/login?redirect=${encodeURIComponent(req.originalUrl)}`);
        }

        const fullToken = cookie.split('; ').find((c) => c.startsWith('auth='));
        if (fullToken) {
            token = fullToken.split('=')[1];
            console.log(`Token: ${token}`);
        }

        jwt.verify(token, this.secretKey, (err, user) => {
            if (err) {
                console.log(`Error verifying token, redirecting to login: ${err}`);
                return res.redirect(`/login?redirect=${encodeURIComponent(req.originalUrl)}`);
            }

            req.user = user;
            next();
        });
    }
}

export default new AuthService();