import sanitizeHtml from 'sanitize-html';

function sanitizeInput(input) {
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  });
}

export default sanitizeInput;