package com.trust.profile.controller;

import com.trust.profile.dto.TagAddRequest;
import com.trust.profile.entity.Tag;
import com.trust.profile.service.TagService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/profiles/{userId}/tags")
public class TagController {
    @Autowired
    private TagService tagService;

    @GetMapping
    public ResponseEntity<List<Tag>> getUserTags(@PathVariable Long userId) {
        return ResponseEntity.ok(tagService.getUserTags(userId));
    }

    @PostMapping
    public ResponseEntity<Tag> addTag(@PathVariable Long userId,
                                      @Valid @RequestBody TagAddRequest request) {
        Tag tag = tagService.addTag(userId, request);
        return ResponseEntity.ok(tag);
    }

    @DeleteMapping("/{tagId}")
    public ResponseEntity<Void> removeTag(@PathVariable Long userId, @PathVariable Long tagId) {
        tagService.removeTag(tagId, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/popular")
    public ResponseEntity<List<Tag>> getPopularTags() {
        return ResponseEntity.ok(tagService.getPopularTags());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleBadRequest(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}

