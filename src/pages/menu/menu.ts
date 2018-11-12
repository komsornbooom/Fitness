import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import {SchedulePage} from '../schedule/schedule';
import{ScanPage} from '../scan/scan';
import{CoursePage} from '../course/course';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})
export class MenuPage {
  sentEmail
  constructor(public alertCtrl:AlertController,  public navCtrl: NavController, public navParams: NavParams) {
  }
  imgpro(){
    this.navCtrl.push(ProfilePage);
  }
  imgcourse(){
    this.navCtrl.push(CoursePage);
  }
  imgscan(){
    this.navCtrl.push(ScanPage);
  }
  imgschedule(){
    this.navCtrl.push(SchedulePage);
  }
}
