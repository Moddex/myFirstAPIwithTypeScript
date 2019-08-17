import * as mongoose from 'mongoose'
import * as bcrypt from 'bcrypt'
import { environment } from '../common/env';

export interface User extends mongoose.Document {
    email: string,
    name: string,
    password: string
}

const userSchema = new mongoose.Schema({
    name: { type: String , required: true},
    email: { type: String, unique: true , required: true},
    password: { type: String , required: true}
});

const hashPassword = (obj, next) => {
    bcrypt.hash(obj.password, environment.security.saltRounds).then(hash => {
        obj.password = hash;
        next();
    }).catch(next);
}

const saveMiddleware = function(next) {
    const user: User = this;

    if(!user.isModified('password')){
        next();
    } else {
        hashPassword(user, next)
    }
}

const updateMiddleware = function(next){
    if(!this.getUpdate().password){
        next();
    } else {
        hashPassword(this.getUpdate(), next);
    }
}

userSchema.pre('save', saveMiddleware);

userSchema.pre('findOneAndUpdate', updateMiddleware);

export const User = mongoose.model<User>('User', userSchema);
