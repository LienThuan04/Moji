export interface IUser {
  _id: string;
  username: string;
  email: string;
  displayName: string;
  phone?: string;
  avatarUrl?: string;
  avatarId?: string;
  bio?: string;
}