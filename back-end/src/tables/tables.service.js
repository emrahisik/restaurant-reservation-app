const knex =require("../db/connection");

const list = () => {
    return knex("tables").select("*");
};

const create = (data) => {
    return knex("tables")
            .insert(data)
            .returning("*")
            .then(table => table[0]);
};

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
};