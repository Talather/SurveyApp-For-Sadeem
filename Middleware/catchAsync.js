module.exports = (errorFunction) => (req, res, next) => {
  Promise.resolve(errorFunction(req, res, next)).catch(next)
} //This middleware function is useful for wrapping async error functions to handle errros in a consistent way.
