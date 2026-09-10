package com.orion.mdd.topics;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.orion.mdd.topics.dto.TopicWithSubscription;
import com.orion.mdd.users.User;

@ExtendWith(MockitoExtension.class)
@Tag("unit")
@Tag("service")
@DisplayName("TopicServiceImpl")
class TopicServiceImplTest {

    @Mock
    private TopicRepository topicRepository;

    @InjectMocks
    private TopicServiceImpl service;

    private static User userWithId(long id) {
        User user = new User("user" + id + "@mdd.com", "user" + id, "secret");
        user.setId(id);
        return user;
    }

    private static Topic topicWithSubscribers(long id, User... subscribers) {
        Topic topic = new Topic("Java", "Description Java");
        topic.setId(id);
        topic.setSubscribers(Set.of(subscribers));
        return topic;
    }

    @Test
    @DisplayName("onlySubscribed=true renvoie les topics souscrits, tous marqués comme abonnés")
    void getAll_onlySubscribed_returnsSubscribedTopicsMarkedAsSubscribed() {
        Topic topic = topicWithSubscribers(1L, userWithId(42L));
        when(topicRepository.findBySubscribersId(42L)).thenReturn(List.of(topic));

        List<TopicWithSubscription> result = service.getAll(42L, true);

        assertThat(result).containsExactly(new TopicWithSubscription(topic, true));
        verify(topicRepository, never()).findAllWithSubscribers();
    }

    @Test
    @DisplayName("onlySubscribed=true interroge le repository avec l'id de l'utilisateur courant")
    void getAll_onlySubscribed_queriesRepositoryWithCurrentUserId() {
        when(topicRepository.findBySubscribersId(42L)).thenReturn(List.of());

        service.getAll(42L, true);

        verify(topicRepository).findBySubscribersId(42L);
    }

    @Test
    @DisplayName("onlySubscribed=false renvoie tous les topics avec le bon flag d'abonnement")
    void getAll_allTopics_flagsSubscriptionForCurrentUserOnly() {
        User alice = userWithId(1L);
        User bob = userWithId(2L);
        Topic subscribedTopic = topicWithSubscribers(1L, alice, bob);
        Topic otherTopic = topicWithSubscribers(2L, bob);
        when(topicRepository.findAllWithSubscribers()).thenReturn(List.of(subscribedTopic, otherTopic));

        List<TopicWithSubscription> result = service.getAll(1L, false);

        assertThat(result).containsExactly(
            new TopicWithSubscription(subscribedTopic, true),
            new TopicWithSubscription(otherTopic, false)
        );
        verify(topicRepository, never()).findBySubscribersId(1L);
    }

    @Test
    @DisplayName("onlySubscribed=false renvoie subscribed=false quand le topic n'a aucun abonné")
    void getAll_allTopics_returnsNotSubscribedWhenTopicHasNoSubscribers() {
        Topic topicWithoutSubscribers = topicWithSubscribers(1L);
        when(topicRepository.findAllWithSubscribers()).thenReturn(List.of(topicWithoutSubscribers));

        List<TopicWithSubscription> result = service.getAll(1L, false);

        assertThat(result).containsExactly(new TopicWithSubscription(topicWithoutSubscribers, false));
    }
}
