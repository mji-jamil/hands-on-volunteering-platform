const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req?.cookies?.token) {
        token = req.cookies.token;
    }
    // 2. Then check Authorization header
    else if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, no token'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log('decoded', decoded);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({
            success: false,
            message: 'Not authorized, token failed'
        });
    }
};

module.exports = protect;