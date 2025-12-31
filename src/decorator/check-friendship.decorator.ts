import { SetMetadata } from '@nestjs/common';

// Key để lưu metadata của decorator này
export const CHECK_FRIENDSHIP_KEY = 'checkFriendship';

/**
 * Decorator để kiểm tra xem 2 người dùng có phải là bạn bè không
 * 
 * CÁCH HOẠT ĐỘNG:
 * 1. Decorator này gán metadata lên handler (method) của controller
 * 2. Metadata chứa thông tin: source (body/param/query) và fieldName (tên field)
 * 3. CheckFriendshipGuard sẽ đọc metadata này để biết lấy recipientId từ đâu
 * 4. Guard sẽ kiểm tra friendship trước khi method được execute
 * 
 * CÁCH SỬ DỤNG:
 * @Post('direct')
 * @UseGuards(CheckFriendshipGuard)
 * @CheckFriendship('body', 'recipientId')  // Lấy recipientId từ request body
 * async sendDirect(@Body() createMessageDto: CreateMessageDto, @User() user: IUser) {
 *   ...
 * }
 * 
 * @Param('userId')
 * @UseGuards(CheckFriendshipGuard)
 * @CheckFriendship('param', 'userId')  // Lấy userId từ URL param
 * async getConversation(@Param('userId') userId: string) {
 *   ...
 * }
 * 
 * @param recipientIdSource - Source của recipientId: 'body' | 'param' | 'query' (mặc định: 'body')
 * @param fieldName - Tên của field chứa recipientId (mặc định: 'recipientId')
 * @returns SetMetadata result
 */
export const CheckFriendship = (recipientIdSource: 'body' | 'param' | 'query' = 'body', fieldName: string = 'recipientId') => {
  return SetMetadata(CHECK_FRIENDSHIP_KEY, { source: recipientIdSource, fieldName });
};
