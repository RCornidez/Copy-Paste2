import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import 'dotenv/config'

class DatabaseContext {
    constructor() {
        if (!DatabaseContext.instance) {
            DatabaseContext.instance = this;
            this.init();
        }
        return DatabaseContext.instance;
    }

    async init() {
        this.dbFilePath = process.env.DATABASE;
        this.db = await open({
            filename: this.dbFilePath,
            driver: sqlite3.Database
        });
        console.log('Connected to database');
        await this.initTables();
    }

    async initTables() {
        // Ensure tables are created if they don't exist
        const createUserTable = `
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                password TEXT
            )
        `;
        const createAllowedIPsTable = `
            CREATE TABLE IF NOT EXISTS allowedIPs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ip TEXT UNIQUE,
                type TEXT
            )
        `;
        const createBlockedIPsTable = `
            CREATE TABLE IF NOT EXISTS blockedIPs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ip TEXT UNIQUE,
                type TEXT
            )
        `;

        await this.db.run(createUserTable);
        await this.db.run(createAllowedIPsTable);
        await this.db.run(createBlockedIPsTable);
    }

    async run(query, params = []) {
        return await this.db.run(query, params);
    }

    async get(query, params = []) {
        return await this.db.get(query, params);
    }

    async all(query, params = []) {
        return await this.db.all(query, params);
    }

    async backupDatabase() {
        const backupFolder = './backup';
        const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '_').replace(/\..+/, '');
        const backupFileName = `database_backup_${timestamp}.db`;

        // Ensure backup folder exists
        if (!fs.existsSync(backupFolder)) {
            fs.mkdirSync(backupFolder);
        }

        // Construct backup file path
        const backupFilePath = path.join(backupFolder, backupFileName);

        // Copy the current database file to backup location
        fs.copyFileSync(this.dbFilePath, backupFilePath);

        console.log(`Database backed up successfully to ${backupFilePath}`);
    }
}

export default new DatabaseContext();
