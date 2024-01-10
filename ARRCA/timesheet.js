cur_frm.add_fetch('project', 'cluster', 'cluster');
// Machinary
cur_frm.add_fetch('id_mac', 'rental_rate', 'rental_rate');
cur_frm.add_fetch('id_mac', 'make_model', 'make_model');
cur_frm.add_fetch('id_mac', 'standard_fuel_consumption', 'standard_fuel_consumption');
cur_frm.add_fetch('id_mac', 'fuel_cost_per_hour', 'fuel_cost_per_hour');
cur_frm.add_fetch('id_mac', 'type', 'type');
cur_frm.add_fetch('id_mac', 'uf', 'uf');
cur_frm.add_fetch('id_mac', 'efficiency', 'efficency');

// Manpower
cur_frm.add_fetch('id_map', 'hourly_cost', 'hourly_cost');
cur_frm.add_fetch('id_map', 'job_title', 'job_title');

//Material
cur_frm.add_fetch('id_mat', 'item', 'item1');
cur_frm.add_fetch('id_mat', 'uom', 'uom');
cur_frm.add_fetch('id_mat', 'quantity', 'quantity');
cur_frm.add_fetch('id_mat', 'unit_price', 'unit_price');


// Fetch Task from Task
cur_frm.add_fetch('task_name', 'unit', 'uom');
cur_frm.add_fetch('task_name', 'quantity', 'quantity');
cur_frm.add_fetch('task_name', 'productivity', 'productivity');
cur_frm.add_fetch('task_name', 'project', 'project');
cur_frm.add_fetch('task_name', 'direct_cost_after_conversion', 'rate');

cur_frm.add_fetch('task_name', 'equipment_total_cost', 'equipment_total_cost');
cur_frm.add_fetch('task_name', 'equipment_unit_rate', 'equipment_unit_rate');

cur_frm.add_fetch('task_name', 'man_power_unit_rate', 'man_power_unit_rate');
cur_frm.add_fetch('task_name', 'man_power_total_cost', 'man_power_total_cost');

cur_frm.add_fetch('task_name', 'material_total_cost', 'material_total_cost');





frappe.ui.form.on("Timesheet", {
      rate: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn];
                frappe.model.set_value(d.doctype, d.name, 'income', (d.executed_quantity * d.rate));
		
		
     }
 });  


frappe.ui.form.on("Timesheet", {
      executed_quantity: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn];
                frappe.model.set_value(d.doctype, d.name, 'income', (d.executed_quantity * d.rate));
		
		
     }
 });  



frappe.ui.form.on("Timesheet", {
      income: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn];
                frappe.model.set_value(d.doctype, d.name, 'net_profit', (d.income - d.activity_total_cost));
		
		
     }
 });  

frappe.ui.form.on("Timesheet", {
      activity_total_cost: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn];
                frappe.model.set_value(d.doctype, d.name, 'net_profit', (d.income - d.activity_total_cost));
		
		
     }
 });  


// Populate Machinery, Manpower and Material From Task Master DocType
// TASK
// MACHINERY
frappe.ui.form.on('Timesheet', {
    task_name: function (frm) {
        if (frm.doc.task_name) {
            frm.clear_table('machinery');
            frappe.model.with_doc('Task', frm.doc.task_name, function () {
                let source_doc = frappe.model.get_doc('Task', frm.doc.task_name);
                $.each(source_doc.machinery, function (index, source_row) {
			const target_row = frm.add_child('machinery');	
                    	target_row.type = source_row.type; 
			target_row.uf = source_row.uf
			target_row.rental_rate = source_row.rental_rate;
                    frm.refresh_field('machinery');
                });
            });
        }
    },
});


// TASK 1
// MANPOWER 1
frappe.ui.form.on('Timesheet', {
    task_name: function (frm) {
        if (frm.doc.task_name) {
            frm.clear_table('manpower1');
            frappe.model.with_doc('Task', frm.doc.task_name, function () {
                let source_doc = frappe.model.get_doc('Task', frm.doc.task_name);
                $.each(source_doc.manpower, function (index, source_row) {
			const target_row = frm.add_child('manpower1');	
                    	target_row.job_title = source_row.job_title; 
			target_row.mp_number = source_row.mp_number;
			target_row.li_permanent = source_row.li_permanent;
			target_row.hourly_cost = source_row.hourly_cost;
                    frm.refresh_field('manpower1');
                });
            });
        }
    },
});

