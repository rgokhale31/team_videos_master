import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class VideoService {
	private videos = [];
	private videosUpdated = new Subject();
	private defaultVidId = 'PennDhamakaJhalak2018.mp4';

	private newVidId = new BehaviorSubject(this.defaultVidId);
	currVidId = this.newVidId.asObservable();

	private newVidTitle = new BehaviorSubject('Penn Dhamaka Jhalak 2018');
	currVidTitle = this.newVidTitle.asObservable();

	private newVidDate = new BehaviorSubject('11/12/2018');
	currVidDate = this.newVidDate.asObservable();

	private newVidViewers = new BehaviorSubject([]);
	currVidViewers = this.newVidViewers.asObservable();

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
	    	if (Math.round(elapsed/msPerDay) == 1) {
	    		return 'yesterday';
	    	} else {
	        	return Math.round(elapsed/msPerDay) + ' days ago';   
	    	}
	    }

	    else if (elapsed < msPerYear) {
	        return Math.round(elapsed/msPerMonth) + ' months ago';   
	    }

	    else {
	        return Math.round(elapsed/msPerYear ) + ' years ago';   
	    }
	}

	getVideos(team, user) {
		if (team == '/') {
			team = 'penndhamaka'
		}
		this.http.get('http://teampracticevideos-env.mhtpstgap5.us-east-1.elasticbeanstalk.com/api/videos/' + team)
		.subscribe((videoData: [{}]) => {
			for (var i = 0; i < videoData.length; i++) {
				videoData[i]['date'] = this.timeDifference(videoData[i]['date']);
				this.videos.push(videoData[i]);
				this.videosUpdated.next([...this.videos]);

			}
		});

		this.updateCurrVidInfo(team, 'PennDhamakaJhalak2018.mp4', user);
	}

	getVideoUpdateListener() {
		return this.videosUpdated.asObservable();
	}

	updateCurrVidInfo(team, newId, user) {
		if (team == '/') {
			team = '/penndhamaka'
		}
		
		this.currVidId.subscribe(currVidId => {
			if (newId == currVidId && newId != this.defaultVidId) {
				return;
			}
		});

		// for the iframe
		this.newVidId.next(newId);
		
		// for the analytics
		var user_dict = { "id": newId, "user_obj": user };
		this.http.post('http://teampracticevideos-env.mhtpstgap5.us-east-1.elasticbeanstalk.com/api/videos/video/', user_dict)
		.subscribe((videoData) => {
			this.newVidTitle.next(videoData['title']);
			this.newVidDate.next(this.timeDifference(videoData['date']));
			this.newVidViewers.next(videoData['viewers']);
		});
	}
}





















