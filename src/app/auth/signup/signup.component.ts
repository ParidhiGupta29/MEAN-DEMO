import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
    templateUrl:'./signup.component.html',
    styleUrls:['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy{
    isLoading=false;
    private authStatusSubs : Subscription

    constructor(private authService:AuthService){}
    
    ngOnInit(){
        this.authStatusSubs= this.authService.getAuthStatusListener()
        .subscribe(authStatus=>{
            this.isLoading=false;
        }) 
    }

    onSignup(form:NgForm){
        if(form.invalid){
            return
        }
        console.log(form.value)
        this.isLoading=true
        this.authService.createUser(form.value.email, form.value.password);
    }

    ngOnDestroy(){
        this.authStatusSubs.unsubscribe;
    }
}