// TASK 1
// MATERIAL 1
frappe.ui.form.on('Timesheet', {
    task_name: function (frm) {
        if (frm.doc.task_name) {
            frm.clear_table('material1');
            frappe.model.with_doc('Task', frm.doc.task_name, function () {
                let source_doc = frappe.model.get_doc('Task', frm.doc.task_name);
                $.each(source_doc.material, function (index, source_row) {
			const target_row = frm.add_child('material1');	
			target_row.item = source_row.item;
                    	target_row.uom = source_row.uom; 
			target_row.quantity = source_row.quantity;
			target_row.unit_price = source_row.unit_price;
			target_row.total_cost = source_row.total_cost;
                    frm.refresh_field('material1');
                });
            });
        }
    },
});


// MACHINERY RELATED SCRIPTS
frappe.ui.form.on("Machinery Detail Timesheet", {
      qty: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn];
                frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (d.qty * d.uf * d.efficency * d.rental_rate));
		
		  set_total_amt_mac(frm);
     }
 });

frappe.ui.form.on("Machinery Detail Timesheet", {
      uf: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn];
                frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (d.qty * d.uf * d.efficency * d.rental_rate));
		
		  set_total_amt_mac(frm);
     }
 });  

frappe.ui.form.on("Machinery Detail Timesheet", {
      efficency: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn];
                frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (d.qty * d.uf * d.efficency * d.rental_rate));
		
		   set_total_amt_mac(frm);
     }
 });

frappe.ui.form.on("Machinery Detail Timesheet", {
      rental_rate: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn];
                frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (d.qty * d.uf * d.efficency * d.rental_rate));
	set_total_amt_mac(frm);	
		   
     }
 });// TOTAL CALCULATIONS FOR QUANTITY AND TOTAL HOURLY COST OF MACHINERY
// Set total quantity of machineryplan on save of Activity Type

// Set total amount of machineryplan on save of Activity Type
frappe.ui.form.on("Timesheet", "validate", function(frm)  {
	set_total_amt_mac(frm);
});

//Set total amount of machineryplan on change of amount
frappe.ui.form.on("Machinery Detail Timesheet", "total_hourly_cost", function(frm, cdt, cdn)  {
	set_total_amt_mac(frm);
});

// Calculate and set total_qty_mac
var set_total_amt_mac = function(frm) {
	var total_amt_mac = 0.0;
	$.each(frm.doc.machinery, function(i, row) {
		total_amt_mac += flt(row.total_hourly_cost);
	})
	calculateTotalCost(frm)
	
	frm.set_value("equipment_total_cost", total_amt_mac);
	//frm.refresh();
}


frappe.ui.form.on("Timesheet", {
      equipment_total_cost: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn];
                frappe.model.set_value(d.doctype, d.name, 'equipment_unit_rate', (d.equipment_total_cost / d.productivity)); 
     }
 }); 

frappe.ui.form.on("Timesheet", {
      productivity: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn];
                frappe.model.set_value(d.doctype, d.name, 'equipment_unit_rate', (d.equipment_total_cost / d.productivity)); 
     }
 }); 

//END OF MACHINERY RELATED TOTAL CALCULATIONS

// END OF MACHINERY RELATED SCRIPT

// Manpower

frappe.ui.form.on("Manpower Detail", {
      li_permanent: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn];
                frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (d.li_permanent * d.labor_no * d.hourly_cost * d.uf * d.efficency)); 

set_total_man(frm);
     }

	
 });

frappe.ui.form.on("Manpower Detail", {
      labor_no: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn];
               frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (d.li_permanent * d.labor_no * d.hourly_cost * d.uf * d.efficency));
set_total_man(frm);
     }
	
 });


frappe.ui.form.on("Manpower Detail", {
      uf: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn];
                 frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (d.li_permanent * d.labor_no * d.hourly_cost * d.uf * d.efficency));

