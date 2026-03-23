export class ApiResponse<T> {
  success: boolean
  data?: T
  message?: string

  constructor(success: boolean, data?: T, message?: string) {
    this.success = success
    this.data = data
    this.message = message
  }

  static success<T>(data: T, message = "Success") {
    return new ApiResponse<T>(true, data, message)
  }

  static error(message: string) {
    return new ApiResponse<null>(false, undefined, message)
  }
}