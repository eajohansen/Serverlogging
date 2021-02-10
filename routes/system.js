const express = require('express');
const router = express.Router();
const si = require('systeminformation');

let hddStatus = [];
let timeNow ='';
let cacheSystem;
let infoSystem = [];
async function HDD () {
    await si.diskLayout()
        .then(data => {
            timeNow = new Date().toLocaleString();
            return hddStatus = data;
        })
        .catch(error => console.log(error))
}
async function gatherInfo ()  {
    try {
        const serverUptime = si.time().uptime;
        const servertime = si.time().current;
        await infoSystem.push({'current_time': new Date(servertime).toLocaleString()});
        await infoSystem.push({'server_uptime': new Date(serverUptime * 1000).toISOString().substr(11, 8)});
        await si.cpuCurrentspeed()
            .then(data => {
                infoSystem.push({'cpu_speed': data.cores});
            })
            .catch(error => console.log(error))

        await si.mem()
            .then(data => {
                infoSystem.push({'ram_total': data.total/1000000, 'ram_free': data.free/1000000, 'ram_used': data.used/1000000});
            })
            .catch(error => console.log(error))

        await si.cpuTemperature()
            .then(data => {
                infoSystem.push({'cpu_temp_avg': data.main});
                infoSystem.push({'cpu_temp_max': data.max});
            })
            .catch(error => console.log(error))

        await si.vboxInfo()
            .then(data => {
                infoSystem.push({'virtual_servers': data});
            })
            .catch(error => console.log(error))
    }
    catch {
        console.log('ERROR')
    }
    finally {
        cacheSystem = infoSystem
        infoSystem = []
    }
}

setInterval(gatherInfo, 5000);

router.get('/serverinfo', (req, res, next) => {
    res.status(200).json(cacheSystem);
})
router.get('/hddinfo', (req, res, next) => {
    HDD();
    console.log(timeNow)
    res.status(200).json(hddStatus)
})

module.exports = router;