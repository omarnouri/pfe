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
 * A Client.
 */
@Entity
@Table(name = "client")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Client implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name_cl", nullable = false, unique = true)
    private String nameCl;

    @Column(name = "logo")
    private String logo;

    @Column(name = "path_logs")
    private String pathLogs;

    @Column(name = "type")
    private String type;

    @ManyToMany
    @JoinTable(
        name = "rel_client__rsses",
        joinColumns = @JoinColumn(name = "client_id"),
        inverseJoinColumns = @JoinColumn(name = "rsses_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    private Set<Rss> rsses = new HashSet<>();

    @OneToMany(mappedBy = "client")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "client" }, allowSetters = true)
    private Set<User> users = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Client id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNameCl() {
        return this.nameCl;
    }

    public Client nameCl(String nameCl) {
        this.setNameCl(nameCl);
        return this;
    }

    public void setNameCl(String nameCl) {
        this.nameCl = nameCl;
    }

    public String getLogo() {
        return this.logo;
    }

    public Client logo(String logo) {
        this.setLogo(logo);
        return this;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public String getPathLogs() {
        return this.pathLogs;
    }

    public Client pathLogs(String pathLogs) {
        this.setPathLogs(pathLogs);
        return this;
    }

    public void setPathLogs(String pathLogs) {
        this.pathLogs = pathLogs;
    }

    public String getType() {
        return this.type;
    }

    public Client type(String type) {
        this.setType(type);
        return this;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Set<Rss> getRsses() {
        return this.rsses;
    }

    public void setRsses(Set<Rss> rsses) {
        this.rsses = rsses;
    }

    public Client rsses(Set<Rss> rsses) {
        this.setRsses(rsses);
        return this;
    }

    public Client addRsses(Rss rss) {
        this.rsses.add(rss);
        return this;
    }

    public Client removeRsses(Rss rss) {
        this.rsses.remove(rss);
        return this;
    }

    public Set<User> getUsers() {
        return this.users;
    }

    public void setUsers(Set<User> users) {
        if (this.users != null) {
            this.users.forEach(i -> i.setClient(null));
        }
        if (users != null) {
            users.forEach(i -> i.setClient(this));
        }
        this.users = users;
    }

    public Client users(Set<User> users) {
        this.setUsers(users);
        return this;
    }

    public Client addUser(User user) {
        this.users.add(user);
        user.setClient(this);
        return this;
    }

    public Client removeUser(User user) {
        this.users.remove(user);
        user.setClient(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Client)) {
            return false;
        }
        return id != null && id.equals(((Client) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Client{" +
            "id=" + getId() +
            ", nameCl='" + getNameCl() + "'" +
            ", logo='" + getLogo() + "'" +
            ", pathLogs='" + getPathLogs() + "'" +
            ", type='" + getType() + "'" +
            "}";
    }
}
