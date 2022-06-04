package com.sopra.pfe.web.rest;

import com.sopra.pfe.domain.LogFile;
import com.sopra.pfe.service.FtpServerService;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class FilesController {

    private final Logger log = LoggerFactory.getLogger(AnomalieResource.class);
    private final FtpServerService ftpService;

    FilesController(FtpServerService ftpService) {
        this.ftpService = ftpService;
    }

    @GetMapping("/files")
    public List<LogFile> getAllFiles() {
        log.debug("REST request to get all files");
        return ftpService.getList();
    }
}
