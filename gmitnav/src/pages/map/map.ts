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
 overlay: any;
 div:any;
 bounds: any;
 srcImage: any;
 
 

 constructor(public navCtrl: NavController,  public geolocation: Geolocation, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
   
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
    //this.imageOverlay();
  }
 
 private createMapMarker() {
    var marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(this.lat,this.lng)
    });

}

/*      Google maps image overlay **IN PROGRESS**
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

showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Connection Error',
      subTitle: 'There seems to be problem with internet connection. You need to be connected to use map feature',
      buttons: ['OK']

    });
    alert.present();
  }

}
