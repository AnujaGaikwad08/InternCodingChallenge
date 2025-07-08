module.exports = (sequelize, DataTypes) => {
  const Store = sequelize.define('Store', {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(400),
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });
  return Store;
}; 