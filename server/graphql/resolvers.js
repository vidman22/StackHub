const bcrypt = require('bcryptjs');
const uuidv4 = require('uuid/v4');
const jwt = require('jsonwebtoken');
const knex = require('../dbconfig');
const keys = require('../keys.js');

const resolver = {

    login: async ({email, password}, ctx, info) => {
        console.log("login variables", email, password);
        const [user] = await knex('users').where("email", email );
    
        if (!user) {
            throw new Error('Email not found');
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            throw new Error('Password is incorrect');
        }
        
        return {
           user
         }
    },
    signUp: async ({  email, password }, ctx, info) => {
        console.log("sign up fired", email, password);
        const hash = await bcrypt.hash(password, 12 );
        const uuid = uuidv4();
        const [existingUser] = await knex('users').where("email", email );
        // console.log('existing user', existingUser);
        if ( existingUser) {
            throw new Error("Email connected to account");
        } else {
            const [user] = await knex('users')
                .returning(['id', 'email' ])
                .insert([{ email, password: hash }])
        
            const token = jwt.sign({ uuid }, keys.APP_SECRET, {expiresIn: '48hr'});
            const expiresIn = 7200;
            console.log('user', user);
            
             return {
                   token,
                   expiresIn,
                   user
             }			
        } 
    }
}

module.exports = resolver;