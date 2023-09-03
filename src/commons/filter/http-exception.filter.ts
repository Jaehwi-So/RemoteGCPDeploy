import {
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException) {
    const status = exception.getStatus();
    const message = exception.message;
    console.log('============ Exception Occured =============');
    console.log(`CODE : ${status}, Message : ${message}`);
    console.log('============================================');

    //Message를 다르게
    if (status === HttpStatus.UNAUTHORIZED) {
      return new HttpException('인증 실패!!', status);
    }
  }
}
