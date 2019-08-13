import { Router } from '../common/router';
import * as restify from 'restify';
import { User } from './users.model'

class UsersRouter  extends Router {
    applyRoutes(application: restify.Server){
        application.get('/users', (req, res, next) => {
            User.find().then(users => {
                res.json(users);
                return next();
            })
        });

        application.get('/users/:id', (req, res, next) => {
            User.findById(req.params.id).then(user => {
                if(user){
                    res.json(user);
                    return next();
                }
                
                res.send(404);
                return next();
            });
        });

        application.post('/users', (req, res, next) => {
            const { name, email } = req.body;

            if(!name || !email){
                res.json({err: 'email and password fields are required'});
                return next();
            }
            
            let user = new User(req.body);
            user.save().then(user => {
                res.send(201, user);
            });
            
            return next();
        });

        application.put('/users/:id', (req, res, next) => {
            const options = {overwrite: true}
            User.update({_id: req.params.id}, req.body, options)
                .exec().then(result => {
                    if(result.n){
                        return User.findById(req.params.id)
                    } else {
                        res.send(404, {err: 'not found'});
                    }
            }).then(user => {
                res.json(user);
                return next();
            });
        })

        application.patch('/users/:id', (req, res,next) => {
            const options = {new: true}
            User.findOneAndUpdate(req.params.id, req.body, options).then(user => {
                if(user){
                    res.json(user);
                    return next();
                } else {
                    res.send(404);
                    return next();
                }
            });
        });
    }
}

export const usersRouter = new UsersRouter()