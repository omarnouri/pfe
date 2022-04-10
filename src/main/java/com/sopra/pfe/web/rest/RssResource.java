package com.sopra.pfe.web.rest;

import com.sopra.pfe.domain.Rss;
import com.sopra.pfe.repository.RssRepository;
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
 * REST controller for managing {@link com.sopra.pfe.domain.Rss}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class RssResource {

    private final Logger log = LoggerFactory.getLogger(RssResource.class);

    private static final String ENTITY_NAME = "rss";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RssRepository rssRepository;

    public RssResource(RssRepository rssRepository) {
        this.rssRepository = rssRepository;
    }

    /**
     * {@code POST  /rsses} : Create a new rss.
     *
     * @param rss the rss to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new rss, or with status {@code 400 (Bad Request)} if the rss has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/rsses")
    public ResponseEntity<Rss> createRss(@Valid @RequestBody Rss rss) throws URISyntaxException {
        log.debug("REST request to save Rss : {}", rss);
        if (rss.getId() != null) {
            throw new BadRequestAlertException("A new rss cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Rss result = rssRepository.save(rss);
        return ResponseEntity
            .created(new URI("/api/rsses/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /rsses/:id} : Updates an existing rss.
     *
     * @param id the id of the rss to save.
     * @param rss the rss to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated rss,
     * or with status {@code 400 (Bad Request)} if the rss is not valid,
     * or with status {@code 500 (Internal Server Error)} if the rss couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/rsses/{id}")
    public ResponseEntity<Rss> updateRss(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Rss rss)
        throws URISyntaxException {
        log.debug("REST request to update Rss : {}, {}", id, rss);
        if (rss.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, rss.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!rssRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Rss result = rssRepository.save(rss);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, rss.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /rsses/:id} : Partial updates given fields of an existing rss, field will ignore if it is null
     *
     * @param id the id of the rss to save.
     * @param rss the rss to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated rss,
     * or with status {@code 400 (Bad Request)} if the rss is not valid,
     * or with status {@code 404 (Not Found)} if the rss is not found,
     * or with status {@code 500 (Internal Server Error)} if the rss couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/rsses/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Rss> partialUpdateRss(@PathVariable(value = "id", required = false) final Long id, @NotNull @RequestBody Rss rss)
        throws URISyntaxException {
        log.debug("REST request to partial update Rss partially : {}, {}", id, rss);
        if (rss.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, rss.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!rssRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Rss> result = rssRepository
            .findById(rss.getId())
            .map(existingRss -> {
                if (rss.getTitre() != null) {
                    existingRss.setTitre(rss.getTitre());
                }
                if (rss.getUrl() != null) {
                    existingRss.setUrl(rss.getUrl());
                }
                if (rss.getEstActive() != null) {
                    existingRss.setEstActive(rss.getEstActive());
                }

                return existingRss;
            })
            .map(rssRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, rss.getId().toString())
        );
    }

    /**
     * {@code GET  /rsses} : get all the rsses.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of rsses in body.
     */
    @GetMapping("/rsses")
    public List<Rss> getAllRsses() {
        log.debug("REST request to get all Rsses");
        return rssRepository.findAll();
    }

    /**
     * {@code GET  /rsses/:id} : get the "id" rss.
     *
     * @param id the id of the rss to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the rss, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/rsses/{id}")
    public ResponseEntity<Rss> getRss(@PathVariable Long id) {
        log.debug("REST request to get Rss : {}", id);
        Optional<Rss> rss = rssRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(rss);
    }

    /**
     * {@code DELETE  /rsses/:id} : delete the "id" rss.
     *
     * @param id the id of the rss to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/rsses/{id}")
    public ResponseEntity<Void> deleteRss(@PathVariable Long id) {
        log.debug("REST request to delete Rss : {}", id);
        rssRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
