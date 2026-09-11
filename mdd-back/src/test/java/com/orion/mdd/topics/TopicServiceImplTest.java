package com.orion.mdd.topics;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
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
import com.orion.mdd.topics.exceptions.AlreadySubscribedException;
import com.orion.mdd.topics.exceptions.NotSubscribedException;
import com.orion.mdd.topics.exceptions.TopicNotFoundException;
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

    @Test
    @DisplayName("subscribe lève TopicNotFoundException quand le topic n'existe pas")
    void subscribe_throwsTopicNotFoundExceptionWhenTopicDoesNotExist() {
        when(topicRepository.existsById(1L)).thenReturn(false);

        assertThatThrownBy(() -> service.subscribe(1L, 42L))
            .isInstanceOf(TopicNotFoundException.class);

        verify(topicRepository, never()).insertSubscription(1L, 42L);
    }

    @Test
    @DisplayName("subscribe lève AlreadySubscribedException quand l'utilisateur est déjà abonné")
    void subscribe_throwsAlreadySubscribedExceptionWhenAlreadySubscribed() {
        when(topicRepository.existsById(1L)).thenReturn(true);
        when(topicRepository.existsByIdAndSubscribersId(1L, 42L)).thenReturn(true);

        assertThatThrownBy(() -> service.subscribe(1L, 42L))
            .isInstanceOf(AlreadySubscribedException.class);

        verify(topicRepository, never()).insertSubscription(1L, 42L);
    }

    @Test
    @DisplayName("subscribe insère l'abonnement quand le topic existe et l'utilisateur n'est pas déjà abonné")
    void subscribe_insertsSubscriptionWhenTopicExistsAndNotAlreadySubscribed() {
        when(topicRepository.existsById(1L)).thenReturn(true);
        when(topicRepository.existsByIdAndSubscribersId(1L, 42L)).thenReturn(false);

        service.subscribe(1L, 42L);

        verify(topicRepository).insertSubscription(1L, 42L);
    }

    @Test
    @DisplayName("unsubscribe lève TopicNotFoundException quand le topic n'existe pas")
    void unsubscribe_throwsTopicNotFoundExceptionWhenTopicDoesNotExist() {
        when(topicRepository.existsById(1L)).thenReturn(false);

        assertThatThrownBy(() -> service.unsubscribe(1L, 42L))
            .isInstanceOf(TopicNotFoundException.class);

        verify(topicRepository, never()).deleteSubscription(1L, 42L);
    }

    @Test
    @DisplayName("unsubscribe lève NotSubscribedException quand l'utilisateur n'est pas abonné")
    void unsubscribe_throwsNotSubscribedExceptionWhenNotSubscribed() {
        when(topicRepository.existsById(1L)).thenReturn(true);
        when(topicRepository.existsByIdAndSubscribersId(1L, 42L)).thenReturn(false);

        assertThatThrownBy(() -> service.unsubscribe(1L, 42L))
            .isInstanceOf(NotSubscribedException.class);

        verify(topicRepository, never()).deleteSubscription(1L, 42L);
    }

    @Test
    @DisplayName("unsubscribe supprime l'abonnement quand le topic existe et l'utilisateur y est abonné")
    void unsubscribe_deletesSubscriptionWhenTopicExistsAndSubscribed() {
        when(topicRepository.existsById(1L)).thenReturn(true);
        when(topicRepository.existsByIdAndSubscribersId(1L, 42L)).thenReturn(true);

        service.unsubscribe(1L, 42L);

        verify(topicRepository).deleteSubscription(1L, 42L);
    }
}
