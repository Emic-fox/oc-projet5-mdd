package com.orion.mdd.topics.dto;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * Mapper MapStruct convertissant un {@link TopicWithSubscription} vers le DTO {@link TopicResponse}
 * exposé par l'API.
 */
@Mapper(componentModel = "spring")
public interface TopicResponseMapper {
    /**
     * @param topicSubscription thème accompagné de l'état de souscription de l'utilisateur
     * @return le DTO de réponse correspondant
     */
    @Mapping(target = "id", source = "topic.id")
    @Mapping(target = "name", source = "topic.name")
    @Mapping(target = "description", source = "topic.description")
    TopicResponse toTopicResponse(TopicWithSubscription topicSubscription);
}
