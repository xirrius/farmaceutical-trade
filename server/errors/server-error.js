const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./custom-error");

class ServerError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }
}

module.exports = ServerError;
