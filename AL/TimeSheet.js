// Fetch price depending on activity type selection
cur_frm.add_fetch("task", "quantity", "agreement_quantity_");
cur_frm.add_fetch("task", "project", "project");
cur_frm.add_fetch("task", "unit", "uom");
cur_frm.add_fetch("task", "activity_unit_rate", "billing_rate");

cur_frm.add_fetch("task", "subject", "task_description");
cur_frm.add_fetch("task", "unit", "uom");
cur_frm.add_fetch("task", "activity_unit_rate", "billing_rate");

//Fetch datas when the project is selected
cur_frm.add_fetch("project", "total_project_amount", "total_project_amount");
cur_frm.add_fetch("project", "total_project_duration", "total_project_duration");

//fetching the uom from the item
cur_frm.add_fetch("item", "stock_uom", "uom");



//fetching the planned quantity from appendicies to contract
frappe.ui.form.on('Timesheet', {
	task: function(frm) {
		console.log("test 00001")
		frappe.call({
			method: 'frappe.client.get_value',
			args: {
				doctype: 'CFF',
				filters: { "parent": frm.doc.appendicies_to_contract_no, "for_which_task": frm.doc.task },
				fieldname: ['quantity', 'for_which_task', 'rate', 'amount']
			},
			callback: function(response) {
				var contract = response.message;
				console.log("response value", contract)
				frm.set_value("agreement_quantity_", contract.quantity);
				frm.refresh_field("agreement_quantity_");
			}
		});
	}
})


//fetching the material consumption from the selected task
frappe.ui.form.on('Timesheet', {
	task: function(frm) {
		console.log("test 00002")
		frappe.call({
			method: 'frappe.client.get_list',
			args: {
				doctype: 'itemplann',
				filters: { "parent": frm.doc.task },
				fields: ['*']
			},
			callback: function(response) {
				var contract = response.message;
				console.log("response value", contract)
				addRowToMRT(frm, contract);
			}
		});
	}
})

function addRowToMRT(frm, data) {
	console.log(frm.doc.item_utilization_timesheet)
	frm.clear_table("item_utilization_timesheet");
	console.log("Test 1");
	frm.set_value("item_utilization_timesheet", []);
	var totala = 0;

	for (var i = 0; i < data.length; i++) {
		console.log("all dddddd", data)
		var tableRow = frappe.model.add_child(frm.doc, "Timesheetitem", "item_utilization_timesheet");
		var dataRow = data[i]; // Access the correct index
		console.log("table row", tableRow);
		console.log("data row", dataRow);
		tableRow.item = dataRow.item; // Assuming this property exists in dataRow
		tableRow.uom = dataRow.uom;
		tableRow.planned_quantity = dataRow.quantity1;
		tableRow.unit_price = dataRow.rate;
		tableRow.quantity = 0;
		tableRow.total = tableRow.unit_price * tableRow.quantity;
		totala += tableRow.total;
	}
	frm.set_value("material_total_cost", totala);
	frm.refresh_field("material_total_cost");
	refresh_field("item_utilization_timesheet");
}





frappe.ui.form.on('Timesheet', {
	contractor: function(frm) {
		console.log("uffff")
		frm.set_query("appendicies_to_contract_no", function() {
			return {
				"filters": {
					"cn": frm.doc.contractor
				}
			}
		});
	}
})

frappe.ui.form.on('Timesheet', {
    appendicies_to_contract_no: function(frm) {
        frappe.call({
            method: 'frappe.client.get_list',
            args: {
                doctype: 'CFF',
                filters: {
                    'parent': frm.doc.appendicies_to_contract_no
                },
                fields: ["*"],
                limit_page_length: 1000 // Set a large number to fetch more records
            },
            callback: function(response) {
                if (response.message) {
                    console.log("response data", response.message)
                    var taskList = response.message.map(function(item) {
                        return item.for_which_task;
                    });

                    frm.set_query('task', function() {
                        return {
                            filters: [
                                ['name', 'in', taskList]
                            ]
                        };
                    });
                } else {
                    console.error("No data received from frappe.client.get_list");
                }
            }
        });
    }
});











// TASK PROGRESS CALCULATION
frappe.ui.form.on("Timesheet", {
	percentage_covered: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frappe.model.set_value(cdt, cdn, "task_progress", d.activity_weight * d.percentage_covered);
	}
});

frappe.ui.form.on("Timesheet", {
	activity_weight: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frappe.model.set_value(cdt, cdn, "task_progress", d.activity_weight * d.percentage_covered);
	}
});

