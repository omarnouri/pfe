package com.sopra.pfe.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Anomalie.
 */
@Entity
@Table(name = "anomalie")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Anomalie implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "msg_ano", nullable = false)
    private String msgAno;

    @Column(name = "msg_sol")
    private String msgSol;

    @ManyToOne
    @JsonIgnoreProperties(value = { "anomalies" }, allowSetters = true)
    private Chaine chaine;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Anomalie id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMsgAno() {
        return this.msgAno;
    }

    public Anomalie msgAno(String msgAno) {
        this.setMsgAno(msgAno);
        return this;
    }

    public void setMsgAno(String msgAno) {
        this.msgAno = msgAno;
    }

    public String getMsgSol() {
        return this.msgSol;
    }

    public Anomalie msgSol(String msgSol) {
        this.setMsgSol(msgSol);
        return this;
    }

    public void setMsgSol(String msgSol) {
        this.msgSol = msgSol;
    }

    public Chaine getChaine() {
        return this.chaine;
    }

    public void setChaine(Chaine chaine) {
        this.chaine = chaine;
    }

    public Anomalie chaine(Chaine chaine) {
        this.setChaine(chaine);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Anomalie)) {
            return false;
        }
        return id != null && id.equals(((Anomalie) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Anomalie{" +
            "id=" + getId() +
            ", msgAno='" + getMsgAno() + "'" +
            ", msgSol='" + getMsgSol() + "'" +
            "}";
    }
}
