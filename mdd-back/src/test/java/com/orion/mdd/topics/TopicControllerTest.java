package com.orion.mdd.topics;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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

import com.orion.mdd.auth.security.JwtService;
import com.orion.mdd.auth.security.SecurityConfig;
import com.orion.mdd.auth.security.UserDetailsImpl;
import com.orion.mdd.topics.dto.TopicResponse;
import com.orion.mdd.topics.dto.TopicResponseMapper;
import com.orion.mdd.topics.dto.TopicWithSubscription;
import com.orion.mdd.users.User;

/**
 * Tests de la couche web de {@link TopicController} : routage, valorisation du paramètre
 * {@code subscribed}, sérialisation JSON via {@link TopicResponseMapper} et vraie chaîne de
 * filtres de sécurité (endpoint protégé).
 *
 * <p>Tranche {@code @WebMvcTest} : pas de service métier ni de base de données. {@code JwtService}
 * et {@code UserDetailsService} sont mockés uniquement pour satisfaire {@code JwtAuthenticationFilter}.
 */
@WebMvcTest(TopicController.class)
@Import(SecurityConfig.class)
@Tag("integration")
@Tag("controller")
@DisplayName("TopicController (tranche web)")
class TopicControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TopicService topicService;
    @MockitoBean
    private TopicResponseMapper topicResponseMapper;

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

    @Test
    @DisplayName("renvoie 200 et tous les topics quand subscribed=false")
    void getTopics_returnsAllTopicsWhenSubscribedIsFalse() throws Exception {
        Topic topic = new Topic("Java", "Description Java");
        topic.setId(1L);
        TopicWithSubscription topicWithSubscription = new TopicWithSubscription(topic, true);

        when(topicService.getAll(42L, false)).thenReturn(List.of(topicWithSubscription));
        when(topicResponseMapper.toTopicResponse(topicWithSubscription))
                .thenReturn(new TopicResponse(1L, "Java", "Description Java", true));

        mockMvc.perform(get("/api/topics").param("subscribed", "false").with(authentication(authFor(alice()))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("Java"))
                .andExpect(jsonPath("$[0].description").value("Description Java"))
                .andExpect(jsonPath("$[0].subscribed").value(true));
    }

    @Test
    @DisplayName("renvoie 200 et transmet subscribed=true au service quand demandé")
    void getTopics_passesSubscribedTrueToService() throws Exception {
        when(topicService.getAll(42L, true)).thenReturn(List.of());

        mockMvc.perform(get("/api/topics").param("subscribed", "true").with(authentication(authFor(alice()))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());

        verify(topicService).getAll(42L, true);
    }

    @Test
    @DisplayName("renvoie 200 et transmet subscribed=false au service quand le paramètre est absent")
    void getTopics_defaultsSubscribedToFalseWhenParamIsMissing() throws Exception {
        when(topicService.getAll(42L, false)).thenReturn(List.of());

        mockMvc.perform(get("/api/topics").with(authentication(authFor(alice()))))
                .andExpect(status().isOk());

        verify(topicService).getAll(42L, false);
    }

    @Test
    @DisplayName("renvoie 401 quand la requête n'est pas authentifiée")
    void getTopics_returns401WhenNotAuthenticated() throws Exception {
        mockMvc.perform(get("/api/topics"))
                .andExpect(status().isUnauthorized());

        verifyNoInteractions(topicService);
        verifyNoInteractions(topicResponseMapper);
    }
}
