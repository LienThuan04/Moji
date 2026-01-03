import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ConversationService } from "src/conversation/conversation.service";
import { CHECK_GROUP_MEMBERSHIP } from "src/decorator/checkGroupMemberShip.decorator";


@Injectable()
export class CheckGroupMemberShipGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private conversationService: ConversationService,

    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        // 1. Lấy metadata từ @CheckGroupMembership decorator
        // Nếu handler không được decorate với @CheckGroupMembership, config sẽ là undefined
        const config = this.reflector.get(CHECK_GROUP_MEMBERSHIP, context.getHandler());
        // 2. Nếu không có metadata, tức là endpoint không yêu cầu kiểm tra group membership
        // → cho phép request thông qua (return true)
        if (!config) {
            return true;
        }
        // 3. Lấy HTTP request object
        const request = context.switchToHttp().getRequest();
        // 4. Lấy conversationId từ body/param/query
        let conversationId: string = '';
        if (config.recipientIdSource === 'param') {
            // Lấy từ URL param: GET /api/message/:conversationId
            conversationId = request.params?.[config.fieldName];
        }
        else if (config.recipientIdSource === 'query') {
            // Lấy từ query string: GET /api/message?conversationId=123
            conversationId = request.query?.[config.fieldName];
        }
        else if (config.recipientIdSource === 'body') {
            conversationId = request.body?.[config.fieldName];
        }

        // 5. Lấy senderId từ request.user._id
        const senderId = request.user?._id;
        // 6. Kiểm tra senderId có trong participants của conversationId không
        const conversation = await this.conversationService.findOne(conversationId); // Lấy conversation từ database

        if (!conversation) {
            throw new BadRequestException('Conversation not found');
        }
        const isMember = await this.conversationService.isUserInConversation(conversationId, senderId);
        if (!isMember) {
            throw new BadRequestException('User is not a member of the group conversation');
        }
        request.conversation = conversation; // Gán conversationId vào request để sử dụng sau này
        return true;
    }
}
