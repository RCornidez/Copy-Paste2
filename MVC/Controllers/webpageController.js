import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __views = path.join(__dirname, '..', '..', 'public', 'v2');

export const getSplashPage = (req, res) => {
    try {
        res.sendFile(path.join(__views, 'splash.html'));
    } catch (error) {
        console.error('Error serving splash page: ', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

export const getCopyPastePage = (req, res) => {
    try {
        res.sendFile(path.join(__views, 'copy-paste.html'));
    } catch (error) {
        console.error('Error serving copy-paste: ', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

export const getLoginPage = (req, res) => {
    try {
        res.sendFile(path.join(__views, 'login.html'));
    } catch (error) {
        console.error('Error serving login: ', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
