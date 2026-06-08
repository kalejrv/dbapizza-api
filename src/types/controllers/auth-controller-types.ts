import { User } from "@types";

export type NewUser = Omit<User, 'role' | 'hashPassword' | 'comparePassword'>;
