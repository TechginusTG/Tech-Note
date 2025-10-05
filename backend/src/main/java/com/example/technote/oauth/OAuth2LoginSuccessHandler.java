package com.example.technote.oauth;

import com.example.technote.config.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    
    private final JwtUtil jwtUtil;
    private final String defaultRedirectUrl;
    private final int cookieMaxAge;
    private final boolean isProduction;

    public OAuth2LoginSuccessHandler(
            JwtUtil jwtUtil,
            @Value("${app.oauth2.redirectUri:http://localhost:3000}") String defaultRedirectUrl,
            @Value("${app.oauth2.cookieMaxAge:604800}") int cookieMaxAge,
            @Value("${spring.profiles.active:dev}") String activeProfile
    ) {
        this.jwtUtil = jwtUtil;
        this.defaultRedirectUrl = defaultRedirectUrl;
        this.cookieMaxAge = cookieMaxAge;
        this.isProduction = "prod".equals(activeProfile);
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {
        CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
        String token = jwtUtil.generateToken(oAuth2User.getEmail());

        addAuthCookie(response, token);
        
        String targetUrl = buildTargetUrl(token);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    private void addAuthCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie("auth_token", token);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(cookieMaxAge);
        
        if (isProduction) {
            cookie.setSecure(true);
            cookie.setAttribute("SameSite", "Strict");
        }
        
        response.addCookie(cookie);
    }

    private String buildTargetUrl(String token) {
        return UriComponentsBuilder.fromUriString(defaultRedirectUrl)
                .queryParam("token", token)
                .build()
                .toUriString();
    }
}
