//Property of ERP Solutions PLC Custom Script Written by Bereket T May 24 2023

cur_frm.add_fetch('project', 'consultant', 'consultant');
cur_frm.add_fetch('project', 'client', 'client');

cur_frm.add_fetch('activity', 'subject', 'subject');



frappe.ui.form.on("New Daily Plan", {
	weekly_plan: function(frm, cdt, cdn) {
		if (!frm.doc.day) {
			frm.doc.weekly_plan = null;
			frm.refresh_field("weekly_plan")
			frappe.show_alert("Please Select Day First")
		}
	}
});

var allActivities = []

frappe.ui.form.on("New Daily Plan Detail", {
	activity: function(frm, cdt, cdn) {
		var activity = []
		var row = locals[cdt][cdn]
		activity.push(row.activity)
		allActivities.push(row.activity)
		console.log("activity", allActivities)

	}
})



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
frappe.ui.form.on("Daily Non Payable Detail", {
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
		frm.refresh_field("daily_non_payable_detail");
	},
});

//calculate the percentage
frappe.ui.form.on("New Daily Plan Detail", {
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
		frm.refresh_field("daily_plan_detail");
	},
});


frappe.ui.form.on("New Daily Plan", {

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

					//get the start and end date from the monthly  plan
					frappe.call({
						method: 'frappe.client.get_list',
						args: {
							doctype: 'Weekly Plan Days Date Data',
							filters: {
								'parent': frm.doc.weekly_plan,
							},
							fields: ["*"],
						},
						callback: async function(response) {
							console.log("Response of date", response.message)
							response.message.map((item, idx) => {
								if (item.day_no == day_value) {
									frm.doc.date = item.date;
								}

							})

							frm.refresh_field("date")

						}
					})


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

			//get the start and end date from the monthly  plan
			frappe.call({
				method: 'frappe.client.get_list',
				args: {
					doctype: 'Non Payable Weekly Detail Plan',
					filters: {
						'parent': frm.doc.weekly_plan,
					},
					fields: ["*"],
				},
				callback: async function(response) {
					console.log("Response for nonpayable", response.message)

					var activitiesNonPayable = [];
					response.message.map((item, index) => {
						if (item["d_" + day_value]) {
							activitiesNonPayable.push(item)
						}
					})
					console.log("activitiesNonPayable", activitiesNonPayable);
					activitiesNonPayable.map((item, idx) => {
						var row = frm.add_child("daily_non_payable_detail")
						row.activity = item.activity;
						row.subject = item.subject;
						row.planned_qty = item["d_" + day_value]
						frm.refresh_field("daily_non_payable_detail")
					})
					ExecuteWeeklyPlanDetailNonPayable(frm, activitiesNonPayable)


				}
			})

			frappe.model.with_doc('Weekly Plan', frm.doc.weekly_plan, function() {
				let source_doc = frappe.model.get_doc('Weekly Plan', frm.doc.weekly_plan);
				// WPAutoPopulate(frm, source_doc.weekly_plan_detail_master, null);

			});


		}
	}

});



function AutoPopulate(frm, cdt, cdn, planned_qty) {

	if (!frm.doc.project) {
		frappe.show_alert("Please select project first to effectively continue with daily plan");
		cur_frm.clear_table("daily_plan_detail");
		cur_frm.refresh_fields();
		return;
	}

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

	//console.log(mp_activites);

	if (!frm.doc.project) {
		show_alert("Please select project first to effectively continue with daily plan");
		cur_frm.clear_table("daily_plan_detail");
		cur_frm.refresh_fields();
		return;
	}

	var date1 = frm.doc.start_date;
	var date2 = frm.doc.end_date;

	//var d = locals[cdt][cdn];

	$.each(mp_activites, function(eachIndex, wp_activity) {

		//add row
		const target_row = frm.add_child('daily_plan_detail');
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
				frm.refresh_field("daily_plan_detail")

			}
		})

		if (target_row.activity && date1 && date2) {
			frappe.call({
				method: "erpnext.timesheet_sum_of_executed_qty.get_executed_quantity_from_timesheet",
				args: { activity: target_row.activity, date1: date1, date2: date2 }
			}).done((r) => {
				if (r.message.length >= 1)
					if (r.message[0]) {

						var executed_quantity = isNaN(r.message[0]) ? r.message[0] : 0;
						target_row.executed_quantity = parseFloat(executed_quantity);
						var remaining = target_row.quantity - parseFloat(executed_quantity);
						target_row.remaining = remaining
					}
			})
		}
	});

	ExecuteWeeklyPlanDetail(frm, planned_qty);
	cur_frm.refresh_fields("daily_plan_detail");

}

function WPAutoPopulateManual(frm, mp_activites, planned_qty) {



	ExecuteWeeklyPlanDetail(frm, 0);
	cur_frm.refresh_fields("daily_plan_detail");

}

