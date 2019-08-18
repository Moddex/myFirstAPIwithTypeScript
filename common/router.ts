import * as restify from 'restify'
import { EventEmitter } from 'events';

export abstract class Router extends EventEmitter{
    abstract applyRoutes(application: restify.Server)

    // envelope(document: any):any {
    //     return document
    // }

    render(res: restify.Response, next: restify.Next){
        return (document) => {
            if(document) {
                this.emit('beforeRender', document);
                res.json(this.envelope(document));
            } else {
                res.send(404);
            }
            return next();
        } 
    }
    
    renderAll(res: restify.Response, next: restify.Next) {
        return (documents: any[]) => {
            if(documents){
                documents.forEach((document, index, arr) => {
                    this.emit('beforeRender', document);
                    arr[index] = this.envelope(document)
                });
                res.json(documents)
            } else {
                res.json([]);
            }
            return next();
        }
    }
}