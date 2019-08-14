import { Router } from '../common/router';
import * as restify from 'restify';
import { User } from './users.model'

class UsersRouter  extends Router {
    constructor() {
        super();
        this.on('beforeRender', document => {
            document.password = undefined;
        });
    }

    applyRoutes(application: restify.Server){
        application.get('/users', (req, res, next) => {
            User.find()
            .then(this.render(res, next))
            .catch(next)
        });

        application.get('/users/:id', (req, res, next) => {
            User.findById(req.params.id).then(this.render(res, next)).catch(next);
        });

        application.post('/users', (req, res, next) => {
            const { name, email } = req.body;

            if(!name || !email){
                res.json({err: 'email and password fields are required'});
                return next();
            }
            
            let user = new User(req.body);
            user.save().then(this.render(res, next)).catch(next);

        });

        application.put('/users/:id', (req, res, next) => {
            const options = {overwrite: true}
            User.update({_id: req.params.id}, req.body, options)
                .exec().then((result: any) => {
                    if(result.n){
                        return User.findById(req.params.id)
                    } else {
                        res.send(404, {err: 'not found'});
                    }
            }).then(this.render(res, next)).catch(next);
        })

        application.patch('/users/:id', (req, res,next) => {
            const options = {new: true}
            User.findOneAndUpdate(req.params.id, req.body, options)
                .then(this.render(res, next)).catch(next);
        });

        application.del('/users/:id', (req, res, next) => {
            User.remove({_id: req.params.id}).exec().then((res: any) => {
                if(res.result.n){
                    res.send(204);
                } else {
                    res.send(404);
                }
                return next();
            }).catch(next);
        });
    }
}

export const usersRouter = new UsersRouter()