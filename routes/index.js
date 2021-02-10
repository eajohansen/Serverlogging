const express = require('express');
const router = express.Router();

const si = require('systeminformation');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/server', function (req, res, next) {
  res.send(si.time().uptime);
})

module.exports = router;
