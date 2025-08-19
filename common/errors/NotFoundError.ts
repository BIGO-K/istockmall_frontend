import ApplicationError from './ApplicationError';
/**
 * 커스텀 NOTFOUND 예외 (제공자 책임)
 */
class NotFoundError extends ApplicationError {
  title: string;
    
  constructor(message?: string, title?: string) {
      super(message) // (1)
      this.title = title || '페이지를 찾을 수 없습니다';
      this.name = "NotFoundError"      
    }
}

export default NotFoundError
