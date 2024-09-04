export interface Message {
    _id?: string; // Identifiant du message, optionnel car généré par MongoDB
    chatId: string; // Identifiant du chat auquel le message appartient
    senderId: string; // Identifiant de l'expéditeur du message
    receiverId: String;
    text: string; // Contenu textuel du message
    voiceMessageUrl: string;
    read: boolean;
    createdAt?: Date; // Date de création du message, optionnel car généré par MongoDB
    updatedAt?: Date; // Date de mise à jour du message, optionnel car généré par MongoDB
  }
  