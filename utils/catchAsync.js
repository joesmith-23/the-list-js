module.exports = fn => {
  // Has to return a function so it isn't immediately called by express
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
