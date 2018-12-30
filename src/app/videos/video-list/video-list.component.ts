import { Component, OnInit } from '@angular/core';
import { VideoService } from '../video.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-video-list',
	templateUrl: './video-list.component.html',
	styleUrls: ['./video-list.component.css']
})
export class VideoListComponent implements OnInit {
	// properties
	public videos: {};
	private videosSub: Subscription;
	private team: string = window.location.pathname;
	user: string = this.getCookie("user");
	private currVidImg;

	// constructors
	constructor (
		private videoService: VideoService
	) {};

	// methods
	ngOnInit() {
		this.videoService.getVideos(this.team, this.user);
		this.videoService.getVideoUpdateListener()
		.subscribe((videos) => {
			this.videos = videos;
		});
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

	searchVideos(ev) {
		var r = document.getElementById("video-list").getElementsByTagName("tr");

		for (var i = r.length - 1; i >= 0; i--) {
			var video_search_input = <HTMLInputElement>document.getElementById("video_search");
			var video_search = video_search_input.value.toLowerCase();
			if ( r[i].getElementsByTagName("td")[1].innerText.toLowerCase().search(video_search) == -1 ) {
				r[i].style.display = 'none';
			} else {
				r[i].style.display = 'block';
			}
		}
	}

	updateIframe(ev) {
		var v = ev.target.closest("tr");
		this.videoService.updateCurrVidInfo(this.team, v.id, this.user);

		this.currVidImg = v.getElementsByTagName("img")[0];

		var vids = document.getElementsByTagName("tr");
		for (var i = 0; i < vids.length; i++) {
			vids[i].style.backgroundColor = '';
		}

		v.style.backgroundColor = '#e1f5fe';
	}
}