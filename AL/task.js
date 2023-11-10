cur_frm.add_fetch('item', 'item', 'item_name');
cur_frm.add_fetch('id', 'job_title', 'job_title');
cur_frm.add_fetch('equipment', 'type', 'type');
cur_frm.add_fetch('task', 'amount', 'amount');




//////////////////////// scripts added by sami are betweeen this comments //////////////////////////////////


frappe.ui.form.on("Man power Detail", {
	 quantity: function(frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		if(row.quantity && row.utilization_factor && row.labor_index && row.productivity){
			calculateManpowerCost(frm,cdt,cdn)
		}
	 },
	utilization_factor: function(frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		if(row.quantity && row.utilization_factor && row.labor_index && row.productivity){
			calculateManpowerCost(frm,cdt,cdn)
		}
	 },
	labor_index: function(frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		if(row.quantity && row.utilization_factor && row.labor_index && row.productivity){
			calculateManpowerCost(frm,cdt,cdn)
		}
	 },
	productivity: function(frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		if(row.quantity && row.utilization_factor && row.labor_index && row.productivity){
			calculateManpowerCost(frm,cdt,cdn)
		}
	 }
 }); 


frappe.ui.form.on("machineryplan", {
	 working_hour: function(frm, cdt, cdn) {
		 console.log("we are here")
		var row = locals[cdt][cdn];
		 console.log("wh: ", row.working_hour, "uf :", row.utilization_factor,  "hrental: ", row.hourly_rental, "pro", row.productivity)
		if(row.working_hour && row.utilization_factor && row.hourly_rental && row.productivity){
			calculateMachineryCost(frm,cdt,cdn)
		}
	 },
	utilization_factor: function(frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		 console.log("wh: ", row.working_hour, "uf :", row.utilization_factor,  "hrental: ", row.hourly_rental, "pro", row.productivity)

		if(row.working_hour && row.utilization_factor && row.hourly_rental && row.productivity){
			calculateMachineryCost(frm,cdt,cdn)
		}
	 },
	hourly_rental: function(frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		 console.log("wh: ", row.working_hour, "uf :", row.utilization_factor,  "hrental: ", row.hourly_rental, "pro", row.productivity)

		if(row.working_hour && row.utilization_factor && row.hourly_rental && row.productivity){
			calculateMachineryCost(frm,cdt,cdn)
		}
	 },
	productivity: function(frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		console.log("row", row)
		 console.log("wh: ", row.working_hour, "uf :", row.utilization_factor,  "hrental: ", row.hourly_rental, "pro", row.productivity)

		if(row.working_hour && row.utilization_factor && row.hourly_rental && row.productivity){
			calculateMachineryCost(frm,cdt,cdn)
		}
	 }
 }); 


frappe.ui.form.on("Task Depends On", {
	  amount: function(frm, cdt, cdn) {
		  console.log("we are here")
			  calculateTotal(frm, "depends_on", "total_caried_to_summary", "amount")
	 }
 }); 



function calculateManpowerCost(frm, cdt, cdn){
	var row = locals[cdt][cdn];
	var cost = row.quantity * row.utilization_factor * row.labor_index / row.productivity;
	row.cost_per_unit = cost;
	
	calculateTotalAmount(frm, "man_power_detail", "man_power_unit_cost")
	frm.set_value("direct_cost", frm.doc.machinery_unit_cost + frm.doc.man_power_unit_cost)
	frm.set_value("over_head_cost", frm.doc.direct_cost * 0.15)
	frm.set_value("profit_margin", frm.doc.direct_cost * 0.10)
	frm.set_value("activity_unit_rate", frm.doc.direct_cost + frm.doc.profit_margin + frm.doc.over_head_cost)


	frm.refresh_field("direct_cost")
	frm.refresh_field("profit_margin")
	frm.refresh_field("activity_unit_rate")
	frm.refresh_field("activity_unit_rate")
	frm.refresh_field("man_power_detail")
}




function calculateMachineryCost(frm, cdt, cdn){
	var row = locals[cdt][cdn];
	var cost = row.working_hour * row.utilization_factor * row.hourly_rental / row.productivity;
	row.cost_per_unit = cost;
	
	calculateTotalAmount(frm, "machinery_detail_planning", "machinery_unit_cost")
	frm.set_value("direct_cost", frm.doc.machinery_unit_cost + frm.doc.man_power_unit_cost)
	frm.set_value("over_head_cost", frm.doc.direct_cost * 0.15)
	frm.set_value("profit_margin", frm.doc.direct_cost * 0.10)
	frm.set_value("activity_unit_rate", frm.doc.direct_cost + frm.doc.profit_margin + frm.doc.over_head_cost)

	
	frm.refresh_field("direct_cost")
	frm.refresh_field("profit_margin")
	frm.refresh_field("activity_unit_rate")
	frm.refresh_field("activity_unit_rate")
	frm.refresh_field("machinery_detail_planning")
}





function calculateTotalAmount(frm, childTable, valueField) {
	var totalAmount = 0;

	if (!frm || !frm.doc || !frm.doc[childTable]) {
		console.error("Invalid form or child table data.");
		return NaN;
	}

	frm.doc[childTable].forEach((row) => {
		if (typeof row.cost_per_unit === 'number') {
			totalAmount += row.cost_per_unit;
		} else if (typeof row.cost_per_unit === 'string' && !isNaN(parseFloat(row.cost_per_unit))) {
			totalAmount += parseFloat(row.cost_per_unit);
		} else {
			console.error("Invalid cost_per_unit value in the child table:", row.cost_per_unit);
		}
	});

	frm.set_value(valueField, totalAmount);
	frm.refresh_field(valueField);

	frm.refresh_field(valueField, totalAmount);
	frm.set_value(valueField, totalAmount);


	return parseFloat(totalAmount);
}


