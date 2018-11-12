import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,LoadingController } from 'ionic-angular';
import firebase from 'firebase';
import 'firebase/firestore';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var items =[];





@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  public buttonClicked: boolean = false;
  public edit:boolean = true;
  public checkCal:boolean = false;
  email:string='';
  tel:string='';
  name:string='';
  gender:string='';
  weight:string='';
  height:string='';
  age:string = '';
  Ctel:string='';
  Cname:string='';
  Cgender:string='';
  Cweight:string='';
  Cheight:string='';
  Cage:string = '';
  Cbirthday:string = '';
  createdCode = null;
  uid;
  bmi;
  heightm;
  heightsq;
  calorieBurn = null;
  trainingTime = null;
  selectDate = '2018-01-01';
  editAlready='';
  editNotready='Any Text';
  birthday:string = '';
  sid;
  gsid:string = '';

  constructor(public loadingCtrl: LoadingController,public navCtrl: NavController, public navParams: NavParams, public alertCtrl:AlertController) {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
  
    loading.present();
  
    setTimeout(() => {
      loading.dismiss();
    }, 1500);
  
  }

  ionViewDidLoad() {
    var user = firebase.auth().currentUser;
    this.uid = user.uid; 
    var uid = firebase.auth().currentUser.uid;
    firebase.firestore().collection("Register").doc(uid).get().then((doc) => {
      if (doc.exists) {
        console.log("Document id:", doc.data().sid);
        this.sid = doc.data().sid;
        const dataRef: firebase.database.Reference = firebase.database().ref('/users/'+doc.data().sid+'/'+uid+'/profile/');
        dataRef.once('value', dataSnapshot => {
          items = dataSnapshot.val();
          console.log(items);
          this.name = dataSnapshot.val().name;
          this.gender = dataSnapshot.val().gender;
          this.weight = dataSnapshot.val().weight;
          this.height = dataSnapshot.val().height;
          this.age = dataSnapshot.val().age;
          this.email = dataSnapshot.val().email;
          this.tel = dataSnapshot.val().tel;
          this.gsid = dataSnapshot.val().sid;
          this.birthday = dataSnapshot.val().birthday;
          this.heightm = dataSnapshot.val().height/100;
          this.heightsq = this.heightm * this.heightm;
          this.bmi =(dataSnapshot.val().weight / this.heightsq).toFixed(2);
        })
      } else {
        console.log("No such document!");
      }
    })
    
    
    console.log('ionViewDidLoad ProfilePage');
  }
  myQRCode(){
    this.buttonClicked = !this.buttonClicked;
    var user = firebase.auth().currentUser;
    this.uid = user.uid; 
    this.createdCode = this.uid;
  }

  editText(){
    const confirm = this.alertCtrl.create({
      title: 'แก้ไขข้อมูล',
      message: "กด'ตกลง'เพื่อแก้ไขข้อมูล",
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
            this.Cname =this.name;
            this.Cgender =this.gender;
            this.Cweight =this.weight;
            this.Cheight =this.height;
            this.Cage =this.age;
            this.Ctel =this.tel;
            this.Cbirthday = this.birthday;

            this.edit = !this.edit;
            if(this.edit == true){
              this.editAlready='';
              this.editNotready='Any Text';
            }
            else{
              this.editAlready='Any Text';
              this.editNotready='';

            }
          }
        }
      ]
    });
    confirm.present();

  }

  saveEditText(){
    if(this.Cbirthday != this.birthday || this.Cgender != this.gender || this.Cname != this.name || this.Cweight != this.weight || this.Cheight != this.height || this.Cage !=this.age || this.Ctel !=this.tel ){
      const confirm = this.alertCtrl.create({
        title: 'ยืนยันการเปลี่ยนแปลง?',
        message: "คุณต้องการเปลี่ยนแปลงข้อมูลดังกล่าวใช่หรือไม่ ?",
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
              var user = firebase.auth().currentUser;
              this.uid = user.uid; 
              let dbs = firebase.firestore();
              firebase.database().ref('/users/'+this.sid+'/'+this.uid +'/profile').update({
                
                name:this.name,
                gender:this.gender,
                tel:this.tel,
                weight:this.weight,
                height:this.height,
                age:this.age,
                birthday:this.birthday
              })
              dbs.collection('Register').doc(this.uid).update({

                name:this.name,
                gender:this.gender,
                tel:this.tel,
                weight:this.weight,
                height:this.height,
                age:this.age,
                birthday:this.birthday
              })

              this.edit = !this.edit;
              if(this.edit == true){
                this.doRefreshdata();
                this.editAlready='';
                this.editNotready='Any Text';
              }
              else{
                this.editAlready='Any Text';
                this.editNotready='';
        
              }
              
            }
          }
        ]
      });
      confirm.present();
      
      
    }else{

      this.edit = !this.edit;
      if(this.edit == true){
        this.editAlready='';
        this.editNotready='Any Text';
      }
      else{
        this.editAlready='Any Text';
        this.editNotready='';

      }

    }
    
  }
  checkDate(){

      if(this.selectDate!='') {
        firebase.database().ref('/users/'+this.sid+'/'+this.uid +'/calorieBurn/'+this.selectDate).once('value', dataSnapshot => {
          try {
            console.log(dataSnapshot.val().calorieBurn);
            this.calorieBurn = dataSnapshot.val().calorieBurn;
            this.trainingTime = dataSnapshot.val().trainingTime + 's.';
            let alert = this.alertCtrl.create({
              title: 'พบข้อมูล!',
              subTitle: "พบข้อมูลการออกกำลังกาย",
              buttons: ['ตกลง']
            });
            alert.present();
            this.checkCal = true;
          } catch (error) {
            this.checkCal = false;
            let alert = this.alertCtrl.create({
              title: 'ไม่พบข้อมูล!',
              subTitle: "ไม่พบข้อมูลการออกกำลังกาย",
              buttons: ['ตกลง']
            });
            alert.present();
              console.log('error occur', 'or Date not found!');
          }
          
        })
        
      }else{
        let alert = this.alertCtrl.create({
          title: 'ไม่พบข้อมูล!',
          subTitle: "ไม่พบข้อมูลการออกกำลังกาย",
          buttons: ['ตกลง']
        });
        alert.present();
          console.log('Date not found!');
      
      }
  
    
  }
  doRefreshdata() {
    var user = firebase.auth().currentUser;
    this.uid = user.uid; 
    
    const dataRef: firebase.database.Reference = firebase.database().ref('/users/'+this.sid+'/'+this.uid+'/profile/');
      dataRef.once('value', dataSnapshot => {
        items = dataSnapshot.val();
        console.log(items);
        this.name = dataSnapshot.val().name;
        this.gender = dataSnapshot.val().gender;
        this.weight = dataSnapshot.val().weight;
        this.height = dataSnapshot.val().height;
        this.age = dataSnapshot.val().age;
        this.email = dataSnapshot.val().email;
        this.tel = dataSnapshot.val().tel;
        this.birthday = dataSnapshot.val().birthday;
        this.heightm = dataSnapshot.val().height/100;
        this.heightsq = this.heightm * this.heightm;
        this.bmi =(dataSnapshot.val().weight / this.heightsq).toFixed(2);
      })
    console.log('doRefreshdata');
   
  }

}
