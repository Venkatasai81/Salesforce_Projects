// This Apex class handles CRUD operations for Patient__c custom object
public with sharing class PatientController {
    
    // Method to retrieve all patient records
    @AuraEnabled(cacheable=true)
    public static List<Patient__c> getPatients() {
        // Query to fetch Id, Name, Email, and Visit Type fields from Patient__c object
        return [SELECT Id, Name, Email__c, Visit_Type__c FROM Patient__c];
    }

    // Method to add a new patient record
    @AuraEnabled
    public static void addPatient(Patient__c patient) {
        // Insert the new patient record
        insert patient;
    }

    // Method to update an existing patient record
    @AuraEnabled
    public static void updatePatient(Patient__c patient) {
        // Update the existing patient record
        update patient;
    }

    // Method to delete a patient record by Id
    @AuraEnabled
    public static void deletePatient(Id patientId) {
        // Query to fetch the patient record by Id and then delete it
        delete [SELECT Id FROM Patient__c WHERE Id = :patientId];
    }
}
