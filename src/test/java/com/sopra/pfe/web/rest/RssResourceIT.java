package com.sopra.pfe.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.sopra.pfe.IntegrationTest;
import com.sopra.pfe.domain.Rss;
import com.sopra.pfe.repository.RssRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link RssResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class RssResourceIT {

    private static final String DEFAULT_TITRE = "AAAAAAAAAA";
    private static final String UPDATED_TITRE = "BBBBBBBBBB";

    private static final String DEFAULT_URL = "AAAAAAAAAA";
    private static final String UPDATED_URL = "BBBBBBBBBB";

    private static final Boolean DEFAULT_EST_ACTIVE = false;
    private static final Boolean UPDATED_EST_ACTIVE = true;

    private static final String ENTITY_API_URL = "/api/rsses";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private RssRepository rssRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRssMockMvc;

    private Rss rss;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Rss createEntity(EntityManager em) {
        Rss rss = new Rss().titre(DEFAULT_TITRE).url(DEFAULT_URL).estActive(DEFAULT_EST_ACTIVE);
        return rss;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Rss createUpdatedEntity(EntityManager em) {
        Rss rss = new Rss().titre(UPDATED_TITRE).url(UPDATED_URL).estActive(UPDATED_EST_ACTIVE);
        return rss;
    }

    @BeforeEach
    public void initTest() {
        rss = createEntity(em);
    }

    @Test
    @Transactional
    void createRss() throws Exception {
        int databaseSizeBeforeCreate = rssRepository.findAll().size();
        // Create the Rss
        restRssMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(rss)))
            .andExpect(status().isCreated());

        // Validate the Rss in the database
        List<Rss> rssList = rssRepository.findAll();
        assertThat(rssList).hasSize(databaseSizeBeforeCreate + 1);
        Rss testRss = rssList.get(rssList.size() - 1);
        assertThat(testRss.getTitre()).isEqualTo(DEFAULT_TITRE);
        assertThat(testRss.getUrl()).isEqualTo(DEFAULT_URL);
        assertThat(testRss.getEstActive()).isEqualTo(DEFAULT_EST_ACTIVE);
    }

    @Test
    @Transactional
    void createRssWithExistingId() throws Exception {
        // Create the Rss with an existing ID
        rss.setId(1L);

        int databaseSizeBeforeCreate = rssRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRssMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(rss)))
            .andExpect(status().isBadRequest());

        // Validate the Rss in the database
        List<Rss> rssList = rssRepository.findAll();
        assertThat(rssList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkTitreIsRequired() throws Exception {
        int databaseSizeBeforeTest = rssRepository.findAll().size();
        // set the field null
        rss.setTitre(null);

        // Create the Rss, which fails.

        restRssMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(rss)))
            .andExpect(status().isBadRequest());

        List<Rss> rssList = rssRepository.findAll();
        assertThat(rssList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkUrlIsRequired() throws Exception {
        int databaseSizeBeforeTest = rssRepository.findAll().size();
        // set the field null
        rss.setUrl(null);

        // Create the Rss, which fails.

        restRssMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(rss)))
            .andExpect(status().isBadRequest());

        List<Rss> rssList = rssRepository.findAll();
        assertThat(rssList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllRsses() throws Exception {
        // Initialize the database
        rssRepository.saveAndFlush(rss);

        // Get all the rssList
        restRssMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(rss.getId().intValue())))
            .andExpect(jsonPath("$.[*].titre").value(hasItem(DEFAULT_TITRE)))
            .andExpect(jsonPath("$.[*].url").value(hasItem(DEFAULT_URL)))
            .andExpect(jsonPath("$.[*].estActive").value(hasItem(DEFAULT_EST_ACTIVE.booleanValue())));
    }

    @Test
    @Transactional
    void getRss() throws Exception {
        // Initialize the database
        rssRepository.saveAndFlush(rss);

        // Get the rss
        restRssMockMvc
            .perform(get(ENTITY_API_URL_ID, rss.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(rss.getId().intValue()))
            .andExpect(jsonPath("$.titre").value(DEFAULT_TITRE))
            .andExpect(jsonPath("$.url").value(DEFAULT_URL))
            .andExpect(jsonPath("$.estActive").value(DEFAULT_EST_ACTIVE.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingRss() throws Exception {
        // Get the rss
        restRssMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewRss() throws Exception {
        // Initialize the database
        rssRepository.saveAndFlush(rss);

        int databaseSizeBeforeUpdate = rssRepository.findAll().size();

        // Update the rss
        Rss updatedRss = rssRepository.findById(rss.getId()).get();
        // Disconnect from session so that the updates on updatedRss are not directly saved in db
        em.detach(updatedRss);
        updatedRss.titre(UPDATED_TITRE).url(UPDATED_URL).estActive(UPDATED_EST_ACTIVE);

        restRssMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRss.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedRss))
            )
            .andExpect(status().isOk());

        // Validate the Rss in the database
        List<Rss> rssList = rssRepository.findAll();
        assertThat(rssList).hasSize(databaseSizeBeforeUpdate);
        Rss testRss = rssList.get(rssList.size() - 1);
        assertThat(testRss.getTitre()).isEqualTo(UPDATED_TITRE);
        assertThat(testRss.getUrl()).isEqualTo(UPDATED_URL);
        assertThat(testRss.getEstActive()).isEqualTo(UPDATED_EST_ACTIVE);
    }

    @Test
    @Transactional
    void putNonExistingRss() throws Exception {
        int databaseSizeBeforeUpdate = rssRepository.findAll().size();
        rss.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRssMockMvc
            .perform(
                put(ENTITY_API_URL_ID, rss.getId()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(rss))
            )
            .andExpect(status().isBadRequest());

        // Validate the Rss in the database
        List<Rss> rssList = rssRepository.findAll();
        assertThat(rssList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRss() throws Exception {
        int databaseSizeBeforeUpdate = rssRepository.findAll().size();
        rss.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRssMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rss))
            )
            .andExpect(status().isBadRequest());

        // Validate the Rss in the database
        List<Rss> rssList = rssRepository.findAll();
        assertThat(rssList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRss() throws Exception {
        int databaseSizeBeforeUpdate = rssRepository.findAll().size();
        rss.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRssMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(rss)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Rss in the database
        List<Rss> rssList = rssRepository.findAll();
        assertThat(rssList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRssWithPatch() throws Exception {
        // Initialize the database
        rssRepository.saveAndFlush(rss);

        int databaseSizeBeforeUpdate = rssRepository.findAll().size();

        // Update the rss using partial update
        Rss partialUpdatedRss = new Rss();
        partialUpdatedRss.setId(rss.getId());

        restRssMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRss.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRss))
            )
            .andExpect(status().isOk());

        // Validate the Rss in the database
        List<Rss> rssList = rssRepository.findAll();
        assertThat(rssList).hasSize(databaseSizeBeforeUpdate);
        Rss testRss = rssList.get(rssList.size() - 1);
        assertThat(testRss.getTitre()).isEqualTo(DEFAULT_TITRE);
        assertThat(testRss.getUrl()).isEqualTo(DEFAULT_URL);
        assertThat(testRss.getEstActive()).isEqualTo(DEFAULT_EST_ACTIVE);
    }

    @Test
    @Transactional
    void fullUpdateRssWithPatch() throws Exception {
        // Initialize the database
        rssRepository.saveAndFlush(rss);

        int databaseSizeBeforeUpdate = rssRepository.findAll().size();

        // Update the rss using partial update
        Rss partialUpdatedRss = new Rss();
        partialUpdatedRss.setId(rss.getId());

        partialUpdatedRss.titre(UPDATED_TITRE).url(UPDATED_URL).estActive(UPDATED_EST_ACTIVE);

        restRssMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRss.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRss))
            )
            .andExpect(status().isOk());

        // Validate the Rss in the database
        List<Rss> rssList = rssRepository.findAll();
        assertThat(rssList).hasSize(databaseSizeBeforeUpdate);
        Rss testRss = rssList.get(rssList.size() - 1);
        assertThat(testRss.getTitre()).isEqualTo(UPDATED_TITRE);
        assertThat(testRss.getUrl()).isEqualTo(UPDATED_URL);
        assertThat(testRss.getEstActive()).isEqualTo(UPDATED_EST_ACTIVE);
    }

    @Test
    @Transactional
    void patchNonExistingRss() throws Exception {
        int databaseSizeBeforeUpdate = rssRepository.findAll().size();
        rss.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRssMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, rss.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(rss))
            )
            .andExpect(status().isBadRequest());

        // Validate the Rss in the database
        List<Rss> rssList = rssRepository.findAll();
        assertThat(rssList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRss() throws Exception {
        int databaseSizeBeforeUpdate = rssRepository.findAll().size();
        rss.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRssMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(rss))
            )
            .andExpect(status().isBadRequest());

        // Validate the Rss in the database
        List<Rss> rssList = rssRepository.findAll();
        assertThat(rssList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRss() throws Exception {
        int databaseSizeBeforeUpdate = rssRepository.findAll().size();
        rss.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRssMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(rss)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Rss in the database
        List<Rss> rssList = rssRepository.findAll();
        assertThat(rssList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRss() throws Exception {
        // Initialize the database
        rssRepository.saveAndFlush(rss);

        int databaseSizeBeforeDelete = rssRepository.findAll().size();

        // Delete the rss
        restRssMockMvc.perform(delete(ENTITY_API_URL_ID, rss.getId()).accept(MediaType.APPLICATION_JSON)).andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Rss> rssList = rssRepository.findAll();
        assertThat(rssList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
