import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { CommentService } from '../comment.service';

import { VideoService } from '../../videos/video.service';

@Component({
	selector: 'app-comment-create',
	templateUrl: './comment-create.component.html',
	styleUrls: ['./comment-create.component.css']
})
export class CommentCreateComponent {
	// properties
	commentInput = '';
	currVidId = '';
	user = this.getCookie("user");

	// constructors
	constructor (
		public commentService: CommentService,
		private videoService: VideoService
	) {};

	// methods
	getCookie(cname) {
	    var name = cname + "=";
	    var decodedCookie = decodeURIComponent(document.cookie);
	    var ca = decodedCookie.split(';');
	    for(var i = 0; i <ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0) == ' ') {
	            c = c.substring(1);
	        }
	        if (c.indexOf(name) == 0) {
	            return c.substring(name.length, c.length);
	        }
	    }
	    return "";
	}

	showCommentButtons() {
		document.getElementById("comment-button").style.display = "block";
		document.getElementById("cancel-button").style.display = "block";
	}

	hideCommentButtons() {
		document.getElementById("comment-button").style.display = "none";
		document.getElementById("cancel-button").style.display = "none";
	}

	onAddComment(form: NgForm) {
		this.videoService.currVidId.subscribe(id => {
			this.currVidId = id;
		});

		if (!form.value.content) {
			return;
		}
		if (form.value.content.replace(/ /g,'') == "@") {
			return;
		}

		const c = { 
			youtube_id: this.currVidId,
			author: this.getCookie("user"), 
			content: form.value.content,
			timestamp: new Date(),
			thread: [],
			reactions: {
				"thumbs_up": [],
				"heart": [],
				"laughing": [],
				"eggplant": [],
				"party": []
			}
		};
		this.commentService.addComment(c);
		form.resetForm();
	}
}