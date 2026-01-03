import { SetMetadata } from '@nestjs/common';

export const CHECK_GROUP_MEMBERSHIP = 'checkGroupMembership';
export const CheckGroupMembership = (recipientIdSource: 'body' | 'param' | 'query' = 'body', fieldName: string = 'recipientId') => {
  return SetMetadata(CHECK_GROUP_MEMBERSHIP, { recipientIdSource, fieldName });
};