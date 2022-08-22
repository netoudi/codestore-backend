import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { EntityNotFoundError } from 'typeorm';
import dataSource from '../database/data-source';

export function Exists(
  entityClass: any,
  field = 'id',
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'Exists',
      constraints: [entityClass, field],
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: ExistsRule,
    });
  };
}

@ValidatorConstraint({ name: 'Exists', async: true })
export class ExistsRule implements ValidatorConstraintInterface {
  async validate(value: string, args: ValidationArguments) {
    if (!value) {
      return false;
    }
    try {
      const [entityClass, field] = args.constraints;
      if (!dataSource.isInitialized) await dataSource.initialize();
      const repository = dataSource.getRepository(entityClass);
      const result = await repository.findOne({
        where: {
          [field]: value,
        },
      });
      if (!result) {
        throw new EntityNotFoundError(entityClass, value);
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} not found`;
  }
}
