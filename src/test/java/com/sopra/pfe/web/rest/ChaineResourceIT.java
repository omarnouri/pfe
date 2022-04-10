package com.sopra.pfe.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.sopra.pfe.IntegrationTest;
import com.sopra.pfe.domain.Chaine;
import com.sopra.pfe.repository.ChaineRepository;
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
 * Integration tests for the {@link ChaineResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ChaineResourceIT {

    private static final String DEFAULT_LIBELLE = "AAAAAAAAAA";
    private static final String UPDATED_LIBELLE = "BBBBBBBBBB";

    private static final String DEFAULT_PROCESS = "AAAAAAAAAA";
    private static final String UPDATED_PROCESS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/chaines";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ChaineRepository chaineRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restChaineMockMvc;

    private Chaine chaine;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Chaine createEntity(EntityManager em) {
        Chaine chaine = new Chaine().libelle(DEFAULT_LIBELLE).process(DEFAULT_PROCESS);
        return chaine;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Chaine createUpdatedEntity(EntityManager em) {
        Chaine chaine = new Chaine().libelle(UPDATED_LIBELLE).process(UPDATED_PROCESS);
        return chaine;
    }

    @BeforeEach
    public void initTest() {
        chaine = createEntity(em);
    }

    @Test
    @Transactional
    void createChaine() throws Exception {
        int databaseSizeBeforeCreate = chaineRepository.findAll().size();
        // Create the Chaine
        restChaineMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chaine)))
            .andExpect(status().isCreated());

        // Validate the Chaine in the database
        List<Chaine> chaineList = chaineRepository.findAll();
        assertThat(chaineList).hasSize(databaseSizeBeforeCreate + 1);
        Chaine testChaine = chaineList.get(chaineList.size() - 1);
        assertThat(testChaine.getLibelle()).isEqualTo(DEFAULT_LIBELLE);
        assertThat(testChaine.getProcess()).isEqualTo(DEFAULT_PROCESS);
    }

    @Test
    @Transactional
    void createChaineWithExistingId() throws Exception {
        // Create the Chaine with an existing ID
        chaine.setId(1L);

        int databaseSizeBeforeCreate = chaineRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restChaineMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chaine)))
            .andExpect(status().isBadRequest());

        // Validate the Chaine in the database
        List<Chaine> chaineList = chaineRepository.findAll();
        assertThat(chaineList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkLibelleIsRequired() throws Exception {
        int databaseSizeBeforeTest = chaineRepository.findAll().size();
        // set the field null
        chaine.setLibelle(null);

        // Create the Chaine, which fails.

        restChaineMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chaine)))
            .andExpect(status().isBadRequest());

        List<Chaine> chaineList = chaineRepository.findAll();
        assertThat(chaineList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkProcessIsRequired() throws Exception {
        int databaseSizeBeforeTest = chaineRepository.findAll().size();
        // set the field null
        chaine.setProcess(null);

        // Create the Chaine, which fails.

        restChaineMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chaine)))
            .andExpect(status().isBadRequest());

        List<Chaine> chaineList = chaineRepository.findAll();
        assertThat(chaineList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllChaines() throws Exception {
        // Initialize the database
        chaineRepository.saveAndFlush(chaine);

        // Get all the chaineList
        restChaineMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(chaine.getId().intValue())))
            .andExpect(jsonPath("$.[*].libelle").value(hasItem(DEFAULT_LIBELLE)))
            .andExpect(jsonPath("$.[*].process").value(hasItem(DEFAULT_PROCESS)));
    }

    @Test
    @Transactional
    void getChaine() throws Exception {
        // Initialize the database
        chaineRepository.saveAndFlush(chaine);

        // Get the chaine
        restChaineMockMvc
            .perform(get(ENTITY_API_URL_ID, chaine.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(chaine.getId().intValue()))
            .andExpect(jsonPath("$.libelle").value(DEFAULT_LIBELLE))
            .andExpect(jsonPath("$.process").value(DEFAULT_PROCESS));
    }

    @Test
    @Transactional
    void getNonExistingChaine() throws Exception {
        // Get the chaine
        restChaineMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewChaine() throws Exception {
        // Initialize the database
        chaineRepository.saveAndFlush(chaine);

        int databaseSizeBeforeUpdate = chaineRepository.findAll().size();

        // Update the chaine
        Chaine updatedChaine = chaineRepository.findById(chaine.getId()).get();
        // Disconnect from session so that the updates on updatedChaine are not directly saved in db
        em.detach(updatedChaine);
        updatedChaine.libelle(UPDATED_LIBELLE).process(UPDATED_PROCESS);

        restChaineMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedChaine.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedChaine))
            )
            .andExpect(status().isOk());

        // Validate the Chaine in the database
        List<Chaine> chaineList = chaineRepository.findAll();
        assertThat(chaineList).hasSize(databaseSizeBeforeUpdate);
        Chaine testChaine = chaineList.get(chaineList.size() - 1);
        assertThat(testChaine.getLibelle()).isEqualTo(UPDATED_LIBELLE);
        assertThat(testChaine.getProcess()).isEqualTo(UPDATED_PROCESS);
    }

    @Test
    @Transactional
    void putNonExistingChaine() throws Exception {
        int databaseSizeBeforeUpdate = chaineRepository.findAll().size();
        chaine.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChaineMockMvc
            .perform(
                put(ENTITY_API_URL_ID, chaine.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chaine))
            )
            .andExpect(status().isBadRequest());

        // Validate the Chaine in the database
        List<Chaine> chaineList = chaineRepository.findAll();
        assertThat(chaineList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchChaine() throws Exception {
        int databaseSizeBeforeUpdate = chaineRepository.findAll().size();
        chaine.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChaineMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(chaine))
            )
            .andExpect(status().isBadRequest());

        // Validate the Chaine in the database
        List<Chaine> chaineList = chaineRepository.findAll();
        assertThat(chaineList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamChaine() throws Exception {
        int databaseSizeBeforeUpdate = chaineRepository.findAll().size();
        chaine.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChaineMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(chaine)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Chaine in the database
        List<Chaine> chaineList = chaineRepository.findAll();
        assertThat(chaineList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateChaineWithPatch() throws Exception {
        // Initialize the database
        chaineRepository.saveAndFlush(chaine);

        int databaseSizeBeforeUpdate = chaineRepository.findAll().size();

        // Update the chaine using partial update
        Chaine partialUpdatedChaine = new Chaine();
        partialUpdatedChaine.setId(chaine.getId());

        partialUpdatedChaine.libelle(UPDATED_LIBELLE);

        restChaineMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChaine.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChaine))
            )
            .andExpect(status().isOk());

        // Validate the Chaine in the database
        List<Chaine> chaineList = chaineRepository.findAll();
        assertThat(chaineList).hasSize(databaseSizeBeforeUpdate);
        Chaine testChaine = chaineList.get(chaineList.size() - 1);
        assertThat(testChaine.getLibelle()).isEqualTo(UPDATED_LIBELLE);
        assertThat(testChaine.getProcess()).isEqualTo(DEFAULT_PROCESS);
    }

    @Test
    @Transactional
    void fullUpdateChaineWithPatch() throws Exception {
        // Initialize the database
        chaineRepository.saveAndFlush(chaine);

        int databaseSizeBeforeUpdate = chaineRepository.findAll().size();

        // Update the chaine using partial update
        Chaine partialUpdatedChaine = new Chaine();
        partialUpdatedChaine.setId(chaine.getId());

        partialUpdatedChaine.libelle(UPDATED_LIBELLE).process(UPDATED_PROCESS);

        restChaineMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedChaine.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedChaine))
            )
            .andExpect(status().isOk());

        // Validate the Chaine in the database
        List<Chaine> chaineList = chaineRepository.findAll();
        assertThat(chaineList).hasSize(databaseSizeBeforeUpdate);
        Chaine testChaine = chaineList.get(chaineList.size() - 1);
        assertThat(testChaine.getLibelle()).isEqualTo(UPDATED_LIBELLE);
        assertThat(testChaine.getProcess()).isEqualTo(UPDATED_PROCESS);
    }

    @Test
    @Transactional
    void patchNonExistingChaine() throws Exception {
        int databaseSizeBeforeUpdate = chaineRepository.findAll().size();
        chaine.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChaineMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, chaine.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chaine))
            )
            .andExpect(status().isBadRequest());

        // Validate the Chaine in the database
        List<Chaine> chaineList = chaineRepository.findAll();
        assertThat(chaineList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchChaine() throws Exception {
        int databaseSizeBeforeUpdate = chaineRepository.findAll().size();
        chaine.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChaineMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(chaine))
            )
            .andExpect(status().isBadRequest());

        // Validate the Chaine in the database
        List<Chaine> chaineList = chaineRepository.findAll();
        assertThat(chaineList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamChaine() throws Exception {
        int databaseSizeBeforeUpdate = chaineRepository.findAll().size();
        chaine.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restChaineMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(chaine)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Chaine in the database
        List<Chaine> chaineList = chaineRepository.findAll();
        assertThat(chaineList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteChaine() throws Exception {
        // Initialize the database
        chaineRepository.saveAndFlush(chaine);

        int databaseSizeBeforeDelete = chaineRepository.findAll().size();

        // Delete the chaine
        restChaineMockMvc
            .perform(delete(ENTITY_API_URL_ID, chaine.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Chaine> chaineList = chaineRepository.findAll();
        assertThat(chaineList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
