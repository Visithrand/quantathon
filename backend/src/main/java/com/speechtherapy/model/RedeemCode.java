package com.speechtherapy.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "redeem_codes")
public class RedeemCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "code", nullable = false, unique = true, length = 64)
    private String code;

    @Column(name = "points_threshold", nullable = false)
    private Integer pointsThreshold; // e.g., 500, 1000, etc.

    @Column(name = "used", nullable = false)
    private boolean used = false;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "used_at")
    private LocalDateTime usedAt;

    public RedeemCode() {}

    public RedeemCode(User user, String code, Integer pointsThreshold) {
        this.user = user;
        this.code = code;
        this.pointsThreshold = pointsThreshold;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public Integer getPointsThreshold() { return pointsThreshold; }
    public void setPointsThreshold(Integer pointsThreshold) { this.pointsThreshold = pointsThreshold; }

    public boolean isUsed() { return used; }
    public void setUsed(boolean used) { this.used = used; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUsedAt() { return usedAt; }
    public void setUsedAt(LocalDateTime usedAt) { this.usedAt = usedAt; }
}


