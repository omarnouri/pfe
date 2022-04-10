package com.sopra.pfe.domain;

import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Rss.
 */
@Entity
@Table(name = "rss")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Rss implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "titre", nullable = false)
    private String titre;

    @NotNull
    @Column(name = "url", nullable = false)
    private String url;

    @Column(name = "est_active")
    private Boolean estActive;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Rss id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitre() {
        return this.titre;
    }

    public Rss titre(String titre) {
        this.setTitre(titre);
        return this;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getUrl() {
        return this.url;
    }

    public Rss url(String url) {
        this.setUrl(url);
        return this;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Boolean getEstActive() {
        return this.estActive;
    }

    public Rss estActive(Boolean estActive) {
        this.setEstActive(estActive);
        return this;
    }

    public void setEstActive(Boolean estActive) {
        this.estActive = estActive;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Rss)) {
            return false;
        }
        return id != null && id.equals(((Rss) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Rss{" +
            "id=" + getId() +
            ", titre='" + getTitre() + "'" +
            ", url='" + getUrl() + "'" +
            ", estActive='" + getEstActive() + "'" +
            "}";
    }
}
