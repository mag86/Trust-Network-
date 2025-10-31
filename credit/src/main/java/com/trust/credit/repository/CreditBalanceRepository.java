package com.trust.credit.repository;

import com.trust.credit.entity.CreditBalance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CreditBalanceRepository extends JpaRepository<CreditBalance, Long> {
    Optional<CreditBalance> findByUserId(Long userId);
}

