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

const update = async (data, table_id) => {
    // return knex("tables")
    //         .where({table_id})
    //         .update(data,"*")
    //         .then(updatedData => updatedData[0]);
    await knex.transaction(trx => {
      trx("tables")
        .where({table_id})
        .update(data,"*")
        .then(updatedData => updatedData[0]);
      return  trx("reservations")
      .where({reservation_id: data.reservation_id})
      .update({status: "seated"})
    })
};

const destroy =  (table_id, reservation_id) => {
  const statusUpdate = knex("reservations").where({reservation_id}).update({status: "finished"})
  return knex("tables").where({table_id}).update({reservation_id: null}).then(() => statusUpdate)
}

module.exports = {
    list,
    create,
    update,
    read,
    readReservation,
    destroy
};