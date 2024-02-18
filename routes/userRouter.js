import express from 'express';
import controllerWrapper from '../helpers/controllerWrapper.js';
import {
  currentUser,
  logOutUser,
  loginUser,
  registerUser,
  updateAvatar,
  updateSubscription,
  verifyUser,
  verifyUserTwo,
} from '../controllers/usersControllers.js';
import validateBody from '../helpers/validateBody.js';
import {
  bodyUserSchema,
  subscriptionUserSchema,
  verifySchema,
} from '../schemas/usersSchemas.js';
import { authMiddlewares } from '../middlewares/authMiddlewares.js';
import { uploadAvatar } from '../middlewares/updateAvatarMiddlewares.js';

const usersRouter = express.Router();

usersRouter.post(
  '/register',
  validateBody(bodyUserSchema),
  controllerWrapper(registerUser)
);

usersRouter.post(
  '/login',
  validateBody(bodyUserSchema),
  controllerWrapper(loginUser)
);

usersRouter.post('/logout', authMiddlewares, controllerWrapper(logOutUser));

usersRouter.get('/current', authMiddlewares, controllerWrapper(currentUser));

usersRouter.patch(
  '/',
  authMiddlewares,
  validateBody(subscriptionUserSchema),
  controllerWrapper(updateSubscription)
);

usersRouter.patch(
  '/avatars',
  authMiddlewares,
  uploadAvatar.single('avatar'),
  controllerWrapper(updateAvatar)
);

usersRouter.get('/verify/:verificationToken', controllerWrapper(verifyUser));

usersRouter.post(
  '/verify',
  validateBody(verifySchema),
  controllerWrapper(verifyUserTwo)
);

export default usersRouter;
