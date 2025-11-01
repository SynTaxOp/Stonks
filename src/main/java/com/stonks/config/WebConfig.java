package com.stonks.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.ResourceResolver;
import org.springframework.web.servlet.resource.ResourceResolverChain;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.List;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve static files from classpath:/static/
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/static/")
                .setCachePeriod(31536000); // Cache for 1 year
        
        // Handle all other routes - serve index.html for React Router
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new ReactRouterResourceResolver());
    }

    /**
     * Custom resource resolver to handle React Router.
     * For non-API routes, serve index.html
     */
    private static class ReactRouterResourceResolver implements ResourceResolver {
        
        private static final List<String> FILE_EXTENSIONS = Arrays.asList(
            ".html", ".js", ".json", ".css", ".png", ".jpg", ".jpeg", ".gif", 
            ".svg", ".woff", ".woff2", ".ttf", ".eot", ".ico"
        );

        @Override
        public Resource resolveResource(HttpServletRequest request, String requestPath,
                                       List<? extends Resource> locations, ResourceResolverChain chain) {
            // If it's an API request, don't handle it here
            if (requestPath.startsWith("api/")) {
                return null;
            }

            // Try to resolve the actual file
            Resource resource = chain.resolveResource(request, requestPath, locations);
            if (resource != null && resource.exists()) {
                return resource;
            }

            // If it's a file extension request and not found, return null (404)
            if (FILE_EXTENSIONS.stream().anyMatch(requestPath::endsWith)) {
                return null;
            }

            // For all other routes (React Router), serve index.html
            return new ClassPathResource("/static/index.html");
        }

        @Override
        public String resolveUrlPath(String resourcePath, List<? extends Resource> locations,
                                     ResourceResolverChain chain) {
            String urlPath = chain.resolveUrlPath(resourcePath, locations);
            if (urlPath != null) {
                return urlPath;
            }
            
            // For React Router paths, return the resource path
            if (resourcePath.startsWith("/") && !resourcePath.startsWith("/api")) {
                return resourcePath;
            }
            
            return null;
        }
    }
}

