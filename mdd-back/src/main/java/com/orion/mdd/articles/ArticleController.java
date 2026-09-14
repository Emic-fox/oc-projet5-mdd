package com.orion.mdd.articles;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.orion.mdd.articles.dto.ArticleResponse;
import com.orion.mdd.articles.dto.ArticleResponseMapper;
import com.orion.mdd.articles.dto.CreateArticleRequest;
import com.orion.mdd.articles.dto.GetArticleCollectionRequest;
import com.orion.mdd.auth.security.UserDetailsImpl;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@Tag(name = "Articles", description = "Opérations sur les articles des thèmes suivis par l'utilisateur connecté")
@RestController
@RequestMapping(value = "/api/articles", produces = MediaType.APPLICATION_JSON_VALUE)
public class ArticleController {
    private final ArticleService articleService;
    private final ArticleResponseMapper articleResponseMapper;

    public ArticleController(ArticleService articleService, ArticleResponseMapper articleResponseMapper) {
        this.articleService = articleService;
        this.articleResponseMapper = articleResponseMapper;
    }

    @Operation(summary = "Liste des articles", description = "Liste des articles des thèmes suivis par l'utilisateur")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Liste des articles"),
        @ApiResponse(responseCode = "401", description = "Utilisateur non authentifié", content = @Content)
    })
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("")
    public ResponseEntity<List<ArticleResponse>> getArticles(
        @Valid @ModelAttribute GetArticleCollectionRequest request,
        @AuthenticationPrincipal UserDetailsImpl authenticatedUser
    ) {
        List<Article> articles = articleService.getFeed(authenticatedUser.getId(), request.ascending());
        List<ArticleResponse> response = articles.stream()
            .map(articleResponseMapper::toArticleResponse)
            .toList();

        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Détail d'un article", description = "Détail d'un article")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Détail de l'article"),
        @ApiResponse(responseCode = "401", description = "Utilisateur non authentifié", content = @Content),
        @ApiResponse(responseCode = "404", description = "Article non trouvé", content = @Content)
    })
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{id}")
    public ResponseEntity<ArticleResponse> getArticle(@PathVariable Long id) {
        Article article = articleService.getById(id);

        return ResponseEntity.ok(articleResponseMapper.toArticleResponse(article));
    }

    @Operation(summary = "Création d'un article", description = "Crée un article sur le thème donné, avec l'utilisateur connecté comme auteur")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Article créé"),
        @ApiResponse(responseCode = "400", description = "Requête invalide", content = @Content),
        @ApiResponse(responseCode = "401", description = "Utilisateur non authentifié", content = @Content),
        @ApiResponse(responseCode = "404", description = "Thème non trouvé", content = @Content)
    })
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("")
    public ResponseEntity<ArticleResponse> createArticle(
        @Valid @RequestBody CreateArticleRequest request,
        @AuthenticationPrincipal UserDetailsImpl authenticatedUser
    ) {
        Article article = articleService.create(
            request.topicId(),
            authenticatedUser.getId(),
            request.title(),
            request.content()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(articleResponseMapper.toArticleResponse(article));
    }
}
