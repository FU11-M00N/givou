const User = require('../models/user');

exports.uploadUserImage = (req, res, next) => {
   User.findOne({
      where: { id: req.user.id },
   });
};
