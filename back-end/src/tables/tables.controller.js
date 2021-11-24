const service = require("./tables.service");

const list = async (req, res, next) => {
  res.json({ data: await service.list() });
};

module.exports = {
    list,
}