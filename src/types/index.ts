import {
  ValidateFunction,
  IDefaultOption,
  Options,
  IStringOption,
  IObjectOption,
  IArrayOption,
  IErrorObject,
} from "../definitions";
import {
  formatParameter,
  getDeep,
  isEqualTo,
  isNull,
  parseFunctionWrapper,
  parseType,
} from "../util/index";

import { validateAny } from "./any";
import { validateArray } from "./array";
import { validateBoolean } from "./boolean";
import { validateNumber } from "./number";
import { validateObject } from "./object";
import { validateString } from "./string";
import { validateDate } from "./date";

export const ExpectType = {
  any: "any",
  number: "number",
  boolean: "boolean",
  string: "string",
  array: "array",
  object: "object",
  date: "date",
} as const;

export type ExpectTypes = keyof typeof ExpectType;

export const validate: ValidateFunction = (props) => {
  const { type, parameter, input, schema, visitedParams } = props;
  let { options, value } = props;

  if (typeof options === "string") options = { type } as IDefaultOption;

  const {
    parse,
    equalTo,
    requiredIf,
    allowNull,
    condition,
    errorCode,
    allowNullErrorCode,
    conditionErrorCode,
    equalToErrorCode,
  } = options;

  const initialValue = value;
  if (parse) {
    value =
      typeof parse === "function"
        ? parseFunctionWrapper({ value, parse })
        : parseType({ value, type });
  }

  const validation = validateType({
    type,
    parameter,
    value,
    options,
    input,
    schema,
    visitedParams,
  });

  value = "parsed" in validation ? validation.parsed : value;

  const isNullValue = isNull(value) || isNull(initialValue);
  const isAllowNull =
    typeof allowNull === "function"
      ? allowNullWrapper({ value, allowNull })
      : allowNull;
  const notRequired = requiredIf && isNull(getDeep(requiredIf, input));
  const nullAllowed = isAllowNull || notRequired;

  if (isNullValue && !nullAllowed) {
    return {
      valid: false,
      error:
        allowNullErrorCode ||
        errorCode ||
        `Expected parameter ${formatParameter(
          parameter
        )} to be of type ${type} but it was ${
          isNull(initialValue)
            ? JSON.stringify(initialValue)
            : JSON.stringify(value)
        }`,
    };
  }

  if (!validation.valid && (!isNullValue || !nullAllowed)) {
    return {
      valid: false,
      error:
        validation.error ||
        errorCode ||
        `Expected parameter ${formatParameter(
          parameter
        )} to be of type ${type} but it was ${JSON.stringify(value)}`,
    };
  }

  const parsed =
    nullAllowed && isNull(initialValue) && !validation.valid
      ? initialValue
      : value;

  if (
    equalTo &&
    !isEqualTo({
      type,
      value: parsed,
      parameter,
      equalTo,
      input,
      schema,
      visitedParams,
      validate,
    })
  ) {
    return {
      valid: false,
      error:
        equalToErrorCode ||
        errorCode ||
        `Expected parameter ${formatParameter(
          parameter
        )} to be equal to ${JSON.stringify(equalTo)}.`,
    };
  }

  if (nullAllowed && isNullValue) return { valid: true, parsed };

  if (typeof condition === "function") {
    let valid = false;
    try {
      valid = condition(value as any);
    } catch (error) {
      // Do nothing
    }

    if (!valid) {
      return {
        valid: false,
        error:
          conditionErrorCode ||
          errorCode ||
          `Expected parameter ${formatParameter(parameter)} to meet condition`,
      };
    }
  }

  return { valid: true, parsed };
};

function allowNullWrapper({
  value,
  allowNull,
}: {
  value: any;
  allowNull: (value: any) => boolean;
}) {
  try {
    return allowNull(value);
  } catch (error) {
    return false;
  }
}

function validateType<T extends ExpectTypes>({
  type,
  ...props
}: {
  type: T;
  parameter: string | number | Array<string | number>;
  value: unknown;
  options: Options<T>;
  input?: unknown;
  schema: Record<string, any>;
  visitedParams: Array<string | number>;
}):
  | { valid: true; parsed?: any }
  | { valid: false; error?: string | IErrorObject } {
  switch (type) {
    case "any":
      return validateAny();
    case "boolean":
      return validateBoolean(props);
    case "number":
      return validateNumber(props);
    case "date":
      return validateDate(props);
    case "string":
      return validateString({
        ...props,
        options: props.options as IStringOption,
      });
    case "object":
      return validateObject({
        ...props,
        validate,
        options: props.options as IObjectOption,
      });
    case "array":
      return validateArray({
        ...props,
        validate,
        options: props.options as IArrayOption,
      });
    default:
      throw new Error(
        `Invalid type ${JSON.stringify(type)} for parameter ${formatParameter(
          props.parameter
        )}`
      );
  }
}
