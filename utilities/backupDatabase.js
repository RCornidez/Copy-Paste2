import fs from 'fs';
import path from 'path';
import 'dotenv/config'

export default function backupDatabase() {
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
    fs.copyFileSync(process.env.DATABASE, backupFilePath);

    console.log(`Database backed up successfully to ${backupFilePath}`);
}