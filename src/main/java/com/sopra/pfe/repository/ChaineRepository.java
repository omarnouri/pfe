package com.sopra.pfe.repository;

import com.sopra.pfe.domain.Chaine;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Chaine entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ChaineRepository extends JpaRepository<Chaine, Long> {}
