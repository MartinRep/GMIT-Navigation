import { Neo4jService } from './../../app/services/neo4j.service';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController, LoadingController  } from 'ionic-angular';
import { AboutPage } from '../about/about';

@Component({
  selector: 'navigate',
  templateUrl: 'navigate.html'
})

export class NavigatePage {

rooms : string[] = [];
locRooms: string[] = [];
locRoom : string = '';
destRooms: string[] = [];
destRoom: string = '';
downRooms: string[] = [];
navigation: boolean = true;
route: string[] = [];
navigationRoute: string[] = [];
loader: any;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, private neo4jDB: Neo4jService) {
  }

ngAfterViewInit(){
  this.loader = this.loadingCtrl.create({
    content: "Loading...",
  });
  this.loader.present().then(() => {this.getRooms();});
 }

getRooms()
{
  //Connects to Neo4j DB and get current list of all rooms in DB
  this.neo4jDB.cypher("MATCH (r:Room) RETURN r.name").then((resp) =>{
    //Processing DB results
    let roomsTest = resp.results[0].data;
    roomsTest.forEach((room) => this.rooms.push(room.row[0]));
    this.loader.dismiss();    
  }).catch((err) =>{
    this.showAlert("Connection Error","Can't connect to database.");
    this.loader.dismiss();
    this.navCtrl.push(AboutPage);
    console.error(err);
  });
 
}

getLocation(loc: any) {
    // Reset items back to all of the items!!
    this.locRooms = [];
    this.rooms.forEach((roomNumber) => this.locRooms.push(roomNumber));
    // set val to the value of the searchbar
    this.locRoom = loc.target.value;
    // if the value is an empty string don't filter the items
    if (this.locRoom && this.locRoom.trim() != '') {
      this.locRooms = this.locRooms.filter((lRoom) => {
        return (lRoom.toLowerCase().indexOf(this.locRoom.toLowerCase()) > -1);
      })
    }
  }

getDestination(des: any) {
    // Reset items back to all of the items!!
    this.destRooms = [];
    this.rooms.forEach((roomNumber) => this.destRooms.push(roomNumber));
    // set val to the value of the searchbar
    this.destRoom = des.target.value;
    // if the value is an empty string don't filter the items
    if (this.destRoom && this.destRoom.trim() != '') {
      this.destRooms = this.destRooms.filter((dRoom) => {
        return (dRoom.toLowerCase().indexOf(this.destRoom.toLowerCase()) > -1);
      })
    }
   
  }


navigate()
{
  //Check if rooms selected are existent and location and destination room are not the same
  if(this.destRoom == this.locRoom || this.destRooms.indexOf(this.destRoom) == -1 || this.locRooms.indexOf(this.locRoom) == -1 )
  {
      this.showAlert('Oooops....','There seems to be Room number MishMash.');
      this.navCtrl.push(NavigatePage);
  }else {
    this.getRoute();
  }
}

getRoute()
{
  let CalcLoader = this.loadingCtrl.create({
      content: "Calculation route...",
    });
  CalcLoader.present();
  this.navigation = false;
  this.route = [];
  this.neo4jDB.cypher("MATCH p=shortestPath((r1:Room {name:\""+this.locRoom+"\"})-[*0..10]->(r2:Room {name:\""+this.destRoom+"\"})) RETURN p").then((resp) => 
    {
      let foundPath = resp.results[0].data[0].row[0];
      //Resultset from Neo4j comes as object array of nodes and relationships
      foundPath.forEach((resObject) =>{
        if(resObject.name != null)   // if the data is a Nodes with add the name to the route array.
        {
          this.route.push(resObject.name);
        }else{                        // or else if the data is relationship (connection)
          this.route.push(resObject.connection[0]);
        }
      }, this);
       // Close Loading message and calls funtion to process DB data to a readable format
      CalcLoader.dismiss().then(() => this.showRoute());
        
  }).catch((reason) => { 
      this.showAlert("Connection Error","Can't connect to database.");
      this.navCtrl.push(AboutPage);     //Returns to previous tab from the tab stack
      console.error(reason);
    });

  }

showRoute()
{
  let message: string;    
  let direction: string;
  message = "Exit the room "+this.locRoom+" then ";   //First 2 values are used as point and orientation of origin.
  for (var index = 2; index < this.route.length-1; index=index+2) {
    /*
    Making directions directions orientational.
    Translating DB data to correct directions accorting to which directions
    they originated.
    */
    switch (this.route[index-1]) {
      case "left":
        switch (this.route[index+1]) 
        {
          case "down":
            direction = "left";
            break;
          case "left":
            direction = "straight";
            break;
          case "up":
            direction = "right";
            break;
          case "right":
            direction = "back";
            break;
          default:
            break;
        }
        break;
      case "right":
        switch (this.route[index+1]) 
        {
          case "down":
            direction = "right";
            break;
          case "up":
            direction = "left";
            break;
          case "right":
            direction = "straight";
            break;
          case "left":
            direction = "back";
          default:
            break;
        }
        break;
      case "down":
        switch (this.route[index+1]) 
        {
          case "down":
            direction = "straight";
            break;
          case "right":
            direction = "left";
            break;
          case "left":
            direction = "right";
            break;
          case "up":
            direction = "back";
          default:
            break;
        }
        break;
        case "up":
        switch (this.route[index+1]) 
        {
          case "up":
            direction = "straight";
            break;
          case "right":
            direction = "right";
            break;
          case "left":
            direction = "left";
            break;
          case "down":
            direction = "back";
          default:
            break;
        }
        break;
      default:
        break;
    }
    
    if(this.route[index+2] != this.destRoom)    //check if it is a corridor Rooms have min 3 digits, coridors 2
    {
      message = message.concat("go "+direction);    //Appending of direction to message
      this.navigationRoute.push(message);             //Adding message to direction string array.  navigationRoute array is linked to ionlist in html 
      if(index+5 < this.route.length)         //checking if junktion or reached destination, the one check before last is ignored. this allowes to display end message on which side of corridor is destination room located
      {
        if(this.route[index].indexOf("stairs") !== -1)  //If string has 'stairs' display stairs name instead of junction
        {
          message = "Then ";
          this.navigationRoute.push(this.route[index]);
        }else {
            message = "On the next junction ";   
        }
      }
    }else {
      this.navigationRoute.push("The room "+this.destRoom+" will be on your "+direction+".");
    }
  }
}

// Function to display custom pop up message Errors an such
showAlert(title:string, message: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }
}
