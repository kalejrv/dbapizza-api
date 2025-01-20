import { User } from '../../src/types';

declare global {
  namespace Express {
    interface Request {
      userAuth: User;
    }
  }
}
