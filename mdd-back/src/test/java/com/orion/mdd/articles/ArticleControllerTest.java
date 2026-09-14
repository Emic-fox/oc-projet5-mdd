package com.orion.mdd.articles;

import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.orion.mdd.articles.dto.ArticleResponse;
import com.orion.mdd.articles.dto.ArticleResponseMapper;
import com.orion.mdd.articles.exceptions.ArticleNotFoundException;
import com.orion.mdd.auth.security.JwtService;
import com.orion.mdd.auth.security.SecurityConfig;
import com.orion.mdd.auth.security.UserDetailsImpl;
import com.orion.mdd.topics.Topic;
import com.orion.mdd.users.User;

/**
 * Tests de la couche web de {@link ArticleController} : routage, valorisation du paramètre
 * {@code sort}, sérialisation JSON via {@link ArticleResponseMapper} et vraie chaîne de
 * filtres de sécurité (endpoint protégé).
 *
 * <p>Tranche {@code @WebMvcTest} : pas de service métier ni de base de données. {@code JwtService}
 * et {@code UserDetailsService} sont mockés uniquement pour satisfaire {@code JwtAuthenticationFilter}.
 */
@WebMvcTest(ArticleController.class)
@Import(SecurityConfig.class)
@Tag("integration")
@Tag("controller")
@DisplayName("ArticleController (tranche web)")
class ArticleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ArticleService articleService;
    @MockitoBean
    private ArticleResponseMapper articleResponseMapper;

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

    private static ArticleResponse response(long id) {
        return new ArticleResponse(
            id,
            "Titre",
            new ArticleResponse.TopicRef(1L, "Java"),
            new ArticleResponse.AuthorRef(42L, "alice"),
            LocalDateTime.of(2025, 1, 1, 12, 0)
        );
    }

    @Test
    @DisplayName("renvoie 200 et la liste des articles avec un tri décroissant quand le paramètre est absent")
    void getArticles_defaultsToDescendingSortWhenParamIsMissing() throws Exception {
        Article article = article(1L);
        when(articleService.getFeed(42L, false)).thenReturn(List.of(article));
        when(articleResponseMapper.toArticleResponse(article)).thenReturn(response(1L));

        mockMvc.perform(get("/api/articles").with(authentication(authFor(alice()))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].title").value("Titre"))
                .andExpect(jsonPath("$[0].topic.id").value(1))
                .andExpect(jsonPath("$[0].topic.name").value("Java"))
                .andExpect(jsonPath("$[0].author.id").value(42))
                .andExpect(jsonPath("$[0].author.username").value("alice"));

        verify(articleService).getFeed(42L, false);
    }

    @Test
    @DisplayName("renvoie 200 et transmet sort=asc au service quand demandé")
    void getArticles_passesAscendingSortToService() throws Exception {
        when(articleService.getFeed(42L, true)).thenReturn(List.of());

        mockMvc.perform(get("/api/articles").param("sort", "asc").with(authentication(authFor(alice()))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());

        verify(articleService).getFeed(42L, true);
    }

    @Test
    @DisplayName("renvoie 200 et transmet sort=desc au service pour toute valeur inconnue")
    void getArticles_defaultsToDescendingSortForUnknownValue() throws Exception {
        when(articleService.getFeed(42L, false)).thenReturn(List.of());

        mockMvc.perform(get("/api/articles").param("sort", "n'importe quoi").with(authentication(authFor(alice()))))
                .andExpect(status().isOk());

        verify(articleService).getFeed(42L, false);
    }

    @Test
    @DisplayName("renvoie 401 quand la requête n'est pas authentifiée")
    void getArticles_returns401WhenNotAuthenticated() throws Exception {
        mockMvc.perform(get("/api/articles"))
                .andExpect(status().isUnauthorized());

        verifyNoInteractions(articleService);
        verifyNoInteractions(articleResponseMapper);
    }

    @Test
    @DisplayName("renvoie 200 et le détail de l'article demandé")
    void getArticle_returns200WithArticleDetail() throws Exception {
        Article article = article(1L);
        when(articleService.getById(1L)).thenReturn(article);
        when(articleResponseMapper.toArticleResponse(article)).thenReturn(response(1L));

        mockMvc.perform(get("/api/articles/1").with(authentication(authFor(alice()))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Titre"))
                .andExpect(jsonPath("$.topic.id").value(1))
                .andExpect(jsonPath("$.topic.name").value("Java"))
                .andExpect(jsonPath("$.author.id").value(42))
                .andExpect(jsonPath("$.author.username").value("alice"));
    }

    @Test
    @DisplayName("renvoie 404 quand l'article n'existe pas")
    void getArticle_returns404WhenArticleNotFound() throws Exception {
        doThrow(new ArticleNotFoundException()).when(articleService).getById(1L);

        mockMvc.perform(get("/api/articles/1").with(authentication(authFor(alice()))))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("renvoie 401 quand la requête n'est pas authentifiée")
    void getArticle_returns401WhenNotAuthenticated() throws Exception {
        mockMvc.perform(get("/api/articles/1"))
                .andExpect(status().isUnauthorized());

        verifyNoInteractions(articleService);
    }
}
