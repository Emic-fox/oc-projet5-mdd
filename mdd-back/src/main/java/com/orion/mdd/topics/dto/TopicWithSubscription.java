package com.orion.mdd.topics.dto;

import com.orion.mdd.topics.Topic;

/**
 * Association d'un thème et de l'état de souscription de l'utilisateur connecté à ce thème.
 *
 * @param topic thème concerné
 * @param subscribed {@code true} si l'utilisateur connecté est abonné à ce thème
 */
public record TopicWithSubscription(Topic topic, boolean subscribed) { }
