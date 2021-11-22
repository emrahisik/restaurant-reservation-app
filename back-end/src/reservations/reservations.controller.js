const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");

/**
 * Write back-end validation functions
 *
 */


/**
 * Checks if request body exists
 * if not, returns bad request status and error message
 */
const reservationDataExists = (req, res, next) => {
  const { data } = req.body;
  if (!data || !Object.keys(data).length) {
    next({
      status: 400,
      message: "Reservation data is required!",
    });
  };
  next();
};

//Array of the only valid fields for reservation
const validFields = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

/**
 * Checks if request body has only valid fields
 * if not, returns bad request status and error message
 */
const hasOnlyValidFields = (req, res, next) => {
  const { data } = req.body;
  const invalidFields = Object.keys(data).filter(
    (field) => !validFields.includes(field)
  );

  if (invalidFields.length) {
    next({
      status: 400,
      message: `Invalid fields: ${invalidFields.join(", ")}`,
    });
  };
  next();
};


/**
 * A set of validation helper functions is created
 * Each function pushes an error message to error 
 * collection array if failure conditions are met
 * Otherwise they process nothing.
 */

//Create an error message collector 
let errorMessages = [];

//Validates firstname
const isFirstNameValid = (first_name) => {
  if (!first_name || !first_name.trim()) {
    errorMessages.push("A first_name is required!");
  };
};

//Validates last name
const isLastNameValid = (last_name) => {
  if (!last_name || !last_name.trim()) {
    errorMessages.push("A last_name is required!");
  };
};

//Validates mobile number
const isMobileValid = (mobile_number) => {
  if (!mobile_number || !mobile_number.trim()) {
    errorMessages.push("A mobile_number is required!");
  };
};

//Validates reservation date and time
//Date can't be in past and on Tuesdays any time
const isDateValid = (reservation_date, reservation_time) => {
  if (!reservation_date || !Date.parse(reservation_date)) {
    errorMessages.push("reservation_date is either invalid or empty!");
  };

  const date = new Date(reservation_date + " " + reservation_time);
  if (!reservation_time || !date.getHours()) {
    errorMessages.push("reservation_time is either invalid or empty!");
  };

  const moment = new Date(Date.now());
  const today = `${moment.getFullYear()}-${moment.getMonth()+1}-${moment.getDate()}`;
  
  if(reservation_date < today){
    errorMessages.push("Chosen date is in the past. Choose a date in the future!");
  };

  if(date.getDay() == 2){
    errorMessages.push("The restaurant is closed on Tuesdays!")
  }
};

//Validates number of people (size of party)
const isPeopleValid = (people) => {
  if (!people || typeof people !== "number" || people < 1) {
    errorMessages.push("A number of people is required and must be at least 1!");
  }
};


/**
 * hasProperties function invokes validation functions
 * After every form submission errorMessages collector
 * is reset to an empty array. If any validation fails,
 * returns a bad request status along with error message
 * collection. 
 */

const hasProperties = (req, res, next) => {
  errorMessages = [];
  const {
    data: {
      first_name,
      last_name,
      mobile_number,
      reservation_date,
      reservation_time,
      people,
    },
  } = req.body;
  isFirstNameValid(first_name);
  isLastNameValid(last_name);
  isMobileValid(mobile_number);
  isDateValid(reservation_date, reservation_time);
  isPeopleValid(people);
  if (!errorMessages.length) {
    next();
  } else {
    const message = errorMessages.join("|");
    next({
      status: 400,
      message,
    });
  }
};


/**
 * List handler for reservation resources
 */
// List daily reservations and sort them from earliest to latest
async function list(req, res) {
  const { date } = req.query;
  const data = await service.list(date);
  data.sort((a, b) => (a.reservation_time > b.reservation_time ? 1 : -1));
  res.json({ data });
}

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(list),],
  create: [
    reservationDataExists,
    hasOnlyValidFields,
    hasProperties,
    asyncErrorBoundary(create),
  ],
};
