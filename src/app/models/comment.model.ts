import { User } from "./user.model";

export interface Commentaire {
    _id: string;
    writer: User; // ID de l'utilisateur qui a écrit le commentaire
    text: string;
    replies: Commentaire[];    
    reactions: string[]; // Liste des ID des réactions associées à ce commentaire
    createdAt: Date; // Ajout de la date de création
    likes: number; // Nombre de likes
    dislikes: number; // Nombre de dislikes
  }