import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { YogaPage } from './yoga';

@NgModule({
  declarations: [
    YogaPage,
  ],
  imports: [
    IonicPageModule.forChild(YogaPage),
  ],
})
export class YogaPageModule {}
