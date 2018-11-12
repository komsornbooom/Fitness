import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { TimerPage } from '../timer/timer';
import firebase from 'firebase';
import 'firebase/firestore';

var getdevice = [];
var getstatus = [];
var showName = [];
var name, name1, name2;
@IonicPage()
@Component({
  selector: 'page-scan',
  templateUrl: 'scan.html',
})
export class ScanPage {
  aerobicCourse = '-';
  yogaCourse = '-';
  public selectcity = [];
  public deviceStatus = [];
  public showName = [];
  scannedCode = null;
  getName;
  sid;

  constructor(public loadingCtrl: LoadingController, public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, private barcodeScanner: BarcodeScanner) {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    setTimeout(() => {
      loading.dismiss();
      let dbs = firebase.firestore();
      var i = 0;
      var j = 0;
      dbs.collection("Device").get().then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(i + ': ' + doc.id);
            getdevice[i] = doc.id;
            dbs.collection("Device").doc(getdevice[i]).get().then((doc) => {
              if (doc.exists) {
                console.log("Document status:", doc.data().status);
                showName[j] = doc.data().name;
                getstatus[j] = doc.data().status;
                console.log(j + ':' + getstatus[j]);
                j++;
              } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
              }
            })
            i++;
          })
        })
        .catch(function (error) {
          console.log("Error getting document:", error);
        });
      this.deviceStatus = getstatus
      this.selectcity = getdevice
      this.showName = showName
    }, 1500);


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

    console.log('ionViewDidLoad ScanPage');
  }
  scanCode() {
    var getName;
    var notfound = 0
    this.selectcity = getdevice
    this.barcodeScanner.scan().then(barcodeData => {
      this.scannedCode = barcodeData.text;
      for (let i = 0; i < this.selectcity.length; i++) {
        if (this.scannedCode == this.selectcity[i]) {
          var dbs = firebase.firestore();
          dbs.collection("Device").doc(this.selectcity[i]).get().then((doc) => {
            dbs.collection('Device').doc(this.selectcity[i]).update({
              status: 'ไม่ว่าง'
            })
            console.log("Document name:", doc.data().name);
            this.refresh();
            getName = doc.data().name;
            if (doc.data().name == 'ลู่วิ่ง') {
              name = 'type'
              name1 = ''
              name2 = ''
            } else if (doc.data().name == 'จักรยานฟิตเนส') {
              name2 = 'type'
              name = ''
              name1 = ''
            }
            else {
              name = ''
              name2 = ''
            }
            console.log("Name: " + getName);
            this.navCtrl.push(TimerPage, {
              'device': this.selectcity[i],
              'name': name,
              'name1': name1,
              'name2': name2
            });
          })
            .catch(function (error) {
              console.log("Error getting document:", error);
            });
          notfound = 0;
          break;
        } else if (this.aerobicCourse == this.scannedCode || this.scannedCode == this.yogaCourse) {
          name = ''
          name1 = 'type'
          this.navCtrl.push(TimerPage, {
            'device': this.scannedCode,
            'name': name,
            'name1': name1
          });
          notfound = 0;
          break;
        } else {
          notfound = 1;
        }
      }
      if (notfound == 1) {
        let alert = this.alertCtrl.create({
          title: 'ไม่พบเครื่องเล่น!',
          subTitle: "ไม่พบอุปกรณ์เครื่องเล่น ที่คุณกำลังขอใช้",
          buttons: ['ตกลง']
        });
        alert.present();
      } else {
        let alert = this.alertCtrl.create({
          title: 'สำเร็จ!',
          subTitle: "ขอให้ท่านเพลิดเพลิน ไปกับการออกกำลังกาย",
          buttons: ['ตกลง']
        });
        alert.present();
      }
    }).catch(err => {
      console.log('Error', err);
    });

  }

  doRefresh(refresher) {
    this.scannedCode = '';
    let dbs = firebase.firestore();
    var i = 0;
    var j = 0;
    dbs.collection("Device").get()
      .then(function (querySnapshot) {

        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          console.log(i + ': ' + doc.id);
          getdevice[i] = doc.id;

          //----------------------
          dbs.collection("Device").doc(getdevice[i]).get().then((doc) => {
            if (doc.exists) {
              console.log("Document name:", doc.data().status);

              getstatus[j] = doc.data().status;
              showName[j] = doc.data().name;
              console.log(j + ':' + getstatus[j]);
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
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
    this.deviceStatus = getstatus
    this.selectcity = getdevice
    this.showName = showName
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  refresh() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss();
      let dbs = firebase.firestore();
      var i = 0;
      var j = 0;
      dbs.collection("Device").get()
        .then(function (querySnapshot) {

          querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(i + ': ' + doc.id);
            getdevice[i] = doc.id;

            //----------------------
            dbs.collection("Device").doc(getdevice[i]).get().then((doc) => {
              if (doc.exists) {
                console.log("Document status:", doc.data().status);
                showName[j] = doc.data().name;
                getstatus[j] = doc.data().status;
                console.log(j + ':' + getstatus[j]);
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
        .catch(function (error) {
          console.log("Error getting document:", error);
        });
      this.deviceStatus = getstatus
      this.selectcity = getdevice
      this.showName = showName
    }, 2000);


  }



}
