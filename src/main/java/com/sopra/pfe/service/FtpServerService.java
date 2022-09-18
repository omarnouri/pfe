package com.sopra.pfe.service;

import com.sopra.pfe.domain.Anomalie;
import com.sopra.pfe.domain.LogFile;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class FtpServerService {

    private String PATH = "d:\\Profiles\\onouri\\Desktop\\Jira\\PFE Omar ING4F\\Liste des logs\\Analyse CAA";
    private final Logger log = LoggerFactory.getLogger(FtpServerService.class);

    final File folder = new File(PATH);

    public List<LogFile> getList() {
        List<LogFile> result = new ArrayList<>();
        for (final File fileEntry : folder.listFiles()) {
            if (fileEntry.isFile()) {
                result.add(new LogFile(fileEntry.getName(), fileEntry.length(), fileEntry.getName(), fileEntry.lastModified()));
            }
        }
        return result;
    }

    public List<Anomalie> analyzeFile(String fileName, List<Anomalie> anomalies) {
        log.warn("++++++ " + anomalies);
        List<Anomalie> anomaliesResult = new ArrayList();
        boolean estAnormal = false;
        BufferedReader reader;
        try {
            reader = new BufferedReader(new FileReader(PATH + "\\" + fileName));
            String line = reader.readLine();
            while (line != null) {
                if (line.toLowerCase().contains("anormale")) {
                    estAnormal = true;
                }
                System.out.println(line);
                // read next line
                Anomalie anomalie = findAnomalie(line, anomalies);
                if (anomalie != null) {
                    anomaliesResult.add(anomalie);
                }
                line = reader.readLine();
            }
            reader.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        if (estAnormal && anomaliesResult.size() == 0) {
            Anomalie anomalie1 = new Anomalie();
            Anomalie anomalie2 = new Anomalie();
            Anomalie anomalie3 = new Anomalie();
            anomalie1.setMsgSol("Merci de vérifier Témoin de validité soit déphasé avec le témoin de validité dans ZY0J");
            anomalie2.setMsgSol(
                "Merci de vérifier l etat de votre salrié il doit etre present sinon Merci de saisi un élément variable est saisi sur la période en cours avec période d’origine"
            );
            anomalie3.setMsgSol(
                "Merci de vérifier Blocage de paie: Si ce cas se présente, il faut clôturer le blocage de paie à une date antérieure à la période de paie"
            );
            anomaliesResult.add(anomalie1);
            anomaliesResult.add(anomalie2);
            anomaliesResult.add(anomalie3);
        }
        return anomaliesResult;
    }

    private Anomalie findAnomalie(String line, List<Anomalie> anomalies) {
        int i = 0;
        while (i < anomalies.size()) {
            if (line.toLowerCase().contains(anomalies.get(i).getMsgAno().toLowerCase())) {
                break;
            }
            i++;
        }
        if (i < anomalies.size()) {
            log.warn("0000000000000000" + anomalies.get(i));
            return anomalies.get(i);
        }
        return null;
    }
}
