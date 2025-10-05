package com.example.technote.config;

import com.example.technote.oauth.CustomOAuth2UserService;
import com.example.technote.oauth.OAuth2LoginSuccessHandler;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class SecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CustomOAuth2UserService customOAuth2UserService;

    @MockBean
    private OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

    @Test
    void whenPublicEndpoint_thenAllowsAccess() throws Exception {
        mockMvc.perform(get("/oauth2/authorization/github"))
                .andExpect(status().isOk());
    }

    @Test
    void whenSwaggerEndpoint_thenAllowsAccess() throws Exception {
        mockMvc.perform(get("/swagger-ui/index.html"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "USER")
    void whenAuthenticatedUser_thenAllowsAccess() throws Exception {
        mockMvc.perform(get("/api/user/me"))
                .andExpect(status().isOk());
    }

    @Test
    void whenUnauthenticatedUser_thenReturns401() throws Exception {
        mockMvc.perform(get("/api/user/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "USER")
    void whenUserAccessingAdminEndpoint_thenReturns403() throws Exception {
        mockMvc.perform(get("/api/admin/users"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void whenAdminAccessingAdminEndpoint_thenAllowsAccess() throws Exception {
        mockMvc.perform(get("/api/admin/users"))
                .andExpect(status().isOk());
    }
}