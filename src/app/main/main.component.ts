import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'main-root',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
	// properties
	team = [
		'Aditya Singh',
		'Akaash Padmanabha',
		'Akhil Chakravati',
		'Anand Prabhu',
		'Ashwin Nathan',
		'Chirag Manyapu',
		'Eash Aggarwal',
		'Gantavya Pawha',
		'Ishaan Rao',
		'Kunal Naik',
		'Prateek Agarwal',
		'Rahul Venkatesh',
		'Rakesh Ravi',
		'Rounak Gokhale',
		'Ritvik Bodducherla',
		'Rohan Shah',
		'Sahil Ahuja',
		'Saumeel Desai',
		'Shabaig Chatha',
		'Shreyas Kudrimoti',
		'Srihari Sritharan',
		'Sri Sritharan',
		'Dr Srimix',
		'Vaibhav Desikan',
		'Yash Killa'
	];

	user = '';

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

	setCookie(cname, cvalue, exdays) {
	    var d = new Date();
	    d.setTime(d.getTime() + (exdays*24*60*60*1000));
	    var expires = "expires="+ d.toUTCString();
	    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	}

	loginRedirect() {
		document.location.href = '/login';
	}

	nameInput() {
	    var person = prompt("Please enter your full name:", "Shreyas Kudrimoti");
	    if ( !this.team.includes(person) ) {
	        this.nameInput();
    	} else {
    		this.setCookie("user", person, 100);
    		document.location.reload();
    	}
	}

	toggleVideo() {
		var video = document.getElementsByTagName("video")[0];
		video.style.display = "none";
	}

	ngOnInit() {
		if (this.getCookie("user") == "") {
			this.loginRedirect();
			return;
		} else {
			this.user = this.getCookie("user");
			console.log(this.user);
		}
	}
}