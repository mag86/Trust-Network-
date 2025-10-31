package com.trust.profile.controller;

import com.trust.profile.entity.UserBlock;
import com.trust.profile.service.UserBlockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profiles/{userId}/blocks")
public class UserBlockController {
    @Autowired
    private UserBlockService blockService;

    @PostMapping("/{blockedId}")
    public ResponseEntity<UserBlock> blockUser(@PathVariable Long userId,
                                               @PathVariable Long blockedId) {
        UserBlock block = blockService.blockUser(userId, blockedId);
        return ResponseEntity.ok(block);
    }

    @DeleteMapping("/{blockedId}")
    public ResponseEntity<Void> unblockUser(@PathVariable Long userId,
                                           @PathVariable Long blockedId) {
        blockService.unblockUser(userId, blockedId);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<UserBlock>> getBlockedUsers(@PathVariable Long userId) {
        return ResponseEntity.ok(blockService.getBlockedUsers(userId));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleBadRequest(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}

