import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __views = path.join(__dirname, '..', '..', 'public', 'v2');
const __v1 = path.join(__dirname, '..', '..', 'public', 'v1');


// v2 Routes

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

export const getQuickstartPage = (req, res) => {
    try {
        res.sendFile(path.join(__views, 'quickstart.html'));
    } catch (error) {
        console.error('Error serving quickstart: ', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

export const getOverviewPage = (req, res) => {
    try {
        res.sendFile(path.join(__views, 'overview.html'));
    } catch (error) {
        console.error('Error serving overview: ', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

export const getPrivacyPage = (req, res) => {
    try {
        res.sendFile(path.join(__views, 'privacy.html'));
    } catch (error) {
        console.error('Error serving privacy: ', error);
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


// v1 Route

export const getv1Page = (req, res) => {
    try {
        res.sendFile(path.join(__v1, 'v1.html'));
    } catch (error) {
        console.error('Error serving Copy/Paste v1: ', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
