import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { AlertController, LoadingController  } from 'ionic-angular';



declare var google;

@Component({
  selector: 'map',
  templateUrl: 'map.html'
})
export class MapPage {

 @ViewChild('map') mapElement: ElementRef;
 map: any;
 infoWindow: any;
 lat: number;
 lng : number;
 

 constructor(public navCtrl: NavController,  public geolocation: Geolocation, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
   
    //this.addMarker();
  }

 ngAfterViewInit(){
   this.presentLoading();
   this.getGeoLocation();
 }
 
 presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 1500
    });
    loader.present();
  }
 
 
 getGeoLocation(){
   this.geolocation.getCurrentPosition().then((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.initializeMap();    
    }, (err) => {
      this.showAlert();
      this.navCtrl.pop();
    });
    
  }
 
 initializeMap() {
    var minZoomLevel = 17;
    
      let mapOptions = 
      {
        zoom: minZoomLevel,
        disableDefaultUI: true,
        center: new google.maps.LatLng(53.278565, -9.010583),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      }
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions); 
    this.createMapMarker();
  }
 
 private createMapMarker() {
    var marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(this.lat,this.lng)
    });

}

showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Connection Error',
      subTitle: 'There seems to be problem with internet connection. You need to be connected to use map feature',
      buttons: ['OK']

    });
    alert.present();
  }

}
