import { MeResponse } from './me-response.interface';

export interface MeUpdateResponse {
    user: MeResponse;
    token: string;
}
