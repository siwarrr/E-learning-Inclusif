import { User } from "./user.model";

export interface Reclamation {
    _id: string;
    user: User;
    fullname: string;
    message: string;
    date: Date;
    response: string;
    handicapType?: string;
    replying: boolean;
}

