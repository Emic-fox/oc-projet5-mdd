package com.orion.mdd.topics.dto;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TopicResponseMapper {
    @Mapping(target = "id", source = "topic.id")
    @Mapping(target = "name", source = "topic.name")
    @Mapping(target = "description", source = "topic.description")
    TopicResponse toTopicResponse(TopicWithSubscription topicSubscription);
}
