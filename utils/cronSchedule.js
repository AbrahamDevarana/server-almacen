const cron = require('node-cron');
const valeSalidaController = require("../controllers/valeSalidaController")

cron.schedule('* * * * *', function() {
    valeSalidaController.validateVale()
});


// const cron = require('node-cron');
// const cronSchedule = cron.schedule('1,2,4,5 * * * *', () => {
//     console.log('running every minute 1, 2, 4 and 5');
// }).start();
//
// module.exports = cronSchedule;