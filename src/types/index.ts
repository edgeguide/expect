import { ValidateFunction } from "../definitions";

import {
  formatParameter,
  getDeep,
  isEqualTo,
  isNull,
  parseFunctionWrapper,
  parseType
} from "../util";

import { validateAny } from "./any";
import { validateArray } from "./array";
import { validateBoolean } from "./boolean";
import { validateNumber } from "./number";
import { validateObject } from "./object";
import { validateString } from "./string";

const mapTypeValidations: any = {
  any: validateAny,
  number: validateNumber,
  boolean: validateBoolean,
  string: validateString,
  array: validateArray,
  object: validateObject
};

export const validate: ValidateFunction = ({
  type,
  parameter,
  value,
  options,
  actualValues = {},
  expected = {}
}) => {
  if (typeof options === "string") {
    options = { type: options };
  }

  const {
    parse,
    equalTo,
    requiredIf,
    allowNull,
    condition,
    errorCode,
    allowNullErrorCode,
    conditionErrorCode,
    equalToErrorCode
  } = options;

  if (
    typeof type !== "string" ||
    !Object.prototype.hasOwnProperty.call(mapTypeValidations, type)
  ) {
    throw new Error(
      `Invalid type ${JSON.stringify(type)} for parameter ${formatParameter(
        parameter
      )}`
    );
  }

  const initialValue = value;
  if (parse) {
    value =
      typeof parse === "function"
        ? parseFunctionWrapper({ value, parse })
        : parseType({ value, type });
  }

  const validation = mapTypeValidations[type]({
    parameter,
    value,
    actualValues,
    options,
    validate
  });

  value = Object.prototype.hasOwnProperty.call(validation, "parsed")
    ? validation.parsed
    : value;

  const isNullValue = isNull(value) || isNull(initialValue);
  const isAllowNull =
    typeof allowNull === "function"
      ? allowNullWrapper({ value, allowNull })
      : allowNull;
  const notRequired = requiredIf && isNull(getDeep(requiredIf, actualValues));
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
        }`
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
        )} to be of type ${type} but it was ${JSON.stringify(value)}`
    };
  }

  const parsed =
    nullAllowed && isNull(initialValue) && !validation.valid
      ? initialValue
      : value;

  if (
    equalTo &&
    !isEqualTo({
      value: parsed,
      equalTo,
      actualValues,
      expected,
      validate
    })
  ) {
    return {
      valid: false,
      error:
        equalToErrorCode ||
        errorCode ||
        `Expected parameter ${formatParameter(
          parameter
        )} to be equal to ${JSON.stringify(equalTo)}.`
    };
  }

  if (nullAllowed && isNullValue) {
    return { valid: true, parsed };
  }

  if (typeof condition === "function") {
    let valid = false;
    try {
      valid = condition(value);
    } catch (error) {
      // Do nothing
    }

    if (!valid) {
      return {
        valid: false,
        error:
          conditionErrorCode ||
          errorCode ||
          `Expected parameter ${formatParameter(parameter)} to meet condition`
      };
    }
  }

  return { valid: true, parsed };
};

function allowNullWrapper({
  value,
  allowNull
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
