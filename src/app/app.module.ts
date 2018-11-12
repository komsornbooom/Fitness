import { MbscModule } from '@mobiscroll/angular';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import firebase from 'firebase';
import { LottieAnimationViewModule } from 'lottie-angular2';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { MenuPage } from '../pages/menu/menu';
import { ListPage } from '../pages/list/list';
import {ScanPage } from '../pages/scan/scan';
import {SchedulePage} from '../pages/schedule/schedule';
import {ProfilePage} from '../pages/profile/profile';
import {CoursePage} from '../pages/course/course';
import {TimerPage} from '../pages/timer/timer';
import {CalculatePage} from '../pages/calculate/calculate';
import {YogaPage} from '../pages/yoga/yoga';
import {AerobicPage} from '../pages/aerobic/aerobic';
import {AnimePage} from '../pages/anime/anime';


import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';




const firebaseAuth = {
  apiKey: "AIzaSyATg0IsO0Xhyx1C7z64v-I-BOnJe-F2q-w",
  authDomain: "fitness-6656c.firebaseapp.com",
  databaseURL: "https://fitness-6656c.firebaseio.com",
  projectId: "fitness-6656c",
  storageBucket: "fitness-6656c.appspot.com",
  messagingSenderId: "41286515607"
};
firebase.initializeApp (firebaseAuth);
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    MenuPage,
    ListPage,
    SchedulePage,
    ScanPage,
    ProfilePage,
    CoursePage,
    TimerPage,
    CalculatePage,
    YogaPage,
    AerobicPage,
    AnimePage
  ],
  imports: [ 
    MbscModule, 
    FormsModule, 
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseAuth),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    NgxQRCodeModule,
    LottieAnimationViewModule.forRoot()
   
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    MenuPage,
    ListPage,
    SchedulePage,
    ScanPage,
    ProfilePage,
    CoursePage,
    TimerPage,
    CalculatePage,
    YogaPage,
    AerobicPage,
    AnimePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
