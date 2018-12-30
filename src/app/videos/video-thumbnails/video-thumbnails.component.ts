import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser'
import { VideoService } from '../video.service';

@Component({
	selector: 'app-video-thumbnails',
	templateUrl: './video-thumbnails.component.html',
	styleUrls: ['./video-thumbnails.component.css']
})
export class VideoThumbnailsComponent implements OnInit {
	// properties
	currVidId = '';
	user = '';

	// constructors
	constructor (
		public sanitizer: DomSanitizer,
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

	ngOnInit() {
		this.videoService.currVidId.subscribe(id => {
			this.currVidId = id
		});

		this.user = this.getCookie("user");
	}
}