const config = require('../../config');
const StripeError  = require('./errors/StripeError');
const stripe = require('stripe')(config.stripe_key);
const async = require('async');

class Stripe {

    static createCustomer(userData) {
        return new Promise( (resolve,reject) => {
            Stripe._createCard(userData.card)
                .then((cardSource) => Stripe._createCustomer(cardSource,userData))
                .then(resolve)
                .catch(reject);
        });
    }
    
    static _createCustomer(cardSource,userData) {
        return new Promise( (resolve,reject) => {
            let data = {
                source : cardSource.id,
                email : userData.email,
                metadata : {
                    customer_email : userData.email,
                    customer_name : userData.name
                }
            };
           stripe.customers.create(data, (err,customer) => {
               return err ? reject(new StripeError('Failed create customer', 'BAD_DATA', {orig: err})) : resolve(customer);
           });
        });
    }

    static _createCard(card) {
        return new Promise( (resolve,reject) => {
            stripe.tokens.create({card : card}, (err,token) => {
                return err ? reject(new StripeError('Failed create card', 'BAD_DATA', {orig: err.stack})) : resolve(token);
            });
        });
    }
    
    static createCharges(customer,payment) {
        return new Promise((resolve,reject) => {
            stripe.charges.create({
                amount: payment.amount,
                currency: 'usd',
                source: customer.default_source,
                customer: customer.id
            }, (err,result) => {
                return err ? reject(new StripeError('Failed create charges', 'BAD_DATA', {orig: err.stack})) : resolve(result);
            });
        });
    }
}

module.exports = Stripe;