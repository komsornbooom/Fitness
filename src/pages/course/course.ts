import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {YogaPage} from '../yoga/yoga';
import {AerobicPage} from '../aerobic/aerobic';

/**
 * Generated class for the CoursePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-course',
  templateUrl: 'course.html',
})
export class CoursePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CoursePage');
  }
  imgyoga (){
    this.navCtrl.push(YogaPage);
  }
  imgaero (){
    this.navCtrl.push(AerobicPage);
  }

}
