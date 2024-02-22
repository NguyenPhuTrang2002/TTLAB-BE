import { INPUT_TEXT_MAX_LENGTH } from '../../common/constants';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JoiValidate } from '../../common/decorators/validator.decorator';
import Joi from '../../plugins/joi';
import { ProductOderBy } from './product.constant';
import { CommonListQuery } from '../../common/interfaces';

export class CreateProductDto {
    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: 'Product name',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).required())
    name: string;

    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: 'Product price',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).required())
    price: string;

    @ApiProperty({
        type: Number,
        default: 0,
    })
    @JoiValidate(Joi.number().min(0).optional())
    quantity: number;

    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: 'Product description',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).required())
    description: string;

    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: 'Product image',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).required())
    image: string;
}

export class UpdateProductDto {
    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: 'Product name',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).required())
    name: string;

    @ApiProperty({
        type: String,
        default: 0,
    })
    @JoiValidate(Joi.number().min(0).optional())
    price: string;

    @ApiProperty({
        type: Number,
        default: 0,
    })
    @JoiValidate(Joi.number().min(0).optional())
    quantity: number;

    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: 'Product description',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).required())
    description: string;

    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: 'Product image',
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).required())
    image: string;
}
export class GetProductListQuery extends CommonListQuery {
    @ApiPropertyOptional({
        enum: ProductOderBy,
        description: 'Which field used to sort',
        default: ProductOderBy.UPDATED_AT,
    })
    @JoiValidate(
        Joi.string()
            .valid(...Object.values(ProductOderBy))
            .optional(),
    )
    orderBy?: ProductOderBy;
    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: "Product'name for filter",
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).optional())
    name?: string;
}
export class GetProductQuery extends CommonListQuery {
    @ApiPropertyOptional({
        enum: ProductOderBy,
        description: 'Which field used to sort',
        default: ProductOderBy.UPDATED_AT,
    })
    @JoiValidate(
        Joi.string()
            .valid(...Object.values(ProductOderBy))
            .optional(),
    )
    orderBy?: ProductOderBy;

    @ApiProperty({
        type: String,
        maxLength: INPUT_TEXT_MAX_LENGTH,
        default: "Product'name for filter",
    })
    @JoiValidate(Joi.string().trim().max(INPUT_TEXT_MAX_LENGTH).optional())
    name?: string;
}
