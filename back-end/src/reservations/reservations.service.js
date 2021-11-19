const knex = require("../db/connection");

const list = (date) => {
    return knex("reservations")
            .where({reservation_date: date });
}

const create = (reservation) => {
    return knex("reservations")
            .insert(reservation)
            .returning("*")
            .then(data => data[0])
}

module.exports = {
    list,
    create,
}