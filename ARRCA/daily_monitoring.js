//Property of ERP Solutions PLC Custom Script Written by Bereket T May 24 2023

cur_frm.add_fetch('project', 'consultant', 'consultant');
cur_frm.add_fetch('project', 'client', 'client');

cur_frm.add_fetch('activity', 'subject', 'subject');




frappe.ui.form.on('New Daily Plan Detail', {
	before_daily_plan_detail_remove: function(frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		var removed_activity = row.activity;
		console.log("removed task id", removed_activity);


		deleteRow(frm, removed_activity, "machinery");
		deleteRow(frm, removed_activity, "manpower1");
		deleteRow(frm, removed_activity, "material1");



	}
});

frappe.ui.form.on("Daily Detail Plan", {
	activity:function(frm, cdt, cdn) {
		console.log("looooged")
		AutoPopulate(frm, cdt, cdn, 0)
	}
});


function deleteRow(frm, removed_activity, childTable) {
	var table = frm.doc[childTable];
	for (var i = 0; i < table.length; i++) {
		if (table[i].activity === removed_activity) {
			// Remove the row from the child table
			console.log("removed")
			table.splice(i, 1);
			// Update the form
			frm.refresh_field(childTable);
		}
	}
}



var day_value;



//calculate the percentage
frappe.ui.form.on("Daily Detail Plan", {
	executed_qty: function(frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		console.log("row")
		if (row.executed_qty > row.planned_qty) {
			frappe.show_alert("Executed quantity should be always less than or equal to the planned quatntity");
			row.executed_qty = null;
		}
		else if (row.executed_qty && row.planned_qty) {

			row.percentage_executed = (row.executed_qty / row.planned_qty) * 100;
		}
		frm.refresh_field("daily_detail_plan");
	},
});


frappe.ui.form.on("Daily Monitoring", {

	project: function(frm, cdt, cdn) {

		var d = locals[cdt][cdn];

		frm.set_query("activity", "daily_plan_detail", function() {
			return {
				"filters": {
					"project": frm.doc.project
				}
			}
		});

		frm.set_query("weekly_plan", function() {
			return {
				"filters": {
					"project": frm.doc.project
				}
			}
		});
	},

	weekly_plan: function(frm, cdt, cdn) {

		var d = locals[cdt][cdn];
		if (frm.doc.weekly_plan) {
			frm.clear_table('daily_plan_detail');

			frappe.call({
				method: "frappe.client.get_list",
				args: {
					doctype: 'Weekly detail plan',
					filters: {
						'parent': frm.doc.weekly_plan,
					},
					fields: ['*']
				},
				callback: async function(response) {
					day_value = frm.doc.day === "Day 1" ? 1 :
						frm.doc.day === "Day 2" ? 2 :
							frm.doc.day === "Day 3" ? 3 :
								frm.doc.day === "Day 4" ? 4 :
									frm.doc.day === "Day 5" ? 5 :
										frm.doc.day === "Day 6" ? 6 :
											null;

					console.log("day value is this: ", day_value);


					var activities = [];
					response.message.map((item, index) => {
						if (item["d_" + day_value]) {
							activities.push(item)
						}
					})
					console.log("activities", activities);

					WPAutoPopulate(frm, activities, null);
				}
			})




		}
	}

});



function AutoPopulate(frm, cdt, cdn, planned_qty) {


	var date1 = frm.doc.start_date;
	var date2 = frm.doc.end_date;

	var d = locals[cdt][cdn];
	var weekly_plan_code = frappe.model.get_value(d.doctype, d.name, "weekly_plan_code");

	if (weekly_plan_code) {
		frappe.call({
			method: "erpnext.weekly_api_get_monthly_plan01.get_monthly_plan_total_by_monthly_code",
			args: { monthly_code: weekly_plan_code }
		}).done((r) => {
			if (r.message.length >= 1)
				if (r.message[0]) {

					var total_contracted_qty_for_month = r.message[0];
					frappe.model.set_value(d.doctype, d.name, "contract_quantity", parseFloat(total_contracted_qty_for_month));
				}
		})

		refresh_field("contract_quantity");
	}

	if (weekly_plan_code && date1 && date2) {
		frappe.call({
			method: "erpnext.weekly_api_get_monthly_plan02.get_monthly_plan_executed_total_by_monthly_code",
			args: { monthly_code: weekly_plan_code, date1: date1, date2: date2 }
		}).done((r) => {
			if (r.message.length >= 1)
				if (r.message[0]) {

					var done_till_now = r.message[0];
					frappe.model.set_value(d.doctype, d.name, "done_till_now", parseFloat(done_till_now));
					var contract_quantity = frappe.model.get_value(d.doctype, d.name, "contract_quantity");
					var remaining_qty = contract_quantity - parseFloat(done_till_now);
					frappe.model.set_value(d.doctype, d.name, "remaining_qty", remaining_qty);
				}
		})

		refresh_field("done_till_now");
		refresh_field("remaining_qty");
	}


	ExecuteWeeklyPlanDetail(frm, planned_qty);
}

