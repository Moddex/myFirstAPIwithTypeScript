import * as restify from 'restify';
import { environment } from '../common/env';
import { Router } from '../common/router'
import * as mongoose from 'mongoose';

export class Server {
    application: restify.Server;

    initializeDB(): mongoose.MongooseThenable {
        (<any>mongoose).Promise = global.Promise;
        return mongoose.connect(environment.db.uri, { useMongoClient: true });
    }

    initRoutes(routers: Router[]): Promise<any>{
        return new Promise((resolve , reject) => {
            try {

                this.application = restify.createServer({
                    name: 'myFirstAPIwithTypeScript',
                    version: '1.0.0'
                });

                this.application.use(restify.plugins.acceptParser(this.application.acceptable));
                this.application.use(restify.plugins.queryParser());
                this.application.use(restify.plugins.bodyParser());

                // Routes
                for(let router of routers){
                    router.applyRoutes(this.application);
                }

                this.application.listen(environment.server.port, () => {
                    resolve(this.application);
                });

            } catch(err) {
                reject(err);
            }
        });
    }

    bootstrap(routers: Router[] = []): Promise<Server>{
        return this.initializeDB().then(() => 
               this.initRoutes(routers).then(() => this));
    }
}