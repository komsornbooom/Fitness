import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,LoadingController } from 'ionic-angular';
import firebase from 'firebase';
import 'firebase/firestore';
import * as moment from 'moment';
import { SchedulePage } from '../schedule/schedule';
/**
 * Generated class for the YogaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var getCourse= [],getDateTime= [],getCount= [],reg = [],count = [];
@IonicPage()
@Component({
  selector: 'page-yoga',
  templateUrl: 'yoga.html',
})
export class YogaPage {
  public getCount = [];
  public course = [];
  public getDateTime = [];
  radio1 = '';
  public reg = [];
  public count = [];
  sid;
  timedate = moment().format('YYYY-MM-DD HH:mm:ss');
  constructor(public loadingCtrl: LoadingController,public navCtrl: NavController, public navParams: NavParams, public alertCtrl:AlertController) {
    var uid = firebase.auth().currentUser.uid;
      firebase.firestore().collection("Register").doc(uid).get().then((doc) => {
        if (doc.exists) {
            console.log("Document id:", doc.data().sid);
            this.sid = doc.data().sid;
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
     })
    let dbs = firebase.firestore();
    dbs.collection("Yoga").get()
    .then(function(querySnapshot) {
        var i = 0;
        var j = 0;
        var num = 1;
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(i+': '+doc.id);
            getCourse[i] = doc.id;
            
            //----------------------
            dbs.collection("Yoga").doc(getCourse[i]).get().then((doc) => {
              if (doc.exists) {
                  console.log("Document Date:", doc.data().date);
                  console.log("Document Time:", doc.data().time);

                  getDateTime[j]=doc.data().date+'/'+doc.data().time;
                  getCount[j] = doc.data().get;
                  reg[j] = doc.data().registered;
                  count[j] = num;
                  console.log(j +':'+ getDateTime[j]);
                  num++;
                  j++;
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
                  
              
          })
          i++;
            //----------------------
            
        })
    })
  .catch(function(error) {
    console.log("Error getting document:", error);
  });
  this.getDateTime = getDateTime;
  this.getCount = getCount;
  this.course = getCourse;
  this.reg = reg;
  this.count = count;

  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
  
    loading.present();
  
    setTimeout(() => {
      loading.dismiss();
    }, 1500);
    console.log('ionViewDidLoad YogaPage');
  }

  doRefresh(refresher) {
    let dbs = firebase.firestore();
    dbs.collection("Yoga").get()
    .then(function(querySnapshot) {
        var i = 0;
        var j = 0;
        var num = 1;
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(i+': '+doc.id);
            getCourse[i] = doc.id;
            
            //----------------------
            dbs.collection("Yoga").doc(getCourse[i]).get().then((doc) => {
              if (doc.exists) {
                  console.log("Document Date:", doc.data().date);
                  console.log("Document Time:", doc.data().time);

                  getDateTime[j]=doc.data().date+'/'+doc.data().time;
                  getCount[j] = doc.data().get;
                  reg[j] = doc.data().registered;
                  count[j] = num;
                  console.log(j +':'+ getDateTime[j]);
                  num++;
                  j++;
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
                  
              
          })
          i++;
            //----------------------
            
        })
    })
  .catch(function(error) {
    console.log("Error getting document:", error);
  });
  this.getDateTime = getDateTime;
  this.getCount = getCount;
  this.course = getCourse;
  this.reg = reg;
  this.count = count;
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 1000);
  }
  
  regCourse(){
  
    if(this.radio1 == ''){
      let alert = this.alertCtrl.create({
        title: 'ไม่พบคอร์ส!',
        subTitle: "กรุณาเลือกคอร์สให้ถูกต้อง",
        buttons: ['ตกลง']
        
      });
      alert.present();
      console.log('course not found!');
    }
    else{
      var uid = firebase.auth().currentUser.uid;
      const dataRef: firebase.database.Reference = firebase.database().ref('/users/'+this.sid+'/'+uid+'/courseReg/Yoga/');
      dataRef.once('value', dataSnapshot => {
        try {
          console.log(dataSnapshot.val().course);
          let alert = this.alertCtrl.create({
            title: 'ไม่สามารถเพิ่มคอร์สได้!',
            subTitle: "ท่านได้ทำการลงทะเบียนคอร์ส 'โยคะ' อยู่แล้ว",
            buttons: ['ตกลง']
          });
          alert.present();
          console.log('Sorry!, Course registered!');
        } catch (error) { 
            console.log(this.radio1);
            let dbs = firebase.firestore();
            dbs.collection("Yoga").doc(this.radio1).get().then((doc) => {
              if (doc.exists) {
                var uid = firebase.auth().currentUser.uid;
                if(doc.data().registered  < doc.data().get){
                  const confirm = this.alertCtrl.create({
                    title: 'ยืนยันการสมัคร?',
                    message: "คุณต้องการที่จะสมัครคอร์ส 'โยคะ' ?",
                    buttons: [
                      {
                        text: 'ไม่ตกลง',
                        handler: () => {
                          console.log('Disagree clicked');
                        }
                      },
                      {
                        text: 'ตกลง',
                        handler: () => {
                          var reg = doc.data().registered + 1;
                          dbs.collection('Yoga').doc(this.radio1).update({
                            registered:reg
                          })
                          firebase.database().ref('/users/'+this.sid+'/'+uid +'/courseReg/Yoga').set({
                            regTime:this.timedate,
                            course:this.radio1,
                            courseDate:doc.data().date,
                            courseTime:doc.data().time
                          })
                          this.doRefreshreg();
                          console.log("Document reg refreshed:", reg);
                          console.log('Agree clicked');
                          this.navCtrl.push(SchedulePage);
                        }
                      }
                    ]
                  });
                  confirm.present();
                }else{
                  let alert = this.alertCtrl.create({
                    title: 'เต็มแล้ว!',
                    subTitle: "คอร์สนี้มีจำนวนผู้สมัครเต็มแล้ว",
                    buttons: ['ตกลง']
                  });
                  alert.present();
                  console.log('Sorry!, Course Full!');
                  this.doRefreshreg();
                }
            
              
              
              } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
              }
            }).catch(function(error) {
              console.log("Error getting document:", error);
            });
          
          }
      })

    }

  }

  doRefreshreg() {
    let dbs = firebase.firestore();
    dbs.collection("Yoga").get()
    .then(function(querySnapshot) {
        var i = 0;
        var j = 0;
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            getCourse[i] = doc.id;
            //----------------------
            dbs.collection("Yoga").doc(getCourse[i]).get().then((doc) => {
              if (doc.exists) {
                  reg[j] = doc.data().registered;
                  j++;
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
          })
          i++;
            //----------------------
        })
    })
    .catch(function(error) {
      console.log("Error getting document:", error);
    }); 
    this.reg = reg;
  }

}
