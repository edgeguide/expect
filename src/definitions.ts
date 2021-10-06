import { ExpectTypes } from "./types/index";

export type Validation<
  Schema extends Record<string, Options | ExpectTypes> | Record<string, any>
> =
  | {
      /**
       * Indicates whether the validation was successful
       */
      isValid: true;
      /**
       * Indicates whether the validation was successful
       * @deprecated wereMet() is replaced with isValid
       */
      wereMet(): true;
      /**
       * Returns parsed input for the properties that passed the validation
       */
      getParsed(): Writeable<
        { [K in keyof OmitUndefined<Schema>]: OptionsValue<Schema[K]> }
      >;
      /**
       * Returns errors for the properties that failed the validation
       */
      errors(): Record<string, never>;
    }
  | {
      /**
       * Indicates whether the validation was successful
       */
      isValid: false;
      /**
       * Indicates whether the validation was successful
       * @deprecated wereMet() is replaced with isValid
       */
      wereMet(): false;
      /**
       * Returns parsed input for the properties that passed the validation
       */
      getParsed(): Writeable<
        { [K in keyof OmitUndefined<Schema>]?: OptionsValue<Schema[K]> }
      >;
      /**
       * Returns errors for the properties that failed the validation
       */
      errors(): { [K in keyof OmitUndefined<Schema>]?: Errors<Schema[K]> };
    };

export type UndefinedProperties<T> = {
  [K in keyof T]: T[K] extends undefined ? K : never;
}[keyof T];

export type OmitUndefined<T> = Omit<T, UndefinedProperties<T>>;

export type Writeable<T> = { -readonly [K in keyof T]: T[K] };

export interface IErrorObject {
  [key: string]: string | IErrorObject;
}

interface IValidateFunctionParams<T extends ExpectTypes> {
  type: T;
  parameter: string | number | Array<string | number>;
  value: unknown;
  options: T | Options<T>;
  input?: unknown;
  schema: Record<string, any>;
  visitedParams: Array<string | number>;
}

export type ValidateFunction<T extends ExpectTypes = ExpectTypes> = (
  params: IValidateFunctionParams<T>
) =>
  | { valid: true; parsed: TypeValue<T> }
  | { valid: false; error: string | IErrorObject };

export interface IDefaultOption<T extends ExpectTypes = ExpectTypes> {
  type: T;
  requiredIf?: string | string[];
  allowNull?: boolean | ((x: any) => boolean);
  parse?: boolean | ((x: any) => TypeValue<T>);
  equalTo?: string | string[];
  condition?: (x: TypeValue<T>) => boolean;
  errorCode?: string;
  allowNullErrorCode?: string;
  equalToErrorCode?: string;
  conditionErrorCode?: string;
}

export interface IArrayOption extends IDefaultOption<"array"> {
  convert?: boolean;
  items?: ExpectTypes | Options | ((x: any) => ExpectTypes | Options);
}

export interface IObjectOption extends IDefaultOption<"object"> {
  keys?: { [key: string]: undefined | ExpectTypes | Options };
  strictKeyCheck?: boolean;
}

export interface IStringOption extends IDefaultOption<"string"> {
  strictEntities?: boolean;
  allowed?: string[];
  blockUnsafe?: boolean;
  blockUnsafeErrorCode?: string;
  sanitize?: boolean;
}

export type Options<T extends ExpectTypes = ExpectTypes> = T extends "string"
  ? IStringOption
  : T extends "object"
  ? IObjectOption
  : T extends "array"
  ? IArrayOption
  : IDefaultOption;

export type TypeValue<T extends ExpectTypes> = T extends "number"
  ? number
  : T extends "boolean"
  ? boolean
  : T extends "string"
  ? string
  : T extends "array"
  ? any[]
  : T extends "date"
  ? Date
  : T extends "object"
  ? Record<string, any>
  : any;

export type OptionsValue<O> = O extends ExpectTypes
  ? TypeValue<O>
  : O extends Options
  ?
      | CheckNull<O>
      | (O extends IArrayOption
          ? O["items"] extends (...args: any) => infer R
            ? OptionsValue<R>[]
            : OptionsValue<O["items"]>[]
          : O extends IObjectOption
          ? O["keys"] extends IObjectOption["keys"]
            ? {
                [K in keyof OmitUndefined<O["keys"]>]: OptionsValue<
                  O["keys"][K]
                >;
              }
            : Record<string, any>
          : O extends IDefaultOption | IStringOption
          ? TypeValue<O["type"]>
          : any)
  : any;

export type CheckNull<O extends Options> = O extends {
  requiredIf: string | string[];
}
  ? undefined | null | ""
  : O extends { allowNull: false }
  ? never
  : O extends { allowNull: boolean | true | ((x: any) => boolean) }
  ? undefined | null | ""
  : never;

export type Errors<O> = O extends "array"
  ? string | { [key: number]: string | IErrorObject }
  : O extends "object"
  ? string | IErrorObject
  : O extends IArrayOption
  ? O["items"] extends (...args: any) => infer R
    ? string | { [key: number]: Errors<R> }
    : string | { [key: number]: Errors<O["items"]> }
  : O extends IObjectOption
  ? O["keys"] extends IObjectOption["keys"]
    ? string | { [K in keyof OmitUndefined<O["keys"]>]: Errors<O["keys"][K]> }
    : string | IErrorObject
  : O extends ExpectTypes | Options
  ? string | undefined
  : any;
