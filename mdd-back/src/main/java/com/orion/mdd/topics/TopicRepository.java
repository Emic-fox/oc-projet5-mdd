package com.orion.mdd.topics;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

interface TopicRepository extends JpaRepository<Topic, Long> {
    List<Topic> findBySubscribersId(Long userId);

    @Query("SELECT DISTINCT t FROM Topic t LEFT JOIN FETCH t.subscribers")
    List<Topic> findAllWithSubscribers();

    boolean existsByIdAndSubscribersId(Long topicId, Long userId);

    @Modifying
    @Query(value = "INSERT INTO subscriptions (topic_id, user_id) VALUES (:topicId, :userId)", nativeQuery = true)
    void insertSubscription(@Param("topicId") Long topicId, @Param("userId") Long userId);

    @Modifying
    @Query(value = "DELETE FROM subscriptions WHERE topic_id = :topicId AND user_id = :userId", nativeQuery = true)
    void deleteSubscription(@Param("topicId") Long topicId, @Param("userId") Long userId);
}