set_total_man(frm);
     }
	
 });

frappe.ui.form.on("Manpower Detail", {
      hourly_cost: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn];
                 frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (d.li_permanent * d.labor_no * d.hourly_cost * d.uf * d.efficency));
set_total_man(frm);
     }
	
 });

frappe.ui.form.on("Manpower Detail", {
      efficency: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn];
                 frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (d.li_permanent * d.labor_no * d.hourly_cost * d.uf * d.efficency)); 

set_total_man(frm);
     }
	
 });

frappe.ui.form.on("Timesheet", "validate", function(frm)  {
	set_total_man(frm);
});

var set_total_man = function(frm) {
	var total_man = 0.0;
	$.each(frm.doc.manpower1, function(i, row) {
		total_man += flt(row.total_hourly_cost);
	})
	calculateTotalCost(frm)
	frm.set_value("man_power_total_cost", total_man);
	//frm.refresh();
}

frappe.ui.form.on("Timesheet", {
      productivity: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn];
                frappe.model.set_value(d.doctype, d.name, 'man_power_unit_rate', (d.man_power_total_cost / d.productivity)); 
     }
 }); 

frappe.ui.form.on("Timesheet", {
      man_power_total_cost: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn];
                frappe.model.set_value(d.doctype, d.name, 'man_power_unit_rate', (d.man_power_total_cost / d.productivity)); 
     }
 });



// EDN OF MATERIAL RELATED SCRIPT

// Material
frappe.ui.form.on("Material DetailARRCA", {
      qaty: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn];
                frappe.model.set_value(d.doctype, d.name, 'total_cost', (d.
qaty * d.unit_price)); 

set_total_mat(frm);
     }
	
 });

frappe.ui.form.on("Material DetailARRCA", {
      unit_price: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn];
                frappe.model.set_value(d.doctype, d.name, 'total_cost', (d.
qaty * d.unit_price)); 

set_total_mat(frm);
     }
	
 });
 
var set_total_mat = function(frm) {
	var total_mat = 0.0;
	$.each(frm.doc.material1, function(i, row) {
		total_mat += flt(row.total_cost);
	})
	calculateTotalCost(frm)
	frm.set_value("material_total_cost", total_mat);
	//frm.refresh();
}

function calculateTotalCost(frm){
	var total = (frm.doc.equipment_total_cost || 0) + (frm.doc.man_power_total_cost || 0) + (frm.doc.material_total_cost || 0)
	frm.set_value("activity_total_cost", total)
	frm.refresh_field("activity_total_cost")
}

frappe.ui.form.on("Timesheet", "validate", function(frm)  {
	set_total_mat(frm);
});

// END OF MATERIAL RELATED SCRIPT

// TASK LIST RELATED SCRIPT
cur_frm.add_fetch('item', 'quantity', 'quantity');
cur_frm.add_fetch('item', 'direct_cost_after_conversion', 'activity_unit_rate');
cur_frm.add_fetch('item', 'unit', 'uom');

// Total Cost
frappe.ui.form.on("Quotation Items", {
      quantity: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn];
                frappe.model.set_value(d.doctype, d.name, 'total_cost', (d.quantity * d.activity_unit_rate));
		set_total_cost(frm);
     }
 });

frappe.ui.form.on("Quotation Items", {
      activity_unit_rate: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn];
                frappe.model.set_value(d.doctype, d.name, 'total_cost', (d.quantity * d.activity_unit_rate));
		set_total_cost(frm);
     }
 });


frappe.ui.form.on("Task", "validate", function(frm)  {
	set_total_cost(frm);
});

//Set total cost of quotation items on change of total cost
frappe.ui.form.on("Quotation Items", "total_cost", function(frm, cdt, cdn)  {
	set_total_cost(frm);
});


// Calculate total cost of tasks
var set_total_cost = function(frm) {
	var total_cost = 0.0;
	$.each(frm.doc.task_list, function(i, row) {
		total_cost += flt(row.total_cost);
	})
	frm.set_value("total_cost_collective", total_cost);
	//frm.refresh();
}




