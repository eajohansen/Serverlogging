const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const si = require('systeminformation');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const http = require('http');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);

async function gatherInfo ()  {

    let infoSystem = [];
    const serverUptime = si.time().uptime;
    const servertime = si.time().current;

  await  si.cpuCurrentspeed()
        .then(data => {
            infoSystem.push({'CPU info: MIN': data.min, 'MAX': data.max, 'AVG': data.avg });
        })
        .catch(error => console.log(error))

    await  si.currentLoad()
        .then(data => {
            infoSystem.push(data.cpus);
        })
        .catch(error => console.log(error))

   await si.mem()
        .then(data => {
            infoSystem.push({'RAM: Total ': data.total, ' free ': data.free, ' used ': data.used});
        })
        .catch(error => console.log(error))

  await  si.cpuTemperature()
        .then(data => {
            infoSystem.push({'cpu temp': data.main});
        })
        .catch(error => console.log(error))

    await si.vboxInfo()
        .then(data => {
            infoSystem.push({'Virtual servers: ': data});
        })
        .catch(error => console.log(error))

   await si.diskLayout()
        .then(data => {
            infoSystem.push(data);
        })
        .catch(error => console.log(error))

    infoSystem.push({'current_time': new Date(servertime).toLocaleString()});
    infoSystem.push({'uptime': new Date(serverUptime * 1000).toISOString().substr(11, 8)});
    return infoSystem


}

gatherInfo();
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

module.exports = app;
