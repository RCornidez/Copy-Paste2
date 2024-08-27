import DatabaseContext from './DatabaseContext.js';

class BlockedIPModel {
    constructor() {
        this.db = DatabaseContext;
    }

    async addIP(ip) {
        const type = this.getIPType(ip);
        const query = 'INSERT INTO blockedIPs (ip, type) VALUES (?, ?)';
        return await this.db.run(query, [ip, type]);
    }

    async removeIP(ip) {
        const query = 'DELETE FROM blockedIPs WHERE ip = ?';
        return await this.db.run(query, [ip]);
    }

    async isIPBlocked(ip) {
        const query = 'SELECT EXISTS(SELECT 1 FROM blockedIPs WHERE ip = ?) as found';
        const result = await this.db.get(query, [ip]);
        return await result.found === 1;
    }

    getIPType(ip) {
        return ip.includes(':') ? 'IPv6' : 'IPv4';
    }
}

export default new BlockedIPModel();
