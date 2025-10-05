package com.example.technote.oauth;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class CustomOAuth2UserTest {

    private Map<String, Object> githubAttributes;
    private Map<String, Object> googleAttributes;
    private DefaultOAuth2User githubOAuth2User;
    private DefaultOAuth2User googleOAuth2User;

    @BeforeEach
    void setUp() {
        githubAttributes = new HashMap<>();
        githubAttributes.put("id", "12345");
        githubAttributes.put("login", "testuser");
        githubAttributes.put("email", "test@github.com");

        googleAttributes = new HashMap<>();
        googleAttributes.put("sub", "67890");
        googleAttributes.put("name", "Test User");
        googleAttributes.put("email", "test@gmail.com");

        githubOAuth2User = new DefaultOAuth2User(
            Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
            githubAttributes,
            "login"
        );

        googleOAuth2User = new DefaultOAuth2User(
            Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
            googleAttributes,
            "name"
        );
    }

    @Test
    void whenCreateFromGithubUser_thenMapsAttributesCorrectly() {
        CustomOAuth2User user = new CustomOAuth2User(githubOAuth2User, "github");

        assertEquals("testuser", user.getName());
        assertEquals("test@github.com", user.getEmail());
        assertEquals("github", user.getProvider());
        assertEquals("12345", user.getId());
        assertTrue(user.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_USER")));
    }

    @Test
    void whenCreateFromGoogleUser_thenMapsAttributesCorrectly() {
        CustomOAuth2User user = new CustomOAuth2User(googleOAuth2User, "google");

        assertEquals("Test User", user.getName());
        assertEquals("test@gmail.com", user.getEmail());
        assertEquals("google", user.getProvider());
        assertEquals("67890", user.getId());
        assertTrue(user.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_USER")));
    }

    @Test
    void whenProviderIsInvalid_thenThrowsException() {
        assertThrows(IllegalArgumentException.class, () -> {
            new CustomOAuth2User(githubOAuth2User, "invalid");
        });
    }
}