var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var comments = require('./routes/comments');
var videos = require('./routes/videos');
var user = require('./routes/user');

var app = express();
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

// View Engine
//app.set('views', path.join(__dirname, 'views/'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// Set Static Folder
app.use(express.static(path.join(__dirname, 'client')));

// Body Parser 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use('/uploads', express.static(path.join(__dirname, "uploads")));
app.use('/', express.static(path.join(__dirname, "angular")));

// Routes
app.use('/api/comments', comments);
app.use('/api/videos', videos);
app.use('/api/user', user);

app.use((req, res, next) => {
	res.sendFile(path.join(__dirname, "angular", "index.html"));
})

app.listen(3000, function() {
	console.log('Server started on port 3000');
});