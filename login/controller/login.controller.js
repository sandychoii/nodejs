
const express  = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config/config.js');
const {memberList} = require('../model/user.js');

router.get('/', (req, res)=>{
	res.redirect('/login')
})

router.get('/login', (req, res)=>{
	const { AccessToken } = req.cookies;
	if (AccessToken != null) {
		res.redirect('/main')
	} else {
    const {user} = req
    // console.log(user)
    res.render('login.html', {user})
}})

router.post('/login', async function(req, res, next) {
	console.log("Logged in.");
	const memberId = req.body.id;
	const memberPassword = req.body.password;
	var memberItem = memberList.find(object => object.id == memberId);
	if (memberItem != null) {
		if (memberItem.password == memberPassword) {
			try {
				const accessToken = await new Promise((resolve, reject) => {
					jwt.sign({
							memberId : memberItem.id,
							memberName : memberItem.name
						},
						config.secret,
						{
							expiresIn : '1d'
						},
						(err, token) => {
							if (err) {
								reject(err);
							} else {
								resolve(token);
							}
						});
				});
				// res.json({success:true, accessToken:accessToken});
				res.cookie('AccessToken', accessToken, {
					path: '/',
					HttpOnly: true
				})
				res.redirect('/main')
			} catch(err) {
				console.log(err);
				res.status(401).json({success:false, errormessage:'token sign fail'});
			}
		} else {
			res.status(401).json({success:false, errormessage:'id and password are not identical'});
		}
	} else {
		res.status(401).json({success:false, errormessage:'id and password are not identical'});
	}
});

router.get('/logout', (req, res)=>{
    // 쿠키 삭제
    res.clearCookie('AccessToken') //, {path: '/main'})
    res.redirect('/login')
})

module.exports = router;