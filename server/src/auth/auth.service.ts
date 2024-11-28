import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto, SigninDto } from '@/auth/dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(
      dto.password,
      Number(process.env.SALT_ROUNDS || 10),
    );

    let role;

    switch (dto.role) {
      case 'seller':
        role = Role.SELLER;
        break;
      case 'buyer':
        role = Role.BUYER;
        break;
      case 'approver':
        role = Role.APPROVER;
        break;
      default:
        role = Role.BUYER;
        break;
    }

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role,
      },
    });

    return user;
  }

  async signin(dto: SigninDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid password');
    }

    const token = await this.jwtService.signAsync({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    delete user.password;

    return { user, token };
  }

  async logout() {}
}
