const nextjsCors = require("nextjs-cors");

module.exports = {
  middleware: [nextjsCors()],
};
