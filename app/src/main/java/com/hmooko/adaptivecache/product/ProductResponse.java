package com.hmooko.adaptivecache.product;

import java.time.Instant;

public record ProductResponse(
        Long id,
        String name,
        Integer price,
        Instant updatedAt,
        Long version
) {
    public static ProductResponse from(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getPrice(),
                product.getUpdatedAt(),
                product.getVersion()
        );
    }
}
