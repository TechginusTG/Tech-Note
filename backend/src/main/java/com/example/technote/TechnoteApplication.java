package com.example.technote.controller;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class TechnoteApplication {
    public static void main(String[] args) {
        SpringApplication.run(TechnoteApplication.class, args);
    }
}
