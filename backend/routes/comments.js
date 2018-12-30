var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var ObjectId = require('mongodb').ObjectID; 
var db = mongojs('mongodb://eash:Issiutng123@ds017514.mlab.com:17514/dmakvids2018', ['comments']);

function formatAtandLinks(words) {
	words = words.split(' ');
	for (var j = 0; j < words.length; j++) {
		if (words[j].slice(0,4) == 'www.') {
			words[j] = '<a href=\'http://' + words[j] + '\' target=\'_blank\' class=\'blue-text text-darken-2\'>' + words[j] + '</a>';
		} else if (words[j].indexOf('@') > -1 ||  words[j].substr(words[j].length - 4) == '.com') {
			if (isNaN(words[j][1])) {
				words[j] = '<font class=\'blue-text text-darken-2 light-blue lighten-5\'>' + words[j] + '</font>';
			} else {
				words[j] = '<font class=\'timestamp blue-text text-darken-2 pointer\'>' + words[j] + '</font>';
			}
		} else if (words[j].slice(0,4) == 'http') {
			words[j] = '<a href=\'' + words[j] + '\' target=\'_blank\' class=\'blue-text text-darken-2\'>' + words[j] + '</a>';
		}
	}
	return words.join(' ');;
}

// Get Comments for Video
router.get('/:id', function(req, res, next) {
	db.comments.find({"youtube_id" : req.params.id}).sort('timestamp').toArray(function(err, comments) {
		if (err) {
			res.send(err)
		} 
		for (var i = 0; i < comments.length; i++) {
			var comm = comments[i]['content'];
			comments[i]['content'] = formatAtandLinks(comm);

			var thread = comments[i]['thread'];
			for (var k = 0; k < thread.length; k++) {
				var rep = thread[k]['content'];
				thread[k]['content'] = formatAtandLinks(rep);
			}
		}
		res.json(comments)
	});
});


// Save Comments
router.post('/new_comment', function(req, res, next) {
	var comment = req.body;
	if (!comment.author || !comment.content) {
		res.status(400);
		res.json({
			"error" : "bad data"
		})
	} else {
		db.comments.save(comment, function(err, task) {
			if (err) {
				res.send(err)
			} 

			comment['content'] = formatAtandLinks(comment['content']);
			res.json(comment)
		});
	}
});

// Update Comment
router.post('/comment_reply/:id', function(req, res, next) {
	var query = { "_id": ObjectId(req.params.id) };
	db.comments.findOne(query, function(err, comments) {
		if (err) {
			res.send(err)
		}
		comments.thread.push(req.body);
		db.comments.update(query, comments, {}, function(err, reply) {
			if (err) {
				res.send(err)
			} 
			res.json(comments)
		});
	});
});

// Update Comment
router.post('/comment_reaction/:id', function(req, res, next) {
	var query = { "_id": ObjectId(req.params.id) };
	db.comments.findOne(query, function(err, comments) {
		if (err) {
			res.send(err)
		}
		if (comments.reactions[req.body.emoji].includes(req.body.user)) {
			comments.reactions[req.body.emoji].splice(comments.reactions[req.body.emoji].indexOf(req.body.user), 1);
		} else {
			comments.reactions[req.body.emoji].push(req.body.user);
		}
		db.comments.update(query, comments, {}, function(err, reply) {
			if (err) {
				res.send(err)
			} 
			res.json(comments)
		});
	});
});


// Delete Single Comment
router.post('/delete_comment/:id', function(req, res, next) {
	db.comments.remove({_id: mongojs.ObjectId(req.params.id)}, function(err, comment) {
		if (err) {
			res.send(err)
		} 
		res.json(comment)
	});
});

// Update Comment
router.put('/comments/:id', function(req, res, next) {
	var comment = req.body;
	var updcomment = {};
	if (comment.title) {
		updcomment.title = comment.title
	}
	if (comment.isPrivate) {
		updcomment.isPrivate = comment.isPrivate
	}
	if (!updcomment) {
		res.status(400);
		res.json({
			"error" : "bad request"
		})
	} else {
		db.comments.update({_id: mongojs.ObjectId(req.params.id)}, updcomment, {}, function(err, comment) {
			if (err) {
				res.send(err)
			} 
			res.json(comment)
		});
	}
});
module.exports = router;



























