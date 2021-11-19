const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");


/**
 * Write back-end validation functions
 * 
 */

//Check if request body exists and has only valid fields
const validFields = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

const reservationDataExists = (req, res, next) => {
  const { data } = req.body;
  if(!data || !Object.keys(data).length){
    next({
      status:400,
      message: "Reservation data is required!",
    });
  };
  next();
};

const hasOnlyValidFields = (req, res, next) => {
  const { data } = req.body;
  const invalidFields= Object.keys(data).filter(field => !validFields.includes(field));

  if(invalidFields.length){
    next({
      status: 400,
      message: `Invalid fields: ${invalidFields.join(", ")}`
    });
  };
  next();
}; 


// Check if the name is valid
const isNameValid = (req, res, next) => {
  const { data:{ first_name, last_name } } = req.body;    
  if( !first_name || !first_name.trim() ){
      next({
          status: 400,
          message: "A first_name is required!",
      });
  }
  if( !last_name || !last_name.trim() ){
    next({
        status: 400,
        message: "A last_name is required!",
    });
};
  return true;
};

const isMobileValid = (req, res, next) => {
  const { data:{ mobile_number } } = req.body;    
  if( !mobile_number || !mobile_number.trim() ){
      next({
          status: 400,
          message: "A mobile_number is required!",
      });
  };
  return true;
};

const isDateValid = (req, res, next) => {
  const { data:{ reservation_date } } = req.body;  
  if( !reservation_date || !Date.parse(reservation_date) ){
      next({
          status: 400,
          message: "reservation_date is either invalid or empty!",
      });
  };
  return true;
};

const isTimeValid = (req, res, next) => {
  const { data:{ reservation_date, reservation_time } } = req.body;
  const date = new Date(reservation_date + ' ' + reservation_time)    
  if( !reservation_time || !date.getHours() ){
      next({
          status: 400,
          message: "reservation_time is either invalid or empty!",
      });
  };
  return true;
};

const isPeopleValid = (req, res, next) => {
  const { data:{ people } } = req.body;    
  if( !people || typeof(people) !== 'number' || people<1 ){
      next({
          status: 400,
          message: "A number of people is required and must be at least 1!",
      });
  };
  return true;
};

const hasProperties = (req, res, next) => {
  return(
    isNameValid(req, res, next)&&
    isMobileValid(req, res, next)&&
    isDateValid(req, res, next)&&
    isTimeValid(req, res, next)&&
    isPeopleValid(req, res, next)&&
    next()
  );
};



/**
 * List handler for reservation resources
 */
// List daily reservations and sort them from earliest to latest
async function list(req, res) {
  const { date } = req.query;
  const data = await service.list(date);
  data.sort((a,b) => a.reservation_time>b.reservation_time ? 1 : -1)
  res.json({ data });
}

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data })
}


module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [reservationDataExists, hasOnlyValidFields, hasProperties, asyncErrorBoundary(create)]
};
