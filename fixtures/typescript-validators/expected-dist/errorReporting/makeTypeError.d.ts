import Validation from '../Validation';
import RuntimeTypeError from './RuntimeTypeError';
export default function makeTypeError<T>(validation: Validation<T>): RuntimeTypeError | undefined;
