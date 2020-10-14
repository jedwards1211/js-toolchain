import Validation from '../Validation';
import { ErrorTuple, IdentifierPath } from '../Validation';
/**
 * # Type
 *
 * This is the base class for all types.
 */
export default abstract class Type<T> {
    readonly __type: T;
    typeName: string;
    abstract errors(validation: Validation<any>, path: IdentifierPath, input: any): Generator<ErrorTuple, void, void>;
    abstract accepts(input: any): boolean;
    assert<V extends T>(input: any, prefix?: string, path?: IdentifierPath): V;
    validate(input: any, prefix?: string, path?: IdentifierPath): Validation<T>;
    abstract toString(): string;
}
