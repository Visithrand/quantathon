package com.speechtherapy.repository;

import com.speechtherapy.model.RedeemCode;
import com.speechtherapy.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface RedeemCodeRepository extends JpaRepository<RedeemCode, Long> {

    Optional<RedeemCode> findByCode(String code);

    @Query("select r from RedeemCode r where r.user = :user and r.pointsThreshold = :threshold")
    List<RedeemCode> findByUserAndThreshold(@Param("user") User user, @Param("threshold") Integer threshold);
}


