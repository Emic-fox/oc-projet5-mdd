package com.orion.mdd.articles;

import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.orion.mdd.articles.dto.CommentCreatedResponse;
import com.orion.mdd.articles.dto.CommentResponse;
import com.orion.mdd.articles.dto.CommentResponseMapper;
import com.orion.mdd.articles.exceptions.ArticleNotFoundException;
import com.orion.mdd.auth.security.JwtService;
import com.orion.mdd.auth.security.SecurityConfig;
import com.orion.mdd.auth.security.UserDetailsImpl;
import com.orion.mdd.topics.Topic;
import com.orion.mdd.users.User;

/**
 * Tests de la couche web de {@link CommentController} : routage, sérialisation JSON via
 * {@link CommentResponseMapper} et vraie chaîne de filtres de sécurité (endpoint protégé).
 *
 * <p>Tranche {@code @WebMvcTest} : pas de service métier ni de base de données. {@code JwtService}
 * et {@code UserDetailsService} sont mockés uniquement pour satisfaire {@code JwtAuthenticationFilter}.
 */
@WebMvcTest(CommentController.class)
@Import(SecurityConfig.class)
@Tag("integration")
@Tag("controller")
@DisplayName("CommentController (tranche web)")
class CommentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CommentService commentService;
    @MockitoBean
    private CommentResponseMapper commentResponseMapper;

    // Requis par la chaîne de sécurité montée dans la tranche (JwtAuthenticationFilter).
    @MockitoBean
    private JwtService jwtService;
    @MockitoBean
    private UserDetailsService userDetailsService;

    private static User alice() {
        User alice = new User("alice@mdd.com", "alice", "hashed");
        alice.setId(42L);
        return alice;
    }

    private static Authentication authFor(User user) {
        UserDetailsImpl principal = UserDetailsImpl.fromUser(user);
        return new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
    }

    private static Article article(long id) {
        Topic topic = new Topic("Java", "Description Java");
        topic.setId(1L);

        Article article = new Article("Titre", "Contenu", topic, alice());
        article.setId(id);
        article.setCreatedAt(LocalDateTime.of(2025, 1, 1, 12, 0));
        return article;
    }

    private static Comment comment(long id) {
        Comment comment = new Comment("Commentaire", article(1L), alice());
        comment.setId(id);
        comment.setCreatedAt(LocalDateTime.of(2025, 1, 1, 12, 0));
        return comment;
    }

    private static CommentResponse response(long id) {
        return new CommentResponse(
            id,
            "Commentaire",
            new CommentResponse.AuthorRef(42L, "alice"),
            LocalDateTime.of(2025, 1, 1, 12, 0)
        );
    }

    private static CommentCreatedResponse createdResponse(long id) {
        return new CommentCreatedResponse(
            id,
            "Commentaire",
            new CommentResponse.AuthorRef(42L, "alice"),
            new CommentCreatedResponse.ArticleRef(1L, "Titre"),
            LocalDateTime.of(2025, 1, 1, 12, 0)
        );
    }

    @Test
    @DisplayName("renvoie 200 et la liste des commentaires de l'article")
    void getComments_returns200WithCommentsList() throws Exception {
        Comment comment = comment(1L);
        when(commentService.getByArticleId(1L)).thenReturn(List.of(comment));
        when(commentResponseMapper.toCommentResponse(comment)).thenReturn(response(1L));

        mockMvc.perform(get("/api/articles/1/comments").with(authentication(authFor(alice()))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].content").value("Commentaire"))
                .andExpect(jsonPath("$[0].author.id").value(42))
                .andExpect(jsonPath("$[0].author.username").value("alice"));

        verify(commentService).getByArticleId(1L);
    }

    @Test
    @DisplayName("renvoie 404 quand l'article n'existe pas")
    void getComments_returns404WhenArticleNotFound() throws Exception {
        doThrow(new ArticleNotFoundException()).when(commentService).getByArticleId(1L);

        mockMvc.perform(get("/api/articles/1/comments").with(authentication(authFor(alice()))))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("renvoie 401 quand la requête n'est pas authentifiée")
    void getComments_returns401WhenNotAuthenticated() throws Exception {
        mockMvc.perform(get("/api/articles/1/comments"))
                .andExpect(status().isUnauthorized());

        verifyNoInteractions(commentService);
    }

    @Test
    @DisplayName("renvoie 201 et le commentaire créé")
    void createComment_returns201WithCreatedComment() throws Exception {
        Comment comment = comment(1L);
        when(commentService.create(1L, 42L, "Commentaire")).thenReturn(comment);
        when(commentResponseMapper.toCommentCreatedResponse(comment)).thenReturn(createdResponse(1L));

        mockMvc.perform(post("/api/articles/1/comments")
                .with(authentication(authFor(alice())))
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"content": "Commentaire"}
                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.content").value("Commentaire"))
                .andExpect(jsonPath("$.author.id").value(42))
                .andExpect(jsonPath("$.author.username").value("alice"))
                .andExpect(jsonPath("$.article.id").value(1))
                .andExpect(jsonPath("$.article.title").value("Titre"));

        verify(commentService).create(1L, 42L, "Commentaire");
    }

    @Test
    @DisplayName("renvoie 400 quand le corps de la requête est invalide")
    void createComment_returns400WhenRequestIsInvalid() throws Exception {
        mockMvc.perform(post("/api/articles/1/comments")
                .with(authentication(authFor(alice())))
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"content": ""}
                """))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(commentService);
    }

    @Test
    @DisplayName("renvoie 404 quand l'article n'existe pas")
    void createComment_returns404WhenArticleNotFound() throws Exception {
        doThrow(new ArticleNotFoundException()).when(commentService).create(1L, 42L, "Commentaire");

        mockMvc.perform(post("/api/articles/1/comments")
                .with(authentication(authFor(alice())))
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"content": "Commentaire"}
                """))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("renvoie 401 quand la requête n'est pas authentifiée")
    void createComment_returns401WhenNotAuthenticated() throws Exception {
        mockMvc.perform(post("/api/articles/1/comments")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"content": "Commentaire"}
                """))
                .andExpect(status().isUnauthorized());

        verifyNoInteractions(commentService);
    }
}
