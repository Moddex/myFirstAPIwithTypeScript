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

userSchema.pre('save', function(next) {
    const user: User = this;

    if(!user.isModified('password')){
        next();
    } else {
        bcrypt.hash(user.password, environment.security.saltRounds).then(hash => {
            user.password = hash;
            next();
        }).catch(next);
    }

})

export const User = mongoose.model<User>('User', userSchema, 'pb');
