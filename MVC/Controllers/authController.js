import AuthService from '../../custom_modules/Auth.js';

export const authenticateLogin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await AuthService.login(username, password);
        if (result.success) {
            const expiryDate = new Date();
            expiryDate.setSeconds(expiryDate.getSeconds() + 15);
            res.cookie('auth', result.token, {
                httpOnly: false,
                secure: false,
                sameSite: 'strict',
                expires: expiryDate,
            });
        }
        res.json(result);
    } catch (error) {
        console.error('Error authenticating: ', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
