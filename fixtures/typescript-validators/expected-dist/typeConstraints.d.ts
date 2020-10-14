import Type from './types/Type';
import Validation, { ErrorTuple, IdentifierPath } from './Validation';
export declare type TypeConstraint<T> = (input: T) => string | null | undefined;
export declare type ConstrainableType<T> = Type<T> & {
    constraints: TypeConstraint<T>[];
};
/**
 * Add constraints to the given subject type.
 */
export declare function addConstraints<T>(subject: ConstrainableType<T>, ...constraints: TypeConstraint<T>[]): void;
/**
 * Collect any errors from constraints on the given subject type.
 */
export declare function collectConstraintErrors(subject: ConstrainableType<any>, validation: Validation<any>, path: IdentifierPath, ...input: any[]): Generator<ErrorTuple, void, void>;
/**
 * Determine whether the input passes the constraints on the subject type.
 */
export declare function constraintsAccept(subject: ConstrainableType<any>, ...input: any[]): boolean;
