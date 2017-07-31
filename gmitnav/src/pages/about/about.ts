import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MapPage } from '../map/map';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(public navCtrl: NavController, private storage: Storage) {
    this.storage.get("firstStart").then((value)=> {
      console.log(value);
      if(value != null) {
        this.storage.set("firstStart",false).then(() => navCtrl.push(MapPage));
      }
    });
  }

}
