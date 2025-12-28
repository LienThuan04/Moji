export interface IUser {
    _id: string;
    username: string;
    email: string;
    displayName: string;
    avatarUrl?: string;
    avatarId?: string;
    phone?: string;
    bio?: string;
}