// when the form saved task_progress will be calculated
frappe.ui.form.on("Timesheet", "validate", function(frm, cdt, cdn) {
	var d = locals[cdt][cdn];
	frappe.model.set_value(cdt, cdn, "task_progress", d.activity_weight * d.percentage_covered);
});
//END OF TASK PROGRESS CALCULATION

// PROJECT PROGRESS CALCULATION
frappe.ui.form.on("Timesheet", {
	task_progress: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frappe.model.set_value(cdt, cdn, "project_progress", d.task_weight * d.task_progress);
	}
});

frappe.ui.form.on("Timesheet", {
	task_weight: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frappe.model.set_value(cdt, cdn, "project_progress", d.task_weight * d.task_progress);
	}
});


frappe.ui.form.on("Timesheet", {
	percentage_covered: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frappe.model.set_value(cdt, cdn, "fk", d.percentage_covered / 100);
	}
});


frappe.ui.form.on("Timesheet", {
	fk: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frappe.model.set_value(cdt, cdn, "tg", d.fk * d.planned_hr);
	}
});


frappe.ui.form.on("Timesheet", {
	planned_hr: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frappe.model.set_value(cdt, cdn, "tg", d.fk * d.planned_hr);
	}
});




frappe.ui.form.on("Timesheet", {
	tg: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frappe.model.set_value(cdt, cdn, "project_physicl_progress", d.tg / d.total_project_duration);
	}
});


frappe.ui.form.on("Timesheet", {
	total_project_duration: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frappe.model.set_value(cdt, cdn, "project_physicl_progress", d.tg / d.total_project_duration);
	}
});


frappe.ui.form.on("Timesheet", {
	total_activity_income: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frappe.model.set_value(cdt, cdn, "project_financial_progress", d.total_activity_income / d.total_project_amount);
	}
});


frappe.ui.form.on("Timesheet", {
	total_project_amount: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frappe.model.set_value(cdt, cdn, "project_financial_progress", d.total_activity_income / d.total_project_amount);
	}
});


// when the form saved project_progress will be calculated
frappe.ui.form.on("Timesheet", "validate", function(frm, cdt, cdn) {
	var d = locals[cdt][cdn];
	frappe.model.set_value(cdt, cdn, "project_progress", d.task_weight * d.task_progress);
});
// END OF PROJECT PROGRESS
// percentage covered Calculation 

frappe.ui.form.on("Timesheet", {
	quantity_executed: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frappe.model.set_value(d.doctype, d.name, 'percentage_covered', (100 * (d.quantity_executed / d.agreement_quantity_)));
	}
});

frappe.ui.form.on("Timesheet", {
	total_project_duration: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frappe.model.set_value(d.doctype, d.name, 'percentage_covered', (100 * (d.quantity_executed / d.agreement_quantity_)));
	}
});




// TOTAL ACTIVITY INCOME AND TOTAL INCOME AT THE BOTTOM 
// when quantity_executed entered total_activity_income will be calculated and also for total_income
frappe.ui.form.on("Timesheet", {
	quantity_executed: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frappe.model.set_value(d.doctype, d.name, 'total_activity_income', (d.quantity_executed * d.billing_rate));
		frappe.model.set_value(d.doctype, d.name, 'total_income', (d.quantity_executed * d.billing_rate));
	}
});

// when the form saved total_activity_income will be calculated and total_income
frappe.ui.form.on("Timesheet", "validate", function(frm, cdt, cdn) {
	var d = locals[cdt][cdn];
	frappe.model.set_value(cdt, cdn, "total_activity_income", d.quantity_executed * d.billing_rate);
	frappe.model.set_value(cdt, cdn, 'total_income', (d.quantity_executed * d.billing_rate));
});

// END OF TOTAL ACTIVITY INCOME CALCULATION AND TOTAL INCOME AT THE BOTTOM

// MAN POWER RELATED SCRIPT
frappe.ui.form.on("Man power Detail", {
	quantity: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frappe.model.set_value(d.doctype, d.name, 'amount', (d.quantity * d.rate * d.utilization_factor * d.hour));
		set_total_amt_man(frm);
	}
});

