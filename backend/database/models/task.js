module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    userId: {  // Adicionado campo de userId
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return Task;
};
