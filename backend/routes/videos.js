var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://eash:Issiutng123@ds017514.mlab.com:17514/dmakvids2018', ['videos']);

const fileUpload = require('express-fileupload');
router.use(fileUpload());

const ThumbnailGenerator = require('video-thumbnail-generator').default;

// Get Video Info
router.get('/:team', function(req, res, next) {
	db.videos.find({"_team" : req.params.team}).sort({date: -1}).toArray(function(err, videos) {
		if (err) {
			res.send(err)
		} 
		res.json(videos)
	});
});

// Get One Video Info
router.post('/video', function(req, res) {
	var query = {"youtube_id": req.body.id};
	db.videos.findOne(query, function(err, video) {
		if (err) {
			res.send(err)
		}
		if (req.body.user_obj != "") {
			// add one to the view count
			video['viewers'].unshift(req.body.user_obj);

			db.videos.update(query, video, {}, function(err, status) {
				if (err) {
					res.send(err)
				}
			});
		}

		res.json(video);
		
	});
});

// Endpoint to handle incoming videos
router.post('/upload', function(req, res) {
	// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
	let video = req.files.file;
	var videoPath = 'uploads/' + req.files.file.name;

	// Use the mv() method to place the file somewhere on your server
	video.mv(videoPath, function(err) {
		if (err) {
			console.log(err)
			return res.status(500).send(err);
		}
		res.status(200).send();
		console.log('New Video! ' + req.protocol + '://' + req.get("host") + '/' + videoPath);
		const tg = new ThumbnailGenerator({
			sourcePath: videoPath,
			thumbnailPath: 'uploads/thumbnails',
		});

		tg.generate({
			size: '640x400'
		});
		
		tg.generateOneByPercentCb(90, (err, result) => {
			console.log(result);
			// 'test-thumbnail-320x240-0001.png'
		});
	});
});

// Endpoint to store incoming videos in DB 
router.post('/save_upload', function(req, res) {
	var date = new Date();
	var new_video = {
	    "_team": "penndhamaka",
	    "title": req.body.title,
	    "youtube_id": req.body.path.split('/')[req.body.path.split('/').length - 1],
	    "date": date,
	    "tag": "practice-video",
	    "viewers": []
	};

	db.videos.save(new_video, function(err, task) {
		if (err) {
			res.status(500).send(err)
		} 
		res.status(200).send('File uploaded and saved to database!');
		console.log("saved to db!");
	});
});


// Delete Single video
router.delete('/delete_video/:id', function(req, res, next) {
	db.videos.remove({_id: mongojs.ObjectId(req.params.id)}, function(err, video) {
		if (err) {
			res.send(err)
		} 
		res.json(video)
	});
});

// Update video
router.put('/videos/:id', function(req, res, next) {
	var video = req.body;
	var updvideo = {};
	if (video.title) {
		updvideo.title = video.title
	}
	if (video.isPrivate) {
		updvideo.isPrivate = video.isPrivate
	}
	if (!updvideo) {
		res.status(400);
		res.json({
			"error" : "bad request"
		})
	} else {
		db.videos.update({_id: mongojs.ObjectId(req.params.id)}, updvideo, {}, function(err, video) {
			if (err) {
				res.send(err)
			} 
			res.json(video)
		});
	}
});
module.exports = router;



























