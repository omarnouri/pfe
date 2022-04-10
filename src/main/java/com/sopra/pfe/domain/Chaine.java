package com.sopra.pfe.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Chaine.
 */
@Entity
@Table(name = "chaine")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Chaine implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "libelle", nullable = false)
    private String libelle;

    @NotNull
    @Column(name = "process", nullable = false)
    private String process;

    @OneToMany(mappedBy = "chaine")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "chaine" }, allowSetters = true)
    private Set<Anomalie> anomalies = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Chaine id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLibelle() {
        return this.libelle;
    }

    public Chaine libelle(String libelle) {
        this.setLibelle(libelle);
        return this;
    }

    public void setLibelle(String libelle) {
        this.libelle = libelle;
    }

    public String getProcess() {
        return this.process;
    }

    public Chaine process(String process) {
        this.setProcess(process);
        return this;
    }

    public void setProcess(String process) {
        this.process = process;
    }

    public Set<Anomalie> getAnomalies() {
        return this.anomalies;
    }

    public void setAnomalies(Set<Anomalie> anomalies) {
        if (this.anomalies != null) {
            this.anomalies.forEach(i -> i.setChaine(null));
        }
        if (anomalies != null) {
            anomalies.forEach(i -> i.setChaine(this));
        }
        this.anomalies = anomalies;
    }

    public Chaine anomalies(Set<Anomalie> anomalies) {
        this.setAnomalies(anomalies);
        return this;
    }

    public Chaine addAnomalie(Anomalie anomalie) {
        this.anomalies.add(anomalie);
        anomalie.setChaine(this);
        return this;
    }

    public Chaine removeAnomalie(Anomalie anomalie) {
        this.anomalies.remove(anomalie);
        anomalie.setChaine(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Chaine)) {
            return false;
        }
        return id != null && id.equals(((Chaine) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Chaine{" +
            "id=" + getId() +
            ", libelle='" + getLibelle() + "'" +
            ", process='" + getProcess() + "'" +
            "}";
    }
}
