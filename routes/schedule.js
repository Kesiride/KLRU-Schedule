var express = require('express');
var router  = express.Router();
var moment = require('moment');
var channelFeeds;

function getDatestamp(req, res, next) {
  var datestamp = moment().format('YYYYMMDD');
  req.datestamp = datestamp;
  next();
}

function getListings(req, res, next) {
  var PBSTvSchedules = require('node-pbs-tv-schedules'),
      options = {};

  options.api_key =  process.env.PBS_TV_SCHEDULES_API_KEY || null;
  options.log_level = "info";

  var pbsAPI = new PBSTvSchedules(options);
  var zip = 78705;

  // Get day's listing for KLRU
  var callsign = 'klru';
  pbsAPI.get_day_schedule_for_callsign_date_async(callsign,req.datestamp)
  .then(function(results){
    pbsAPI.logger.info("Found " + results.feeds.length + " items");
    channelFeeds = results.feeds;
    return channelFeeds;
  })
  .catch(function (err) {
      pbsAPI.logger.error(err);
  })
  .done(function(channelFeeds) {
    req.channelFeeds = channelFeeds;
    next();
  });
}

router.use(getDatestamp);
router.use(getListings);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('schedule', {
    title: 'Schedule',
    scheduleDate: req.datestamp,
    klruFeeds: req.channelFeeds
  });
});

module.exports = router;
