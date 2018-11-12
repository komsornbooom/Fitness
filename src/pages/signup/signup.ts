import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams ,AlertController,LoadingController} from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase';
import 'firebase/firestore';
import {AnimePage} from '../anime/anime';

/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  
  @ViewChild('email') email;
  @ViewChild('password') password;
  @ViewChild('conpassword') conpassword;
  name: string = '';
  gender:string='';
  tel: string = '';
  weight: string = '';
  height: string = '';
  age:string='';
  uid:string='';
  sid:string = '';
  disable = false;
  enable = true;

  constructor(public loadingCtrl: LoadingController,public db: AngularFireDatabase, private fire: AngularFireAuth, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
    
  }
  public event = {
    month: '1990-02-19',
    timeStarts: '07:43',
    timeEnds: '1990-02-20'
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  signUp() {
    this.disable = true;
    this.enable = false;
    var Ex = this.sid.split('')[0];
    let dbs = firebase.firestore();
    if(Ex == 'B' && this.sid.length == 8 || Ex == 'M'&& this.sid.length == 8 || Ex == 'D' && this.sid.length == 8){
      const dataRef: firebase.database.Reference = firebase.database().ref('/users/'+this.sid);
      dataRef.once('value', dataSnapshot => {
        if(dataSnapshot.val() != null) {
          let alert = this.alertCtrl.create({
            title: 'รหัสนักศึกษาผิดพลาด',
            subTitle: "รหัสนักศึกษานี้ได้ทำการลงทะเบียนไปแล้ว",
            buttons: ['ตกลง']
          });
          alert.present();
          console.log(dataSnapshot.val());
          this.disable = false;
              this.enable = true;
        } else {
          if (this.password.value == this.conpassword.value){
            this.fire.auth.createUserWithEmailAndPassword(this.email.value, this.password.value)  
            .then(data =>{
              let loading = this.loadingCtrl.create({
                content: 'Please wait...'
              });
              loading.present();
              setTimeout(() => {
                loading.dismiss();
                var user = firebase.auth().currentUser;
              this.uid = user.uid; 
              firebase.database().ref('users/' +this.sid+'/'+ this.uid +'/profile').set({
                sid:this.sid,
                email: this.email.value,
                password: this.password.value,
                name:this.name,
                birthday:this.event.month,
                gender:this.gender,
                tel:this.tel,
                weight:this.weight,
                height:this.height,
                age:this.age
              })
              dbs.collection('Register').doc(this.uid).set({
                sid:this.sid,
                email: this.email.value,
                password: this.password.value,
                name:this.name,
                birthday:this.event.month,
                gender:this.gender,
                tel:this.tel,
                weight:this.weight,
                height:this.height,
                age:this.age
              })
          
              console.log('register user with', this.email.value, this.password.value);
              console.log('Got UID',this.uid);
              this.navCtrl.setRoot(AnimePage);
              this.disable = false;
              this.enable = true;
                
              }, 4000);
              
            })
            .catch(error =>{
              let alert = this.alertCtrl.create({
                title: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
                subTitle: "อีเมลหรือรหัสผ่านไม่ถูกต้อง,ลองใหม่อีกครั้ง",
                buttons: ['ตกลง']
              });
              alert.present();
                console.log('error occur', 'or e-mail not found!');
                this.disable = false;
                this.enable = true;
            });
          
          
          }else{
            let alert = this.alertCtrl.create({
              title: 'รหัสผ่านไม่ถูกต้อง',
              subTitle: "รหัสผ่านไม่ตรงกัน",
              buttons: ['ตกลง']
            });
            alert.present();
            this.disable = false;
              this.enable = true;
          }
        }
      })
    }else{
      let alert = this.alertCtrl.create({
        title: 'รหัสนักศึกษาไม่ถูกต้อง',
        subTitle: "รหัสนักศึกษาต้องขึ้นต้นด้วย 'B','M' หรือ 'D' ตามด้วยตัวเลข 7 หลัก",
        buttons: ['ตกลง']
      });
      alert.present();
      this.disable = false;
      this.enable = true;
    }
    
  }

}
