import { ExpectTypes } from "./types";

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

type DefaultTypes = Exclude<ExpectTypes, "array" | "object" | "string">;
export interface IDefaultOption<T extends DefaultTypes = DefaultTypes> {
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

export interface IArrayOption extends Omit<IDefaultOption, "type" | "parse"> {
  type: "array";
  parse?: boolean | ((x: any) => any[]);
  convert?: boolean;
  items?: ExpectTypes | Options | ((x: any) => ExpectTypes | Options);
}

export interface IObjectOption extends Omit<IDefaultOption, "type" | "parse"> {
  type: "object";
  parse?: boolean | ((x: any) => any);
  keys?: { [key: string]: ExpectTypes | Options };
  strictKeyCheck?: boolean;
}

export interface IStringOption extends Omit<IDefaultOption, "type" | "parse"> {
  type: "string";
  parse?: boolean | ((x: any) => string);
  strictEntities?: boolean;
  allowed?: string[];
  blockUnsafe?: boolean;
  blockUnsafeErrorCode?: string;
  errorCode?: string;
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
  ? undefined | null
  : O extends { allowNull: false }
  ? never
  : O extends { allowNull: boolean | true | ((x: any) => boolean) }
  ? undefined | null
  : never;
