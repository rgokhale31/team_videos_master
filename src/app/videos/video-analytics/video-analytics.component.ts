import { Component, OnInit } from '@angular/core';
import { VideoService } from '../video.service';

@Component({
	selector: 'app-video-analytics',
	templateUrl: './video-analytics.component.html',
	styleUrls: ['./video-analytics.component.css']
})
export class VideoAnalyticsComponent implements OnInit {
	// properties
	public video_title;
	public video_date;
	public video_view_count;
	public video_viewers;

	// constructors
	constructor (private videoService: VideoService) {};

	// methods
	unique(ar) {
		return ar.filter(function (value, index, self) { 
			return self.indexOf(value) === index;
		});
	}
	// *****unused******
	changeVideoTime(ofst) {
		var video: HTMLVideoElement = <HTMLVideoElement>document.getElementById("videoIframe");
		video.currentTime = video.currentTime + ofst;
	}

	playlistToggle(ev) {
		var playlist_row;
		playlist_row = ev.target.closest('tr');

		if (playlist_row.getElementsByClassName('material-icons')[0].innerHTML == 'check_box_outline_blank') {
			playlist_row.getElementsByClassName('material-icons')[0].innerHTML = 'check';
			playlist_row.getElementsByClassName('material-icons')[0].classList.remove('grey-text');
			playlist_row.getElementsByClassName('material-icons')[0].classList.add('blue-text');
		} else {
			playlist_row.getElementsByClassName('material-icons')[0].innerHTML = 'check_box_outline_blank';
			playlist_row.getElementsByClassName('material-icons')[0].classList.remove('blue-text');
			playlist_row.getElementsByClassName('material-icons')[0].classList.add('grey-text');
		} 
	}

	ngOnInit() {
		this.videoService.currVidTitle.subscribe(video_title => {
			this.video_title = video_title;
		});

		this.videoService.currVidDate.subscribe(video_date => {
			this.video_date = video_date;
		});

		this.videoService.currVidViewers.subscribe(video_viewers => {
			this.video_view_count = video_viewers.length;
			this.video_viewers = this.unique(video_viewers);
		});
	}

	showCreateButtons() {
		document.getElementById("createPlaylist").style.display = "block";
		document.getElementById("cancelPlaylist").style.display = "block";
	}

	hideCreateButtons() {
		document.getElementById("createPlaylist").style.display = "none";
		document.getElementById("cancelPlaylist").style.display = "none";
	}
}