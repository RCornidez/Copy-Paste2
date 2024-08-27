import { customAlphabet } from 'nanoid';


const nanoid = customAlphabet('abcd1234567890', 6);


export const generateGetJWT = (req, res, jwt) => {
    try {
        const uniqueKey = nanoid();
        const payload = { 
            req_ip: req.ip,
            group_id: uniqueKey
        };
        const token = jwt.generateToken(payload, '15m');
        res.cookie('jwt', token, { 
            httpOnly: true,
            secure: false,
            sameSite: 'strict'
        });
        res.json({ success: true, group_id: uniqueKey });
    } catch (error) {
        console.error('Error generating GET JWT token:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

export const generatePostJWT = (req, res, jwt) => {
    try {
        const uniqueKey = req.body.group_id;
        const payload = { 
            req_ip: req.ip,
            group_id: uniqueKey
        };
        const token = jwt.generateToken(payload, '15m');
        res.cookie('jwt', token, { 
            httpOnly: true,
            secure: false,
            sameSite: 'strict'
        });
        res.json({ success: true, group_id: uniqueKey });
    } catch (error) {
        console.error('Error generating POST JWT token:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
