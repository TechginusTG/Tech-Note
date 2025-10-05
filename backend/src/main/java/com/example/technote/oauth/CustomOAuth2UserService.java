package com.example.technote.oauth;

import com.example.technote.user.User;
import com.example.technote.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private static final Logger logger = LoggerFactory.getLogger(CustomOAuth2UserService.class);

    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        
        try {
            return processOAuth2User(userRequest, oAuth2User);
        } catch (Exception ex) {
            logger.error("Error processing OAuth2 user", ex);
            throw new OAuth2AuthenticationException(ex.getMessage(), ex);
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest userRequest, OAuth2User oAuth2User) {
        String provider = userRequest.getClientRegistration().getRegistrationId();
        CustomOAuth2User customOAuth2User = new CustomOAuth2User(oAuth2User, provider);
        
        Optional<User> userOptional = userRepository.findByProviderAndProviderId(
            provider, 
            customOAuth2User.getId()
        );

        User user;
        if (userOptional.isPresent()) {
            user = userOptional.get();
            updateExistingUser(user, customOAuth2User);
        } else {
            user = registerNewUser(customOAuth2User);
        }

        userRepository.save(user);
        return customOAuth2User;
    }

    private User registerNewUser(CustomOAuth2User oAuth2User) {
        User user = new User();
        user.setProvider(oAuth2User.getProvider());
        user.setProviderId(oAuth2User.getId());
        user.setEmail(oAuth2User.getEmail());
        user.setUsername(oAuth2User.getName());
        user.setEnabled(true);
        return user;
    }

    private void updateExistingUser(User user, CustomOAuth2User oAuth2User) {
        // Update user information if needed
        if (!user.getEmail().equals(oAuth2User.getEmail())) {
            user.setEmail(oAuth2User.getEmail());
        }
        if (!user.getUsername().equals(oAuth2User.getName())) {
            user.setUsername(oAuth2User.getName());
        }
    }
}
