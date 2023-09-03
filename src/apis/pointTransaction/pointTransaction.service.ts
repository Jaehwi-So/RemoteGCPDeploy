import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import {
  PointTransaction,
  POINT_TRANSACTION_STATUS_ENUM,
} from './entities/pointTransaction.entity';

@Injectable()
export class PointTransactionService {
  constructor(
    @InjectRepository(PointTransaction)
    private readonly pointTransactionRepository: Repository<PointTransaction>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly connection: Connection, //Typeorm 지원
  ) {}
  async create({ impUid, amount, currentUser }) {
    // T. 트랜잭션 사용을 위해서 queryRunner 연결
    const queryRunner = await this.connection.createQueryRunner();
    await queryRunner.connect();

    // T. 트랜잭션 시작
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      //1. pointTransaction 테이블에 거래기록 생성
      const pointTransaction = this.pointTransactionRepository.create({
        impUid: impUid,
        amount: amount,
        user: currentUser,
        status: POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
      });

      //await this.pointTransactionRepository.save(pointTransaction);
      await queryRunner.manager.save(pointTransaction); //트랜잭션 사용을 위해서는 queryRunner.manager를 통해 IUD

      //2. 유저의 돈 찾아오기
      //T : 베타락을 걸어서 동시 Read를 방지함!! 트랜잭션이 완료될 때 까지 다른 곳에서는 조회가 불가능함
      //const user = await this.userRepository.findOne({ id: currentUser.id });
      const user = await queryRunner.manager.findOne(
        User,
        { id: currentUser.id },
        { lock: { mode: 'pessimistic_write' } }, //SERIALIZABLE 수준일때 베타락 적용가능
      );

      //3. 유저의 돈 업데이트(충전)
      // await this.userRepository.update(
      //   { id: user.id }, //
      //   { point: user.point + amount },
      // );
      const updatedUser = await this.userRepository.create({
        ...user,
        point: user.point + amount,
      });

      await queryRunner.manager.save(updatedUser);

      // T. 트랜잭션 커밋
      await queryRunner.commitTransaction();

      //4. 최종 결과 프론트엔드에 돌려주기
      return pointTransaction;
    } catch (err) {
      console.log(err);
      // T. 트랜잭션 롤백
      await queryRunner.rollbackTransaction();
    } finally {
      // T. queryRunner 연결 종료
      await queryRunner.release();
    }
  }
}
