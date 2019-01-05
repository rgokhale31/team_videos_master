import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms"; 

@Component({
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

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

	onLogin(form: NgForm) {
		var person = form.value.first_name.trim() + ' ' + form.value.last_name.trim();
		this.setCookie("user", person, 100);
		document.location.href = '/';
	}

	ngOnInit() {
		if (this.getCookie("user") == "") {
			return;
		} else {
			document.location.href = '/';
		}
	}

}