const bcrypt = require('bcryptjs');
const uuidv4 = require('uuid/v4');

const knex = require('../dbconfig');

const resolver = {
    stripeUser: async (_, ctx, info) => {
        let id = ctx.session.userID;

        if (id) {
            const [user] = await knex('stripe_users').where("id", id);
            return user;
        } else return null;

        

    },
    login: async ({email, password}, ctx, info) => {
        console.log("ctx", ctx);
        const [user] = await database('stripe_users').where("email", email );
    
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

    createStripeUser: async( {username, email, password }, ctx, info) => {
        console.log("args", typeof password, typeof email, typeof username);
        console.log("Ctx", ctx.session);

        const hash = await bcrypt.hash(password, 10);
        //const uuid = uuidv4();

        //const [existingUser] = await knex('stripe_users').where("email", email).catch( (error) => console.error(error));


        // if (existingUser) {
        //     console.log("uh oh, fired")
        //     throw new Error('Email already used');
        // } else {
        try{
            const [stripe_user] = await knex('stripe_users')
                .returning(['id', 'username', 'email', 'password' ])
                .insert([{username, email, password: hash }])
                console.log("stripe_user", stripe_user);
                ctx.session.userID = stripe_user.id;
            return stripe_user;   
        } catch (err) {
                console.error(err);
        }
        
    }
}

module.exports = resolver;