// ACTIVITY TOTAL COST RELATED SCRIPT
frappe.ui.form.on("Timesheet", "man_power_total_cost", function(frm, cdt, cdn) {
var d = locals[cdt][cdn];
frappe.model.set_value(cdt, cdn, "activity_total_cost", d.man_power_total_cost + d.equipment_total_cost + d.material_total_cost); });

frappe.ui.form.on("Timesheet", "equipment_total_cost", function(frm, cdt, cdn) {
var d = locals[cdt][cdn];
frappe.model.set_value(cdt, cdn, "activity_total_cost", d.man_power_total_cost + d.equipment_total_cost + d.material_total_cost); });

frappe.ui.form.on("Timesheet", "material_total_cost", function(frm, cdt, cdn) {
var d = locals[cdt][cdn];
frappe.model.set_value(cdt, cdn, "activity_total_cost", d.man_power_total_cost + d.equipment_total_cost + d.material_total_cost); });

// INDIRECT COST TOTAL COST RELATED SCRIPT
frappe.ui.form.on("Timesheet", "activity_total_cost", function(frm, cdt, cdn) {
var d = locals[cdt][cdn];
frappe.model.set_value(cdt, cdn, "indirect_cost_total", (d.activity_total_cost * d.indirectcost)/100); });

frappe.ui.form.on("Timesheet", "indirectcost", function(frm, cdt, cdn) {
var d = locals[cdt][cdn];
frappe.model.set_value(cdt, cdn, "indirect_cost_total", (d.activity_total_cost * d.indirectcost)/100); });

// TOTAL COST WITH INDIRECT COST
frappe.ui.form.on("Timesheet", "activity_total_cost", function(frm, cdt, cdn) {
var d = locals[cdt][cdn];
frappe.model.set_value(cdt, cdn, "total_cost_with_indirect_cost", d.activity_total_cost + d.indirect_cost_total); });

frappe.ui.form.on("Timesheet", "indirect_cost_total", function(frm, cdt, cdn) {
var d = locals[cdt][cdn];
frappe.model.set_value(cdt, cdn, "total_cost_with_indirect_cost", d.activity_total_cost + d.indirect_cost_total); });


// TOTAL WITH PROFIT MARGIN
frappe.ui.form.on("Timesheet", "activity_total_cost", function(frm, cdt, cdn) {
var d = locals[cdt][cdn];
frappe.model.set_value(cdt, cdn, "total_with_profit_margin", (d.activity_total_cost * d.profitmargin)/100); });

frappe.ui.form.on("Timesheet", "profitmargin", function(frm, cdt, cdn) {
var d = locals[cdt][cdn];
frappe.model.set_value(cdt, cdn, "total_with_profit_margin", (d.activity_total_cost * d.profitmargin)/100); });

// TOTAL WITH PROFIT MARGIN
frappe.ui.form.on("Timesheet", "total_cost_with_indirect_cost", function(frm, cdt, cdn) {
var d = locals[cdt][cdn];
frappe.model.set_value(cdt, cdn, "activity_unit_rate", d.total_cost_with_indirect_cost + d.total_with_profit_margin + d.activity_unit_rate_collective); });

frappe.ui.form.on("Timesheet", "total_with_profit_margin", function(frm, cdt, cdn) {
var d = locals[cdt][cdn];
frappe.model.set_value(cdt, cdn, "activity_unit_rate", d.total_cost_with_indirect_cost + d.total_with_profit_margin + d.activity_unit_rate_collective); });


frappe.ui.form.on("Timesheet", "activity_unit_rate_collective", function(frm, cdt, cdn) {
var d = locals[cdt][cdn];
frappe.model.set_value(cdt, cdn, "activity_unit_rate", d.total_cost_with_indirect_cost + d.total_with_profit_margin + d.activity_unit_rate_collective); });



















