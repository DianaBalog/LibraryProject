sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/model/resource/ResourceModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter"
], function (Controller, MessageToast, Fragment, ResourceModel, Filter, FilterOperator, Sorter) {
   "use strict";
   return Controller.extend("org.ubb.books.controller.BookList", {

        onInit: function(){
            this.book = {
                Isbn : "",
                Title:"",
                Author:"",
                DatePublished: "",
                Language:"",
                TotalNumberBooks:"",
                AvailableBooks: 0
            }
        },

        onCheckoutBook(oEvent){
            const aSelContext = this.byId("idBooksTable").getSelectedContexts();
            if (aSelContext.length != 0){
                var oBook = aSelContext[0].getObject();
                var oEntry = { };
                
                if(oBook.AvailableBooks <= 0){
                    MessageToast.show("No available books!");
                }else{
                    oEntry.Isbn = oBook.Isbn;
                    oEntry.Title = oBook.Title;
                    oEntry.Author = oBook.Author;
                    oEntry.Id = 1;
                    oEntry.DateOfCheckout = '2020-01-01T00:00:00'
                    oEntry.DateOfReturn = '2020-01-01T00:00:00'
                    oEntry.FirstName = ''
                    oEntry.LastName = ''
                    oEntry.Username = ''

                
                    var odataModel = new sap.ui.model.odata.ODataModel("http://localhost:9555/sap/opu/odata/SAP/Z801_LIBRARY_DIBA_SRV_02/");
                
                    odataModel.create("/BorrowSet",oEntry, null, function() {
                        MessageToast.show("Borrowed succesfully!");
                    }, function(){
                        MessageToast.show("Error!");
                    });
                }
                

            } else {
                MessageToast.show("Select a book to borrow!");
            }
        },

    });
});