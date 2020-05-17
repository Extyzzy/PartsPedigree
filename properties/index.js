const properties = {
  dev: require('./development.properties'),
  uat: require('./uat.properties'),
  production: require('./production.properties'),
};

module.exports = properties[process.env.ENV_TYPE || 'dev'];
