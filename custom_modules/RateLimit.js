import expressRateLimit from 'express-rate-limit';
import BlockedIPModel from '../MVC/Models/BlockedIPModel.js';
import AllowedIPModel from '../MVC/Models/AllowedIPModel.js';

export default class RateLimiter {
    constructor(options) {
        this.windowMs = options.windowMs;
        this.max = options.max;

        // Initialize rate limiter
        this.limiter = expressRateLimit({
            windowMs: this.windowMs,
            max: this.max,
            handler: this.handleRateLimitExceeded.bind(this),
            skip: this.checkAllowedIPs.bind(this), // Skip rate limiting for allowed IPs
        });
    }

    // Combined middleware for rate limiting and IP blocking
    rateLimit() {
        return async (req, res, next) => {
            const ip = this.getIP(req);

            // Check if IP is allowed to bypass rate limiting
            if (await AllowedIPModel.isIPAllowed(ip)) {
                return next();
            }

            // Check if IP is blocked
            if (await BlockedIPModel.isIPBlocked(ip)) {
                return res.status(403).json({ error: 'Access denied' });
            }

            // Apply rate limiting
            this.limiter(req, res, next);
        };
    }

    // Handle rate limit exceeded
    async handleRateLimitExceeded(req, res) {
        const ip = this.getIP(req);
        if (!(await BlockedIPModel.isIPBlocked(ip))) {
            await BlockedIPModel.addIP(ip); // Add IP to blocked list
        }
        res.status(429).json({ error: 'Rate limit exceeded' });
    }

    // Check if the IP is allowed to bypass rate limiting
    async checkAllowedIPs(req) {
        const ip = this.getIP(req);
        return await AllowedIPModel.isIPAllowed(ip);
    }

    // Get IP address from request
    getIP(req) {
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        return ip ? ip.split(',')[0].trim() : null; // Handle potential forwarded IPs
    }
}
