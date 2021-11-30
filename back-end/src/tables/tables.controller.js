const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const { as } = require("../db/connection");


//Validates if the request has a data body
const tableDataExists = (req, res, next) => {
  const { data } = req.body;
  if (!data || !Object.keys(data).length) {
    next({
      status: 400,
      message: "Table data is required!",
    });
  }
  next();
};

// Validates if request body has only valid fields
const hasOnlyValidFields = (req, res, next) => {
    const { data } = req.body;
    const validFields = ["table_name", "capacity", "reservation_id"]
    const invalidFields = Object.keys(data).filter((key) => !validFields.includes(key));
    if(!invalidFields.length){
        return next();
    };
    next({
        status: 400,
        message: `Invalid fields: ${invalidFields.join(", ")}`
    });
};

//Validates that table_name has value and at least 2 character long
const isTableNameValid = (req, res, next) => {
    const { table_name } = req.body.data;
    if(!table_name || table_name.length < 2){
        next({
            status: 400,
            message: "table_name  is required and must be at least 2 chatracter long!"
        });
    };
    next();
};

//Validates that capacity has value and minimum 1
const isCapacityValid = (req, res, next) => {
    const { capacity } =req.body.data;
    if(!capacity || capacity < 1 || typeof capacity !== "number"){
        next({
            status: 400,
            message: "capacity is required and must be at least 1!"
        });
    };
    next();
};

//Verifies that table exists
const tableExists = async (req, res, next) => {
    const { table_id } = req.params;
    const table = await service.read(table_id);
    if(table){
        res.locals.table = table;
        next();
    }else{
        return next({
            status: 404,
            message: `Table ${table_id} cannot be found!`,
        });
    };
};
// Validates that request body exists and has reservation_id prop
const seatDataExists = (req, res, next) => {
    const { data } = req.body;
    if(!data || !data.reservation_id){
        next({
            status: 400,
            message: "reservation_id could not acquired!"
        });
    }else{
        return next();
    }
};


//Validates that the table is free
const isTableFree = (req, res, next) => {
    const {table} = res.locals;
    if(table.reservation_id){
        return next({
            status: 400,
            message: "The table is occupied!"
        });
    }else{
        next();
    };
};

//Validates that the table is occupied
const isTableOccupied = (req, res, next) => {
    const {table} = res.locals;
    if(!table.reservation_id){
        return next({
            status: 400,
            message: "The table is not occupied!"
        });
    }else{
        next();
    };
};


//Validates that reservation id exists
const reservationExists = async (req, res, next) => {
  const { reservation_id } = req.body.data;
  const reservation = await service.readReservation(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation
    return next();
  } else {
    next({
      status: 404,
      message: `The reservation id ${reservation_id} not found!`,
    });
  }
};

//Validates that table has enough capacity for eservation
const enoughCapacity = (req, res, next) => {
    const { table, reservation } = res.locals;
    if(table.capacity >= reservation.people){
        return next();
    }else{
        next({
            status: 400,
            message: "Table capacity is not enough!"
        })
    }
}


const list = async (req, res, next) => {
  res.json({ data: await service.list() });
};


const create = async (req, res, next) => {
    const { data } = req.body;
    const newTable = await service.create(data)
    res.status(201).json({ data: newTable })
}

const update = async (req, res, next) => {
    const { reservation_id } = req.body.data;
    const {table} = res.locals;
    console.log(table)
    const updatedTable = {...table, reservation_id: reservation_id};
    await service.update(updatedTable, table.table_id)
    res.json("Update Successful!");
}

const destroy = async (req, res, next) => {
    const { table_id } = req.params;
    await service.destroy(table_id);
    res.json("delete Successful");
}

module.exports = {
    list,
    create: [tableDataExists, hasOnlyValidFields, isTableNameValid, isCapacityValid, asyncErrorBoundary(create)],
    update : [seatDataExists, asyncErrorBoundary(reservationExists), asyncErrorBoundary(tableExists), isTableFree, enoughCapacity, asyncErrorBoundary(update)],
    delete: [asyncErrorBoundary(tableExists), isTableOccupied, asyncErrorBoundary(destroy)]
}