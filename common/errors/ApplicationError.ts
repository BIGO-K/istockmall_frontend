/**
 * 어플리케이션 내의 핸들링된 오류 처리
 * !모든 커스텀 예외는 최상위 상속으로 ApplicationError를 가져야 함
 */
class ApplicationError extends Error {
  constructor(message?: string) {
    super(message) // (1)
    this.name = 'ApplicationError' // (2)    
  }
}

export default ApplicationError