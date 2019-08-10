import * as restify from 'restify';
import { environment } from '../common/env';

export class Server {
    application: restify.Server;

    initRoutes(): Promise<any>{
        return new Promise((resolve , reject) => {
            try {

                this.application = restify.createServer({
                    name: 'myFirstAPIwithTypeScript',
                    version: '1.0.0'
                });

                this.application.use(restify.plugins.acceptParser(this.application.acceptable));
                this.application.use(restify.plugins.queryParser());
                this.application.use(restify.plugins.bodyParser());

                this.application.get('/', (req, res, next) => {
                    res.json({msg: 'Hello'});
                    return next();
                });

                this.application.listen(environment.server.port, () => {
                    resolve(this.application);
                });

            } catch(err) {
                reject(err);
            }
        });
    }

    bootstrap(): Promise<Server>{
        return this.initRoutes().then(() => this);
    }
}