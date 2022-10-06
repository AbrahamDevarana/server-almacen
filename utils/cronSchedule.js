const CronJob = require('cron').CronJob;
const valeSalidaController = require("../controllers/valeSalidaController")
const job = new CronJob('0 5 * * *', function() {
    // console.log('running at midnight');
	valeSalidaController.cerrarValesAbiertos()
},
null,
true,
'America/Mexico_City'
);

job.start();