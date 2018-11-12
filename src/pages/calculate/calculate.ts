import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import firebase from 'firebase';
import 'firebase/firestore';
import { MenuPage } from '../menu/menu';
import { AngularFireDatabase } from 'angularfire2/database';
import * as moment from 'moment';
/**
 * Generated class for the CalculatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-calculate',
  templateUrl: 'calculate.html',
})
export class CalculatePage {
  sid;
  uid;
  mincal: number;
  hr: number;
  min: number;
  sec: number;
  fra: number;
  course;
  calburn;
  weight;
  device;
  aerobicCourse = '';
  yogaCourse = '';
  timedate = new Date().toLocaleString();
  today = moment().format('YYYY-MM-DD');
  constructor(public db: AngularFireDatabase, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
    this.device = navParams.get('device')
    this.weight = navParams.get('weight')
    console.log("weight:", this.weight);
    this.hr = Math.floor(this.navParams.get('timer') / (1000 * 60 * 60))
    this.min = Math.floor((this.navParams.get('timer') - this.hr * 1000 * 60 * 60) / (1000 * 60))
    this.sec = Math.floor((this.navParams.get('timer') - this.hr * 1000 * 60 * 60 - this.min * 1000 * 60) / 1000)
    this.fra = Math.floor((this.navParams.get('timer') - this.hr * 1000 * 60 * 60 - this.min * 1000 * 60 - this.sec * 1000) / 10)

    this.mincal = Math.floor((this.navParams.get('timer') / (1000 * 60)))
    this.course = navParams.get('Notifications')
    this.calburn = Math.floor((this.mincal * this.course * 3.5 * this.weight) / 200)

  }

  ionViewDidLoad() {
    var uid = firebase.auth().currentUser.uid;
    firebase.firestore().collection("Register").doc(uid).get().then((doc) => {
      if (doc.exists) {
        console.log("Document id:", doc.data().sid);
        this.sid = doc.data().sid;
        const dataRef: firebase.database.Reference = firebase.database().ref('/users/' + doc.data().sid + '/' + uid + '/courseReg/Aerobic');
        dataRef.once('value', dataSnapshot => {
          try {
            this.aerobicCourse = dataSnapshot.val().course;
            console.log(dataSnapshot.val().course);
          } catch (error) {
            console.log('Aerobic not found');
          }
        })
        const dataRef1: firebase.database.Reference = firebase.database().ref('/users/' + doc.data().sid + '/' + uid + '/courseReg/Yoga');
        dataRef1.once('value', dataSnapshot => {
          try {
            this.yogaCourse = dataSnapshot.val().course;
            console.log(dataSnapshot.val().course);
          } catch (error) {
            console.log('Yoga not found');
          }
        })
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    })
    console.log('ionViewDidLoad CalculatePage');
  }
  saveTo() {
    var user = firebase.auth().currentUser;
    this.uid = user.uid;
    if (this.aerobicCourse == this.device || this.yogaCourse == this.device) {
    } else {
      let dbs = firebase.firestore();
      dbs.collection('Device').doc(this.device).update({
        status: 'ว่าง'
      })
    }
    firebase.database().ref('/users/' + this.sid + '/' + this.uid + '/calorieBurn/' + this.today).once('value', dataSnapshot => {
      if (dataSnapshot.exists() == true) {
        this.db.list('/users/' + this.sid + '/' + this.uid + '/Used-Device/' + this.today).push({
          usedDevice: this.device,
          trainingTime: this.hr + ':' + this.min + ':' + this.sec,
          saveTime: this.timedate
        })
        var gethr: number = dataSnapshot.val().trainingTime.split(':')[0];
        var getmin: number = dataSnapshot.val().trainingTime.split(':')[1];
        var getsec: number = dataSnapshot.val().trainingTime.split(':')[2];
        console.log(dataSnapshot.exists());
        console.log(gethr + ':' + getmin + ':' + getsec);
        this.hr = Math.floor(this.hr) + Math.floor(gethr);
        this.min = Math.floor(this.min) + Math.floor(getmin);
        this.sec = Math.floor(this.sec) + Math.floor(getsec);
        this.calburn = this.calburn + dataSnapshot.val().calorieBurn;
        firebase.database().ref('/users/' + this.sid + '/' + this.uid + '/calorieBurn/' + this.today).set({
          trainingTime: this.hr + ':' + this.min + ':' + this.sec,
          calorieBurn: this.calburn,
          saveTime: this.timedate
        })
        let alert = this.alertCtrl.create({
          title: 'อัพเดท!',
          subTitle: "การอัพเดทข้อมูลเสร็จสิ้น!",
          buttons: ['ตกลง']
        });
        alert.present();
      } 
      else {
        firebase.database().ref('/users/' + this.sid + '/' + this.uid + '/calorieBurn/' + this.today).set({
          trainingTime: this.hr + ':' + this.min + ':' + this.sec,
          calorieBurn: this.calburn,
          saveTime: this.timedate
        })
        this.db.list('/users/' + this.sid + '/' + this.uid + '/Used-Device/' + this.today).push({
          usedDevice: this.device,
          saveTime: this.timedate
        })
        console.log(dataSnapshot.exists());
        let alert = this.alertCtrl.create({
          title: 'บันทึก!',
          subTitle: "การบันทึกข้อมูลเสร็จสิ้น!",
          buttons: ['OK']
        });
        alert.present();
      }
    })
    this.navCtrl.setRoot(MenuPage);
  }
}
