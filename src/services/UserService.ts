import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';
import { UserData } from '../types';
import { Repository } from 'typeorm';

export class UserService {
  constructor(private userRepository: Repository<User>) {}

  async create({ firstName, lastName, email, password }: UserData) {
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.save({ firstName, lastName, email, password });
  }
}
