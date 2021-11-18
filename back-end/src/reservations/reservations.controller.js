const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");


/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const { date } = req.query;
  //console.log(date);
  const data = await service.list(date);
  res.json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
};
