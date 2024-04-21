import { isEqual, uniq } from "lodash-es";
import { lowercase } from "./lowercase";

export const transformSearchParams = (
  search: ServerComponentParams,
): TransformedSearchParams => {
  const searchParams = search.searchParams;

  const params: DynamicObject<Array<string>> = {};

  if (!searchParams) {
    return { params: search.params, searchParams: null };
  }

  const keys = Object.keys(searchParams);

  keys.forEach((key) => {
    const value = searchParams[key];

    const values = params[key] ?? [];

    if (value && typeof value === "string") {
      return (params[key] = [
        ...(values.includes(value) ? values : []),
        lowercase(value),
      ]);
    }

    if (value && typeof value !== "string") {
      if (
        value.length === 0 ||
        value.filter((item) => item !== "").length === 0
      )
        return null;

      return (params[key] = [
        ...(isEqual(values, value)
          ? values
          : uniq(value)
              .map(lowercase)
              .filter((item) => item !== "")),
      ]);
    }
  });

  if (Object.keys(params).length === 0) {
    return { params: search.params, searchParams: null };
  }

  return {
    searchParams: params,
    params: search.params,
  };
};
