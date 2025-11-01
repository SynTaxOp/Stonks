package com.stonks.dto;

import com.stonks.dto.MFAPIDTOs.MutualFundNavDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NavDateDTO {
    private String date;
    private Double nav;

    public NavDateDTO(MutualFundNavDTO dto) {
        this.date = dto.getDate();
        this.nav = Double.parseDouble(dto.getNav());
    }
}
