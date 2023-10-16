//fetch the actual quantities from the selected task itself
cur_frm.add_fetch('task', 'man_power_total_qty','planned_man_power')
cur_frm.add_fetch('task', 'machinery_total_qty','planned_machinery')
cur_frm.add_fetch('task', 'over_head_cost','planned_material')

frappe.ui.form.on('Construction Report', {
    task: async function(frm) {
        let taskSelected = frm.doc.task;
        let projectSelected = frm.doc.project;
        let startDate = frm.doc.from_date;
        let endDate = frm.doc.to_date;

        console.log("Task Selected:", taskSelected);
        console.log("Project Selected:", projectSelected);
        console.log("Start Date:", startDate);
        console.log("End Date:", endDate);

        if (taskSelected) {
            let filters = {
                task: taskSelected
            };

            if (projectSelected) {
                filters.project = projectSelected;
            }

            if (startDate) {
                filters.start_date = ['>=', startDate];
            }

            if (endDate) {
                if (!filters.start_date) {
                    filters.start_date = ['<=', endDate];
                } else {
                    filters.end_date = ['<=', endDate];
                }
            }

            console.log("Filters:", filters);

            let actualCosts = await frappe.db.get_list("Timesheet", {
                filters: filters,
                fields: ["material_total_cost", "  ", "machinery_total_cost", "total_income", "net_profit", "task", "name"]
            });

            console.log("Actual Costs:", actualCosts);  

            if(!frm.doc.report_timesheet){
				console.log("ere gud")
				frm.set_value("report_timesheet", []);

				for (var i = 0; i < actualCosts.length; i++){
					var timeSheetRow = frappe.model.add_child(frm.doc, "Report Timsheet", "report_timesheet");
					console.log("timesheet row", timeSheetRow)
					timeSheetRow.machinery_cost = actualCosts[i].machinery_total_cost;
					timeSheetRow.material_cost = actualCosts[i].material_total_cost;
					timeSheetRow.manpower_cost = actualCosts[i].manpower_total_cost;
					timeSheetRow.task = actualCosts[i].task;
					timeSheetRow.timsheet_id = actualCosts[i].name;
				}
			}

            let totalMTC = actualCosts.reduce((total, timesheet) => total + (timesheet.material_total_cost || 0), 0);
            let totalMNC = actualCosts.reduce((total, timesheet) => total + (timesheet.machinery_total_cost || 0), 0);
            let totalMPC = actualCosts.reduce((total, timesheet) => total + (timesheet.manpower_total_cost || 0), 0);
            let totalIncome = actualCosts.reduce((total, timesheet) => total + (timesheet.total_income || 0), 0);
            let totalNetProfit = actualCosts.reduce((total, timesheet) => total + (timesheet.net_profit || 0), 0);

            console.log("Total Material Cost:", totalMTC);
            console.log("Total Machinery Cost:", totalMNC);
            console.log("Total Manpower Cost:", totalMPC);

            frm.set_value("actual_material", totalMTC);
            frm.set_value("actual_man_power", totalMPC);
            frm.set_value("actual_machinary", totalMNC);

            let totalActual = totalMTC + totalMPC + totalMNC;
            let totalPlanned = frm.doc.planned_man_power + frm.doc.planned_machinery + frm.doc.planned_material;

            console.log("Total Actual Quantity:", totalActual);
            console.log("Total Planned Quantity:", totalPlanned);

            frm.set_value("total_planned_quantity", totalPlanned);
            frm.set_value("total_actual_quantity", totalActual);
            frm.set_value("total_income", totalIncome);
            frm.set_value("total_net_profit", totalNetProfit);

            frm.refresh_fields();
        }
    }
});



frappe.ui.form.on("Construction Report", {
	onload: function(frm) {
		var table = frm.doc.report_timesheet;
		//hide the add row buttons for a child tables
		frm.set_df_property("report_timesheet", "read_only", 1);
	}
});

















        frappe.call({
            method: 'frappe.client.get_list',
            args: {
                doctype: 'New Daily Plan',
                filters: {
                    'project': frm.doc.project ? frm.doc.project : undefined
                },
                'name': ['!=', frm.docname],
            },
            callback: function (response) {
				console.log("response", response)
                if (response.message && Array.isArray(response.message)) {
                    var records = response.message;
                    if (records.length == 0) {
                        console.log("records are 0");
                        frm.clear_table('utilization_report_table');
                        refresh_field('utilization_report_table');
                    } else {
                        console.log(`the length of records is ${records.length}`);
                        for (var i = 0; i < records.length; i++) {
                            var record = records[i];
                            console.log(`Document name ${record.name}`);
                            fetchAndLogAllFields(record.name, frm); // Pass the name of the record
                        }
                    }
                }
            }
        });



function fetchAndLogAllFields(recordName, frm) {
    frappe.call({
        method: 'frappe.client.get',
        args: {
            doctype: 'Equipment Daily Time Utilization Register',
            name: recordName
        },
        callback: function (response) {
            if (response.message) {
                var recordData = response.message;
                // Here you can log/process all fields of the fetched record as needed
                console.log("Fetched Record:", recordData);
                
                // You can also populate the 'utilization_report_table' child table here
                // using the fetched record's data and frm.doc

                // For example:
                var timeSheetRow = frappe.model.add_child(frm.doc, "utilization_report_table", "utilization_report_table");
                timeSheetRow.field1 = recordData.field1; // Replace with actual field names
                timeSheetRow.field2 = recordData.field2;
                // ... and so on
                
                frm.refresh_fields();
            }
        }
    });
}


