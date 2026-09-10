package com.orion.mdd.topics.dto;

import com.orion.mdd.topics.Topic;

public record TopicWithSubscription(Topic topic, boolean subscribed) { }
