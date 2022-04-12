module.exports = (req, res) => {
  console.log("here");
  req.session.destroy();

  return res.status(200).json({ success: true });
}
