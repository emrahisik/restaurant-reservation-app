const knex = require("../db/connection");

const list = (date) => {
    return knex("reservations")
            .where({reservation_date: date })
            .orderBy("reservation_time");
}

const read = (reservation_id) => {
    return knex("reservations").where({reservation_id}).first()
}

const search = (mobile_number) => {
    return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

const create = (reservation) => {
    return knex("reservations")
            .insert(reservation)
            .returning("*")
            .then(data => data[0])
}

const updateStatus = (reservation_id, status) => {
    return knex("reservations")
            .where({reservation_id})
            .update({status: status})
            .returning("*")
            .then(updatedData => updatedData[0]);
};

module.exports = {
    list,
    create,
    read,
    updateStatus,
    search,
}