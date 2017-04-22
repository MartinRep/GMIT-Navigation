import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';


declare var google;

@Component({
  selector: 'map',
  templateUrl: 'map.html'
})
export class MapPage {

 @ViewChild('map') mapElement: ElementRef;
 map: any;
 infoWindow: any;
 lat : any = 53.278565;
 lng : any = -9.010583;
 

 constructor(public navCtrl: NavController,  public geolocation: Geolocation) {
    this.getGeoLocation();
    this.addMarker();
  }

 initializeMap() {
    var minZoomLevel = 17;
    
      let mapOptions = 
      {
        zoom: minZoomLevel,
        center: new google.maps.LatLng(53.278565, -9.010583),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions); 
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

  addMarker(){
 
  let marker = new google.maps.Marker({
    map: this.map,
    animation: google.maps.Animation.DROP,
    center: new google.maps.LatLng(this.lat, this.lng),
  });
  let content = "<h4>You're here. Maybe.</h4>";          
 
  this.addInfoWindow(marker, content);
 
}

addInfoWindow(marker, content){
 
  let infoWindow = new google.maps.InfoWindow({
    content: content
  });
     infoWindow.open(this.map, marker);
}

}
