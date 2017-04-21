import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

declare var google;

@Component({
  selector: 'map',
  templateUrl: 'map.html'
})
export class MapPage {

 map: any;

 constructor(public navCtrl: NavController, public platform: Platform) {
    this.platform = platform;
    this.initializeMap();
  }

 initializeMap() {
        this.platform.ready().then(() => {
          
          var minZoomLevel = 17;
          this.map = new google.maps.Map(document.getElementById('map'), {
              zoom: minZoomLevel,
              center: new google.maps.LatLng(53.278578, -9.010636),
              mapTypeId: google.maps.MapTypeId.ROADMAP
          });
      });
  }  

}
