import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController ,LoadingController} from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { MenuPage } from '../menu/menu';
import 'firebase/firestore';
import firebase from 'firebase';


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  newPassword;
  sid;
  disable = false;
  enable = true;
  @ViewChild('email') email;
  @ViewChild('password') password;

  constructor(public loadingCtrl: LoadingController,private fire: AngularFireAuth, public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams) {
    
  }

  ionViewDidLoad() {
    
    console.log('ionViewDidLoad LoginPage');
  }

  showPrompt() {
    const prompt = this.alertCtrl.create({
      title: 'รีเซ็ตรหัสผ่าน',
      message: "กรุณากรอกอีเมลล์ของท่าน",
      inputs: [
        {
          name: 'Email',
          placeholder: 'example@email.com'
        },
      ],
      buttons: [
        {
          text: 'ยกเลิก',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'ส่ง',
          handler: data => {
            console.log(data.Email);
            this.resetPassword(data.Email);
          }
        }
      ]
    });
    prompt.present();
  }

  resetPassword(email: string): any {
    this.fire.auth.sendPasswordResetEmail(email).
    then(data =>{
      let alert = this.alertCtrl.create({
        title: 'สำเร็จ!',
        subTitle:"กรุณาไปที่อีเมลล์ของท่านเพื่อสร้างรหัสผ่านใหม่",
        buttons: ['ตกลง']
      });
      alert.present();
    })
    .catch(error =>{
      let alert = this.alertCtrl.create({
        title: 'อีเมลไม่ถูกต้อง',
        subTitle: "ที่อยู่อีเมลนี้ไม่ถูกต้อง หรือ ยังไม่ได้ลงทะเบียน",
        buttons: ['ตกลง']
      });
      alert.present();
        console.log('error occur', 'e-mail not found!');
    });
    this.showPrompt();
  }

  logIn() {
    this.disable = true;
    this.enable = false;
    this.fire.auth.signInWithEmailAndPassword(this.email.value, this.password.value)
    .then(data =>{
      let loading = this.loadingCtrl.create({
        content: 'Loading Please Wait...'
      });
      loading.present();
      setTimeout(() => {
        loading.dismiss();
        var uid = firebase.auth().currentUser.uid;
        firebase.firestore().collection("Register").doc(uid).get().then((doc) => {
          if (doc.exists) {
            console.log("Document id:", doc.data().sid);
            this.sid = doc.data().sid;
            var name;
            const dataRef: firebase.database.Reference = firebase.database().ref('/users/'+this.sid+'/'+uid+'/profile/');
            dataRef.once('value', dataSnapshot => {
              name = dataSnapshot.val().name;
              let alert = this.alertCtrl.create({
                title: 'ยินดีต้อนรับ!',
                subTitle: "สวัสดีคุณ "+ name,
                buttons: ['ตกลง']
              });
              alert.present();
            })
            this.navCtrl.setRoot(MenuPage);
            this.disable = false;
            this.enable = true;
          } else {
            this.disable = false;
            this.enable = true;
              // doc.data() will be undefined in this case
              console.log("No such document!");
          }
        })
        console.log('logged in', this.fire.auth.currentUser.uid);
      }, 4500);
      
        
    })
    .catch(error =>{
      
      let alert = this.alertCtrl.create({
        title: 'ไม่สำเร็จ',
        subTitle: "อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง",
        buttons: ['ตกลง']
      });
      alert.present();
        console.log('error occur', 'e-mail or password not found!');
        this.disable = false;
        this.enable = true;
    });
    
      
  }

  

}
