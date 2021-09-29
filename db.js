
const Sequelize = require('sequelize'),
    config = require('./config');

    let models = {};
let connection = {
    host: config.postgres.host,
    dialect: 'postgres',
    pool: {
        max: 150,
        min: 0,
        idle: 10000
    },
};
if (config.postgres.port) connection.port = config.postgres.port;
let sequelize = new Sequelize(config.postgres.database, config.postgres.username, config.postgres.password, connection);

const files = require('./models');
files.forEach(file => {
    const model = require(file)(sequelize, Sequelize.DataTypes)
    models[model.name] = model;
})

Object.keys(models).forEach(modelName => {
    if ('associate' in models[modelName]) {
        models[modelName].associate(models);
    }
})

console.log(models);
console.log('Database loaded');

function db () {

}

db.getSequelize = function() {
    return sequelize;
}

db.getModels = function(){
    return models;
}

module.exports = db;