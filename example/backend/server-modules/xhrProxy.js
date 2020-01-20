const { requestWithCORS } = require('../request');

module.exports = async function(req, res, next) {
  const { originalRequest, senderEmail } = req.body;
  const data = await requestWithCORS(originalRequest, senderEmail);
  res.type('application/json');
  res.send({
    body: JSON.stringify(data),
    init: {
      status: 200,
    },
  });
};