/* TIMESHEET SCRIPT BEFORE MESAY OLI ***************

// Fetch price depending on activity type selection
cur_frm.add_fetch("activity", "billing_rate", "billing_rate");
cur_frm.add_fetch("activity", "agreement_quantity_", "agreement_quantity_");
cur_frm.add_fetch("activity", "activity_weight", "activity_weight");
cur_frm.add_fetch("activity", "total_project_duration", "total_project_duration");
cur_frm.add_fetch("activity", "total_project_amount_in_etb", "total_project_amount");
cur_frm.add_fetch("activity", "project", "project");
cur_frm.add_fetch("activity", "task", "task");
cur_frm.add_fetch("activity", "uom", "uom");
cur_frm.add_fetch("activity", "machinary_total_amount", "machinary_total_amount");



cur_frm.add_fetch("task", "task_weight", "task_weight");

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
frappe.ui.form.on("Timesheet", "validate", function(frm)  {
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
frappe.ui.form.on("man_power_detail", "costing_amount", function(frm, cdt, cdn)  {
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
frappe.ui.form.on("Timesheet", "validate", function(frm)  {
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
frappe.ui.form.on("Machineryused", "costing_amount", function(frm, cdt, cdn)  {
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
frappe.ui.form.on("Timesheet", "validate", function(frm)  {
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
frappe.ui.form.on("Timesheetitem", "total", function(frm, cdt, cdn)  {
	set_total_amt_mat(frm);
});

// TOTAL CALCULATION OF MATERIAL USED END

// END OF MATERIAL USED RELATED SCRIPT

// TOTAL COST AT THE BOTTOM 
// when manpower_total_cost changed total_cost will be calculated
frappe.ui.form.on("Timesheet", {
      manpower_total_cost: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn];
		if(!d.manpower_total_cost) d.manpower_total_cost = 0.0;
		if(!d.machinery_total_cost) d.machinery_total_cost = 0.0;
		if(!d.material_total_cost) d.material_total_cost = 0.0;
                frappe.model.set_value(d.doctype, d.name, 'total_cost', (d.manpower_total_cost + d.machinery_total_cost + material_total_cost ));
     }
 });

// when material_total_cost changed total_cost will be calculated
frappe.ui.form.on("Timesheet", {
      machinery_total_cost: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn];
                frappe.model.set_value(d.doctype, d.name, 'total_cost', (d.manpower_total_cost + d.machinery_total_cost + d.material_total_cost ));
     }
 });

// when manpower_total_cost changed total_cost will be calculated
frappe.ui.form.on("Timesheet", {
      material_total_cost: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn];
                frappe.model.set_value(d.doctype, d.name, 'total_cost', (d.manpower_total_cost + d.machinery_total_cost + d.material_total_cost ));
     }
 });

// when the form saved total_cost will be calculated
frappe.ui.form.on("Timesheet", "validate", function(frm, cdt, cdn) {
var d = locals[cdt][cdn];
frappe.model.set_value(cdt, cdn, "total_cost", d.manpower_total_cost + d.machinery_total_cost + d. material_total_cost);
});

// END OF TOTAL COST CALCULATION AT THE BOTTOM

// NET PROFIT AT THE BOTTOM 
// when total_income changed net_profit will be calculated
frappe.ui.form.on("Timesheet", {
      total_income: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn];
                frappe.model.set_value(d.doctype, d.name, 'net_profit', (d.total_income -  d.total_cost));
     }
 });

// when total_cost changed net_profit will be calculated
frappe.ui.form.on("Timesheet", {
      total_cost: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn];
                frappe.model.set_value(d.doctype, d.name, 'net_profit', (d.total_income -  d.total_cost));
     }
 });

// when the form saved total_cost will be calculated
frappe.ui.form.on("Timesheet", "validate", function(frm, cdt, cdn) {
var d = locals[cdt][cdn];
frappe.model.set_value(cdt, cdn, "net_profit", d.total_income -  d.total_cost);
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

********************** END OF OLD SCRIPT ****
 *** END OF TIMESHEET SCRIPT BEFORE MESAY OLI ***************/

frappe.ui.form.on("Timesheet", {
    date_ec:function(frm, cdt, cdn) {
        if(frm.doc.date_ec) {

            var finalgc = convertDateTOGC(frm.doc.date_ec).toString();
            frm.doc.date= finalgc;
            refresh_field("date");
            
        }
    }
});