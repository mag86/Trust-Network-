package com.trust.profile.service;

import com.trust.profile.dto.TagAddRequest;
import com.trust.profile.entity.Tag;
import com.trust.profile.entity.TagType;
import com.trust.profile.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TagService {
    @Autowired
    private TagRepository tagRepository;

    @Transactional
    public Tag addTag(Long userId, TagAddRequest request) {
        if (tagRepository.existsByUserIdAndName(userId, request.getName())) {
            throw new IllegalArgumentException("Тег уже существует");
        }
        Tag tag = new Tag();
        tag.setUserId(userId);
        tag.setName(request.getName());
        tag.setType(TagType.USER_DEFINED);
        tag.setAddedAt(java.time.LocalDateTime.now());
        return tagRepository.save(tag);
    }

    public List<Tag> getUserTags(Long userId) {
        return tagRepository.findByUserId(userId);
    }

    public List<Tag> getPopularTags() {
        return tagRepository.findByType(TagType.POPULAR);
    }

    @Transactional
    public void removeTag(Long tagId, Long userId) {
        Tag tag = tagRepository.findById(tagId)
                .orElseThrow(() -> new IllegalArgumentException("Тег не найден"));
        if (!tag.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Нельзя удалить чужой тег");
        }
        tagRepository.delete(tag);
    }

    // TODO: автодополнение при вводе тегов (FR3.3.2)
    // TODO: рекомендации тегов на основе навыков
    // TODO: автоматические теги на основе активности
}

