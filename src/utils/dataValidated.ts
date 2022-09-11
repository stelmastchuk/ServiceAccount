import { AppError } from "src/errors/AppError";
const DateFns = require("date-fns");

export const validateDate = (startDate: string, endDate: string): void => {
  const validStart = DateFns.isValid(new Date(startDate));
  const validEnd = DateFns.isValid(new Date(endDate));

  if (!validStart) {
    throw new AppError("Invalid startDate!");
  }

  if (!validEnd) {
    throw new AppError("Invalid endDate!");
  }

  if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
    throw new AppError("StartDate can't be bigger than EndDate!");
  }
};
