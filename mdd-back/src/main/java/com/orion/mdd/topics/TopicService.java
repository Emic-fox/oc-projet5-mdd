package com.orion.mdd.topics;

import java.util.List;

import com.orion.mdd.topics.dto.TopicWithSubscription;

public interface TopicService {
    List<TopicWithSubscription> getAll(Long currentUserId, boolean onlySubscribed);

    void subscribe(Long topicId, Long userId);

    void unsubscribe(Long topicId, Long userId);
}
