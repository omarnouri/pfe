package com.sopra.pfe.repository;

import com.sopra.pfe.domain.Rss;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Rss entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RssRepository extends JpaRepository<Rss, Long> {}
