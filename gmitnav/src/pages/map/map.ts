import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { AboutPage } from '../about/about';
import { Storage } from '@ionic/storage';

declare var google;

@Component({
  selector: 'map',
  templateUrl: 'map.html'
})
export class MapPage {

 @ViewChild('map') mapElement: ElementRef;    //Binding html div element with variable map
 @ViewChild('input') inputElement;
 map: any;
 oldBuildingOverLay: any;
 newBuildingOverLay: any;
 infoWindow: any;
 lat: number;
 lng : number;
 loader: any;
 marker: any;
 roomNumber: any;
  
 constructor(public navCtrl: NavController,  public geolocation: Geolocation, public alertCtrl: AlertController, public loadingCtrl: LoadingController, private storage: Storage) {
    this.loader = this.loadingCtrl.create({
      content: "Loading...",
    });
    this.loader.present();
  }

//function is called when all the elements in html are initialized to prevent undefined div errors.
 ngAfterViewInit(){     
   this.getGeoLocation();
 }

 //Getting device current possition
 getGeoLocation(){
   this.geolocation.getCurrentPosition().then((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.initializeMap();    
    }, (err) => {
      // On error pop up message is displayed and app returns to About page
      this.showAlert('Connection Error','There seems to be problem with internet connection. You need to be connected to use map feature');
      this.loader.dismiss();
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
    this.marker = new google.maps.Marker({
      animation: google.maps.Animation.DROP,
    });

    this.map.addListener('maptypeid_changed', () => {
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
      this.lat = e.latLng.lat();
      this.lng = e.latLng.lng();
      this.createMapMarker(this.lat,this.lng);
      this.inputElement.setFocus();
    });
    this.newBuildingOverLay.addListener('click', (e) => {
      this.lat = e.latLng.lat();
      this.lng = e.latLng.lng();
      this.createMapMarker(this.lat,this.lng);
      this.inputElement.setFocus();
    });
    // calling function to mark users current location on map
    this.loader.dismiss();

  }
 
 private createMapMarker(lat: number, lng:number) {
    this.marker.setMap(null);
    this.marker = new google.maps.Marker({
      //animation: google.maps.Animation.BOUNCE,
      position: new google.maps.LatLng(lat,lng)
    });
    this.marker.setMap(this.map);
    
}

private onSubmit()
{
  console.log(this.roomNumber+" "+this.lat+" "+this.lng);
 
      this.storage.set(this.roomNumber, " "+this.lat+" "+this.lng).then(
        ()=>{
          this.storage.get(this.roomNumber).then((val)=> {
            console.log("Room: "+this.roomNumber+" latLng: "+val);
            this.roomNumber = null;
          })
          this.storage.get('test').then((value) => console.log(value));
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
