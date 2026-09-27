import { CanActivate,UnauthorizedException,ForbiddenException ,Injectable} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import { ExecutionContext } from "@nestjs/common";
import { UserRole } from "src/common/common.enums";



@Injectable()
export class DonorGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];

        if(!authHeader){
            throw new UnauthorizedException('Token is missing');
        }

        const token = authHeader.split(' ')[1];
        if(!token){
            throw new UnauthorizedException('Token is missing');
        }

        try{
        const payload = await this.jwtService.verifyAsync(token);
        if(payload.role !== UserRole.DONOR){
            throw new ForbiddenException('Access denied');
        }
        
        request.user = payload;
        return true;
    }catch(error){
    if (error instanceof ForbiddenException) {
        throw error;
    }
    throw new UnauthorizedException('Invalid token');
}

}
}