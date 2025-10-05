package com.example.technote.oauth;

import com.example.technote.config.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.Authentication;

import javax.servlet.http.Cookie;
import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OAuth2LoginSuccessHandlerTest {

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private Authentication authentication;

    @Mock
    private CustomOAuth2User oAuth2User;

    @InjectMocks
    private OAuth2LoginSuccessHandler handler;

    private MockHttpServletRequest request;
    private MockHttpServletResponse response;

    @BeforeEach
    void setUp() {
        request = new MockHttpServletRequest();
        response = new MockHttpServletResponse();

        when(authentication.getPrincipal()).thenReturn(oAuth2User);
        when(oAuth2User.getEmail()).thenReturn("test@example.com");
        when(jwtUtil.generateToken(anyString())).thenReturn("test.jwt.token");
    }

    @Test
    void whenAuthenticationSuccess_thenSetsCookieAndRedirects() throws IOException {
        handler.onAuthenticationSuccess(request, response, authentication);

        Cookie[] cookies = response.getCookies();
        assertNotNull(cookies);
        assertTrue(cookies.length > 0);

        Cookie authCookie = cookies[0];
        assertEquals("auth_token", authCookie.getName());
        assertEquals("test.jwt.token", authCookie.getValue());
        assertTrue(authCookie.isHttpOnly());
        assertEquals("/", authCookie.getPath());

        assertEquals(302, response.getStatus()); // Redirect status code
        assertNotNull(response.getHeader("Location")); // Redirect URL is set
    }

    @Test
    void whenInProduction_thenSetsCookieWithSecureFlag() throws IOException {
        // Simulate production environment
        handler = new OAuth2LoginSuccessHandler(
            jwtUtil,
            "https://example.com",
            3600,
            "prod"
        );

        handler.onAuthenticationSuccess(request, response, authentication);

        Cookie[] cookies = response.getCookies();
        assertNotNull(cookies);
        assertTrue(cookies.length > 0);
        assertTrue(cookies[0].getSecure());
        assertEquals("Strict", cookies[0].getAttribute("SameSite"));
    }
}