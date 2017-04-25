import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import  * as neo4j from "neo4j-typescript";
import { AlertController, LoadingController  } from 'ionic-angular';

// setting up NEO4j connection settings through specified interface
var config: neo4j.INeo4jConfig = {
  authentication: {
    username: "neo4j",
    password: "maximus14"
  },
  protocol: neo4j.NEO4J_PROTOCOL.http,
  host: "localhost",
  port: 7474
};

@Component({
  selector: 'navigate',
  templateUrl: 'navigate.html'
})

export class NavigatePage {

locRooms: string[] = [];
locRoom : string = '';
destRooms: string[] = [];
destRoom: string = '';
downRooms: string[] = [];
navigation: boolean = true;
route: string[] = [];
navigationRoute: string[] = [];

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    this.getRooms();
  }

getRooms()
{
  //Connects to Neo4j DB and get current list of all rooms in DB
  neo4j.connect(config).then((response) =>
  {
    var cyphTest: neo4j.INeo4jCypherRequest;
      //Defining cypher statement to retreive rooms list
      cyphTest = { statements:[{
          statement: "MATCH (r:Room) RETURN r.name"
        }]}
      neo4j.cypher(cyphTest).then((resp) => 
        {
          //Processing DB results
          resp.results.forEach(function(element) {
            element.data.forEach(function(room) {
              //Adding rooms numbers to input searchbar lists
              this.locRooms.push(room.row[0]);
              this.destRooms.push(room.row[0]);
            }, this);
          }, this);
        }
      );
  }).catch((reason) =>{
    this.showAlert("Connection Error","Trouble with internet connection.");
    this.navCtrl.pop();
    console.error(reason);
  });

}

getLocation(loc: any) {
     /* 
    Reset items back to all of the items!!
      */
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
    /* 
    Reset items back to all of the items!!
      */
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
      this.showAlert('Houston we have a problem.','There seems to be Room number MishMash.');
      this.navCtrl.push(NavigatePage);
  }else {
    this.getRoute();
  }
}

getRoute()
{
  var cyphTest: neo4j.INeo4jCypherRequest;
  this.presentLoading();
  this.navigation = false;
  //Connects to Neo4j REST API with predefinned config settings
  neo4j.connect(config)
  .then((response) => 
    {
      console.log("Successfully connected.");
      cyphTest = { statements:[{
          statement: "MATCH p=shortestPath((r1:Room {name:\""+this.locRoom+"\"})-[*0..10]->(r2:Room {name:\""+this.destRoom+"\"})) RETURN p"
        }]}
        //Calles to the Neo4j DB with predefined cypher statement and process the responded result nested object arrays
      neo4j.cypher(cyphTest).then((resp) => 
        {
          resp.results.forEach(function(nResults) {
            nResults.data.forEach(function(nData) {
            nData.row.forEach(function(nRow) {
                nRow.forEach(function(resObjects) {
                  if(resObjects.name != null)   // if the data is a Nodes with add the name to the route array.
                  {
                    this.route.push(resObjects.name);
                  }else{                        // or else if the data is relationship (connection)
                    this.route.push(resObjects.connection[0]);
                  }
                }, this);
              }, this);
            }, this);
          }, this);
          this.showRoute();   // Now calls funtion to process DB data to a readable format
        }
      );
    })
    .catch((reason) => { 
      this.showAlert("Connection Error","Trouble with internet connection.");
      this.navCtrl.pop();     //Returns to previous tab from the tab stack
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
//Funcrion to display loading animation in case data beeing fetched from server are delayed. 
presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Calculation route...",
      duration: 2000
    });
    loader.present();
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
