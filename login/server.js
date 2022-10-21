const express = require('express');
const nunjucks = require('nunjucks')
const cookieParser = require('cookie-parser')

const app = express();

app.use(express.json());

app.set('view engine', 'html')
nunjucks.configure('./views', {
    express: app,
    watch: true
})
app.use(cookieParser())

app.use(express.urlencoded({extended:false}));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'content-type');
    next();
  });


require("./routes/login.route.js")(app);
require("./routes/main.route.js")(app);


app.listen(8888, () => {
	console.log('Listening...');
});