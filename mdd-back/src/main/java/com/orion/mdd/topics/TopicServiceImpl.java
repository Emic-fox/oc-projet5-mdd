package com.orion.mdd.topics;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.orion.mdd.topics.dto.TopicWithSubscription;
import com.orion.mdd.topics.exceptions.AlreadySubscribedException;
import com.orion.mdd.topics.exceptions.NotSubscribedException;
import com.orion.mdd.topics.exceptions.TopicNotFoundException;

@Service
class TopicServiceImpl implements TopicService {
    private final TopicRepository topicRepository;

    TopicServiceImpl(TopicRepository topicRepository) {
        this.topicRepository = topicRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TopicWithSubscription> getAll(Long currentUserId, boolean onlySubscribed) {
        // On veut seulement les topics souscrits : une seule requête suffit
        if (onlySubscribed) {
            return topicRepository.findBySubscribersId(currentUserId).stream()
                .map(topic -> new TopicWithSubscription(topic, true))
                .toList();
        }

        // On veut tous les topics : une seule requête, avec un fetch join
        // sur les abonnés pour valoriser "subscribed" sans round-trip supplémentaire
        return topicRepository.findAllWithSubscribers().stream()
            .map(topic -> new TopicWithSubscription(
                topic,
                topic.getSubscribers().stream().anyMatch(user -> user.getId().equals(currentUserId))
            ))
            .toList();
    }

    @Override
    @Transactional
    public void subscribe(Long topicId, Long userId) {
        if (!topicRepository.existsById(topicId)) {
            throw new TopicNotFoundException();
        }
        if (topicRepository.existsByIdAndSubscribersId(topicId, userId)) {
            throw new AlreadySubscribedException();
        }

        topicRepository.insertSubscription(topicId, userId);
    }

    @Override
    @Transactional
    public void unsubscribe(Long topicId, Long userId) {
        if (!topicRepository.existsById(topicId)) {
            throw new TopicNotFoundException();
        }
        if (!topicRepository.existsByIdAndSubscribersId(topicId, userId)) {
            throw new NotSubscribedException();
        }

        topicRepository.deleteSubscription(topicId, userId);
    }

}
