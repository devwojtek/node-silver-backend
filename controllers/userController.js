const mongoose = require('./../libs/mongoose');
const User = mongoose.model('User');
const slapMindset = mongoose.model('slapMindset');
const IdealClient = mongoose.model('IdealClient');
const Statement = mongoose.model('Statement');

class UserController {
    static getFinishedSteps(req) {
        let select = 'finishedSteps';
        let userId = req.decoded._doc._id;
        let data = {};
        return User.load({_id: userId}, select)
            .then((steps) => {
                if (steps.finishedSteps.length <= 0) return null;

                data.steps = steps;

                return slapMindset.load({userId: userId})
                    .then((slapMindset) => {
                        data.slapMindset = slapMindset;
                        return IdealClient.load({userId: userId});
                    })
                    .then((idealClient) => {
                        data.idealClient = idealClient;
                        return Statement.load({userId: userId})
                    })
                    .then((statement) => {
                        data.statement = statement;
                        return data;
                    });
            });

    }
}

module.exports = UserController;