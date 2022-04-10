package com.sopra.pfe.web.rest;

import com.sopra.pfe.domain.Anomalie;
import com.sopra.pfe.repository.AnomalieRepository;
import com.sopra.pfe.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.sopra.pfe.domain.Anomalie}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AnomalieResource {

    private final Logger log = LoggerFactory.getLogger(AnomalieResource.class);

    private static final String ENTITY_NAME = "anomalie";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AnomalieRepository anomalieRepository;

    public AnomalieResource(AnomalieRepository anomalieRepository) {
        this.anomalieRepository = anomalieRepository;
    }

    /**
     * {@code POST  /anomalies} : Create a new anomalie.
     *
     * @param anomalie the anomalie to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new anomalie, or with status {@code 400 (Bad Request)} if the anomalie has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/anomalies")
    public ResponseEntity<Anomalie> createAnomalie(@Valid @RequestBody Anomalie anomalie) throws URISyntaxException {
        log.debug("REST request to save Anomalie : {}", anomalie);
        if (anomalie.getId() != null) {
            throw new BadRequestAlertException("A new anomalie cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Anomalie result = anomalieRepository.save(anomalie);
        return ResponseEntity
            .created(new URI("/api/anomalies/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /anomalies/:id} : Updates an existing anomalie.
     *
     * @param id the id of the anomalie to save.
     * @param anomalie the anomalie to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated anomalie,
     * or with status {@code 400 (Bad Request)} if the anomalie is not valid,
     * or with status {@code 500 (Internal Server Error)} if the anomalie couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/anomalies/{id}")
    public ResponseEntity<Anomalie> updateAnomalie(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Anomalie anomalie
    ) throws URISyntaxException {
        log.debug("REST request to update Anomalie : {}, {}", id, anomalie);
        if (anomalie.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, anomalie.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!anomalieRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Anomalie result = anomalieRepository.save(anomalie);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, anomalie.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /anomalies/:id} : Partial updates given fields of an existing anomalie, field will ignore if it is null
     *
     * @param id the id of the anomalie to save.
     * @param anomalie the anomalie to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated anomalie,
     * or with status {@code 400 (Bad Request)} if the anomalie is not valid,
     * or with status {@code 404 (Not Found)} if the anomalie is not found,
     * or with status {@code 500 (Internal Server Error)} if the anomalie couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/anomalies/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Anomalie> partialUpdateAnomalie(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Anomalie anomalie
    ) throws URISyntaxException {
        log.debug("REST request to partial update Anomalie partially : {}, {}", id, anomalie);
        if (anomalie.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, anomalie.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!anomalieRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Anomalie> result = anomalieRepository
            .findById(anomalie.getId())
            .map(existingAnomalie -> {
                if (anomalie.getMsgAno() != null) {
                    existingAnomalie.setMsgAno(anomalie.getMsgAno());
                }
                if (anomalie.getMsgSol() != null) {
                    existingAnomalie.setMsgSol(anomalie.getMsgSol());
                }

                return existingAnomalie;
            })
            .map(anomalieRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, anomalie.getId().toString())
        );
    }

    /**
     * {@code GET  /anomalies} : get all the anomalies.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of anomalies in body.
     */
    @GetMapping("/anomalies")
    public List<Anomalie> getAllAnomalies() {
        log.debug("REST request to get all Anomalies");
        return anomalieRepository.findAll();
    }

    /**
     * {@code GET  /anomalies/:id} : get the "id" anomalie.
     *
     * @param id the id of the anomalie to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the anomalie, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/anomalies/{id}")
    public ResponseEntity<Anomalie> getAnomalie(@PathVariable Long id) {
        log.debug("REST request to get Anomalie : {}", id);
        Optional<Anomalie> anomalie = anomalieRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(anomalie);
    }

    /**
     * {@code DELETE  /anomalies/:id} : delete the "id" anomalie.
     *
     * @param id the id of the anomalie to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/anomalies/{id}")
    public ResponseEntity<Void> deleteAnomalie(@PathVariable Long id) {
        log.debug("REST request to delete Anomalie : {}", id);
        anomalieRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
