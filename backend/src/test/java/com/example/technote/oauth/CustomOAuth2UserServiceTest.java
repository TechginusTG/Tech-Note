package com.example.technote.oauth;

import com.example.technote.user.User;
import com.example.technote.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomOAuth2UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CustomOAuth2UserService service;

    @Mock
    private OAuth2UserRequest userRequest;

    @Mock
    private ClientRegistration clientRegistration;

    private Map<String, Object> attributes;

    @BeforeEach
    void setUp() {
        attributes = new HashMap<>();
        attributes.put("id", "12345");
        attributes.put("login", "testuser");
        attributes.put("email", "test@github.com");

        when(userRequest.getClientRegistration()).thenReturn(clientRegistration);
        when(clientRegistration.getRegistrationId()).thenReturn("github");
        when(userRequest.getAccessToken()).thenReturn(new OAuth2AccessToken(
            OAuth2AccessToken.TokenType.BEARER,
            "token",
            Instant.now(),
            Instant.now().plusSeconds(3600)
        ));
    }

    @Test
    void whenUserDoesNotExist_thenCreateNewUser() {
        when(userRepository.findByProviderAndProviderId(any(), any()))
            .thenReturn(Optional.empty());

        OAuth2User oAuth2User = service.loadUser(userRequest);

        verify(userRepository).save(any(User.class));
        assertNotNull(oAuth2User);
        assertTrue(oAuth2User instanceof CustomOAuth2User);
    }

    @Test
    void whenUserExists_thenUpdateUser() {
        User existingUser = new User();
        existingUser.setId(1L);
        existingUser.setEmail("old@email.com");
        existingUser.setUsername("oldusername");
        existingUser.setProvider("github");
        existingUser.setProviderId("12345");

        when(userRepository.findByProviderAndProviderId("github", "12345"))
            .thenReturn(Optional.of(existingUser));

        OAuth2User oAuth2User = service.loadUser(userRequest);

        verify(userRepository).save(any(User.class));
        assertNotNull(oAuth2User);
        assertTrue(oAuth2User instanceof CustomOAuth2User);
    }

    @Test
    void whenErrorOccurs_thenThrowsOAuth2AuthenticationException() {
        when(userRepository.findByProviderAndProviderId(any(), any()))
            .thenThrow(new RuntimeException("Database error"));

        assertThrows(RuntimeException.class, () -> {
            service.loadUser(userRequest);
        });
    }
}