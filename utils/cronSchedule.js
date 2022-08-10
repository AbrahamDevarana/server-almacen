const CronJob = require('cron').CronJob;
const valeSalidaController = require("../controllers/valeSalidaController")
//     valeSalidaController.validateVale()
const job = new CronJob('00 00 00 * * *', function() {
    console.log('running at midnight');
	valeSalidaController.validateVale()
});

job.start();