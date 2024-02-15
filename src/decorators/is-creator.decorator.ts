import { SetMetadata } from '@nestjs/common';
export const IS_CREATOR = 'is_creator';
export const isCreator = () => SetMetadata(IS_CREATOR, true);
