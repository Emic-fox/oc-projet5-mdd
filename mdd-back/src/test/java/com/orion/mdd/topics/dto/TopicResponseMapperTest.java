package com.orion.mdd.topics.dto;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import com.orion.mdd.topics.Topic;

@Tag("unit")
@Tag("mapper")
@DisplayName("TopicResponseMapper")
class TopicResponseMapperTest {

    private final TopicResponseMapper mapper = Mappers.getMapper(TopicResponseMapper.class);

    @Test
    @DisplayName("Devrait mapper un topic abonné vers une TopicResponse")
    void shouldMapSubscribedTopic() {
        Topic topic = new Topic(1L, "Développement", "Lorem ipsum...", null);
        TopicWithSubscription topicWithSubscription = new TopicWithSubscription(topic, true);

        TopicResponse response = mapper.toTopicResponse(topicWithSubscription);

        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.name()).isEqualTo("Développement");
        assertThat(response.description()).isEqualTo("Lorem ipsum...");
        assertThat(response.subscribed()).isTrue();
    }

    @Test
    @DisplayName("Devrait mapper un topic non abonné vers une TopicResponse")
    void shouldMapNotSubscribedTopic() {
        Topic topic = new Topic(2L, "Sécurité", "Description sécurité", null);
        TopicWithSubscription topicWithSubscription = new TopicWithSubscription(topic, false);

        TopicResponse response = mapper.toTopicResponse(topicWithSubscription);

        assertThat(response.id()).isEqualTo(2L);
        assertThat(response.name()).isEqualTo("Sécurité");
        assertThat(response.description()).isEqualTo("Description sécurité");
        assertThat(response.subscribed()).isFalse();
    }

    @Test
    @DisplayName("Devrait retourner null quand la source est null")
    void shouldReturnNullWhenSourceIsNull() {
        assertThat(mapper.toTopicResponse(null)).isNull();
    }

    @Test
    @DisplayName("Devrait mapper id/name/description à null quand le topic est null")
    void shouldMapNullFieldsWhenTopicIsNull() {
        TopicWithSubscription topicWithSubscription = new TopicWithSubscription(null, true);

        TopicResponse response = mapper.toTopicResponse(topicWithSubscription);

        assertThat(response.id()).isNull();
        assertThat(response.name()).isNull();
        assertThat(response.description()).isNull();
        assertThat(response.subscribed()).isTrue();
    }
}
