const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgresql://note_n43w_user:coTmKyur7LeVwOao2zLtFESn94plaY7H@dpg-ctq88hpopnds73f4ah3g-a/note_n43w', {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

const Note = sequelize.define('Note', {
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  },
  adminToken: {
    type: DataTypes.STRING,
    defaultValue: () => Math.random().toString(36).substring(2, 15)
  }
});

// Sync the model with the database
sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch(err => console.error('Error syncing database:', err));

// Add this after sequelize initialization
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = Note; 