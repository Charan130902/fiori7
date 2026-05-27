/*global QUnit*/

sap.ui.define([
	"com/employeedata1/controller/Empdataview.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Empdataview Controller");

	QUnit.test("I should test the Empdataview controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
