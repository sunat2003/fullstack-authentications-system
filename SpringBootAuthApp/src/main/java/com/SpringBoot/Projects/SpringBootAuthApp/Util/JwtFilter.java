package com.SpringBoot.Projects.SpringBootAuthApp.Util;


import com.SpringBoot.Projects.SpringBootAuthApp.DTO.ErrorMessage;
import com.SpringBoot.Projects.SpringBootAuthApp.Repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    ErrorMessage errorMessage;

//    // List of paths that don't require token validation
//    private static final List<String> PUBLIC_PATHS = List.of(
//            "/api/auth/login",
//            "/api/auth/register"
//    );
//
//    // Skip filter for public paths
//    @Override
//    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
//        return PUBLIC_PATHS.contains(request.getServletPath());
//    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");

        // If no token in the header, return 403 Forbidden response
        if (header == null || !header.startsWith("Bearer ")) {
            errorMessage.sendErrorResponse(response, "Missing or invalid Authorization header");
            return;
        }

        // Extract token from header
        String token = header.substring(7);

        // Validate the token
        if (!jwtUtil.validateToken(token)) {
            errorMessage.sendErrorResponse(response, "Invalid or expired token");
            return;
        }

        // If token is valid, continue the request chain
        chain.doFilter(request, response);
    }
}
