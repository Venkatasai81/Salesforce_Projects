import { LightningElement, track, wire } from 'lwc';
// Import Apex methods for CRUD operations on Patient records
import getPatients from '@salesforce/apex/PatientController.getPatients';
import addPatient from '@salesforce/apex/PatientController.addPatient';
import updatePatient from '@salesforce/apex/PatientController.updatePatient';
import deletePatient from '@salesforce/apex/PatientController.deletePatient';
// Import refreshApex to refresh data wire adapters
import { refreshApex } from '@salesforce/apex';

// Define the PatientManager class, which extends LightningElement
export default class PatientManager extends LightningElement {
    @track patients; // Track changes to the patients array
    @track isModalOpen = false; // Track the state of the modal (open/close)
    @track modalHeader = ''; // Track the header text for the modal
    @track patientName = ''; // Track the patient's name
    @track patientEmail = ''; // Track the patient's email
    @track patientVisitType = ''; // Track the patient's visit type
    @track selectedPatientId; // Track the ID of the selected patient

    // Define options for the visit type picklist
    visitTypeOptions = [
        { label: 'Consultation', value: 'Consultation' },
        { label: 'Follow-up', value: 'Follow-up' },
        { label: 'Emergency', value: 'Emergency' },
        { label: 'Routine Check-Up', value: 'Routine Check-Up' }
    ];

    // Define columns for the data table
    columns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Email', fieldName: 'Email__c' },
        { label: 'Visit Type', fieldName: 'Visit_Type__c' },
        {
            type: 'button', typeAttributes: {
                label: 'Edit',
                name: 'edit',
                variant: 'brand'
            }
        },
        {
            type: 'button', typeAttributes: {
                label: 'Delete',
                name: 'delete',
                variant: 'destructive'
            }
        }
    ];

    // Wire the getPatients Apex method to retrieve patient data
    @wire(getPatients)
    wiredPatients(result) {
        this.wiredPatientsResult = result; // Store the result for refreshApex
        if (result.data) {
            this.patients = result.data; // Assign retrieved data to patients array
        } else if (result.error) {
            console.error(result.error); // Log any errors
        }
    }

    // Open the modal for adding a new patient
    handleAddNewPatient() {
        this.isModalOpen = true;
        this.modalHeader = 'Add New Patient';
        this.patientName = '';
        this.patientEmail = '';
        this.patientVisitType = '';
        this.selectedPatientId = null;
    }

    // Close the modal
    closeModal() {
        this.isModalOpen = false;
    }

    // Handle changes to the patient's name input field
    handleNameChange(event) {
        this.patientName = event.target.value;
    }

    // Handle changes to the patient's email input field
    handleEmailChange(event) {
        this.patientEmail = event.target.value;
    }

    // Handle changes to the patient's visit type picklist
    handleVisitTypeChange(event) {
        this.patientVisitType = event.target.value;
    }

    // Save the patient's details (add or update based on selectedPatientId)
    savePatient() {
        const patientData = {
            Name: this.patientName,
            Email__c: this.patientEmail,
            Visit_Type__c: this.patientVisitType
        };
        console.log('Patient to save:', JSON.stringify(patientData)); // Log the patient object to the console

        if (this.selectedPatientId) {
            patientData.Id = this.selectedPatientId;
            updatePatient({ patient: patientData })
                .then(() => {
                    console.log('Patient updated successfully');
                    this.refreshPatients();
                    this.closeModal();
                })
                .catch(error => {
                    console.error('Error updating patient:', error);
                });
        } else {
            addPatient({ patient: patientData })
                .then(() => {
                    console.log('Patient added successfully');
                    this.refreshPatients();
                    this.closeModal();
                })
                .catch(error => {
                    console.error('Error adding patient:', error);
                });
        }
    }

    // Handle row actions (edit or delete) in the data table
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        if (actionName === 'edit') {
            this.selectedPatientId = row.Id;
            this.patientName = row.Name;
            this.patientEmail = row.Email__c;
            this.patientVisitType = row.Visit_Type__c;
            this.modalHeader = 'Edit Patient';
            this.isModalOpen = true;
        } else if (actionName === 'delete') {
            deletePatient({ patientId: row.Id })
                .then(() => {
                    console.log('Patient deleted successfully');
                    this.refreshPatients();
                })
                .catch(error => {
                    console.error('Error deleting patient:', error);
                });
        }
    }

    // Refresh the patients data using refreshApex
    refreshPatients() {
        return refreshApex(this.wiredPatientsResult);
    }
}
