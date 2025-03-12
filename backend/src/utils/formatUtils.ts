import YAML from "js-yaml";
import { xml2js, js2xml } from "xml-js";
import { ConversionResult, DataFormat } from "../types";

export const convertData = (
  inputText: string,
  inputFormat: DataFormat,
  outputFormat: DataFormat
): ConversionResult => {
  try {
    if (!inputText.trim()) {
      return { result: "", error: null };
    }

    // First parse input to JavaScript object
    let data: any;

    switch (inputFormat) {
      case "json":
        data = JSON.parse(inputText);
        break;
      case "yaml":
        data = YAML.load(inputText);
        break;
      case "xml":
        const options = { compact: true, ignoreComment: true, spaces: 2 };
        data = xml2js(inputText, options);
        break;
    }

    // Then convert to output format
    let result = "";
    switch (outputFormat) {
      case "json":
        result = JSON.stringify(data, null, 2);
        break;
      case "yaml":
        result = YAML.dump(data);
        break;
      case "xml":
        const options = { compact: true, ignoreComment: true, spaces: 2 };
        result = js2xml(data, options);
        break;
    }

    return { result, error: null };
  } catch (err) {
    return {
      result: "",
      error: `Error converting from ${inputFormat.toUpperCase()} to ${outputFormat.toUpperCase()}: ${
        err instanceof Error ? err.message : String(err)
      }`,
    };
  }
};

export const formatData = (
  inputText: string,
  format: DataFormat
): ConversionResult => {
  try {
    if (!inputText.trim()) {
      return { result: inputText, error: null };
    }

    let result = "";
    switch (format) {
      case "json":
        const parsed = JSON.parse(inputText);
        result = JSON.stringify(parsed, null, 2);
        break;
      case "yaml":
        const yamlObj = YAML.load(inputText);
        result = YAML.dump(yamlObj);
        break;
      case "xml":
        const xmlOptions = { compact: true, ignoreComment: true, spaces: 2 };
        const xmlObj = xml2js(inputText, xmlOptions);
        result = js2xml(xmlObj, xmlOptions);
        break;
    }

    return { result, error: null };
  } catch (err) {
    return {
      result: inputText,
      error: `Error formatting ${format.toUpperCase()}: ${
        err instanceof Error ? err.message : String(err)
      }`,
    };
  }
};
