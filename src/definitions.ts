import { ExpectTypes } from "./types/index";

export interface IErrorObject {
  [key: string]: string | IErrorObject;
}

export type ValidateFunction<T extends ExpectTypes = ExpectTypes> = (params: {
  type: T;
  parameter: string | number | Array<string | number>;
  value: unknown;
  options: T | Options<T>;
  input?: unknown;
  schema: Record<string, any>;
  visitedParams: Array<string | number>;
}) =>
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
  keys?: { [key: string]: ExpectTypes | Options };
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
      | (O extends IDefaultOption | IStringOption
          ? TypeValue<O["type"]>
          : O extends IArrayOption
          ? O["items"] extends (...args: any) => infer R
            ? OptionsValue<R>[]
            : OptionsValue<O["items"]>[]
          : O extends IObjectOption
          ? O["keys"] extends IObjectOption["keys"]
            ? { [K in keyof O["keys"]]: OptionsValue<O["keys"][K]> }
            : Record<string, any>
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
    ? string | { [K in keyof O["keys"]]: Errors<O["keys"][K]> }
    : string | IErrorObject
  : O extends ExpectTypes | Options
  ? string | undefined
  : any;
