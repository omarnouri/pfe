package com.sopra.pfe.repository;

import com.sopra.pfe.domain.Anomalie;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Anomalie entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AnomalieRepository extends JpaRepository<Anomalie, Long> {
    List<Anomalie> findByChaine_Id(Long chaineId);
}
