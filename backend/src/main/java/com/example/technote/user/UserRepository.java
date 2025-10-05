package com.example.technote.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByProviderAndProviderId(String provider, String providerId);
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.enabled = true AND u.lastLoginAt < :date")
    List<User> findInactiveUsers(@Param("date") LocalDateTime date);
    
    @Modifying
    @Query("UPDATE User u SET u.lastLoginAt = CURRENT_TIMESTAMP WHERE u.id = :userId")
    void updateLastLoginTime(@Param("userId") Long userId);
    
    @Query("SELECT u FROM User u WHERE :role MEMBER OF u.roles")
    List<User> findByRole(@Param("role") String role);
    
    @Modifying
    @Query("UPDATE User u SET u.emailVerified = true WHERE u.id = :userId")
    void verifyEmail(@Param("userId") Long userId);
}
