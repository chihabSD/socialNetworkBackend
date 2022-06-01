const userController = {};

userController.test = async (req, res, next) => {
  res.send({
    message: " Testing ",
  });
};
module.exports = userController;