function WPAutoPopulate(frm, mp_activites, planned_qty) {



	$.each(mp_activites, function(eachIndex, wp_activity) {

		console.log("we are here")
		const target_row = frm.add_child('daily_detail_plan');
		target_row.activity = wp_activity.activity;
		// target_row.subject = wp_activity.activity_name;
		target_row.uom = wp_activity.uom;
		target_row.planned_qty = wp_activity["d_" + day_value];
		target_row.rate = wp_activity.rate;
		target_row.amount = target_row.quantity * target_row.rate;
		target_row.crew_assigned = wp_activity.crew_assigned;	
		target_row.scontract_assigned = wp_activity.scontract_assigned;


		frappe.call({
			method: 'frappe.client.get_list',
			args: {
				doctype: 'Task',
				filters: {
					'name': wp_activity.activity,
				},
				fields: ["*"],
			},
			callback: async function(response) {
				console.log("Response ", response.message[0].quantity)
				target_row.subject = response.message[0].subject;
				frm.refresh_field("daily_detail_plan")

			}
		})

	});

	ExecuteWeeklyPlanDetail(frm, planned_qty);
	cur_frm.refresh_fields("daily_detail_plan");

}



function ExecuteWeeklyPlanDetail(frm, planned_qty) {
	console.log("we are here again")
	var grand_total_cost_for_machinary = 0;
	var number_of_items_for_machinary = 0;
	var sum_of_unit_rate_for_machinary = 0;

	var grand_total_cost_for_manpower = 0;
	var number_of_items_for_manpower = 0;
	var sum_of_unit_rate_for_manpower = 0;

	var grand_total_cost_for_material = 0;
	var number_of_items_for_material = 0;
	var sum_of_unit_rate_for_material = 0;

	var task_lists = frm.doc.daily_detail_plan;

	var allMachinesMap = new Map();
	var allMaterialMap = new Map();
	var allManpowerMap = new Map();

	// frm.doc.machinery = []
	// frm.doc.manpower1 = []
	// frm.doc.material1 = []




	$.each(task_lists, function(_i, eMain) {
	
		var taskParent = eMain.activity;
		var activity_name = eMain.activity_name;

		// frm.doc.weekly_detail_plan = []
		// frm.doc.machinery = []
		// frm.doc.manpower1 = []
		// frm.doc.material1 = []

		frm.doc.machinery_detail_summerized = []
		frm.doc.manpower_detail_summerized = []
		frm.doc.material_detail_summerized = []



		// Check if activity exists in non_payable_weekly_detail_plan
		var machinery = frm.doc.machinery || [];
		var machineryExist = false;

		for (var i = 0; i < machinery.length; i++) {
			if (machinery[i].activity === taskParent) {
						machineryExist = true;
				break;
			}
		}
		console.log("machinery exist", machineryExist)
		console.log("tak parent", taskParent)

		if(!machineryExist){
			if (taskParent) {
				frappe.call({
					method: "erpnext.machinary_populate_api.get_machinary_by_task",
					args: { parent: taskParent }
				}).done((r) => {
					$.each(r.message, function(_i, e) {
						console.log("machinery", e)
						var entry = frm.add_child("machinery");
						entry.id_mac = e.id_mac;
						entry.type = e.type;
						entry.machinery_type = e.id_mac
						entry.activity = taskParent;
						entry.uf = e.uf;
						entry.efficency = e.efficency;
						entry.rental_rate = e.rental_rate;
						grand_total_cost_for_machinary += entry.qty * entry.rental_rate;
						number_of_items_for_machinary += 1;
						sum_of_unit_rate_for_machinary += entry.rental_rate;
						entry.total_hourly_cost = entry.qty * entry.rental_rate;


						//fetching the quantity from the database
						frappe.call({
							method: 'frappe.client.get_list',
							args: {
								doctype: 'Task',
								filters: {
									'name': e.parent,
								},
								fields: ["*"],
							},
							callback: async function(response) {
								console.log("Response ", response.message[0].quantity)
								entry.qty = response.message[0].quantity;
								entry.subject = response.message[0].subject;
								entry.uom = response.message[0].unit;
								frm.refresh_field("machinery")

							}
						})


					})

					frm.doc.equipment_total_cost = grand_total_cost_for_machinary;
					frm.doc.equipment_unit_rate = (sum_of_unit_rate_for_machinary / number_of_items_for_machinary);

					refresh_field("machinery");
					refresh_field("equipment_total_cost");
					refresh_field("equipment_unit_rate");
					refresh_field("machinery_detail_summerized");
				})
			}
		}


		//Script to populate child tables for manpower
		var manpower1 = frm.doc.manpower1 || [];
		var manpowerExist = false;

		for (var i = 0; i < manpower1.length; i++) {
			if (manpower1[i].activity === taskParent) {
							manpowerExist = true;
				break;
			}
		}

		if(!manpowerExist){
			if (taskParent) {
				frappe.call({
					method: "erpnext.manpower_populate_api.get_manpower_by_task",
					args: { parent: taskParent }
				}).done((r) => {
					$.each(r.message, function(_i, e) {
						console.log("manpoer", e)
						var entry = frm.add_child("manpower1");
						entry.id_map = e.id_map;
						entry.job_title = e.job_title;
						entry.labor_no = e.mp_number || 1;
						entry.activity = taskParent;
						entry.labor_name = e.job_title;
						entry.uf = e.uf;
						entry.efficency = e.efficency;
						entry.hourly_cost = e.hourly_cost;
						grand_total_cost_for_manpower += entry.qty * entry.hourly_cost;
						number_of_items_for_manpower += 1;
						sum_of_unit_rate_for_manpower += entry.hourly_cost;
						entry.total_hourly_cost = entry.qty * entry.hourly_cost;

						frappe.call({
							method: 'frappe.client.get_list',
							args: {
								doctype: 'Task',
								filters: {
									'name': e.parent,
								},
								fields: ["*"],
							},
							callback: async function(response) {
								console.log("Response ", response.message[0].quantity)
								entry.qty = response.message[0].quantity;
								entry.subject = response.message[0].subject;
								activity_name = response.message[0].subject
								frm.refresh_field("manpower1")

							}
						})

					})


					frm.doc.man_power_total_cost = grand_total_cost_for_manpower;
					frm.doc.man_power_unit_rate = (sum_of_unit_rate_for_manpower / number_of_items_for_manpower);

					refresh_field("manpower1");
					refresh_field("man_power_total_cost");
					refresh_field("man_power_unit_rate");
					refresh_field("manpower_detail_summerized");
				})
			}
		}


		//Script to populate child tables for material
		var material1 = frm.doc.material1 || [];
		var materialExist = false;

		for (var i = 0; i < material1.length; i++) {
			if (material1[i].activity === taskParent) {
								materialExist = true;
				break;
			}
		}

		if(!materialExist){
			if (taskParent) {
				frappe.call({
					method: 'frappe.client.get_list',
					args: {
						doctype: 'Material DetailARRCA',
						filters: {
							'parent': taskParent
						},
						fields: ['*'],
					},
					callback: async function(response) {
						var value = response.message;
						console.log("material", value)
						value.map((val, index) => {

							const target_row = frm.add_child('material1');
							target_row.id_mat = val.id_mat;
							target_row.item1 = val.item1;
							target_row.uom = val.uom;
							target_row.activity = val.parent;
							console.log("acttttttt name", activity_name)
							target_row.subject = activity_name;
							target_row.material_qty = val.qaty
							target_row.material_name = val.item1;
							target_row.uf = val.uf;
							target_row.efficency = val.efficency;
							target_row.unit_price = val.unit_price;
							target_row.total_cost = target_row.qty * target_row.unit_price;



	

							frm.refresh_field("material1");



						})
					}
				});
			}
		}

	})
}

