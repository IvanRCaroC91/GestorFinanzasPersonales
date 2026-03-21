# Configuración CORS para Backend Spring Boot

## Problema
El backend está enviando múltiples valores en la cabecera `Access-Control-Allow-Origin`: `'http://localhost:5173, *'`

## Solución Correcta

### 1. Configuración CORS Recomendada (Solo para tu frontend)

```java
@Configuration
@EnableWebMvc
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/v1/**")
                .allowedOrigins("http://localhost:5173")  // Solo tu frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

### 2. Si usas @CrossOrigin en controladores

```java
@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {
    // ...
}
```

### 3. Configuración Global (si usas Spring Security)

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            // ... otras configuraciones
        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/v1/**", configuration);
        return source;
    }
}
```

## Errores Comunes a Evitar

❌ **NO HACER ESTO:**
```java
// Esto causa el error
configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "*"));
```

❌ **NO USAR * con allowCredentials(true):**
```java
// Esto no funciona
configuration.setAllowedOrigins(Arrays.asList("*"));
configuration.setAllowCredentials(true);
```

## Verificación

Después de configurar, verifica que las cabeceras sean:

```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: *
```

## Para Desarrollo Rápido (No producción)

Si necesitas una solución temporal para desarrollo:

```java
@Configuration
public class CorsConfig {
    
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/v1/**")
                        .allowedOrigins("http://localhost:5173")
                        .allowedMethods("*")
                        .allowedHeaders("*")
                        .allowCredentials(false);  // false si es solo desarrollo
            }
        };
    }
}
```
