import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';
import { UserData } from '../types';
import { Repository } from 'typeorm';
import createHttpError, { HttpError } from 'http-errors';
import { Roles } from '../constants';

export class UserService {
  constructor(private userRepository: Repository<User>) {}

  async create({ firstName, lastName, email, password }: UserData) {
    try {
      //const userRepository = AppDataSource.getRepository(User);
      return await this.userRepository.save({
        firstName,
        lastName,
        email,
        password,
        role: Roles.Customer,
      });
    } catch (err) {
      const error = createHttpError(
        500,
        'Failed to store the data in the database'
      );
    }
  }
}
