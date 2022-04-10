package com.sopra.pfe.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.sopra.pfe.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class RssTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Rss.class);
        Rss rss1 = new Rss();
        rss1.setId(1L);
        Rss rss2 = new Rss();
        rss2.setId(rss1.getId());
        assertThat(rss1).isEqualTo(rss2);
        rss2.setId(2L);
        assertThat(rss1).isNotEqualTo(rss2);
        rss1.setId(null);
        assertThat(rss1).isNotEqualTo(rss2);
    }
}
