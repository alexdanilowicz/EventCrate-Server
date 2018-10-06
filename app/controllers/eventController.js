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

  const eventbody = {
    name,
    clubName,
    description,
    location,
    startTime,
    endTime,
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
  EventModel.find({ approved: '1' })
    .then((result) => {
      res.send(result);
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
