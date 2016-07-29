const glob = require('glob');

glob.sync(`${__dirname}/tests/**/*.test.js`)
  .forEach(file => require(file)(__dirname));
