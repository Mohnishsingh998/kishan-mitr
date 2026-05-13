require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 8080;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully.');

    // Sync models
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Database models synced (dev mode - alter).');
    } else {
      await sequelize.sync();
      console.log('✅ Database models synced (tables created if not exist).');
    }

    app.listen(PORT, () => {
      console.log(`🚀 KrishiMitra API running on http://localhost:${PORT}/api/v1`);
      console.log(`📋 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
