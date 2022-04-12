module.exports = (user, callback) => {
  if (!user || !user._id)
    return callback('document_not_found');
  
  return callback(null, {
    _id: user._id.toString(),
    email: user.email,
    is_email_confirmed: user.is_email_confirmed,
    is_account_complete: user.is_account_complete,
    name: user.name,
    number: user.number,
    profile_photo: user.profile_photo,
    is_email_notifications_allowed: user.is_email_notifications_allowed,
    is_light_team_on: user.is_light_team_on,
    favorite_announcements: user.favorite_announcements.map(each => each.toString())
  });
}
