import {Message} from '../model/user.model';

export interface ApiResponse {
    statusCode: number;
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    messages? : [Message];
}
