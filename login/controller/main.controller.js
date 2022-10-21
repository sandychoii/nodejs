const authMiddleware = require('../middleware/authmiddleware.js');
const express  = require('express');
const router = express.Router();

router.get('/main', authMiddleware, (req, res)=>{
    res.render('main.html')
})

module.exports = router;