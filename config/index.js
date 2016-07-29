const NODE_ENV = process.env.NODE_ENV || 'dev';

const base = require('./base.js');
const env = require(`./env/${NODE_ENV}.js`);
const config = Object.assign(base, env)

module.exports = config;
