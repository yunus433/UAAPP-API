const User = require('../../user/User');

module.exports = (late_bus, callback) => {
  if (!late_bus || !late_bus._id)
    return callback('document_not_found');
  
  User.findUserById(late_bus.user_id, (err, user) => {
    if (err) return callback(err);

    return callback(null, {
      _id: late_bus._id.toString(),
      destination: late_bus.destination,
      user: {
        _id: user._id.toString(),
        email: user.email,
        name: user.name,
        number: user.number
      }
    });
  });
}
