import Type from './Type';
import Validation, { ErrorTuple, IdentifierPath } from '../Validation';
export default class UndefinedLiteralType extends Type<undefined> {
    typeName: string;
    errors(validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void>;
    accepts(input: any): boolean;
    toString(): string;
}
