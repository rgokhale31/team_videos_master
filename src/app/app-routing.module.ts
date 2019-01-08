import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from "./main/main.component";
import { LoginComponent } from "./auth/login/login.component";
import { NotFoundComponent } from "./not-found/not-found.component";

const routes: Routes = [
	{ path: '', component: MainComponent },
	{ path: 'login', component: LoginComponent },
	{ path: '404', component: NotFoundComponent },
 	{ path: '**', redirectTo: '/404' }
];

@NgModule({
  imports: [
  	RouterModule.forRoot(
  		routes
  	)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
