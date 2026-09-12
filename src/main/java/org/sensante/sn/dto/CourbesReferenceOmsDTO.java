package org.sensante.sn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourbesReferenceOmsDTO {
    private List<Integer> moisAxe;
    private List<Double> plusUnSdKg;
    private List<Double> medianeKg;
    private List<Double> moinsDeuxSdKg;
    private List<Double> moinsTroisSdKg;
}