function ExecuteWeeklyPlanDetailNonPayable(frm, task_lists) {


	frm.doc.daily_non_payable_machinery_detail = []
	frm.doc.daily_non_payable_manpower_detail = []
	frm.doc.daily_non_payable_material_detail = []



	$.each(task_lists, function(_i, eMain) {

		var taskParent = eMain.activity;
		var activity_name = eMain.activity_name;


		frm.doc.daily_non_payable_machinery_detail = []
		frm.doc.daily_non_payable_manpower_detail = []
		frm.doc.daily_non_payable_material_detail = []




		if (taskParent) {
			frappe.call({
				method: "erpnext.machinary_populate_api.get_machinary_by_task",
				args: { parent: taskParent }
			}).done((r) => {
				$.each(r.message, function(_i, e) {

					var entry = frm.add_child("daily_non_payable_machinery_detail");
					entry.id_mac = e.id_mac;
					entry.type = e.type;
					entry.activity = taskParent;
					entry.uf = e.uf;
					entry.efficency = e.efficency;
					entry.rental_rate = e.rental_rate;
					entry.total_hourly_cost = entry.qty * entry.rental_rate;


					//fetching the quantity from the database
					frappe.call({
						method: 'frappe.client.get_list',
						args: {
							doctype: 'Task',
							filters: {
								'name': e.parent,
							},
							fields: ["*"],
						},
						callback: async function(response) {
							console.log("Response ", response.message[0].quantity)
							entry.qty = response.message[0].quantity;
							entry.subject = response.message[0].subject;
							entry.uom = response.message[0].unit;
							frm.refresh_field("machinery")

						}
					})


				})

				refresh_field("daily_non_payable_machinery_detail");
			})
		}


		//Script to populate child tables for manpower
		if (taskParent) {
			frappe.call({
				method: "erpnext.manpower_populate_api.get_manpower_by_task",
				args: { parent: taskParent }
			}).done((r) => {
				$.each(r.message, function(_i, e) {
					var entry = frm.add_child("daily_non_payable_manpower_detail");
					entry.id_map = e.id_map;
					entry.job_title = e.job_title;
					entry.labor_no = e.mp_number || 1;
					entry.activity = taskParent;
					entry.uf = e.uf;
					entry.efficency = e.efficency;
					entry.hourly_cost = e.hourly_cost;
					entry.total_hourly_cost = entry.qty * entry.hourly_cost;

					frappe.call({
						method: 'frappe.client.get_list',
						args: {
							doctype: 'Task',
							filters: {
								'name': e.parent,
							},
							fields: ["*"],
						},
						callback: async function(response) {
							console.log("Response ", response.message[0].quantity)
							entry.qty = response.message[0].quantity;
							entry.subject = response.message[0].subject;
							frm.refresh_field("manpower1")

						}
					})

				})


				refresh_field("daily_non_payable_manpower_detail");

			})
		}


		//Script to populate child tables for material
		if (taskParent) {
			frappe.call({

				method: "erpnext.material_populate_api.get_material_by_task",
				args: { parent: taskParent }

			}).done((r) => {
				$.each(r.message, function(_i, e) {

					var entry = frm.add_child("daily_non_payable_material_detail");
					entry.id_mat = e.id_mat;
					entry.item1 = e.item1;
					entry.activity = taskParent;
					entry.uom = e.uom;
					entry.uf = e.uf;
					entry.efficency = e.efficency;
					entry.unit_price = e.unit_price;
					entry.total_cost = entry.qty * entry.unit_price;

					frappe.call({
						method: 'frappe.client.get_list',
						args: {
							doctype: 'Task',
							filters: {
								'name': e.parent,
							},
							fields: ["*"],
						},
						callback: async function(response) {
							console.log("Response ", response.message[0].quantity)
							entry.qty = response.message[0].quantity;
							entry.subject = response.message[0].subject;
							frm.refresh_field("material1")

						}
					})

				})

				refresh_field("daily_non_payable_material_detail");

			})
		}
	})
}





frappe.ui.form.on("New Daily Plan Detail", {
	planned_qty: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		AutoPopulate(frm, cdt, cdn, d.planned_qty);
	}
});
