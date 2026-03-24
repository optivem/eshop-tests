package com.optivem.eshop.dsl.driver.adapter.external.tax.client.dtos.error;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExtTaxErrorResponse {
    private String message;
}
