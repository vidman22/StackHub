const app = require("express")();
const bodyParser = require('body-parser');
const cors = require('cors');
const graphqlHTTP = require('express-graphql');
const session = require('express-session');
const stripe = require("stripe")("sk_test_itSbVJv4myjvWTEMg1u8VP3z003gNbK4ll");


const resolvers = require('./graphql/resolvers');
const schema  = require('./graphql/TypeDefs');

app.use(session({ 
    secret: 'stripeforlife', 
    resave: false,
    saveUninitialized: true, 
    cookie: { maxAge: 60000 } 
  }));

app.use(require("body-parser").text());

app.post("/charge", async (req, res) => {
    try {
      let {status} = await stripe.charges.create({
        amount: 2000,
        currency: "usd",
        description: "An example charge",
        source: req.body
      });
  
      res.json({status});
      console.log({status});
    } catch (err) {
      res.status(500).end();
    }
  });


const PORT = process.env.PORT || 5000;

  app.use(cors());
  app.use(bodyParser.json());


  app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql:true
  }));

  app.listen(PORT, () => console.log("Listening on port " + PORT));