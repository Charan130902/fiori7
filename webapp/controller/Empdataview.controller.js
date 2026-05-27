sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (Controller, JSONModel, MessageToast, MessageBox) {

    "use strict";

    return Controller.extend("com.employeedata1.controller.Empdataview", {

        _originalData: null,

        onInit: function () {

            var oViewModel = new JSONModel({

                showMainButtons: true,
                showFooterButtons: false,
                mode: ""

            });

            this.getView().setModel(oViewModel, "view");

            this._loadData();

        },

        _loadData: function () {

            var oModel = this.getOwnerComponent().getModel();

            var that = this;

            oModel.read("/EmployeeDataSet", {

                success: function (oData) {

                    oData.results.forEach(function (oItem) {

                        oItem.editable = false;

                    });

                    var oLocalModel = new JSONModel({

                        EmployeeDataSet: oData.results

                    });

                    that.getView().setModel(oLocalModel, "local");

                },

                error: function () {

                    MessageBox.error("Failed to Load Data");

                }

            });

        },

        onAdd: function () {

            var oLocalModel = this.getView().getModel("local");

            var aData = oLocalModel.getProperty("/EmployeeDataSet");

            aData.push({

                EMPID: "",
                NAME: "",
                LOCATION: "",
                DESIGNATION: "",
                editable: true,
                isNew: true

            });

            oLocalModel.setProperty("/EmployeeDataSet", aData);

            this.getView()
                .getModel("view")
                .setProperty("/showMainButtons", false);

            this.getView()
                .getModel("view")
                .setProperty("/showFooterButtons", true);

            this.getView()
                .getModel("view")
                .setProperty("/mode", "ADD");

        },

        onEdit: function () {

            var oTable = this.byId("empTable");

            var oSelectedItem = oTable.getSelectedItem();

            if (!oSelectedItem) {

                MessageBox.warning("Please Select One Row");

                return;

            }

            var oLocalModel = this.getView().getModel("local");

            var aData = oLocalModel.getProperty("/EmployeeDataSet");

            aData.forEach(function (oItem) {

                oItem.editable = false;

            });

            var oContext = oSelectedItem.getBindingContext("local");

            var oData = oContext.getObject();

            this._originalData = JSON.parse(JSON.stringify(oData));

            oData.editable = true;

            oLocalModel.refresh();

            this.getView()
                .getModel("view")
                .setProperty("/showMainButtons", false);

            this.getView()
                .getModel("view")
                .setProperty("/showFooterButtons", true);

            this.getView()
                .getModel("view")
                .setProperty("/mode", "EDIT");

        },

        onSave: function () {

            var sMode = this.getView()
                .getModel("view")
                .getProperty("/mode");

            if (sMode === "ADD") {

                this._createRecord();

            } else if (sMode === "EDIT") {

                this._updateRecord();

            }

        },

        _createRecord: function () {

            var oLocalModel = this.getView().getModel("local");

            var aData = oLocalModel.getProperty("/EmployeeDataSet");

            var oNewRecord = aData[aData.length - 1];

            var oPayload = {

                EMPID: oNewRecord.EMPID,
                NAME: oNewRecord.NAME,
                LOCATION: oNewRecord.LOCATION,
                DESIGNATION: oNewRecord.DESIGNATION

            };

            if (
                !oPayload.EMPID ||
                !oPayload.NAME ||
                !oPayload.LOCATION ||
                !oPayload.DESIGNATION
            ) {

                MessageBox.warning("Please Fill All Fields");

                return;

            }

            var oModel = this.getOwnerComponent().getModel();

            var that = this;

            oModel.create("/EmployeeDataSet", oPayload, {

                success: function () {

                    MessageToast.show("Record Created Successfully");

                    that.onRefresh();

                },

                error: function () {

                    MessageBox.error("Create Failed");

                }

            });

        },

        _updateRecord: function () {

            var oTable = this.byId("empTable");

            var oSelectedItem = oTable.getSelectedItem();

            var oContext = oSelectedItem.getBindingContext("local");

            var oData = oContext.getObject();

            var sEmpid = oData.EMPID;

            var oPayload = {

                EMPID: oData.EMPID,
                NAME: oData.NAME,
                LOCATION: oData.LOCATION,
                DESIGNATION: oData.DESIGNATION

            };

            var oModel = this.getOwnerComponent().getModel();

            var that = this;

            oModel.update("/EmployeeDataSet('" + sEmpid + "')", oPayload, {

                success: function () {

                    MessageToast.show("Updated Successfully");

                    that.onRefresh();

                },

                error: function () {

                    MessageBox.error("Update Failed");

                }

            });

        },

        onDelete: function () {

            var oTable = this.byId("empTable");

            var oSelectedItem = oTable.getSelectedItem();

            if (!oSelectedItem) {

                MessageBox.warning("Please Select One Row");

                return;

            }

            var oContext = oSelectedItem.getBindingContext("local");

            var oData = oContext.getObject();

            var sEmpid = oData.EMPID;

            var oModel = this.getOwnerComponent().getModel();

            var that = this;

            oModel.remove("/EmployeeDataSet('" + sEmpid + "')", {

                success: function () {

                    MessageToast.show("Deleted Successfully");

                    that.onRefresh();

                },

                error: function () {

                    MessageBox.error("Delete Failed");

                }

            });

        },

        onRefresh: function () {

            this.getView()
                .getModel("view")
                .setProperty("/showMainButtons", true);

            this.getView()
                .getModel("view")
                .setProperty("/showFooterButtons", false);

            this.getView()
                .getModel("view")
                .setProperty("/mode", "");

            this._loadData();

        },

        onCancel: function () {

            var sMode = this.getView()
                .getModel("view")
                .getProperty("/mode");

            if (sMode === "EDIT") {

                var oTable = this.byId("empTable");

                var oSelectedItem = oTable.getSelectedItem();

                if (oSelectedItem && this._originalData) {

                    var oContext = oSelectedItem
                        .getBindingContext("local");

                    var oData = oContext.getObject();

                    oData.EMPID = this._originalData.EMPID;
                    oData.NAME = this._originalData.NAME;
                    oData.LOCATION = this._originalData.LOCATION;
                    oData.DESIGNATION = this._originalData.DESIGNATION;

                    oData.editable = false;

                    this.getView()
                        .getModel("local")
                        .refresh();

                }

            }

            this.onRefresh();

        }

    });

});