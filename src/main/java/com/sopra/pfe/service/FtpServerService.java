package com.sopra.pfe.service;

import com.sopra.pfe.domain.LogFile;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class FtpServerService {

    private final Logger log = LoggerFactory.getLogger(FtpServerService.class);

    String path = "d:\\Profiles\\onouri\\Desktop\\Jira\\PFE Omar ING4F\\Liste des logs\\Analyse CAA";
    final File folder = new File(path);

    public List<LogFile> getList() {
        List<LogFile> result = new ArrayList<>();
        for (final File fileEntry : folder.listFiles()) {
            if (fileEntry.isFile()) {
                result.add(new LogFile(fileEntry.getName(), fileEntry.length(), fileEntry.getName(), fileEntry.lastModified()));
            }
        }
        return result;
    }
}
