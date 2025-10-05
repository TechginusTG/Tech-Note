package com.example.technote.oauth;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

public class CustomOAuth2User implements OAuth2User {

    private final OAuth2User oauth2User;
    private final String provider;
    private final Map<String, Object> attributes;
    private final Collection<GrantedAuthority> authorities;
    private final String email;
    private final String name;

    public CustomOAuth2User(OAuth2User oauth2User, String provider) {
        this.oauth2User = oauth2User;
        this.provider = provider;
        this.attributes = oauth2User.getAttributes();
        this.authorities = new ArrayList<>(oauth2User.getAuthorities());
        this.authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        
        // Provider-specific attribute mapping
        if ("github".equals(provider)) {
            this.email = (String) attributes.get("email");
            this.name = (String) attributes.get("login");
        } else if ("google".equals(provider)) {
            this.email = (String) attributes.get("email");
            this.name = (String) attributes.get("name");
        } else {
            throw new IllegalArgumentException("Unsupported OAuth2 provider: " + provider);
        }
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getProvider() {
        return provider;
    }

    public String getId() {
        if ("github".equals(provider)) {
            return attributes.get("id").toString();
        } else if ("google".equals(provider)) {
            return (String) attributes.get("sub");
        }
        throw new IllegalStateException("Provider ID not found for provider: " + provider);
    }
}
