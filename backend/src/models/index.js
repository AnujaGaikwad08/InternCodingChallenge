const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Store = require('./store')(sequelize, Sequelize);
db.Rating = require('./rating')(sequelize, Sequelize);

// Associations
db.User.hasMany(db.Store, { foreignKey: 'owner_id' });
db.Store.belongsTo(db.User, { foreignKey: 'owner_id' });

db.User.hasMany(db.Rating, { foreignKey: 'user_id' });
db.Store.hasMany(db.Rating, { foreignKey: 'store_id' });
db.Rating.belongsTo(db.User, { foreignKey: 'user_id' });
db.Rating.belongsTo(db.Store, { foreignKey: 'store_id' });

module.exports = db; 