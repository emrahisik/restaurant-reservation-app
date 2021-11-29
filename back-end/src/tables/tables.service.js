const knex =require("../db/connection");

const list = () => {
  return knex("tables").select("*").orderBy("table_name");
};

const read = (table_id) => {
  return knex("tables").where({table_id}).first()
}

const create = (data) => {
    return knex("tables")
            .insert(data)
            .returning("*")
            .then(table => table[0]);
};

const readReservation = (reservation_id) => {
  return knex("reservations").where({reservation_id}).first()
}

const update = (data, table_id) => {
    return knex("tables")
            .where({table_id})
            .update(data,"*")
            .then(updatedData => updatedData[0]);
};

module.exports = {
    list,
    create,
    update,
    read,
    readReservation,
};