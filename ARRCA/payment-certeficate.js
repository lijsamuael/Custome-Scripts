// Fetch Task from Task
cur_frm.add_fetch('contract_no', 'project', 'project');
cur_frm.add_fetch('contract_no', 'contractor', 'contractor');
cur_frm.add_fetch('contract_no', 'consultant', 'consultant');
cur_frm.add_fetch('contract_no', 'employee', 'client');
cur_frm.add_fetch('contract_no', 'location', 'location');


frappe.ui.form.on('Payment Certeficate', {
	main_contract: function(frm, cdt, cdn) {
		calculateTotalContractAmount(frm);
	},
	supp_contract: function(frm, cdt, cdn) {
		calculateTotalContractAmount(frm);
	},
	price_adjustment: function(frm, cdt, cdn) {
		calculateTotalContractAmount(frm);
	},
	variation_orders: function(frm, cdt, cdn) {
		calculateTotalContractAmount(frm);
	},
	vat_0: function(frm, cdt, cdn) {
		calculateTotalContractAmount(frm);
	}
});

function calculateTotalContractAmount (frm){
	var total = (frm.doc.main_contract || 0 ) + (frm.doc.supp_contract || 0) + (frm.doc.price_adjustment || 0) + (frm.doc.variation_orders || 0) + (frm.doc.vat_0 || 0);
	console.log("total", total)
	frm.set_value("total_sum", total);
	frm.refresh_field("total_sum");
}


frappe.ui.form.on('Prevpay', {
	amount_plus_vat: function(frm) {
		var table = frm.doc.table_13;
		var total = 0;
		console.log("table", table);
		for(var i = 0; i < table.length; i++){
			total += (table[i].amount_plus_vat || 0);
			console.log("total", total)
		}
		frm.set_value("previous_payments", total)
		frm.set_value("previous_payment_total", total)
		frm.refresh_field("previous_payments");
		frm.refresh_field("previous_payment_total");
	}
});



frappe.ui.form.on('Payment Certeficate', {
	previous_payments: function(frm, cdt, cdn) {
		calculateTotalDeduction(frm);
	},
	rebate: function(frm, cdt, cdn) {
		calculateTotalDeduction(frm);
	},
	retention: function(frm, cdt, cdn) {
		calculateTotalDeduction(frm);
	},
	advance_payt: function(frm, cdt, cdn) {
		calculateTotalDeduction(frm);
	}
});

function calculateTotalDeduction (frm){
	var total = (frm.doc.previous_payment_total || 0 ) + (frm.doc.rebate || 0) + (frm.doc.retention || 0) + (frm.doc.advance_payt || 0);
	console.log("total", total)
	frm.set_value("total_deduction", total);
	frm.refresh_field("total_deduction");
}


frappe.ui.form.on('Payment Certeficate', {
	amount_of_advance_taken: function(frm, cdt, cdn) {
		calculateTotalAdvance(frm);
	},
	amount_of_advance_repaid_previous: function(frm, cdt, cdn) {
		calculateTotalAdvance(frm);
	},
	amount_of_advance_repaid_this_payment: function(frm, cdt, cdn) {
		calculateTotalAdvance(frm);
	}
});

function calculateTotalAdvance (frm){
	var total = (frm.doc.amount_of_advance_taken || 0 ) + (frm.doc.amount_of_advance_repaid_previous || 0) + (frm.doc.amount_of_advance_repaid_this_payment || 0);
	console.log("total", total)
	frm.set_value("out_standing_advance_payment", total);
	frm.refresh_field("out_standing_advance_payment");
}


//fetch and assign values to the bill of quantity
// frappe.ui.form.on('Payment Certeficate', {
// 	contract_no: function(frm) {
// 		if(frm.doc.contract_no){
// 		frappe.call({
// 			method: 'frappe.client.get_list',
// 			args: {
// 				doctype: 'Timesheet',
// 				filters: {
// 					'contract_no': frm.doc.contract_no,
// 				},
// 				fields: ["*"],
// 			},
// 			callback: async function(response) {
// 				var timesheets = response.message;
// 				console.log("respnoses", timesheets)
// 				var table = frm.doc.table;
// 				frm.clear_table("table");
// 				frm.set_value("table", []);

// 				timesheets.map((timesheet, index) => {
// 					var tableRow = frappe.model.add_child(frm.doc, "BOQ Table", "table");
// 					tableRow.item = timesheet.task_name;
// 					tableRow.executed_quantity = timesheet.executed_quantity;
// 					tableRow.unit_rate = timesheet.productivity;
// 					tableRow.unit = timesheet.uom;
// 					tableRow.contract_quantity = timesheet.quantity;
// 					tableRow.contract_amount = tableRow.unit_rate * tableRow.contract_quantity;
// 					tableRow.executed_amount = tableRow.unit_rate * tableRow.executed_quantity;
// 				})
// 				refresh_field("table");

// 			}
// 		})
// 		}
// 	}
// });