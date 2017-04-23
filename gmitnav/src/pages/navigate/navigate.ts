import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import  * as neo4j from "neo4j-typescript";

@Component({
  selector: 'navigate',
  templateUrl: 'navigate.html'
})
export class NavigatePage {

  constructor(public navCtrl: NavController) {
    
  }

addMarker(){
  var config: neo4j.INeo4jConfig = {
  authentication: {
    username: "neo4j",
    password: "maximus14"
  },
  protocol: neo4j.NEO4J_PROTOCOL.http,
  host: "localhost",
  port: 7474
};


neo4j.connect(config)
  .then((response) => {
    console.log("Successfully connected.");
  }
)
  .catch((reason) => {
    console.log("error");
    console.error(reason);
  });

}
}
