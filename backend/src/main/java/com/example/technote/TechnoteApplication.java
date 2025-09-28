package com.example.technote;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class TechnoteApplication {

	public static void main(String[] args) {
		SpringApplication.run(TechnoteApplication.class, args);
    System.out.printf("Backen seerver Started");
	}

}
