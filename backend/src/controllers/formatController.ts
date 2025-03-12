import { Request, Response } from "express";
import { DataFormat } from "../types";
import * as formatUtils from "../utils/formatUtils";
import * as responseUtils from "../utils/responseUtils";

export const convertFormat = (req: Request, res: Response): void => {
  const { inputText, inputFormat, outputFormat } = req.body;

  if (!inputText || !inputFormat || !outputFormat) {
    responseUtils.errorResponse(
      res,
      "Missing required fields: inputText, inputFormat, outputFormat"
    );
    return;
  }

  if (
    !["json", "yaml", "xml"].includes(inputFormat) ||
    !["json", "yaml", "xml"].includes(outputFormat)
  ) {
    responseUtils.errorResponse(
      res,
      "Invalid format. Supported formats: json, yaml, xml"
    );
    return;
  }

  const { result, error } = formatUtils.convertData(
    inputText,
    inputFormat as DataFormat,
    outputFormat as DataFormat
  );

  if (error) {
    responseUtils.errorResponse(res, error);
    return;
  }

  responseUtils.successResponse(res, { result });
};

export const beautifyFormat = (req: Request, res: Response): void => {
  const { inputText, format } = req.body;

  if (!inputText || !format) {
    responseUtils.errorResponse(
      res,
      "Missing required fields: inputText, format"
    );
    return;
  }

  if (!["json", "yaml", "xml"].includes(format)) {
    responseUtils.errorResponse(
      res,
      "Invalid format. Supported formats: json, yaml, xml"
    );
    return;
  }

  const { result, error } = formatUtils.formatData(
    inputText,
    format as DataFormat
  );

  if (error) {
    responseUtils.errorResponse(res, error);
    return;
  }

  responseUtils.successResponse(res, { result });
};
