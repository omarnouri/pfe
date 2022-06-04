package com.sopra.pfe.domain;

public class LogFile {

    private String name;
    private long size;
    private String type;
    private long updateDate;

    public LogFile() {}

    public LogFile(String name, long size, String type, long updateDate) {
        this.name = name;
        this.size = size;
        this.type = type;
        this.updateDate = updateDate;
    }

    public long getUpdateDate() {
        return updateDate;
    }

    public long getSize() {
        return size;
    }

    public void setSize(long size) {
        this.size = size;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setUpdateDate(long updateDate) {
        this.updateDate = updateDate;
    }
}
