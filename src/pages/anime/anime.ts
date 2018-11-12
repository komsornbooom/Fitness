import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';


@IonicPage()
@Component({
  selector: 'page-anime',
  templateUrl: 'anime.html',
})
export class AnimePage {
  public showText;

  public lottieConfig: Object;
  constructor(public navCtrl: NavController, public navParams: NavParams) {  
    this.lottieConfig = {
      path: 'assets/success.json',
      autoplay: true,
      loop: true
  };  
  }
  handleAnimation(anim: any) {
    setTimeout(() => {
      this.showText = 'show';
      this.navCtrl.setRoot(HomePage);
    }, 3000);
    
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad AnimePage');
  }

}
