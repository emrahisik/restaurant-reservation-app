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

const reservationExists = async (req, res, next) => {
  const { reservation_id } = req.params;
  const reservation = await service.read(reservation_id);
  if(reservation){
    res.locals.reservation = reservation;
    return next();
  }else{
    next({
      status: 404,
      message: `The reservation id ${reservation_id} not found!`
    })
  }
}

//Array of the only valid fields for reservation
const validFields = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "status",
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
//Only reservations between 10:30AM and 9:30PM are accepted
const isDateValid = (reservation_date, reservation_time) => {
  if (!reservation_date || !Date.parse(reservation_date)) {
    errorMessages.push("reservation_date is either invalid or empty!");
  };

  const date = new Date(reservation_date + " " + reservation_time);
  if (!reservation_time || !date.getHours()) {
    errorMessages.push("reservation_time is either invalid or empty!");
  };

  const today = new Date(Date.now());
  if(date < today){
    errorMessages.push("Chosen date and time is in the past. Choose a date and time in the future!");
  };

  if(reservation_time < "10:30"){
    console.log(reservation_time)
    errorMessages.push("The restaurant opens at 10:30AM!")
  };

  if(reservation_time > "21:30"){
    errorMessages.push("Reservations after 9:30PM are not accepted!")
  }

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

//Validates that status is "booked" by default
const isStatusValid = (status) => {
  if(status === "seated" || status === "finished"){
    errorMessages.push(`Status ${status} is unknown`)
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
      status
    },
  } = req.body;
  isFirstNameValid(first_name);
  isLastNameValid(last_name);
  isMobileValid(mobile_number);
  isDateValid(reservation_date, reservation_time);
  isPeopleValid(people);
  isStatusValid(status)
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

//Validates that request body exists and has status property
const statusDataExists = (req, res, next) => {
  const { data } = req.body;
  if(!data || !data.status){
      next({
          status: 400,
          message: "status could not acquired!"
      });
  }else{
      return next();
  }
};

//Validates that requested data status is either booked, seated, finished or canceled
const hasValidStatus = (req, res, next) => {
  const {data: {status} } = req.body;
  const validStatus = ["booked", "seated", "finished", "canceled"];
  if(validStatus.includes(status)){
    next();
  }else{
    next({
      status: 400,
      message: `Status ${status} is unknown`
    });
  };
};

//Validates that current status of reservation is "booked"
const isStatusBooked = (req, res, next) => {
  const {status}  = res.locals.reservation;
  if(status !== "booked"){
    next({
      status: 400,
      message: `Reservations ${status} cannot be seated!`
    })
  }else{
    return next();
  }
}


const searchQueryExist = (req, res, next) => {
  const { date, mobile_number } = req.query;

  if(date){
    res.locals.date = date;
    next();
  }else if(mobile_number  && !mobile_number.match(/[A-Za-z]/)){
    res.locals.mobile_number = mobile_number;
    next();
  }else{
    next({
      status: 400,
      message: "Invalid query!"
    })
  }
}


/**
 * List handler for reservation resources
 */
// List daily reservations and sort them from earliest to latest
async function list(req, res) {
  const { date, mobile_number } = res.locals;
  let data = ""
  if(date){
    data = await service.list(date);
    data = data.filter(({status}) => status!=="finished")
  }else if(mobile_number){
    data = await service.search(mobile_number);
  }
  res.json({ data });
}

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
};

async function read(req,res) {
  const { reservation } = res.locals;
  res.status(200).json({ data: reservation })
};

async function updateStatus(req, res){
    const { reservation_id } = req.params;
    const { status } = req.body.data;
    console.log("dat")
    const data = await service.updateStatus(reservation_id, status)
    console.log(data)
    res.json({data})
}

module.exports = {
  list: [searchQueryExist, asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(reservationExists), read],
  create: [
    reservationDataExists,
    hasOnlyValidFields,
    hasProperties,
    asyncErrorBoundary(create),
  ],
  updateStatus: [asyncErrorBoundary(reservationExists), isStatusBooked, statusDataExists, hasValidStatus, asyncErrorBoundary(updateStatus) ]
};