frappe.ui.form.on("Man power Detail", {
	rate: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frappe.model.set_value(d.doctype, d.name, 'amount', (d.quantity * d.rate * d.utilization_factor * d.hour));
	}
});
frappe.ui.form.on("Man power Detail", {
	utilization_factor: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frappe.model.set_value(d.doctype, d.name, 'amount', (d.quantity * d.rate * d.utilization_factor * d.hour));
	}
});
frappe.ui.form.on("Man power Detail", {
	hour: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frappe.model.set_value(d.doctype, d.name, 'amount', (d.quantity * d.rate * d.utilization_factor * d.hour));
	}
});

// TOTAL CALCULATIONS FOR MAN POWER TOTAL COST
// Set total cost of Manpowerused on save of Activity Type
frappe.ui.form.on("Timesheet", "validate", function(frm) {
	set_total_amt_man(frm);
});

// Calculate and set manpower_total_cost
var set_total_amt_man = function(frm) {
	var total_amt_man = 0.0;
	$.each(frm.doc.man_power_detail, function(i, row) {
		total_amt_man += flt(row.amount);
	})
	frm.set_value("manpower_total_cost", total_amt_man);
	//frm.refresh();
}

//Set total cost of Manpowerused on change of costing_amount
frappe.ui.form.on("man_power_detail", "costing_amount", function(frm, cdt, cdn) {
	set_total_amt_man(frm);
});

// TOTAL CALCULATION OF MAN POWER USED END

// END OF MAN POWER USED RELATED SCRIPT


// MACHINERY RELATED SCRIPT
frappe.ui.form.on("man_power_detail", {
	resource: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frappe.model.set_value(d.doctype, d.name, 'costing_amount', (d.resource * d.executing_rate));
		set_total_amt_mac(frm);
	}
});

frappe.ui.form.on("Machineryused", {
	executing_rate: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frappe.model.set_value(d.doctype, d.name, 'costing_amount', (d.resource * d.executing_rate));
	}
});

// TOTAL CALCULATIONS FOR MACHINERY TOTAL COST
// Set total cost of Machinery on save of Activity Type
frappe.ui.form.on("Timesheet", "validate", function(frm) {
	set_total_amt_mac(frm);
});

// Calculate and set machinery_total_cost
var set_total_amt_mac = function(frm) {
	var total_amt_mac = 0.0;
	$.each(frm.doc.machinery_used, function(i, row) {
		total_amt_mac += flt(row.costing_amount);
	})
	frm.set_value("machinery_total_cost", total_amt_mac);
	//frm.refresh();
}

//Set total cost of Material on change of costing_amount
frappe.ui.form.on("Machineryused", "costing_amount", function(frm, cdt, cdn) {
	set_total_amt_mac(frm);
});

// TOTAL CALCULATION OF MACHINERY USED END

// END OF MACHINERY USED RELATED SCRIPT


// MATERIAL RELATED SCRIPT
frappe.ui.form.on("Timesheetitem", {
	quantity: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frappe.model.set_value(d.doctype, d.name, 'total', (d.quantity * d.unit_price));
		set_total_amt_mat(frm);
	}
});

frappe.ui.form.on("Timesheetitem", {
	unit_price: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frappe.model.set_value(d.doctype, d.name, 'total', (d.quantity * d.unit_price));
	}
});

// TOTAL CALCULATIONS FOR MATERIAL TOTAL COST
// Set total cost of Material on save of Activity Type
frappe.ui.form.on("Timesheet", "validate", function(frm) {
	set_total_amt_mat(frm);
});

// Calculate and set material_total_cost
var set_total_amt_mat = function(frm) {
	var total_amt_mat = 0.0;
	$.each(frm.doc.item_utilization_timesheet, function(i, row) {
		total_amt_mat += flt(row.total);
	})
	frm.set_value("material_total_cost", total_amt_mat);
	//frm.refresh();
}

//Set total cost of Material on change of total
frappe.ui.form.on("Timesheetitem", "total", function(frm, cdt, cdn) {
	set_total_amt_mat(frm);
});

// TOTAL CALCULATION OF MATERIAL USED END

// END OF MATERIAL USED RELATED SCRIPT

// TOTAL COST AT THE BOTTOM 
// when manpower_total_cost changed total_cost will be calculated
frappe.ui.form.on("Timesheet", {
	manpower_total_cost: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		if (!d.manpower_total_cost) d.manpower_total_cost = 0.0;
		if (!d.machinery_total_cost) d.machinery_total_cost = 0.0;
		if (!d.material_total_cost) d.material_total_cost = 0.0;
		frappe.model.set_value(d.doctype, d.name, 'total_cost', (d.manpower_total_cost + d.machinery_total_cost + material_total_cost));
	}
});

