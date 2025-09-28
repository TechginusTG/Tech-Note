package com.example.technote.oauth;

import com.example.technote.user.User;
import com.example.technote.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String provider = userRequest.getClientRegistration().getRegistrationId();
        String providerId = oAuth2User.getAttribute("id").toString();

        Optional<User> userOptional = userRepository.findByProviderAndProviderId(provider, providerId);

        User user;
        if (userOptional.isPresent()) {
            user = userOptional.get();
        } else {
            user = new User();
            user.setProvider(provider);
            user.setProviderId(providerId);
            Map<String, Object> attributes = oAuth2User.getAttributes();
            user.setUsername((String) attributes.get("login")); // github
            user.setEmail((String) attributes.get("email")); // google
            if (user.getUsername() == null) {
                user.setUsername((String) attributes.get("name")); // google
            }
            userRepository.save(user);
        }

        return new CustomOAuth2User(oAuth2User, provider);
    }
}
