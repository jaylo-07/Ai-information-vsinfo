const User = require('../model/user');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) {
            return res.status(400).json({ error: 'Token is required' });
        }

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub, email, name, picture } = payload;

        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                googleId: sub,
                name: name,
                email: email,
                picture: picture
            });
            await user.save();
        }

        const jwtToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'secretKey', {
            expiresIn: '7d'
        });

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                picture: user.picture
            },
            token: jwtToken
        });

    } catch (error) {
        console.error("Google Login Error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
