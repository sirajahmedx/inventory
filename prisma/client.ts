import { connectToDatabase } from '../models';

// Connect to database
connectToDatabase()
  .then(() => console.log('✅ Database connection established'))
  .catch((error) => console.error('❌ Database connection error:', error));

export { connectToDatabase };
