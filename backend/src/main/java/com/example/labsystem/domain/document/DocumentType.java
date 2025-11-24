package com.example.labsystem.domain.document;

/**
 * Тип документа
 */
public enum DocumentType {
    /**
     * Згода на оренду обладнання
     */
    RENTAL_AGREEMENT("RENT", "Згода на оренду"),

    /**
     * Акт приймання-передачі
     */
    HANDOVER_ACT("HAND", "Акт приймання-передачі"),

    /**
     * Акт повернення
     */
    RETURN_ACT("RETN", "Акт повернення"),

    /**
     * Заявка на закупівлю
     */
    PURCHASE_REQUEST("PURCH", "Заявка на закупівлю"),

    /**
     * Інше
     */
    OTHER("OTH", "Інший документ");

    private final String code;
    private final String displayName;

    DocumentType(String code, String displayName) {
        this.code = code;
        this.displayName = displayName;
    }

    public String getCode() {
        return code;
    }

    public String getDisplayName() {
        return displayName;
    }
}
