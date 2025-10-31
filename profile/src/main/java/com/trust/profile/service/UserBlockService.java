package com.trust.profile.service;

import com.trust.profile.entity.UserBlock;
import com.trust.profile.repository.UserBlockRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserBlockService {
    @Autowired
    private UserBlockRepository blockRepository;

    @Transactional
    public UserBlock blockUser(Long blockerId, Long blockedId) {
        if (blockerId.equals(blockedId)) {
            throw new IllegalArgumentException("Нельзя заблокировать себя");
        }
        if (blockRepository.existsByBlockerUserIdAndBlockedUserId(blockerId, blockedId)) {
            throw new IllegalArgumentException("Пользователь уже заблокирован");
        }
        UserBlock block = new UserBlock();
        block.setBlockerUserId(blockerId);
        block.setBlockedUserId(blockedId);
        block.setBlockedAt(java.time.LocalDateTime.now());
        return blockRepository.save(block);
        // TODO: скрытие из поиска, ограничение сообщений
    }

    @Transactional
    public void unblockUser(Long blockerId, Long blockedId) {
        UserBlock block = blockRepository.findByBlockerUserIdAndBlockedUserId(blockerId, blockedId)
                .orElseThrow(() -> new IllegalArgumentException("Блокировка не найдена"));
        blockRepository.delete(block);
    }

    public boolean isBlocked(Long blockerId, Long blockedId) {
        return blockRepository.existsByBlockerUserIdAndBlockedUserId(blockerId, blockedId);
    }

    public List<UserBlock> getBlockedUsers(Long userId) {
        return blockRepository.findByBlockerUserId(userId);
    }
}

