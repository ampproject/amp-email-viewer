const { requestWithCORS } = require('../request');

module.exports = async function(req, res) {
  const { originalRequest, senderEmail } = req.body;
  const { status, data } = await requestWithCORS(originalRequest, senderEmail);
  res.type('application/json');
  res.send({
    body: JSON.stringify(data),
    init: {
      status,
    },
  });
};
