import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { GetTopicsRequest } from '../models/get-topics-request.interface';
import { Topic } from '../models/topic.interface';
import { environment } from '@/environments/environment';

@Service()
export class TopicsService {
    private http = inject(HttpClient);
    
    private path = `${environment.apiUrl}/api/topics`;

    getTopics(request: GetTopicsRequest = {}) {
        return this.http.get<Topic[]>(this.path, { params: { ...request } });
    }
}