function ExecuteWeeklyPlanDetail(frm, planned_qty) {
	var grand_total_cost_for_machinary = 0;
	var number_of_items_for_machinary = 0;
	var sum_of_unit_rate_for_machinary = 0;

	var grand_total_cost_for_manpower = 0;
	var number_of_items_for_manpower = 0;
	var sum_of_unit_rate_for_manpower = 0;

	var grand_total_cost_for_material = 0;
	var number_of_items_for_material = 0;
	var sum_of_unit_rate_for_material = 0;

	var task_lists = frm.doc.daily_plan_detail

	var crewed_tasks = frm.doc.daily_plan_detail.filter((item) => {
		if(item.crew_assigned){
			return item;
		}
	});

	var contrated_tasks = frm.doc.daily_plan_detail.filter((item) => {
		if(item.scontract_assigned){
			return item;
		}
	});

	console.log("non crew assinged task lists", task_lists);
	console.log("crew assinged task lists", crewed_tasks);
	console.log("sub contract assigned task lists", contrated_tasks);



	var allMachinesMap = new Map();
	var allMaterialMap = new Map();
	var allManpowerMap = new Map();

	// frm.doc.machinery = []
	// frm.doc.manpower1 = []
	// frm.doc.material1 = []

	frm.doc.machinery_detail_summerized = []
	frm.doc.manpower_detail_summerized = []
	frm.doc.material_detail_summerized = []

	//fetch the material machinery and manpower detail for tasks that crew is not assigned
	$.each(task_lists, function(_i, eMain) {
		console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
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

		if (taskParent) {
				frappe.call({
					method: "erpnext.machinary_populate_api.get_machinary_by_task",
					args: { parent: taskParent }
				}).done((r) => {
					$.each(r.message, function(_i, e) {

						var entry = frm.add_child("machinery");
						entry.id_mac = e.id_mac;
						entry.type = e.type;
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


						var entrySummerized = frm.add_child("machinery_detail_summerized");
						entrySummerized.id_mac = e.id_mac;
						entrySummerized.type = e.type;
						entrySummerized.qty = e.qty * planned_qty;
						entrySummerized.uf = e.uf;
						entrySummerized.efficency = e.efficency;
						entrySummerized.rental_rate = e.rental_rate;
						entrySummerized.total_hourly_cost = entrySummerized.qty * entrySummerized.rental_rate;

					})

					frm.doc.equipment_total_cost = grand_total_cost_for_machinary;
					frm.doc.equipment_unit_rate = (sum_of_unit_rate_for_machinary / number_of_items_for_machinary);

					refresh_field("machinery");
					refresh_field("equipment_total_cost");
					refresh_field("equipment_unit_rate");
					refresh_field("machinery_detail_summerized");
				})
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

			if (taskParent) {
				frappe.call({
					method: "erpnext.manpower_populate_api.get_manpower_by_task",
					args: { parent: taskParent }
				}).done((r) => {
					$.each(r.message, function(_i, e) {
						var entry = frm.add_child("manpower1");
						entry.id_map = e.id_map;
						entry.job_title = e.job_title;
						entry.labor_no = e.mp_number || 1;
						entry.activity = taskParent;
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
								frm.refresh_field("manpower1")

							}
						})


						var entryMPSummerized = frm.add_child("manpower_detail_summerized");
						entryMPSummerized.id_map = e.id_map;
						entryMPSummerized.job_title = e.job_title;
						entryMPSummerized.qty = e.qty * planned_qty;
						entryMPSummerized.uf = e.uf;
						entryMPSummerized.efficency = e.efficency;
						entryMPSummerized.hourly_cost = e.hourly_cost;
						entryMPSummerized.total_hourly_cost = entryMPSummerized.qty * entryMPSummerized.hourly_cost;
					})


					frm.doc.man_power_total_cost = grand_total_cost_for_manpower;
					frm.doc.man_power_unit_rate = (sum_of_unit_rate_for_manpower / number_of_items_for_manpower);

					refresh_field("manpower1");
					refresh_field("man_power_total_cost");
					refresh_field("man_power_unit_rate");
					refresh_field("manpower_detail_summerized");
				})
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
			console.log("is there a problem there:")
			if (taskParent) {
				frappe.call({

					method: "erpnext.material_populate_api.get_material_by_task",
					args: { parent: taskParent }

				}).done((r) => {
					$.each(r.message, function(_i, e) {

						var entry = frm.add_child("material1");
						entry.id_mat = e.id_mat;
						entry.item1 = e.item1;
						entry.activity = taskParent;
						entry.uom = e.uom;
						entry.uf = e.uf;
						entry.efficency = e.efficency;
						entry.unit_price = e.unit_price;
						grand_total_cost_for_material += entry.qty * entry.unit_price;
						number_of_items_for_material += 1;
						sum_of_unit_rate_for_material += entry.unit_price;
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
								console.log("Response for maaterial ", response.message[0].quantity)
								entry.qty = response.message[0].quantity;
								entry.subject = response.message[0].subject;
								frm.refresh_field("material1")

							}
						})

						var entryMaterialSummerized = frm.add_child("material_detail_summerized");
						entryMaterialSummerized.id_mat = e.id_mat;
						entryMaterialSummerized.item1 = e.item1;
						entryMaterialSummerized.uom = e.uom;
						entryMaterialSummerized.qty = e.qty * planned_qty;
						entryMaterialSummerized.uf = e.uf;
						entryMaterialSummerized.efficency = e.efficency;
						entryMaterialSummerized.unit_price = e.unit_price;
						entryMaterialSummerized.total_cost = entryMaterialSummerized.qty * entryMaterialSummerized.unit_price;
					})

					frm.doc.material_total_cost = grand_total_cost_for_material;
					//frm.doc.man_power_unit_rate = (sum_of_unit_rate/number_of_items);

					refresh_field("material1");
					refresh_field("material_total_cost");
					refresh_field("material_detail_summerized");
				})
			}

	})

	//crew assgined tasks manipulation
	console.log("creeeeeeeeeewed tasks", crewed_tasks)
	$.each(crewed_tasks, function(_i, eMain) {

		console.log("Emain", eMain)
		var taskParent = eMain.activity;
		var crew_name = eMain.crew_assigned;

		// Check if activity exists in non_payable_weekly_detail_plan
		var machinery_form_crew = frm.doc.machinery_form_crew || [];
		var machineryExist = false;

		for (var i = 0; i < machinery_form_crew.length; i++) {
			if (machinery_form_crew[i].activity === taskParent) {
				machineryExist = true;
				break;
			}
		}

		if (!machineryExist) {
			frappe.call({
				method: 'frappe.client.get_list',
				args: {
					doctype: 'Crew Equipment',
					filters: {
						'parent': crew_name,
					},
					fields: ["*"],
				},
				callback: async function(response) {
					console.log("Crew Response", response.message)
					var resp = response.message;
					resp && resp.map((item) => {
						var entry = frm.add_child("machinery_form_crew");
						entry.crew = crew_name;
						entry.type = item.type
						
						frappe.call({
							method: 'frappe.client.get_list',
							args: {
								doctype: 'Task',
								filters: {
									'name': taskParent,
								},
								fields: ["*"],
							},
							callback: async function(response) {
								console.log("Task Response", response.message)
								entry.subject = response.message[0].subject
								frm.refresh_field("machinery_form_crew")


							}
						})

					})

					frm.refresh_field("machinery_form_crew")

				}
			})
		}


		//Script to populate child tables for manpower
		var manpower_from_crew = frm.doc.manpower_from_crew || [];
		var manpowerExist = false;

		for (var i = 0; i < manpower_from_crew.length; i++) {
			if (manpower_from_crew[i].activity === taskParent) {
				manpowerExist = true;
				break;
			}
		}

		if (!manpowerExist) {
			frappe.call({
				method: 'frappe.client.get_list',
				args: {
					doctype: 'Crew Manpower',
					filters: {
						'parent': crew_name,
					},
					fields: ["*"],
				},
				callback: async function(response) {
					console.log("Crew Response", response.message)
					var resp = response.message;
					resp && resp.map((item) => {
						var entry = frm.add_child("manpower_from_crew");
						entry.crew = crew_name;
						entry.job_title = item.labor_type
						entry.labor_no = item.quantity

						frappe.call({
							method: 'frappe.client.get_list',
							args: {
								doctype: 'Task',
								filters: {
									'name': taskParent,
								},
								fields: ["*"],
							},
							callback: async function(response) {
								console.log("Task Response", response.message)
								entry.subject = response.message[0].subject
								frm.refresh_field("manpower_from_crew")


							}
						})

					})

					frm.refresh_field("manpower_from_crew")

				}
			})
		}



	})





	//sub contract assigned task manipulation
	$.each(contrated_tasks, function(_i, eMain) {

		console.log("Emain", eMain)
		var taskParent = eMain.activity;
		var sc_name = eMain.scontract_assigned;



		//Script to populate child tables for manpower
		var new_daily_subcontract_manpower_detail = frm.doc.new_daily_subcontract_manpower_detail || [];
		var manpowerExist = false;

		for (var i = 0; i < new_daily_subcontract_manpower_detail.length; i++) {
			if (new_daily_subcontract_manpower_detail[i].activity === taskParent) {
				manpowerExist = true;
				break;
			}
		}

		if (!manpowerExist) {
			frappe.call({
				method: 'frappe.client.get_list',
				args: {
					doctype: 'Sub Contract Manpower',
					filters: {
						'parent': sc_name,
					},
					fields: ["*"],
				},
				callback: async function(response) {
					console.log("Sub Contract Response", response.message)
					var resp = response.message;
					resp && resp.map((item) => {
						var entry = frm.add_child("new_daily_subcontract_manpower_detail");
						entry.sub_contract = sc_name;
						entry.labor_name = item.labor_type
						entry.labor_no = item.quantity

						frappe.call({
							method: 'frappe.client.get_list',
							args: {
								doctype: 'Task',
								filters: {
									'name': taskParent,
								},
								fields: ["*"],
							},
							callback: async function(response) {
								console.log("Task Response", response.message)
								entry.task_name = response.message[0].subject
								frm.refresh_field("new_daily_subcontract_manpower_detail")


							}
						})

					})

					frm.refresh_field("new_daily_subcontract_manpower_detail")

				}
			})
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
