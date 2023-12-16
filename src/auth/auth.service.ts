import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LogInDto } from 'src/DTO';
import { CreateUser } from 'src/interfaces';
import { UserDocument, UserModel } from 'src/schemas';
import * as argon from 'argon2'

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(UserModel.name)
        private userModel: Model<UserDocument>,
        private jwt: JwtService,
        private config: ConfigService
    ) { }

    async signUp(signUp: CreateUser) {
        const user = await this.userModel.findOne({ email: signUp.email }).exec()
        if (user) {
            throw new BadRequestException('Email already exists, please sign in')
        }
        (await this.userModel.create({ ...signUp })).save()
        return signUp
    }

    async logIn(logIn: LogInDto) {
        const user = await this.userModel.findOne({ email: logIn.email }).exec()
        if (!user) {
            throw new NotFoundException('Email does not exist, please create an account')
        }
        const pwMatches = await argon.verify(user.password, logIn.password)
        if (!pwMatches) {
            throw new ForbiddenException("Password incorrect")
        }
        delete user.password
        return this.signToken(user._id, user.email, user.firstName)
    }

    async signToken(userId: any, email: string, firstName: string): Promise<{ accessToken: string }> {
        const payload = {
            userId, email, firstName
        }
        const secret = this.config.get('JWT_SECRET')

        const token = await this.jwt.signAsync(payload, { expiresIn: '24h', secret: secret })

        return {
            accessToken: token
        }
    }
}
