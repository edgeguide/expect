export type ExpectedType =
  | "any"
  | "number"
  | "boolean"
  | "string"
  | "array"
  | "object";

export interface IErrorObject {
  [key: string]: undefined | string | IErrorObject;
}

export type ValidateFunction = (input: {
  type: ExpectedType;
  parameter: string | number | Array<string | number>;
  value: any;
  options: ExpectedType | Options;
  actualValues?: any;
  expected?: any;
}) => {
  valid: boolean;
  error?: string | IErrorObject;
  parsed?: any;
};

export interface IDefaultOption {
  type: ExpectedType;
  requiredIf?: string | string[];
  allowNull?: boolean | ((x: any) => boolean);
  parse?: boolean | ((x: any) => any);
  equalTo?: string | string[];
  condition?: (x: any) => boolean;
  errorCode?: string;
  allowNullErrorCode?: string;
  equalToErrorCode?: string;
  conditionErrorCode?: string;
}

export interface IArrayOption extends IDefaultOption {
  parse?: boolean | ((x: any) => any[]);
  convert?: boolean;
  items?: ExpectedType | Options | ((x: any) => Options);
}

export interface IObjectOption extends IDefaultOption {
  parse?: boolean | ((x: any) => object);
  keys?: { [key: string]: ExpectedType | Options };
  strictKeyCheck?: boolean;
}

export interface IStringOption extends IDefaultOption {
  parse?: boolean | ((x: any) => string);
  strictEntities?: boolean;
  allowed?: string[];
  blockUnsafe?: boolean;
  blockUnsafeErrorCode?: string;
  errorCode?: string;
  sanitize?: boolean;
}

export type Options =
  | IDefaultOption
  | IArrayOption
  | IObjectOption
  | IStringOption;
