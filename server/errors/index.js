const CustomAPIError = require("./custom-error");
const UnauthorizedError = require("./unauthorized");
const NotFoundError = require("./not-found");
const BadRequestError = require("./bad-request");
const ServerError = require("./server-error");

module.exports = {
  CustomAPIError,
  UnauthorizedError,
  NotFoundError,
  BadRequestError,
  ServerError,
};
