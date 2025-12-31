import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FriendService } from 'src/friend/friend.service';
import { CHECK_FRIENDSHIP_KEY } from 'src/decorator/check-friendship.decorator';

/**
 * CheckFriendshipGuard - Guard để kiểm tra xem 2 người dùng có phải là bạn bè
 * 
 * QUI TRÌNH HOẠT ĐỘNG:
 * 1. Đọc metadata từ @CheckFriendship decorator trên handler
 * 2. Lấy user ID từ request.user (do middleware/passport đã set)
 * 3. Lấy recipientId từ body/param/query (tùy vào decorator config)
 * 4. Normalize cả 2 ID (sắp xếp để userA < userB)
 * 5. Gọi FriendService.CheckFriendship() để kiểm tra xem có phải bạn bè không
 * 6. Nếu không phải bạn bè → throw BadRequestException
 * 7. Nếu là bạn bè → return true để cho phép request tiếp tục
 * 
 * FLOW:
 * Client gửi request
 *     ↓
 * NestJS middleware/guards được execute theo thứ tự
 *     ↓
 * CheckFriendshipGuard.canActivate() được gọi
 *     ↓
 * Đọc @CheckFriendship metadata (source + fieldName)
 *     ↓
 * Lấy sender ID từ request.user._id
 *     ↓
 * Lấy recipient ID từ body/param/query
 *     ↓
 * Kiểm tra friendship trong database
 *     ↓
 * Nếu OK → return true (cho phép handler execute)
 * Nếu NOT OK → throw BadRequestException (ngừng tại đây)
 */
@Injectable()
export class CheckFriendshipGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private friendService: FriendService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Lấy metadata từ @CheckFriendship decorator
    // Nếu handler không được decorate với @CheckFriendship, config sẽ là undefined
    const config = this.reflector.get(CHECK_FRIENDSHIP_KEY, context.getHandler());
    
    // 2. Nếu không có metadata, tức là endpoint không yêu cầu kiểm tra friendship
    // → cho phép request thông qua (return true)
    if (!config) {
      return true;
    }

    // 3. Lấy HTTP request object
    const request = context.switchToHttp().getRequest();
    
    // 4. Lấy user từ request
    // User được set bởi Passport/JWT middleware ở authentication stage
    const user = request?.user;

    // 5. Kiểm tra user có tồn tại và có _id không
    if (!user || !user._id) {
      throw new BadRequestException('User not found in request');
    }

    // 6. Lấy recipientId từ source (body, param, hoặc query)
    // config.source: 'body' | 'param' | 'query'
    // config.fieldName: tên của field (mặc định 'recipientId')
    let recipientId: string = '';

    if (config.source === 'body') {
      // Lấy từ request body: POST /api/message/direct { recipientId: "123", ... }
      recipientId = request.body?.[config.fieldName];
    } else if (config.source === 'param') {
      // Lấy từ URL param: GET /api/message/:recipientId
      recipientId = request.params?.[config.fieldName];
    } else if (config.source === 'query') {
      // Lấy từ query string: GET /api/message?recipientId=123
      recipientId = request.query?.[config.fieldName];
    }

    // 7. Kiểm tra recipientId có tồn tại không
    if (!recipientId) {
      throw new BadRequestException(`${config.fieldName} not found in ${config.source}`);
    }

    // 8. Lấy sender ID (người gửi) và receiver ID (người nhận)
    const senderId = user._id.toString();
    const receiverId = recipientId.toString();

    // 9. Normalize IDs
    // Lý do: Friendship được lưu trong database dưới dạng (userA, userB)
    // Để đảm bảo consistency, ta sắp xếp 2 ID sao cho userA < userB
    // Ví dụ: checkFriendship("user2", "user1") 
    //        → normalize thành ("user1", "user2")
    let userA = senderId;
    let userB = receiverId;
    if (userA > userB) {
      [userA, userB] = [userB, userA]; // Swap nếu userA > userB
    }

    // 10. Kiểm tra xem 2 người có phải là bạn bè không
    const areFriends = await this.friendService.CheckFriendship(userA, userB);

    // 11. Xử lý kết quả
    // Nếu không phải bạn bè → throw exception (request sẽ bị ngừng tại đây)
    if (!areFriends) {
      throw new BadRequestException('You can only send messages to users who are your friends.');
    }
    // 12. Nếu là bạn bè → return true để cho phép handler được execute
    return true;
  }
}
