import { Router } from '../common/router';
import * as restify from 'restify';

class UsersRouter  extends Router {
    applyRoutes(application: restify.Server){
        application.get('/users', (req, res, next) => {
            res.json({msg: 'Users Route'});
        });
    }
}

export const usersRouter = new UsersRouter()