function calculateTotal(frm, childTable, valueField, input) {
	var totalAmount = 0;

	if (!frm || !frm.doc || !frm.doc[childTable]) {
		console.error("Invalid form or child table data.");
		return NaN;
	}

	frm.doc[childTable].forEach((row) => {
		if (typeof row[input] === 'number') {
			totalAmount += row[input];
		} else if (typeof row[input] === 'string' && !isNaN(parseFloat(row[input]))) {
			totalAmount += parseFloat(row[input]);
		} else {
			console.error("Invalid input value in the child table:", row[input]);
		}
	});

	frm.set_value(valueField, totalAmount);
	frm.refresh_field(valueField);

	frm.refresh_field(valueField, totalAmount);
	frm.set_value(valueField, totalAmount);


	return parseFloat(totalAmount);
}


///////////////////////////////////////////////////////////////////////////////////////////////////////




frappe.ui.form.on("Task", {
	  quantity: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
				frappe.model.set_value(d.doctype, d.name, 'amount', (d.quantity * d.activity_unit_rate)); 
	 }
 }); 


frappe.ui.form.on("Task", {
	  activity_unit_rate: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
				frappe.model.set_value(d.doctype, d.name, 'amount', (d.quantity * d.activity_unit_rate)); 
	 }
 }); 
frappe.ui.form.on("Man power Detail", {
	  quantity: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
				frappe.model.set_value(d.doctype, d.name, 'amount', (d.
utilization_factor * d.quantity * d.rate));
		frappe.model.set_value(d.doctype, d.name, 'total_quantity_required', (d.quantity * d.quantity_to_be_executed));
		set_total_qty_man(frm);  
	 }
 });  

frappe.ui.form.on("Man power Detail", {
	  rate: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
				frappe.model.set_value(d.doctype, d.name, 'amount', (d.
utilization_factor * d.quantity * d.rate));   
	}
});

frappe.ui.form.on("Man power Detail", {
	  utilization_factor: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
				frappe.model.set_value(d.doctype, d.name, 'amount', (d.
utilization_factor * d.quantity * d.rate));   
	}
});

frappe.ui.form.on("Man power Detail", {
	  quantity_to_be_executed: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
				frappe.model.set_value(d.doctype, d.name, 'total_quantity_required', (d.quantity * d.quantity_to_be_executed));
		frappe.model.set_value(d.doctype, d.name, 'total_amount_required', (d.amount* d.quantity_to_be_executed));

	 }
 });

frappe.ui.form.on("Man power Detail", {
	  amount: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frappe.model.set_value(d.doctype, d.name, 'total_amount_required', (d.amount* d.quantity_to_be_executed));

	 }
 });

// TOTAL CALCULATIONS FOR QUANTITY AND AMOUNT OF MAN POWER
// Set total quantity of manpowerplan on save of Activity Type
frappe.ui.form.on("Activity Type", "validate", function(frm)  {
	set_total_qty_man(frm);
});

// Set total quantity of manpowerplan on change of quantity included in the above script
//frappe.ui.form.on("manpowerplan", "quantity", function(frm, cdt, cdn)  {
	//set_total_qty_man(frm);
//});

// Calculate and set total_qty_man
var set_total_qty_man = function(frm) {
	var total_qty_man = 0.0;
	$.each(frm.doc.man_power_detail, function(i, row) {
		total_qty_man += flt(row.quantity);
	})
	frm.set_value("man_power_total_qty", total_qty_man);
	//frm.refresh();
}

// Set total amount of manpowerplan on save of Activity Type
frappe.ui.form.on("Activity Type", "validate", function(frm)  {
	set_total_amt_man(frm);
});

//Set total amount of manpowerplan on change of amount included in the above script
frappe.ui.form.on("man_power_detail", "amount", function(frm, cdt, cdn)  {
	set_total_amt_man(frm);
});

// Calculate and set total_qty_man
var set_total_amt_man = function(frm) {
	var total_amt_man = 0.0;
	$.each(frm.doc.man_power_detail, function(i, row) {
		total_amt_man += flt(row.amount);
	})
	frm.set_value("man_power_total_amount", total_amt_man);
	//frm.refresh();
}
// TOTAL CALCULATION OF MAN POWER END

// END OF MAN POWER RELATED SCRIPT

// MACHINERY RELATED SCRIPTS
frappe.ui.form.on("machineryplan", {
	  working_hour: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
				frappe.model.set_value(d.doctype, d.name, 'amount', (d.utilization_factor * d.working_hour * d.rate));
		frappe.model.set_value(d.doctype, d.name, 'total_quantity_required', (d.working_hour * d.quantity_to_be_exected));
		// set_total_qty_mac(frm);   
	 }
 });  

frappe.ui.form.on("machineryplan", {
	  rate: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
				frappe.model.set_value(d.doctype, d.name, 'amount', (d.utilization_factor * d.working_hour * d.rate));   
	}
});

frappe.ui.form.on("machineryplan", {
	  utilization_factor: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
				frappe.model.set_value(d.doctype, d.name, 'amount', (d.utilization_factor * d.working_hour * d.rate));   
	}
});

frappe.ui.form.on("itemplann", {
	  quantity1 : function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
				frappe.model.set_value(d.doctype, d.name, 'amount', (d.quantity1 * d.rate));   
	}
});

frappe.ui.form.on("itemplann", {
	  rate : function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
				frappe.model.set_value(d.doctype, d.name, 'amount', (d.quantity1 * d.rate));   
	}
});
