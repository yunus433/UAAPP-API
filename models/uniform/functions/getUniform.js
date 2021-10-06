module.exports = (uniform, callback) => {
  if (!uniform || !uniform._id)
    return callback('document_not_found');
  
  return callback(null, {
    _id: uniform._id.toString(),
    type: uniform.type,
    name: uniform.name,
    image: uniform.image_url
  });
}
