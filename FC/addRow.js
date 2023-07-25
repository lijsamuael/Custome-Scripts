frappe.ui.form.on("Employee Monthly Timesheet", {
    onload: function(frm) {

    frm.add_child("time_sheets", {});
        
    frm.refresh_field("time_sheets");
    }
});


frappe.ui.form.on("Employee Monthly Timesheet", {
    onload: function(frm) {
		console.log("Test 1");
        if (!frm.doc.time_sheets) {
			console.log("Test 2");
            frm.set_value("time_sheets", []);

            for (var i = 0; i < 30; i++) {
				console.log("Test 3");
                var timeSheetRow = frappe.model.add_child(frm.doc, "Time Sheet", "time_sheets");
                // Set any default values for the new row
                timeSheetRow.working_hours = "";
                timeSheetRow.public_holidays = "";
                timeSheetRow.annual_paid_leave = "";
                timeSheetRow.sick_leave = "";
                timeSheetRow.unpaid_leave = "";
                timeSheetRow.holiday_leave = "";
                timeSheetRow.compensation_leave = "";
            }

            frm.refresh_field("time_sheets");
        }
    }
});
