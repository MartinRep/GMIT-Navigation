import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { AlertController, LoadingController  } from 'ionic-angular';
import { AboutPage } from '../about/about';

declare var google;

@Component({
  selector: 'map',
  templateUrl: 'map.html'
})
export class MapPage {

 @ViewChild('map') mapElement: ElementRef;    //Binding html div element with variable map
 map: any;
 oldBuildingOverLay: any;
 newBuildingOverLay: any;
 infoWindow: any;
 lat: number;
 lng : number;
 overlay: any;
 div:any;
 bounds: any;
 srcImage: any;
  
 constructor(public navCtrl: NavController,  public geolocation: Geolocation, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
  }

//function is called when all the elements in html are initialized to prevent undefined div errors.
 ngAfterViewInit(){
   this.presentLoading();
   this.getGeoLocation();
 }
 
 //displays loading animation when fetching data from net
 presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 1500
    });
    loader.present();
  }
 
 //Getting device current possition
 getGeoLocation(){
   this.geolocation.getCurrentPosition().then((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        console.log(this.lat, this.lng);
        this.initializeMap();    
    }, (err) => {
      // On error pop up message is displayed and app returns to About page
      this.showAlert('Connection Error','There seems to be problem with internet connection. You need to be connected to use map feature');
      this.navCtrl.push(AboutPage);
    });
    
  }
 
 initializeMap() {
    var minZoomLevel = 17;
      //setting up initial location zoomlevel and type of map
      let mapOptions = 
      {
        zoom: minZoomLevel,
        disableDefaultUI: false,
        center: new google.maps.LatLng(53.278565, -9.010583),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      }
    //Initializing the map
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions); 
      var oldBuilding = {
          north: 53.27959,
          west: -9.01287,
          south: 53.278038,
          east: -9.00876
        };
      var newBuilding = {
          north: 53.278235,
          west: -9.01195,
          south: 53.277276,
          east: -9.00911
          
        };
     this.oldBuildingOverLay = new google.maps.GroundOverlay(
            '../assets/Map0.png',
            oldBuilding);
    

    this.newBuildingOverLay = new google.maps.GroundOverlay(
            '../assets/Dmap0.png',
            newBuilding);
    
    this.oldBuildingOverLay.setMap(this.map);   
    this.newBuildingOverLay.setMap(this.map);  
    this.map.addListener('maptypeid_changed', () => {
      console.log(this.map.getMapTypeId());
      if(this.map.getMapTypeId() != 'roadmap')
    {
      this.oldBuildingOverLay.setMap(null);   
      this.newBuildingOverLay.setMap(null);  
    }else {
      this.oldBuildingOverLay.setMap(this.map);   
      this.newBuildingOverLay.setMap(this.map);  
    }
    })
    

    this.oldBuildingOverLay.addListener('click', (e) => {
      console.log('Room location:' + e.latLng.lat() +' ' + e.latLng.lng());
    });
    this.newBuildingOverLay.addListener('click', (e) => {
      console.log('Room location:' + e.latLng.lat() +' ' + e.latLng.lng());
    });

    // calling function to mark users current location on map
    this.createMapMarker();
  }
 
 private createMapMarker() {
    var marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(this.lat,this.lng)
    });

}

showAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

}
