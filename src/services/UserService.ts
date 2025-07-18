import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';
import { LoginData, UserData } from '../types';
import { Repository } from 'typeorm';
import createHttpError, { HttpError } from 'http-errors';
import { Roles } from '../constants';
import bcrypt from 'bcrypt';

export class UserService {
  constructor(private userRepository: Repository<User>) {}

  async create({ firstName, lastName, email, password }: UserData) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await this.userRepository.findOne({
      where: { email: email },
    });

    if (user) {
      const err = createHttpError(400, 'Email already exists');
      throw err;
    }

    try {
      //const userRepository = AppDataSource.getRepository(User);

      return await this.userRepository.save({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: Roles.Customer,
      });
    } catch (err) {
      //console.log('d');
      const error = createHttpError(
        500,
        'Failed to store the data in the database'
      );
      throw error;
    }
  }

  async findByEmail({ email }: { email: string }) {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });

    return user;
  }

  async findById(id: number) {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });

    return user;
  }

  async login({ email, password }: LoginData) {
    const saltRounds = 10;
    //const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await this.userRepository.findOne({
      where: { email: email },
    });

    if (user) {
      console.log('p');
      const b = await bcrypt.compare(password, user.password);

      if (b) {
        console.log('mammay');
      }
    }

    try {
      //const userRepository = AppDataSource.getRepository(User);
    } catch (err) {
      //console.log('d');
      const error = createHttpError(
        500,
        'Failed to store the data in the database'
      );
      throw error;
    }
  }
}
