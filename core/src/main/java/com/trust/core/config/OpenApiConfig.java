package com.trust.core.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI trustNetworkOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Trust Network API")
                        .description("API документация для платформы Trust Network - платформа для доверительных взаимоотношений и выполнения задач")
                        .version("v0.0.1")
                        .contact(new Contact()
                                .name("Trust Network Team")
                                .email("support@trust-network.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")));
    }
}

