module.exports = (req, res, next) => {
  const user = req.session.user;

  if (user.is_email_confirmed)
    return next();

  return res.status(401).json({
    error: 'not_authanticated_request',
    success: false
  });;
}
