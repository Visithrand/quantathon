package com.speechtherapy.controller;

import com.speechtherapy.model.RedeemCode;
import com.speechtherapy.repository.RedeemCodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/redeem-code")
@CrossOrigin(origins = "*")
public class RedeemCodeController {

    @Autowired
    private RedeemCodeRepository redeemCodeRepository;

    @GetMapping("/{id}")
    public ResponseEntity<RedeemCode> getById(@PathVariable Long id) {
        return redeemCodeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}")
    public ResponseEntity<?> markUsed(@PathVariable Long id) {
        return redeemCodeRepository.findById(id).map(code -> {
            if (!code.isUsed()) {
                code.setUsed(true);
                code.setUsedAt(LocalDateTime.now());
                redeemCodeRepository.save(code);
            }
            return ResponseEntity.ok(Map.of("message", "Redeem code marked as used"));
        }).orElse(ResponseEntity.notFound().build());
    }
}


