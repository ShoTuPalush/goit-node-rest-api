import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import contactsRouter from './routes/contactsRouter.js';
import usersRouter from './routes/userRouter.js';

dotenv.config();
const { DB_HOST } = process.env;

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactsRouter);
app.use('/api/users', usersRouter);

app.use((_, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((error, req, res, next) => {
  const { status = 500, message = 'Server error' } = error;
  res.status(status).json({ message });
});

mongoose
  .connect(DB_HOST)
  .then(() => console.log('Database connection successful'))
  .then(() =>
    app.listen(3000, () => {
      console.log('Server is running. Use our API on port: 3000');
    })
  )
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });
