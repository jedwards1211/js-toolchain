import Type from './Type';
import ObjectTypeProperty from './ObjectTypeProperty';
import Validation, { ErrorTuple, IdentifierPath } from '../Validation';
export default class ObjectType<T extends Record<string, any>> extends Type<T> {
    typeName: string;
    readonly properties: ObjectTypeProperty<keyof T, any>[];
    readonly exact: boolean;
    constructor(properties?: ObjectTypeProperty<keyof T, any>[], exact?: boolean);
    errors(validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void>;
    accepts(input: any): boolean;
    toString(): string;
}
