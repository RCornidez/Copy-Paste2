// create-admin.js
import readline from 'readline';
import { fileURLToPath } from 'url';
import path from 'path';
import DatabaseContext from './custom_modules/Database.mjs';
import AuthService from './custom_modules/Auth.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUTH_SECRET_KEY = 'your_secret_key';

// Initialize SQLite Database
const dbContext = new DatabaseContext();
await dbContext.init();

// Initialize Authentication Service
const authService = new AuthService(dbContext, AUTH_SECRET_KEY);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function createAdmin() {
    await dbContext.init();
    
    rl.question('Enter admin username: ', async (username) => {
        rl.question('Enter admin password: ', async (password) => {
            try {
                const result = await authService.register(username, password);
                if (result.success) {
                    console.log('Admin user created successfully.');
                } else {
                    console.log('Error creating admin user:', result.message);
                }
            } catch (error) {
                console.error('Error creating admin user:', error);
            }
            rl.close();
        });
    });
}

createAdmin();
