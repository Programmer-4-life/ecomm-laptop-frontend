import { MessageResponse } from "../types/api-types"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react"
import { SerializedError } from "@reduxjs/toolkit"
import { NavigateFunction } from "react-router-dom";
import toast from "react-hot-toast";
import moment from "moment";

type ResType =
  | {
    data: MessageResponse;
  }
  | {
    error: FetchBaseQueryError | SerializedError;
  }

export const responseToast = (
  res: ResType,
  navigate: NavigateFunction | null,
  url: string) => {

  if ("data" in res) {
    toast.success(res.data.message)
    if (navigate) {
      navigate(url)
    }
    else if ("error" in res) {
      const error = res.error as FetchBaseQueryError;
      const messageResponse = error.data as MessageResponse;
      toast.error(messageResponse.message)
    }
  }
}

export const getLastMonths = () => {
  const currentDate = moment();

  currentDate.date(1)

  const last6Months: string[] = []
  const last12Months: string[] = []

  for (let i = 0; i < 6; i++) {
    const monthDate = currentDate.clone().subtract(i, "months")
    const monthName = monthDate.format("MMM")
    last6Months.unshift(monthName)
    // unshift adds the element to the beginning of the array
    //    last6Months.push(monthName)
    // push adds the element to the end of the array
  }

  for (let i = 0; i < 12; i++) {
    const monthDate = currentDate.clone().subtract(i, "months")
    const monthName = monthDate.format("MMM")
    last12Months.unshift(monthName)
  }

  return {
    last6Months,
    last12Months
  }
}