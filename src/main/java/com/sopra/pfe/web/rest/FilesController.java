package com.sopra.pfe.web.rest;

import com.sopra.pfe.domain.Anomalie;
import com.sopra.pfe.domain.LogFile;
import com.sopra.pfe.repository.AnomalieRepository;
import com.sopra.pfe.service.FtpServerService;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class FilesController {

    private final Logger log = LoggerFactory.getLogger(AnomalieResource.class);
    private final FtpServerService ftpService;
    private final AnomalieRepository anomalieRepository;

    FilesController(FtpServerService ftpService, AnomalieRepository anomalieRepository) {
        this.ftpService = ftpService;
        this.anomalieRepository = anomalieRepository;
    }

    @GetMapping("/files")
    public List<LogFile> getAllFiles() {
        log.debug("REST request to get all files");
        return ftpService.getList();
    }

    @GetMapping("/files/analyze")
    public List<Anomalie> analyze(@RequestParam String fileName, @RequestParam Long chaineId) {
        log.debug("REST request to get all files");
        List<Anomalie> anomalies = null;
        anomalies = anomalieRepository.findByChaine_Id(chaineId);
        log.debug("REST request to analyze a file", anomalies);
        return ftpService.analyzeFile(fileName, anomalies);
    }
}
