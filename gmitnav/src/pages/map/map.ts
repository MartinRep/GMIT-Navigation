import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';


declare var google;

@Component({
  selector: 'map',
  templateUrl: 'map.html'
})
export class MapPage {

 map: any;
 lat : any = 53.278565;
 lng : any = -9.010583;
 

 constructor(public navCtrl: NavController, public platform: Platform, private geolocation: Geolocation) {
    this.getGeoLocation();
    this.platform = platform;  
  }

 initializeMap() {
        this.platform.ready().then(() => {
          
          var minZoomLevel = 17;
          this.map = new google.maps.Map(document.getElementById('map'), {
              zoom: minZoomLevel,
              center: new google.maps.LatLng(this.lat, this.lng),
              mapTypeId: google.maps.MapTypeId.ROADMAP
          });
      });
  }

  getGeoLocation(){
   this.geolocation.getCurrentPosition().then((position) => {
       this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      this.initializeMap();
    }, (err) => {
      console.log(err);
    });
 
  }

}
