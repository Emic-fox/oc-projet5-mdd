package com.orion.mdd.articles.dto;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.LocalDateTime;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import com.orion.mdd.articles.Article;
import com.orion.mdd.articles.Comment;
import com.orion.mdd.topics.Topic;
import com.orion.mdd.users.User;

@Tag("unit")
@Tag("mapper")
@DisplayName("CommentResponseMapper")
class CommentResponseMapperTest {

    private final CommentResponseMapper mapper = Mappers.getMapper(CommentResponseMapper.class);

    private static Comment sampleComment() {
        Topic topic = new Topic(1L, "Développement", "Lorem ipsum...", null);
        User author = new User("alice@mdd.com", "alice", "hashed");
        author.setId(42L);
        Article article = new Article(1L, "Mon article", "Contenu", topic, author, LocalDateTime.of(2025, 1, 1, 12, 0));

        return new Comment(1L, "Merci pour cet article !", article, author, LocalDateTime.of(2025, 1, 2, 9, 30));
    }

    @Test
    @DisplayName("Devrait mapper un commentaire vers une CommentResponse")
    void shouldMapComment() {
        Comment comment = sampleComment();

        CommentResponse response = mapper.toCommentResponse(comment);

        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.content()).isEqualTo("Merci pour cet article !");
        assertThat(response.author().id()).isEqualTo(42L);
        assertThat(response.author().username()).isEqualTo("alice");
        assertThat(response.createdAt()).isEqualTo(LocalDateTime.of(2025, 1, 2, 9, 30));
    }

    @Test
    @DisplayName("Devrait retourner null quand la source est null pour toCommentResponse")
    void shouldReturnNullWhenSourceIsNullForCommentResponse() {
        assertThat(mapper.toCommentResponse(null)).isNull();
    }

    @Test
    @DisplayName("Devrait mapper un commentaire vers une CommentCreatedResponse incluant l'article")
    void shouldMapCommentToCreatedResponse() {
        Comment comment = sampleComment();

        CommentCreatedResponse response = mapper.toCommentCreatedResponse(comment);

        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.content()).isEqualTo("Merci pour cet article !");
        assertThat(response.author().id()).isEqualTo(42L);
        assertThat(response.author().username()).isEqualTo("alice");
        assertThat(response.article().id()).isEqualTo(1L);
        assertThat(response.article().title()).isEqualTo("Mon article");
        assertThat(response.createdAt()).isEqualTo(LocalDateTime.of(2025, 1, 2, 9, 30));
    }

    @Test
    @DisplayName("Devrait retourner null quand la source est null pour toCommentCreatedResponse")
    void shouldReturnNullWhenSourceIsNullForCommentCreatedResponse() {
        assertThat(mapper.toCommentCreatedResponse(null)).isNull();
    }
}
