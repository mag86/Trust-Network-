package com.trust.reputation.entity;

public enum ReputationLevel {
    NOVICE(0, 29, "Новичок", "🔴"), // Красный
    EXPERIENCED(30, 59, "Опытный", "🟨"), // Желтый
    EXPERT(60, 84, "Эксперт", "🟦"), // Синий
    MASTER(85, 100, "Мастер", "🟩"); // Зеленый

    private final int minScore;
    private final int maxScore;
    private final String name;
    private final String icon;

    ReputationLevel(int min, int max, String name, String icon) {
        this.minScore = min;
        this.maxScore = max;
        this.name = name;
        this.icon = icon;
    }

    public static ReputationLevel fromScore(double score) {
        for (ReputationLevel level : values()) {
            if (score >= level.minScore && score <= level.maxScore) {
                return level;
            }
        }
        return NOVICE;
    }

    public int getMinScore() { return minScore; }
    public int getMaxScore() { return maxScore; }
    public String getName() { return name; }
    public String getIcon() { return icon; }
}

