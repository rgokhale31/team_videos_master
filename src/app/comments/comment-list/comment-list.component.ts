import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';

import { CommentService } from '../comment.service';

import { VideoService } from '../../videos/video.service';

@Component({
	selector: 'app-comment-list',
	templateUrl: './comment-list.component.html',
	styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent implements OnInit {
	// properties
	public comments;
	private commentsSub: Subscription;
	user = this.getCookie("user");

	// constructors
	constructor (
		public commentService: CommentService,
		private videoService: VideoService
	) {};

	// methods
	ngOnInit() {
		this.videoService.currVidId.subscribe(id => {
			this.commentService.getComments(id);
			this.commentService.getCommentUpdateListener()
			.subscribe((comments: []) => {
				this.comments = comments;
			});
		});
	}

	test() {
		alert("ypo");
	}
	
	showReplyRow(commentId) {
		document.getElementById( 'reply-row-' + commentId ).style.display = 'block';
		//document.getElementById( 'reply-row-' + commentId ).scrollIntoView();
	}

	hideReplyRow(commentId) {
		document.getElementById( 'reply-row-' + commentId ).style.display = 'none';
		//document.getElementById( 'reply-row-' + commentId ).scrollIntoView();
	}

	clickedSize(id, emoji) {
		var reaction = {
			"user": this.user,
			"emoji": emoji
		}
		this.commentService.addReaction(id, reaction);
	}

	showCommentActions(commentId) {
		document.getElementById( 'comment-actions-' + commentId ).style.display = 'block';
	}

	timestampCheck(ev) {
		if ( ev.target.classList.contains("timestamp") ) {
			var timestamp = ev.target.innerHTML.slice(1);
			if ( timestamp.indexOf(":") > -1 ) {
				timestamp = timestamp.split(":");
				if (!isNaN(timestamp[0]) && !isNaN(timestamp[1].slice(0,1))) {
					var video: HTMLVideoElement = <HTMLVideoElement>document.getElementById("videoIframe");
					var secs = Number(timestamp[0])*60 + Number(timestamp[1].slice(0,2));
					video.currentTime = <number>secs;
				}
			}
		}
	}

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

	onAddReply(form: NgForm, id: string) {
		if (!form.value.content) {
			return;
		}

		const r = { 
			author: this.getCookie("user"), 
			content: form.value.content,
			timestamp: new Date()
		};

		this.commentService.addReply(id, r);
		form.resetForm();
	}

	onDeleteComment(id) {
		var delete_flag = confirm("Are you sure you want to delete your comment? This action cannot be undone.")
		if (delete_flag) {
			this.videoService.currVidId.subscribe(youtube_id => {
				this.commentService.deleteComment(id,youtube_id);
			});
		} else {
			return;
		}
	}
}