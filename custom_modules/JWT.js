import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export default class JWT {
    constructor() {
        this.secret = this._generateSecret();
    }

    _generateSecret() {
        const randomBytes = crypto.randomBytes(32);
        return randomBytes.toString('hex');
    }

    generateToken(payload, expiresIn) {
        return jwt.sign(payload, this.secret, { expiresIn });
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, this.secret);
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
}
