module.exports = fn => {
  // Has to return a function so it isn't immediately called by express - this is an example of a higher order function
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
