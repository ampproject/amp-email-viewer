const Mustache = require('mustache');
const { requestWithCORS } = require('../request');

module.exports = async function(req, res, next) {
  const { originalRequest, ampComponent, senderEmail } = req.body;
  const { status, data } = await requestWithCORS(originalRequest, senderEmail);
  const html = renderTemplate(status, ampComponent, data);

  res.type('application/json');
  res.send({
    html,
    body: JSON.stringify(data),
    init: {
      status,
    },
  });
};

function renderTemplate(status, ampComponent, data) {
  if (ampComponent.type === 'amp-list') {
    return renderList(status, ampComponent, data);
  } else if (ampComponent.type === 'amp-form') {
    return renderForm(status, ampComponent, data);
  }
}

function renderForm(status, ampComponent, data) {
  let template;
  if (status === 200) {
    template = ampComponent.successTemplate;
  } else {
    template = ampComponent.errorTemplate;
  }
  if (template.type !== 'amp-mustache') {
    throw new Error('unknown template type');
  }
  return Mustache.render(template.payload, data);
}

function renderList(status, ampComponent, data) {
  if (status !== 200) {
    return;
  }
  let view = data;
  const template = ampComponent.successTemplate;
  if (ampComponent.ampListAttributes) {
    view = processListResponse(view, ampComponent.ampListAttributes);
  }
  if (template.type !== 'amp-mustache') {
    throw new Error('unknown template type');
  }
  return Mustache.render(`{{#items}}${template.payload}{{/items}}`, view);
}

function processListResponse(data, {items, singleItem, maxItems}) {
  for (const item of items.split('.')) {
    if (item) {
      data = data[item];
    }
  }
  if (singleItem) {
    data = [data];
  }
  maxItems = Number(maxItems);
  if (maxItems > 0) {
    data = data.slice(0, maxItems);
  }
  return {
    items: data
  };
}
