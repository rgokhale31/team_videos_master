import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class CommentService {
	private comments = [];
	private commentsUpdated = new Subject();

	private team = [
		'@AdityaSingh',
		'@AkaashPadmanabha',
		'@AkhilChakravati',
		'@AnandPrabhu',
		'@AshwinNathan',
		'@ChiragManyapu',
		'@EashAggarwal',
		'@GantavyaPawha',
		'@IshaanRao',
		'@KunalNaik',
		'@PrateekAgarwal',
		'@RahulVenkatesh',
		'@RakeshRavi',
		'@RounakGokhale',
		'@RitvikBodducherla',
		'@RohanShah',
		'@SahilAhuja',
		'@SaumeelDesai',
		'@ShabaigChatha',
		'@ShreyasKudrimoti',
		'@SrihariSritharan',
		'@VaibhavDesikan',
		'@YashKilla'
	];

	constructor(private http: HttpClient) {}

	timeDifference(previous) {
		previous = new Date(previous)
		var current = Number(new Date())
	    var msPerMinute = 60 * 1000;
	    var msPerHour = msPerMinute * 60;
	    var msPerDay = msPerHour * 24;
	    var msPerMonth = msPerDay * 30;
	    var msPerYear = msPerDay * 365;

	    var elapsed = current - previous;

	    if (elapsed < msPerMinute) {
	         return Math.round(elapsed/1000) + ' seconds ago';   
	    }

	    else if (elapsed < msPerHour) {
	         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
	    }

	    else if (elapsed < msPerDay ) {
	         return Math.round(elapsed/msPerHour ) + ' hours ago';   
	    }

	    else if (elapsed < msPerMonth) {
	        return Math.round(elapsed/msPerDay) + ' days ago';   
	    }

	    else if (elapsed < msPerYear) {
	        return Math.round(elapsed/msPerMonth) + ' months ago';   
	    }

	    else {
	        return Math.round(elapsed/msPerYear ) + ' years ago';   
	    }
	}

	getComments(currVidId) {
		this.http.get('http://teampracticevideos-env.mhtpstgap5.us-east-1.elasticbeanstalk.com/api/comments/' + currVidId)
		.subscribe((commentData: []) => {
			this.comments = [];
			for (var i = 0; i < commentData.length; i++) {
				let comm: {} = {
									_id: commentData[i]['_id'],
									author: commentData[i]['author'], 
									content: commentData[i]['content'],
									timestamp: this.timeDifference(commentData[i]['timestamp']),
									thread: commentData[i]['thread'],
									reactions: commentData[i]['reactions']
								};

				if (comm['thread']) {
					for (var j = 0; j < comm['thread'].length; j++) {
						comm['thread'][j]['timestamp'] = this.timeDifference(comm['thread'][j]['timestamp'])
					}
				}

				this.comments.push(comm);
			}
			this.commentsUpdated.next([...this.comments]);
		});
	}

	addComment(comm: {}) {
		this.http.post('http://teampracticevideos-env.mhtpstgap5.us-east-1.elasticbeanstalk.com/api/comments/new_comment/', comm)
		.subscribe((commentData) => {
			this.comments.push(
				{
					_id: commentData['_id'],
					author: commentData['author'], 
					content: commentData['content'],
					timestamp: this.timeDifference(commentData['timestamp']),
					thread: [],
					reactions: {
						"thumbs_up": [],
						"heart": [],
						"laughing": [],
						"eggplant": [],
						"party": []
					}
				}
			);
			this.commentsUpdated.next([...this.comments]);
/*
			var slack_post = {
				"text": commentData['author'] + " just added a new comment on http://www.teampracticevideos.com/penndhamaka"
			};
			this.http.post('https://hooks.slack.com/services/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', slack_post)
			.subscribe((commentData) => {
				return;
			});
*/
		});
	}

	addReply(id: string, comm: {}) {
		this.http.post('http://teampracticevideos-env.mhtpstgap5.us-east-1.elasticbeanstalk.com/api/comments/comment_reply/' + id, comm)
		.subscribe((commentData) => {
			this.getComments(commentData['youtube_id']);
		});
	}

	addReaction(id: string, reaction: {}) {
		this.http.post('http://teampracticevideos-env.mhtpstgap5.us-east-1.elasticbeanstalk.com/api/comments/comment_reaction/' + id, reaction)
		.subscribe((commentData) => {
			this.getComments(commentData['youtube_id']);
		});
	}

	deleteComment(id: string, youtube_id: string) {
		this.http.post('http://teampracticevideos-env.mhtpstgap5.us-east-1.elasticbeanstalk.com/api/comments/delete_comment/' + id, [])
		.subscribe((commentData) => {
			this.getComments(youtube_id);
		});
	}

	getCommentUpdateListener() {
		return this.commentsUpdated.asObservable();
	}

	autocompleter(ev, input) {
		var inp = <HTMLInputElement>document.getElementById(input);
		if (ev.key === '@') {
			this.autocomplete(inp);
		} 
	}

	autocomplete(inp) {
		/*the autocomplete function takes two arguments,
		the text field element and an array of possible autocompleted values:*/
		var currentFocus;
		var arr = this.team;
		/*execute a function when someone writes in the text field:*/
		inp.addEventListener("input", function acmplt(e) {
			var a, b, i, val = this.value.split(' ')[this.value.split(' ').length-1];
			/*close any already open lists of autocompleted values*/
			closeAllLists('');
			if (!val) {
				return false;
			}
			currentFocus = -1;
			/*create a DIV element that will contain the items (values):*/
			a = document.createElement("div");
			a.setAttribute("id", this.id + "autocomplete-list");
			a.setAttribute("class", "autocomplete-items");
			/*append the DIV element as a child of the autocomplete container:*/
			this.parentNode.appendChild(a);
			/*for each item in the array...*/
			for (i = 0; i < arr.length; i++) {
				/*check if the item starts with the same letters as the text field value:*/
				if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
					/*create a DIV element for each matching element:*/
					b = document.createElement("div");
					/*make the matching letters bold:*/
					b.innerHTML = "<img style=\"width: 22px;\" src=\"assets/img/" + arr[i].substr(1) + ".jpg\" class=\"left circle\">";
					b.innerHTML += "&nbsp; &nbsp; <b>" + arr[i].substr(0, val.length) + "</b>";
					b.innerHTML += arr[i].substr(val.length) + "<br>";
					/*insert a input field that will hold the current array item's value:*/
					b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
					/*execute a function when someone clicks on the item value (DIV element):*/
					b.addEventListener("click", function (e) {
						/*insert the value for the autocomplete text field:*/
						inp.value = inp.value
										.split(' ')
										.slice(0,inp.value.split(' ').length-1)
										.join(" ") 
										+ " " 
										+ this.getElementsByTagName("input")[0].value + ' ';
						inp.focus();
						/*close the list of autocompleted values,
						(or any other open lists of autocompleted values:*/
						closeAllLists('');
						inp.removeEventListener("input", acmplt);
					});
					a.appendChild(b);
				}
			}
		});

		function closeAllLists(elmnt) {
			/*close all autocomplete lists in the document,
			except the one passed as an argument:*/
			var x = document.getElementsByClassName("autocomplete-items");
			console.log(x);
			for (var i = 0; i < x.length; i++) {
				x[i].parentNode.removeChild(x[i]);
			}
		}
		/*execute a function when someone clicks in the document:*/
		document.addEventListener("click", function (e) {
			closeAllLists(e.target);
		});
	}
}