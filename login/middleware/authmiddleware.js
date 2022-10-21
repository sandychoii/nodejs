const jwt = require('jsonwebtoken');
const config = require('../config/config.js');

const authMiddleware = async (req, res, next) => {
	const { AccessToken } = req.cookies;
	if (AccessToken == null) {
        res.redirect('/login')
		// res.status(403).json({success:false, errormessage:'Authentication fail'});
	} else {
		try {
			const tokenInfo = await new Promise((resolve, reject) => {
				jwt.verify(AccessToken, config.secret, 
					(err, decoded) => {
						if (err) {
							reject(err);
						} else {
							resolve(decoded);
						}
					});
			});
			req.tokenInfo = tokenInfo;
			next();
		} catch(err) {
			console.log(err);
			res.status(403).json({success:false, errormessage:'Authentication fail'});
		}
	}
}

module.exports = authMiddleware;