package com.techfix.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings (CorsRegistry registry) {
        registry.addMapping("/**") //todas rotas da api
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("POST","GET","PUT","PATCH","DELETE")
                .allowedHeaders("*") //content type, authorization
                .allowCredentials(true); //JWT tokens e cookies podem ser mandados
    }
}
