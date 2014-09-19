var express = require('express')
var app = express()

var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(express.static('./'))

app.route('/api/charge').post(function(request, response) {
    // Set your secret key: remember to change this to your live secret key in production
    // See your keys here https://dashboard.stripe.com/account
    var stripe = require("stripe")("sk_test_kZzQSK1Xnl51P8IgheZlAMbU");

    var stripeToken = request.body.stripeToken;
    var description = request.body.description;

    var charge = stripe.charges.create({
        amount: 19900, // amount in cents, again
        currency: "usd",
        card: stripeToken,
        description: description
    }, function(err, charge) {
        if (err) {
            if (err.type === 'StripeCardError') {
                // The card has been declined
                response.status(402).send(err.message)
            }
            else if (err.type === 'StripeInvalidRequest') {
                // Reused token or such
                response.status(400).send(err.message)
            }
            else {
                response.status(500).end()
            }
        }
        else {
            response.set('Content-Type', 'application/json')
            response.send(JSON.stringify({
                amount: charge.amount,
                last4: charge.card.last4
            }))
        }
    });


})

var server = app.listen(+process.argv[2] || 8000, function() {
    console.log('Listening on port %d', server.address().port)
})
