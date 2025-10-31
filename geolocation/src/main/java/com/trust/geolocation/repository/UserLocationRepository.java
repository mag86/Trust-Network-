package com.trust.geolocation.repository;

import com.trust.geolocation.entity.UserLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserLocationRepository extends JpaRepository<UserLocation, Long> {
    Optional<UserLocation> findByUserId(Long userId);

    // Поиск пользователей в радиусе (Haversine формула)
    @Query(value = "SELECT *, " +
            "(6371 * acos(cos(radians(:lat)) * cos(radians(latitude)) * " +
            "cos(radians(longitude) - radians(:lon)) + sin(radians(:lat)) * " +
            "sin(radians(latitude)))) AS distance " +
            "FROM user_locations " +
            "WHERE (6371 * acos(cos(radians(:lat)) * cos(radians(latitude)) * " +
            "cos(radians(longitude) - radians(:lon)) + sin(radians(:lat)) * " +
            "sin(radians(latitude)))) <= :radiusKm " +
            "ORDER BY distance " +
            "LIMIT :limit", nativeQuery = true)
    List<UserLocation> findNearbyUsers(@Param("lat") double latitude,
                                       @Param("lon") double longitude,
                                       @Param("radiusKm") double radiusKm,
                                       @Param("limit") int limit);

    List<UserLocation> findByUpdatedAtAfter(LocalDateTime date);
}

