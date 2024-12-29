
public with sharing class OpportunityLineItemController {
    @AuraEnabled(cacheable=true)
    public static List<SalesOrder__c> getSalesOrders(Id salesOrderId) {
        return [
            SELECT Id, Product__r.Name, Quantity__c, UnitPrice__c, Amount__c, DiscountType__c, DiscountValue__c, GSTPercentage__c
            FROM SalesOrder__c
            WHERE Id = :salesOrderId
        ];
    }

    @AuraEnabled
    public static void saveSalesOrders(List<SalesOrder__c> salesOrders) {
        update salesOrders;
    }
}
