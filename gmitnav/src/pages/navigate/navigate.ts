import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import  * as neo4j from "neo4j-typescript";
import { AlertController, LoadingController  } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    this.getRooms();
  }

getRooms()
{
  
  neo4j.connect(config).then((response) =>
  {
    var cyphTest: neo4j.INeo4jCypherRequest;
      cyphTest = { statements:[{
          statement: "MATCH (r:Room) RETURN r.name"
        }]}
      neo4j.cypher(cyphTest).then((resp) => 
        {
          //console.log(resp);
          resp.results.forEach(function(element) {
            element.data.forEach(function(room) {
              //console.log(room.row[0]);
              this.locRooms.push(room.row[0]);
              this.destRooms.push(room.row[0]);
            //console.log(room.row[0]);
            }, this);
            //console.log(element.data[0].row[0]);
          }, this);
          //console.log(this.rooms);
        }
      );
  }).catch((reason) =>{
    console.error(reason);
  });

}

getLocation(loc: any) {
    // Reset items back to all of the items
    
    // set val to the value of the searchbar
    this.locRoom = loc.target.value;
    console.log(loc.target.value);
    // if the value is an empty string don't filter the items
    if (this.locRoom && this.locRoom.trim() != '') {
      this.locRooms = this.locRooms.filter((lRoom) => {
        return (lRoom.toLowerCase().indexOf(this.locRoom.toLowerCase()) > -1);
      })
    }
  }

getDestination(des: any) {
    // Reset items back to all of the items
   
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
  //Check if rooms selected are existent and not the same rooms
  if(this.destRoom == this.locRoom || this.destRoom != this.destRooms.pop() || this.locRoom != this.locRooms.pop())
  {
      this.showAlert('Houston we have problem.','There seems to be Room number MishMash.');
      this.navCtrl.push(NavigatePage);
  }else {
    this.getRoute();
  }
}

getRoute()
{
  this.presentLoading();
  this.navigation = false;
  neo4j.connect(config)
  .then((response) => 
    {
      console.log("Successfully connected.");
      var cyphTest: neo4j.INeo4jCypherRequest;
      cyphTest = { statements:[{
          statement: "MATCH p=shortestPath((r1:Room {name:\""+this.locRoom+"\"})-[*0..10]->(r2:Room {name:\""+this.destRoom+"\"})) RETURN p"
        }]}
        //console.log(cyphTest);
      neo4j.cypher(cyphTest).then((resp) => 
        {
          resp.results.forEach(function(nResults) {
            //console.log(nResults);
            nResults.data.forEach(function(nData) {
              //console.log(nData);
            nData.row.forEach(function(nRow) {
                //console.log(nRow);
                nRow.forEach(function(resObjects) {
                  /*
                  Process data nodes and connections
                   */
                  console.log(resObjects);
                  if(resObjects.name != null)   // if the data is a Nodes with label 'name' add name of the room or corridor to the route array.
                  {
                    this.route.push(resObjects.name);
                  }else{                        // or else the data is relationship (connection)
                    this.route.push(resObjects.connection[0]);
                  }
                }, this);
              }, this);
            }, this);
          }, this);
          
         console.log(this.route);
        }
      );
    })
    .catch((reason) => {
      this.showAlert("Connection Error","Trouble with internet connection.");
      console.error(reason);
    });

  }


  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Calculation route...",
      duration: 2000
    });
    loader.present();
  }

showAlert(title:string, message: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']

    });
    alert.present();
  }

}

