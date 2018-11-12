import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,LoadingController } from 'ionic-angular';
import firebase from 'firebase';
import 'firebase/firestore';
/**
 * Generated class for the SchedulePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
})
export class SchedulePage {
 aerobicCourse = '';
 yogaCourse = '';
 aerobicdate = '';
 aerobictime = '';
 yogadate = '';
 yogatime = '';
 sid;
  constructor(public loadingCtrl: LoadingController,public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
  
    loading.present();
  
    setTimeout(() => {
      loading.dismiss();
    }, 1500);
  }

  ionViewDidLoad() {
    var uid = firebase.auth().currentUser.uid;
      firebase.firestore().collection("Register").doc(uid).get().then((doc) => {
        if (doc.exists) {
            console.log("Document id:", doc.data().sid);
            this.sid = doc.data().sid;
            const dataRef: firebase.database.Reference = firebase.database().ref('/users/'+this.sid+'/'+uid +'/courseReg/Aerobic');
      dataRef.once('value', dataSnapshot => {
       try {
         this.aerobicCourse = dataSnapshot.val().course;
         this.aerobicdate = dataSnapshot.val().courseDate;
         this.aerobictime = dataSnapshot.val().courseTime;
         console.log(dataSnapshot.val().course);
       } catch (error) {
        console.log('Aerobic not found');
       }
      })

      const dataRef1: firebase.database.Reference = firebase.database().ref('/users/'+this.sid+'/'+uid +'/courseReg/Yoga');
      dataRef1.once('value', dataSnapshot => {
       try {
         this.yogaCourse = dataSnapshot.val().course;
         this.yogadate = dataSnapshot.val().courseDate;
         this.yogatime = dataSnapshot.val().courseTime;
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

    
    console.log('ionViewDidLoad SchedulePage');
  }
  removeCourseYoga(){
    const confirm = this.alertCtrl.create({
      title: 'ยกเลิกคอร์ส?',
      message: 'คุณแน่ใจหรือไม่ ว่าต้องการที่จะยกเลิกคอร์ส?',
      buttons: [
        {
          text: 'ไม่ใช่',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'ใช่',
          handler: () => {
            var uid = firebase.auth().currentUser.uid;
            firebase.database().ref('/users/'+this.sid+'/'+uid+'/courseReg/Yoga/').remove();
            this.yogaCourse = '';
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
  

    
  }
  removeCourseAerobic(){
    const confirm = this.alertCtrl.create({
      title: 'ยกเลิกคอร์ส?',
      message: 'คุณแน่ใจหรือไม่ ว่าต้องการที่จะยกเลิกคอร์ส?',
      buttons: [
        {
          text: 'ไม่ใช่',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'ใช่',
          handler: () => {
            var uid = firebase.auth().currentUser.uid;
            firebase.database().ref('/users/'+this.sid+'/'+uid+'/courseReg/Aerobic/').remove();
            this.aerobicCourse = '';
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
    
  }

}
