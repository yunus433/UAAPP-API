const fetch = require('node-fetch');

module.exports = (body, callback) => {
  return callback(null);
  const ELASTIC_EMAIL_API_KEY = process.env.ELASTIC_EMAIL_API_KEY;

  if (!body || !body.template || !body.to) return callback('bad_request');

  if (body.template == 'waitlist_out_en') {
    if (!body.name)
      return callback('bad_request');

    fetch(`https://api.elasticemail.com/v2/email/send?apiKey=${ELASTIC_EMAIL_API_KEY}&isTransactional=true&template=waitlist_out_en&merge_name=${body.name}&to=${body.to.trim()}&charset=utf-8`, {
      method: 'POST'
    })
      .then(data => data.json())
      .then(res => callback(null, res))
      .catch(err => callback('database_error'));
  } else if (body.template == 'waitlist_out_tr') {
    if (!body.name)
      return callback('bad_request');

    fetch(`https://api.elasticemail.com/v2/email/send?apiKey=${ELASTIC_EMAIL_API_KEY}&isTransactional=true&template=waitlist_out_tr&merge_name=${body.name}&to=${body.to.trim()}&charset=utf-8`, {
      method: 'POST'
    })
      .then(data => data.json())
      .then(res => callback(null, res))
      .catch(err => callback('database_error'));
  } else if (body.template == 'new_paid_survey_en') {
    if (!body.name)
      return callback('bad_request');

    fetch(`https://api.elasticemail.com/v2/email/send?apiKey=${ELASTIC_EMAIL_API_KEY}&isTransactional=true&template=new_paid_survey_en&merge_name=${body.name}&to=${body.to.trim()}&charset=utf-8`, {
      method: 'POST'
    })
      .then(data => data.json())
      .then(res => callback(null, res))
      .catch(err => callback('database_error'));
  } else if (body.template == 'new_paid_survey_tr') {
    if (!body.name)
      return callback('bad_request');

    fetch(`https://api.elasticemail.com/v2/email/send?apiKey=${ELASTIC_EMAIL_API_KEY}&isTransactional=true&template=new_paid_survey_tr&merge_name=${body.name}&to=${body.to.trim()}&charset=utf-8`, {
      method: 'POST'
    })
      .then(data => data.json())
      .then(res => callback(null, res))
      .catch(err => callback('database_error'));
  } else {
    return callback('bad_request');
  }
};
