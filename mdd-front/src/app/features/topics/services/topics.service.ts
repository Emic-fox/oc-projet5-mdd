import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '@/environments/environment';
import { GetTopicsRequest } from '../models/get-topics-request.interface';
import { PostSubscriptionResponse } from '../models/post-subscription-response.interface';
import { Topic } from '../models/topic.interface';

@Service()
export class TopicsService {
    private http = inject(HttpClient);
    
    private path = `${environment.apiUrl}/api/topics`;

    getTopics(request: GetTopicsRequest = {}) {
        return this.http.get<Topic[]>(this.path, { params: { ...request } });
    }

    subscribe(topicId: number) {
        return this.http.post<PostSubscriptionResponse>(`${this.path}/${topicId}/subscription`, {});
    }

    unsubscribe(topicId: number) {
        return this.http.delete(`${this.path}/${topicId}/subscription`);
    }
}
