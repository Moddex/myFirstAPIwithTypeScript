import * as mongoose from 'mongoose'

export interface User extends mongoose.Document {
    email: string,
    name: string
}

const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String }
})

export const User = mongoose.model<User>('User', userSchema, 'pb');
