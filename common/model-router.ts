import { Router } from './router';
import * as mongoose from 'mongoose';

export abstract class ModelRouter<D extends mongoose.Document> extends Router {
    constructor(protected model: mongoose.Model<D>){
        super();
    }

    protected prepareOne(query: mongoose.DocumentQuery<D,D>): mongoose.DocumentQuery<D,D> {
        return query;
    }

    envelope(document: any):any {
        let resource = Object.assign({_links: {}}, document.toJSON())
        resource._links.self = `/${this.model.collection.name}/${resource._id}`
        return resource
    }

    validateId  = (req, res, next) => {
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){
            res.send(404);
            next(new Error('Not found error'));
        } else {
            next();
        }
    }

    findAll = (req, res, next) => {
        this.model.find()
        .then(this.renderAll(res, next))
        .catch(next)
    }

    findById = (req, res, next) => {
      this.prepareOne(this.model.findById(req.params.id))
        .then(this.render(res, next))
        .catch(next);
    }

    save = (req, res, next) => {     
        let document = new this.model(req.body);
        document.save().then(this.render(res, next)).catch(next);
    }

    replace = (req, res, next) => {
        const options = {runValidators: true, overwrite: true}
        this.model.update({_id: req.params.id}, req.body, options)
            .exec().then(result => {
                if(result.n){
                    return this.model.findById(req.params.id)
                } else {
                    res.send(404, {err: 'not found'});
                }
        }).then(this.render(res, next)).catch(next);
    }

    update = (req, res,next) => {
        const options = {runValidators: true, new: true}
        this.model.findOneAndUpdate(req.params.id, req.body, options)
            .then(this.render(res, next)).catch(next);
    }

    delete = (req, res, next) => {
        this.model.remove({_id: req.params.id}).exec().then((res: any) => {
            if(res.result.n){
                res.send(204);
            } else {
                res.send(404);
            }
            return next();
        }).catch(next);
    }
}