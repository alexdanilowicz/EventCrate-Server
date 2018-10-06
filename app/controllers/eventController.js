import EventModel from '../models/eventModel';

/**
 * Function to create an event
 * @param {F} req
 * @param {*} res
 * @param {*} next
 */
export function createEvent(req, res, next) {
  // basic validation for what's needed
  const {
    name,
    clubName,
    description,
    location,
    start,
    end,
    date,
  } = req.body;

  if (!name || !location || !start || !end || !clubName || !date || !description) {
    res.status(422).json({ error: 'Need event name, clubname, description, location, start time, end time, and date' });
    return;
  }

  // convert the time strings to nicer format
  const startTime = tConvert(start);
  const endTime = tConvert(end);
  const finalDate = convertDate(date);
  const eventbody = {
    name,
    clubName,
    description,
    location,
    startTime,
    endTime,
    finalDate,
    date,
  };

  EventModel.create(eventbody)
    .then((result) => {
      res.send('created event');
    })
    .catch((error) => {
      res.send(error);
    });
}

/**
 * Function to just get all events
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export function getAllEvents(req, res, next) {
  EventModel.find({})
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
}

export function getApprovedEvents(req, res, next) {
  // console.log('aaaaaaaaaa');
  // console.log(req.query);
  // console.log(req.params);
  // initialize table
  const table = {

  };

  // get starting date (it's a string that will be parsed later, mm/dd)
  const { date } = req.query;
  console.log('ccccccccc');
  console.log(date);
  // initialize a date object using the date
  const day = new Date(date); // date object
  const endDate = day.getDate() + 4;  // get end date

  // create the next few days
  let idx = day.getDate();
  // fill up the table with empty arrays for each day from start to end
  while (idx < endDate) {
    const fDate = idx.toString().length === 1 ? `0${idx}` : `${idx}`;
    const key = `${date.split('/')[0]}/${fDate}`;
    table[key] = [];
    idx += 1;
  }

  // current date comes from req.body
  // table, key(date) -> array of bojects
  EventModel.find({ approved: '1' })
    .then((result) => {
      // push each item into the table with the corresponding date
      result.forEach((item) => {
        console.log(item);
        const split = item.date.split('-');
        const convertedDate = `${split[1]}/${split[0]}`;
        if (convertedDate in table) {
          table[convertedDate].push(item);
        }
      });

      // go through each array int able and sort them
      // TODO: fix this
      for (const key in table) {
        table[key].sort((a, b) => {
          const aStart = Number(a.startTime);
          const bStart = Number(b.startTime);
          return aStart <= bStart;
        });
      }
      res.send(table);
    })
    .catch((err) => {
      res.send(err);
    });
}

export function getNonReviewedEvents(req, res, next) {
  EventModel.find({ approved: '0' })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
}

/**
 * flag event as approved (1) or declined (2)
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export function approveEvent(req, res, next) {
  const id = req.params.id;
  EventModel.findOneAndUpdate({ _id: id }, { approved: '1' })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
}

export function declineEvent(req, res, next) {
  const id = req.params.id;
  EventModel.findOneAndUpdate({ _id: id }, { approved: '2' })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send(err);
    });
}

// helper function from stack overflow: convert string in format
// "HH:MM:SS" in 24 hour time to 12 hour time
function tConvert(time) {
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
  if (time.length > 1) { // If time format correct
    time = time.slice(1);  // Remove full string match value
    time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join(''); // return adjusted time or original string
}

function convertDate(dateString) {
  const splitDate = dateString.split('-');
  return new Date(splitDate[2], splitDate[1] - 1, splitDate[0]);
}
