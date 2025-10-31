package com.trust.credit.repository;

import com.trust.credit.entity.EscrowTransaction;
import com.trust.credit.entity.EscrowStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EscrowTransactionRepository extends JpaRepository<EscrowTransaction, Long> {
    Optional<EscrowTransaction> findByTaskId(Long taskId);
    List<EscrowTransaction> findByStatus(EscrowStatus status);
    List<EscrowTransaction> findByCreatorId(Long creatorId);
}

