package com.orion.mdd.articles.dto;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import com.orion.mdd.articles.Article;
import com.orion.mdd.topics.Topic;
import com.orion.mdd.users.User;

@Tag("unit")
@Tag("mapper")
@DisplayName("ArticleResponseMapper")
class ArticleResponseMapperTest {

    private final ArticleResponseMapper mapper = Mappers.getMapper(ArticleResponseMapper.class);

    @Test
    @DisplayName("Devrait mapper un article vers une ArticleResponse")
    void shouldMapArticle() {
        Topic topic = new Topic(1L, "Développement", "Lorem ipsum...", null);
        User author = new User("alice@mdd.com", "alice", "hashed");
        author.setId(42L);
        LocalDateTime createdAt = LocalDateTime.of(2025, 1, 1, 12, 0);

        Article article = new Article(1L, "Mon article", "Contenu", topic, author, createdAt);

        ArticleResponse response = mapper.toArticleResponse(article);

        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.title()).isEqualTo("Mon article");
        assertThat(response.topic().id()).isEqualTo(1L);
        assertThat(response.topic().name()).isEqualTo("Développement");
        assertThat(response.author().id()).isEqualTo(42L);
        assertThat(response.author().username()).isEqualTo("alice");
        assertThat(response.createdAt()).isEqualTo(createdAt);
    }

    @Test
    @DisplayName("Devrait retourner null quand la source est null")
    void shouldReturnNullWhenSourceIsNull() {
        assertThat(mapper.toArticleResponse(null)).isNull();
    }
}