// when material_total_cost changed total_cost will be calculated
frappe.ui.form.on("Timesheet", {
	machinery_total_cost: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frappe.model.set_value(d.doctype, d.name, 'total_cost', (d.manpower_total_cost + d.machinery_total_cost + d.material_total_cost));
	}
});

// when manpower_total_cost changed total_cost will be calculated
frappe.ui.form.on("Timesheet", {
	material_total_cost: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frappe.model.set_value(d.doctype, d.name, 'total_cost', (d.manpower_total_cost + d.machinery_total_cost + d.material_total_cost));
	}
});

// when the form saved total_cost will be calculated
frappe.ui.form.on("Timesheet", "validate", function(frm, cdt, cdn) {
	var d = locals[cdt][cdn];
	frappe.model.set_value(cdt, cdn, "total_cost", d.manpower_total_cost + d.machinery_total_cost + d.material_total_cost);
});

// END OF TOTAL COST CALCULATION AT THE BOTTOM

// NET PROFIT AT THE BOTTOM 
// when total_income changed net_profit will be calculated
frappe.ui.form.on("Timesheet", {
	total_income: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frappe.model.set_value(d.doctype, d.name, 'net_profit', (d.total_income - d.total_cost));
	}
});

// when total_cost changed net_profit will be calculated
frappe.ui.form.on("Timesheet", {
	total_cost: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frappe.model.set_value(d.doctype, d.name, 'net_profit', (d.total_income - d.total_cost));
	}
});

// when the form saved total_cost will be calculated
frappe.ui.form.on("Timesheet", "validate", function(frm, cdt, cdn) {
	var d = locals[cdt][cdn];
	frappe.model.set_value(cdt, cdn, "net_profit", d.total_income - d.total_cost);
});

// END OF NET PROFIT CALCULATION AT THE BOTTOM





/********************** OLD SCRIPT **************
// TOTAL ACTIVITY INCOME
frappe.ui.form.on("Timesheet Detail", {
	  billing_rate: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
				frappe.model.set_value(d.doctype, d.name, 'total_activity_income', (d.quantity * d.billing_amount));
	 }
 });

frappe.ui.form.on("Timesheet Detail", {
	  billing_amount: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
				frappe.model.set_value(d.doctype, d.name, 'total_activity_income', (d.quantity * d.billing_amount));
	 }
 });

frappe.ui.form.on("Timesheet", "validate", function(frm, cdt, cdn) {
var d = locals[cdt][cdn];
frappe.model.set_value(cdt, cdn, "total_activity_income", d.quantity * d.billing_amount); });

// TOTAL ACTIVITY COST
frappe.ui.form.on("Timesheet Detail", {
	  costing_rate: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
				frappe.model.set_value(d.doctype, d.name, 'total_activity_cost', (d.quantity * d.costing_amount));
	 }
 });

frappe.ui.form.on("Timesheet Detail", {
	  costing_amount: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
				frappe.model.set_value(d.doctype, d.name, 'total_activity_cost', (d.quantity * d.costing_amount));
	 }
 });

frappe.ui.form.on("Timesheet", "validate", function(frm, cdt, cdn) {
var d = locals[cdt][cdn];
frappe.model.set_value(cdt, cdn, "total_activity_cost", d.quantity * d.costing_amount); });

// NET PROFIT OR LOSS CALCULATION 
frappe.ui.form.on("Timesheet Detail", {
	  total_activity_income: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
				frappe.model.set_value(d.doctype, d.name, 'net_profit_or_loss', (d.total_activity_income - d.total_activity_cost));
	 }
 });

frappe.ui.form.on("Timesheet Detail", {
	  total_activity_cost: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
				frappe.model.set_value(d.doctype, d.name, 'net_profit_or_loss', (d.total_activity_income - d.total_activity_cost));
	 }
 });

frappe.ui.form.on("Timesheet", "validate", function(frm, cdt, cdn) {
var d = locals[cdt][cdn];
frappe.model.set_value(cdt, cdn, "net_profit_or_loss", d.total_activity_income - d.total_activity_cost); });

********************** END OF OLD SCRIPT ****/



frappe.ui.form.on("Timesheet", {
	project: function(frm, cdt, cdn) {

		var d = locals[cdt][cdn];
		console.log("d has the value of the following", d);
		frm.set_query("task", function() {
			return {
				"filters": {
					"project": frm.doc.project
				}
			}
		});

	},
});
