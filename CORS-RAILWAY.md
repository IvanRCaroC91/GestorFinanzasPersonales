# CORS Configuration for Railway Backend

## Required CORS Configuration

Your Railway backend needs to be configured to accept requests from Vercel frontend domains.

## Origins to Allow

### Development
```javascript
'http://localhost:5173',
'http://localhost:3000',
'http://10.40.0.52:5173',
'http://192.168.1.16:5173'
```

### Production (Vercel)
```javascript
'https://tu-app.vercel.app',
'https://*.vercel.app'
```

## Example Spring Boot Configuration

```java
@Configuration
@EnableWebSecurity
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(
                    "http://localhost:5173",
                    "http://localhost:3000",
                    "http://10.40.0.52:5173",
                    "http://192.168.1.16:5173",
                    "https://tu-app.vercel.app",
                    "https://*.vercel.app"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders(
                    "Content-Type",
                    "Authorization",
                    "X-User-Id"
                )
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

## Example Express.js Configuration

```javascript
const cors = require('cors');

const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://10.40.0.52:5173',
        'http://192.168.1.16:5173',
        'https://tu-app.vercel.app',
        /^https:\/\/.*\.vercel\.app$/
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-User-Id']
};

app.use(cors(corsOptions));
```

## Headers Required

### Request Headers (Frontend sends)
- `Authorization: Bearer <JWT_TOKEN>`
- `X-User-Id: <USER_ID>`
- `Content-Type: application/json`

### Response Headers (Backend must send)
- `Access-Control-Allow-Origin: <origin>`
- `Access-Control-Allow-Credentials: true`
- `Access-Control-Allow-Headers: Content-Type, Authorization, X-User-Id`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`

## Testing CORS

You can test CORS with curl:

```bash
# Test preflight request
curl -X OPTIONS \
  -H "Origin: https://tu-app.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Authorization, X-User-Id" \
  https://eureka-copy-production.up.railway.app/api/v1/auth/login

# Test actual request
curl -X POST \
  -H "Origin: https://tu-app.vercel.app" \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test"}' \
  https://eureka-copy-production.up.railway.app/api/v1/auth/login
```

## Common Issues

1. **CORS Policy Error**: Backend not allowing the frontend origin
2. **Credentials not allowed**: Missing `allowCredentials: true`
3. **Headers not allowed**: Missing specific headers in allowedHeaders
4. **Methods not allowed**: Missing OPTIONS method for preflight

## Railway Specific Notes

- Railway automatically provides HTTPS
- Your app URL is: `https://eureka-copy-production.up.railway.app`
- Make sure your backend listens on the correct port (Railway provides PORT env var)
- Railway's internal network: `eureka-copy.railway.internal`
