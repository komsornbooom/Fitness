import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { CalculatePage } from '../calculate/calculate';
import firebase from 'firebase';
import 'firebase/firestore';
/**
 * Generated class for the TimerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var lapsNr = 1;
var minutes, seconds, fract;

function format(ms) {
  minutes = Math.floor(ms / (1000 * 60)),
    seconds = Math.floor((ms - minutes * 1000 * 60) / 1000),
    fract = Math.floor((ms - minutes * 1000 * 60 - seconds * 1000) / 10);
  return minutes + 'm ' + (seconds < 10 ? '0' : '') + seconds + 's.' + (fract < 10 ? '0' : '') + fract;

}

@IonicPage()
@Component({
  selector: 'page-timer',
  templateUrl: 'timer.html',
})
export class TimerPage {
  course;
  Notifications = '';
  timer: number;
  weight: number;
  uid;
  device;
  name = '';
  name1 = '';
  name2 = '';
  timerSettings: any = {
    lang: 'th',
    theme: 'mobiscroll-dark',
    display: 'inline',
    step: 0.01,
    rows: 3,
    mode: 'stopwatch',
    onReset: function () {
      document.getElementById('laps').innerHTML = "";
      lapsNr = 1;
    },
    onLap: function (event, inst) {
      var cont = document.getElementById('laps'),
        temp = document.createElement('tr');

      temp.innerHTML = '<td>#' + lapsNr + '</td><td> - ' 
      + format(event.lap) + ' - </td><td>' + format(event.ellapsed) + '</td>';
      cont.appendChild(temp);
      lapsNr++;
    }
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
    this.device = this.navParams.get('device')
    this.name = this.navParams.get('name')
    this.name1 = this.navParams.get('name1')
    this.name2 = this.navParams.get('name2')
    console.log(this.name);
    var user = firebase.auth().currentUser;
    this.uid = user.uid;
    let dbs = firebase.firestore();
    dbs.collection("Register").doc(this.uid).get().then((doc) => {
      if (doc.exists) {
        console.log("Document weight:", doc.data().weight);
        this.weight = doc.data().weight;
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
    //--------------------------------------------------------------------------------------------//


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TimerPage');
    //console.log(this.timer);
  }
  Cal() {
    if (this.Notifications != '') {
      this.navCtrl.push(CalculatePage, {
        'timer': this.timer,
        'Notifications': this.Notifications,
        'weight': this.weight,
        'device': this.device
      });
    } else {
      let alert = this.alertCtrl.create({
        title: 'ยังไม่เลือกรูปแบบการฝึก!',
        subTitle: "กรุณา เลือกรูปแบบการฝึก",
        buttons: ['ตกลง']
      });
      alert.present();
    }
  }

}
