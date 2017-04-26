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
        disableDefaultUI: true,
        center: new google.maps.LatLng(53.278565, -9.010583),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      }
    //Initializing the map
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions); 
    // callin finction to mark users current location on map
    this.createMapMarker();
    //this.imageOverlay();
  }
 
 private createMapMarker() {
    var marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(this.lat,this.lng)
    });

}

/*      Google maps image overlay to insert imagige of building layout 
        over the maps default GMIT building.
           **IN PROGRESS**

private imageOverlay()
{
 
  this.bounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(53.277622, -9.012568),
    new google.maps.LatLng(53.279335, -9.009188));
  this.srcImage = '';
  this.overlay = new google.maps.OverlayView(this.bounds,this.srcImage,this.map);
  this.overlay.setMap(this.map);
  this.div = document.createElement('div');
  this.div.style.borderStyle = 'none';
  this.div.style.borderWidth = '0px';
  this.div.style.position = 'absolute';

  var img:any = document.createElement('img');
  img.src = this.srcImage;
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.position = 'absolute';
  this.div.appendChild(img);

  var panes = this.overlay.getPanes();
  panes.overlayLayer.appendChild(this.div); 
}

private draw()
{
  var overlayProjection = this.overlay.getProjection();
  var sw = overlayProjection.fromLatLngToDivPixel(this.bounds.getSouthWest());
  var ne = overlayProjection.fromLatLngToDivPixel(this.bounds.getNorthEast());

  this.div.style.left = sw.x + 'px';
  this.div.style.top = ne.y + 'px';
  this.div.style.width = (ne.x - sw.x) + 'px';
  this.div.style.height = (sw.y - ne.y) + 'px';
}
*/

showAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

}
