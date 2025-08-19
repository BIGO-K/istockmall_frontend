import ApplicationError from './ApplicationError';
/**
 * 요청 인자 불량 예외 (제공자 책임)
 */
class BadArgumentsError extends ApplicationError {
  argumentName?: string
  argumentValue?: any

  constructor(message?: string, argumentName?: string, argumentValue?: any) {
    super(message) // (1)
    this.name = 'BadArgumentsError' // (2)
    this.argumentName = argumentName
    this.argumentValue = argumentValue
  }
}

export default BadArgumentsError
