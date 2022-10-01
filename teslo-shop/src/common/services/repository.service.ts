import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { NOT_NULL_VIOLATION } from '../codes/postgresql-error.codes';

export abstract class RepositoryService<EntityMap> {
  protected abstract _getConstraintMessage(
    constraint: string,
    entityMap: EntityMap,
  ): string;

  protected _handleError(error: Error, entityMap?: EntityMap): void {
    if (error instanceof QueryFailedError)
      this._handleQueryFailedError(error, entityMap);
    throw new InternalServerErrorException(
      'An error that is not of type QueryFailedError was thrown. Create a custom handler!',
    );
  }

  protected _handleQueryFailedError(
    error: QueryFailedError,
    entityMap?: EntityMap,
  ): void {
    if (entityMap && error.driverError.constraint) {
      const constraint = error.driverError.constraint as string;
      throw new BadRequestException(
        this._getConstraintMessage(constraint, entityMap),
      );
    }
    throw new BadRequestException(this._getCodeMessage(error));
  }

  private _getCodeMessage(error: QueryFailedError): string {
    const code = +error.driverError.code;
    switch (code) {
      case NOT_NULL_VIOLATION: {
        const column = error.driverError.column as string;
        return `Field '${column}' must not be null`;
      }
      default:
        return 'Unhandled PostgreSQL code. Create a custom message!';
    }
  }
}
