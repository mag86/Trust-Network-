package com.trust.entity;

import jakarta.persistence.Embeddable;

@Embeddable
public class TrustScore {
    private Double value;
    private String level;
    // getters/setters/constructors
}
