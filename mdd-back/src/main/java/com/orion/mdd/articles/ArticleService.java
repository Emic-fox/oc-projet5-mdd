package com.orion.mdd.articles;

import java.util.List;

public interface ArticleService {
    List<Article> getFeed(Long currentUserId, boolean ascending);

    Article getById(Long id);
}
