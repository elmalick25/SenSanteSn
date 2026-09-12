package org.sensante.sn.Config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    public static final String SECURITY_SCHEME_NAME = "BearerAuth";

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("SenSanté API — Ministère de la Santé et de l'Action Sociale")
                        .version("1.0.0")
                        .description("Plateforme Nationale de Santé Infantile, Triage Nutritionnel & Lutte contre la Malnutrition Aiguë (MAS/MAM) au Sénégal.")
                        .contact(new Contact()
                                .name("Direction de la Santé de la Mère et de l'Enfant (DSME / MSAS)")
                                .email("contact@sensante.sn")
                                .url("https://sensante.sn"))
                        .license(new License()
                                .name("Souveraineté Sanitaire Numérique Sénégal")
                                .url("https://secante.sn/licence")))
                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
                .components(new Components()
                        .addSecuritySchemes(SECURITY_SCHEME_NAME,
                                new SecurityScheme()
                                        .name(SECURITY_SCHEME_NAME)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Entrez le jeton JWT obtenu via /api/auth/login sans le préfixe 'Bearer '.")));
    }
}
