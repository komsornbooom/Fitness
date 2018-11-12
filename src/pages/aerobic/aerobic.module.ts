import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AerobicPage } from './aerobic';

@NgModule({
  declarations: [
    AerobicPage,
  ],
  imports: [
    IonicPageModule.forChild(AerobicPage),
  ],
})
export class AerobicPageModule {}
