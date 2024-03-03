import {
    INPUT_PHONE_MAX_LENGTH,
    URL_MAX_LENGTH,
} from './../../common/constants';
import { INPUT_TEXT_MAX_LENGTH } from '../../common/constants';
import { JoiValidate } from '../../common/decorators/validator.decorator';
import { UserOrderBy } from './user.constant';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import Joi from '../../plugins/joi';
import { CommonListQuery } from '../../common/interfaces';

export class CreateUserDto {
    @ApiProperty({
        type: String,
        maxLength: URL_MAX_LENGTH,
        default: 'avatar',
    })
    @JoiValidate(Joi.string().trim().max(URL_MAX_LENGTH).required())
    avatar: string;

    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: 'name',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).required())
    name: string;

    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: 'email',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).required())
    email: string;
    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: '2000/01/01',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).required())
    birthday: string;

    @ApiProperty({
        type: String,
        maxLength: INPUT_PHONE_MAX_LENGTH,
        default: '0123456789',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_PHONE_MAX_LENGTH).required())
    phone: string;
    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: 'user',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH))
    role: string;
}

export class UpdateUserDto {
    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: 'User name',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).required())
    name: string;
    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: 'Email',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).required())
    email: string;
    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: 'Birthday',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).required())
    birthday: string;
    @ApiProperty({
        type: String,
        maxLength: INPUT_PHONE_MAX_LENGTH,
        default: 'Phone',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_PHONE_MAX_LENGTH).required())
    phone: string;
    @ApiProperty({
        type: String,
        maxLength: URL_MAX_LENGTH,
        default: 'Avatar',
    })
    @JoiValidate(Joi.string().trim().max(URL_MAX_LENGTH).required())
    avatar: string;
}

export class GetUserListQuery extends CommonListQuery {
    @ApiPropertyOptional({
        enum: UserOrderBy,
        description: 'Which field used to sort',
        default: UserOrderBy.UPDATED_AT,
    })
    @JoiValidate(
        Joi.string()
            .valid(...Object.values(UserOrderBy))
            .optional(),
    )
    orderBy?: UserOrderBy;

    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: "User'name for filter",
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).optional())
    name?: string;
    role?: string;
    email?: string;
}
