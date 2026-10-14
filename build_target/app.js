const path = require("path");

// PWAとして配信するため、JS単体ではなくHTMLをエントリにする
module.exports = {
  index: path.resolve(__dirname, "../src/index.html")
};
