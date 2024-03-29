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

        onInsertBook(oEvent){
            if(!this.newBookDialog){
                this.newBookDialog = sap.ui.xmlfragment("org.ubb.books.view.fragment.insert",this);
            }
            this.resetBook();
            var oModel = new sap.ui.model.json.JSONModel();
            this.getView().addDependent(this.newBookDialog);
            this.newBookDialog.setModel(oModel);
            this.newBookDialog.getModel().setData(this.book);
            this.newBookDialog.open();
        },

        saveBook(oEvent){
            var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            if (this.validateBook(this.book)){
                var oDataModel = this.getView().getModel();
                var oModel = oEvent.getSource().getModel();
                var data =oModel.getData()
                data.TotalNumberBooks = parseInt(data.TotalNumberBooks);
                data.AvailableBooks = parseInt(data.AvailableBooks);
                oDataModel.create('/BooksSet', data, {
                    success: function() {
                        MessageToast.show(oResourceBundle.getText("saveSuccess"));
                    },
                    error: function(){
                        MessageToast.show(oResourceBundle.getText("saveError"));
                    }
                });
                this.newBookDialog.close();
            }
        },

        onUpdateBook(oEvent){
            var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            const aSelContext = this.byId("idBooksTable").getSelectedContexts();
            if (aSelContext.length != 0){
                var oBook = aSelContext[0].getObject();
                this.book = oBook;
                if(!this.updateBookDialog){
                    this.updateBookDialog = sap.ui.xmlfragment("org.ubb.books.view.fragment.update",this);
                }
                var oModel = new sap.ui.model.json.JSONModel();
                this.getView().addDependent(this.updateBookDialog);
                this.updateBookDialog.setModel(oModel);
                this.updateBookDialog.getModel().setData(this.book);
                this.updateBookDialog.open();
            } else {
                MessageToast.show(oResourceBundle.getText("noSelectionUpdateError"));
            }
        },

        updateBook(oEvent){
            var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            if (this.validateBook(this.book)){
                const aSelContexts = this.byId("idBooksTable").getSelectedContexts();
                const sBookPath = aSelContexts[0].getPath();
                var oModel = this.getView().getModel();
                oModel.update(sBookPath, this.book, {
                    success: function() {
                        MessageToast.show(oResourceBundle.getText("updateSuccess"));
                    },
                    error: function(){
                        MessageToast.show(oResourceBundle.getText("updateError"));
                    }
                });
                this.updateBookDialog.close();
            }
        },

        onDeleteBook(oEvent){
            var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            const aSelContexts = this.byId("idBooksTable").getSelectedContexts();
            if (aSelContexts.length != 0){
                const sBookPath = aSelContexts[0].getPath();
                this.getView().getModel().remove(sBookPath);
                MessageToast.show(oResourceBundle.getText("deleteSuccess"));
            } else {
                MessageToast.show(oResourceBundle.getText("noSelectionDeleteError"));
            }
        },

        closeDialog(oEvent){
            if (this.newBookDialog){
                this.newBookDialog.close();
            }
            if (this.updateBookDialog){
                this.updateBookDialog.close();
            }
        },

        resetBook(){
            this.book.Isbn = "";
            this.book.Title = "";
            this.book.Author = "";
            this.book.DatePublished = "";
            this.book.Language = "";
            this.book.TotalNumberBooks = 0;
            this.book.AvailableBooks = 0;
        },

        validateBook(oBook){
            var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            if (oBook.Isbn.length === 0){
                MessageToast.show(oResourceBundle.getText("isbnEmptyError"));
                return false;
            }
            if (oBook.Isbn.length > 13){
                MessageToast.show(oResourceBundle.getText("isbnLongerThan13Error"));
                return false;
            }
            if (oBook.Title.length === 0){
                MessageToast.show(oResourceBundle.getText("titleEmptyError"));
                return false;
            }
            if (oBook.Author.length === 0){
                MessageToast.show(oResourceBundle.getText("authorEmptyError"));
                return false;
            }
            if (oBook.DatePublished.length === 0){
                MessageToast.show(oResourceBundle.getText("dateEmptyError"));
                return false;
            }
            if (oBook.Language.length === 0){
                MessageToast.show(oResourceBundle.getText("languageEmptyError"));
                return false;
            }
            if (parseInt(oBook.TotalNumberBooks) < 0){
                MessageToast.show(oResourceBundle.getText("totalNumberNegativeError"));
                return false;
            }
            if (parseInt(oBook.AvailableBooks) < 0){
                MessageToast.show(oResourceBundle.getText("availableNumberNegativeError"));
                return false;
            }
            if (parseInt(oBook.TotalNumberBooks) < parseInt(oBook.AvailableBooks)){
                MessageToast.show(oResourceBundle.getText("totalNumberError"));
                return false;
            }
            return true;
        }
    });
});