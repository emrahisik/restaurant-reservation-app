module.exports = methodNotAllowed = (req, res, next) => {
    next({
        status: 405,
        message: `Method ${req.method} not allowed!`
    });
};