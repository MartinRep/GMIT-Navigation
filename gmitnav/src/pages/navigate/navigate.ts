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
    var ct = {
      statement: "match (n) return n"
           
    }
   var cyphTest: neo4j.INeo4jCypherRequest;
   var resp : any;
   cyphTest = { statements: [{
     statement: "MATCH p=shortestPath((r1:Room {name:'208'})-[*]->(r2:Room {name:'200'})) RETURN p"
   }]}
   neo4j.cypher(cyphTest).then((resp) => {
     console.log(resp);
     console.log(resp.results.pop());

   });
  }
)
  .catch((reason) => {
    console.log("error");
    console.error(reason);
  });

}

}
