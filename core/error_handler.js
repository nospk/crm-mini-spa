const Controller = require("./controller")
const notFound = (req, res, next)=>{
    Controller.setLocalValue(req,res);
    //const error = new Error (`Not Found - ${req.originalUrl}`);
    return res.status(404).render('404');
};
const errorHandler = (err, req, res, next)=>{
    Controller.setLocalValue(req,res);
    res.locals.message = err.message;
    res.locals.error = process.env.run === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
};

module.exports = {notFound, errorHandler}