const User = require('../models/user');

exports.uploadImage = (req, res, next) => {
   const user = User.findOne({
      where: { id: req.user.id },
   });
};
