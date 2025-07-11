package com.fileflow.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${fileflow.jwt.secret}")
    private String jwtSecret;

    @Value("${fileflow.jwt.expiration}")
    private long jwtExpirationMs;

    private SecretKey getSigningKey() {
        // Créer une clé sécurisée à partir du secret
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String generateToken(String username) {
        return Jwts.builder()
                .subject(username)  // Nouvelle API : subject() au lieu de setSubject()
                .issuedAt(new Date())  // Nouvelle API : issuedAt() au lieu de setIssuedAt()
                .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))  // Nouvelle API : expiration()
                .signWith(getSigningKey())  // Nouvelle API : signWith() avec SecretKey
                .compact();
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parser()  // Nouvelle API : parser() remplacé par parserBuilder()
                .verifyWith(getSigningKey())  // Nouvelle API : verifyWith() au lieu de setSigningKey()
                .build()
                .parseSignedClaims(token)  // Nouvelle API : parseSignedClaims() au lieu de parseClaimsJws()
                .getPayload()  // Nouvelle API : getPayload() au lieu de getBody()
                .getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())  // Nouvelle API : verifyWith()
                    .build()
                    .parseSignedClaims(authToken);  // Nouvelle API : parseSignedClaims()
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}