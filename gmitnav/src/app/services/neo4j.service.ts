import {Injectable} from '@angular/core';
import  * as neo4j from "neo4j-typescript";

var config: neo4j.INeo4jConfig = {
  authentication: {
    username: "app",
    password: "gmit"
  },
  protocol: neo4j.NEO4J_PROTOCOL.http,
  host: "localhost",
  port: 7474
};

@Injectable()
export class Neo4jService{

    constructor(){
        
    }
    cypher(cypherCode : string) : Promise<any | any>
        {
            let promise = new Promise((resolve, reject) => {                 
            //Connects to Neo4j DB and get current list of all rooms in DB
            neo4j.connect(config).then((response) =>
            {
                let cypherReq: neo4j.INeo4jCypherRequest;
                //Defining cypher statement to retreive rooms list
                cypherReq = { statements:[{
                    statement: cypherCode
                    }]}
                neo4j.cypher(cypherReq).then((resp) => 
                    {
                        resolve(resp);
                    }
                );
            }).catch((reason) =>{
                reject(reason);
            });

        });
        return promise;
        }

}