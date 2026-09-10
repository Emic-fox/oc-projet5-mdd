package com.orion.mdd.topics;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

interface TopicRepository extends JpaRepository<Topic, Long> {
    List<Topic> findBySubscribersId(Long userId);

    @Query("SELECT DISTINCT t FROM Topic t LEFT JOIN FETCH t.subscribers")
    List<Topic> findAllWithSubscribers();
}
