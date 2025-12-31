import { Participant } from "src/conversation/schema/participant.schema";

export const updateConversationAfterCreateMessage = (conversation: any, message: any, senderId: string) => {
    conversation.set({
        seenBy: [],
        lastMessageAt: message.createdAt,
        lastMessage: {
            _id: message._id,
            content: message.content,
            senderId,
            createdAt: message.createdAt,
        }
    });

    conversation.participants.forEach((p: Participant) => {
        const memberId = p.userId.toString();
        const isSender = memberId === senderId.toString();
        const prevCount = conversation.unreadCounts.get(memberId) || 0;
        conversation.unreadCounts.set(memberId, isSender ? 0 : prevCount + 1);
    });

    return conversation.save();
}