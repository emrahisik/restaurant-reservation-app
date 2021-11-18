const knex = require("../db/connection");

const list = (date) => {
    return knex("reservations")
            .where({reservation_date: date });
}

module.exports = {
    list,
}