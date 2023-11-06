//Property of ERP Solutions PLC Custom Script Written by Bereket T May 24 2023

cur_frm.add_fetch('project', 'consultant', 'consultant');
cur_frm.add_fetch('project', 'client', 'client');

cur_frm.add_fetch('activity_id', 'subject', 'subject');
cur_frm.add_fetch('activity_id', 'unit', 'uom');
cur_frm.add_fetch('activity_id', 'productivity', 'productivity');

// cur_frm.add_fetch('activity_id', 'quantity', 'planned_qty');

var week_value;
var flattenedArray;

function addDays(date, days) {
	var result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}

frappe.ui.form.on('Weekly detail plan', {
	d_1: function(frm, cdt, cdn){
		prohobitUpperSum1(frm, cdt, cdn, "d_1")
	},
	d_2: function(frm, cdt, cdn){
		prohobitUpperSum1(frm, cdt, cdn, "d_2")
	},
	d_3: function(frm, cdt, cdn){
		prohobitUpperSum1(frm, cdt, cdn, "d_3")
	},
	d_4: function(frm, cdt, cdn){
		prohobitUpperSum1(frm, cdt, cdn, "d_4")
	},
	
	d_5: function(frm, cdt, cdn){
		prohobitUpperSum1(frm, cdt, cdn, "d_5")
	},
	d_6: function(frm, cdt, cdn){
		prohobitUpperSum1(frm, cdt, cdn, "d_6")
	},
})


function prohobitUpperSum1(frm, cdt, cdn, month) {
	var total = 0;
	var row = locals[cdt][cdn];
	console.log("localssss for each month", row);

	// Calculate the total
	total += row.d_1 ? parseFloat(row.d_1) : 0;
	total += row.d_2 ? parseFloat(row.d_2) : 0;
	total += row.d_3 ? parseFloat(row.d_3) : 0;
	total += row.d_4 ? parseFloat(row.d_4) : 0;
	total += row.d_5 ? parseFloat(row.d_5) : 0;
	total += row.d_6 ? parseFloat(row.d_6) : 0;

	console.log("total sum", total);

	if(total > row.planned_this_week){
		row[month] = null;
		frm.refresh_field("weekly_detail_plan")
		frappe.show_alert("Each day sum should be lower than the planned")
	}
}

frappe.ui.form.on("Weekly Plan", {
	project: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		console.log("d", d)
		frm.set_query("activity_id", "weekly_non_payable_tasks", function() {
			return {
				"filters": {
					"project": frm.doc.project,
					"task_type": "Non Payable"
					
				}
			}
		});
	}
});


frappe.ui.form.on("Weekly Plan", {
	 monthly_plan: function(frm, cdt, cdn) {
		if(!frm.doc.week){
			frm.doc.monthly_plan = null;
			frm.refresh_field("monthly_plan")
			frappe.show_alert("Please Select Month First")
		}
	 }
 });


frappe.ui.form.on("Weekly Plan", {
	start_date: function(frm, cdt, cdn) {

		var d = locals[cdt][cdn];
		var start_date = frappe.model.get_value(d.doctype, d.name, "start_date");

		if (start_date) {
			var end_date = addDays(start_date, 6);
			frappe.model.set_value(d.doctype, d.name, "end_date", end_date);
		}
	},

	project: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frm.set_query("activity", "weekly_plan_detail_master", function() {
			return {
				"filters": {
					"project": frm.doc.project
				}
			}
		});

		frm.set_query("monthly_plan", function() {
			return {
				"filters": {
					"project": frm.doc.project
				}
			}
		});
	},

	monthly_plan: function(frm, cdt, cdn) {

		var d = locals[cdt][cdn];
		
		if (frm.doc.monthly_plan) {
			frm.clear_table('weekly_plan_detail_master');
			frappe.call({
				method: "frappe.client.get_list",
				args: {
					doctype: 'Monthly Plan Detail Week View',
					filters: {
						'parent': frm.doc.monthly_plan,
					},
					fields: ['*']
				},
				callback: async function(response) {
					console.log("response message", response.message)
					week_value = frm.doc.week === "Week One" ? 1 :
						frm.doc.week === "Week Two" ? 2 :
							frm.doc.week === "Week Three" ? 3 :
								frm.doc.week === "Week Four" ? 4 :
									null;



					//get the start and end date from the monthly  plan
					frappe.call({
						method: 'frappe.client.get_list',
						args: {
							doctype: 'Monthly Plan Week Date Data',
							filters: {
								'parent': frm.doc.monthly_plan,
							},
							fields: ["*"],
						},
						callback: async function(response) {
							console.log("Response of starting and end date", response.message)
							response.message.map((item, idx) => {
								if (item.week_no == week_value) {
									frm.doc.start_date = item.start_date;
									frm.doc.end_date = item.end_date;
								}

							})

							frm.refresh_field("start_date")
							frm.refresh_field("end_date")

							//assgin the week dates accordingly
							var start_date = frm.doc.start_date;
							var end_date = frm.doc.end_date;

							// Loop through months
							for (var i = 0; i < 6; i++) {
								var row = frm.add_child("weekly_plan_days_date_data")
								row.day_no = i + 1;
								if (i == 0) {
									console.log("first try")
									row.date = start_date;
								} else {
									console.log("not first try")
									row.date = frappe.datetime.add_days(frm.doc.weekly_plan_days_date_data[i - 1].date, 1);

								}


								console.log(" date for day " + i + " is " + row.date);

								// Check if end date is in the past
								if (row.date > end_date) {
									console.log("now exited")
									row.date = end_date;
									break;
								}

							}
							console.log("weekly_plan_days_date_data", frm.doc.weekly_plan_days_date_data)

							frm.refresh_field("weekly_plan_days_date_data"); // Move this line out of the loop

						}
					})

					//get the previous non performed quantity
					var filters = {
						monthly_plan: frm.doc.monthly_plan
					}

					filters.week = frm.doc.week === "Week Two" ? "Week One" :
						frm.doc.week === "Week Three" ? "Week Two" :
							frm.doc.week === "Week Four" ? "Week Three" :
									null;

					console.log("the value of the filters", filters)

					const startTime = performance.now();
					
					if(filters.week){
						await frappe.call({
							method: 'frappe.client.get_list',
							args: {
								doctype: 'Weekly Plan',
								filters: filters,
								fields:['name']
							},
							callback: async function(response){
								console.log("response of previous non performed quantity", response.message)
								var previoius_week_plan = response.message[0];

								frappe.call({
									method: 'frappe.client.get_list',
									args: {
										doctype: 'New Daily Plan',
										filters: {
											weekly_plan: previoius_week_plan
										},
										fields:['name']
									},
									callback: async function(response){
										console.log("from the daily plan response", response.message)
										var previous_daily_plans = response.message;

										var newDailyPlanDetails = [];

										for (var i = 0; i < previous_daily_plans.length; i++) {
											var dailyPlanName = previous_daily_plans[i].name;

											await frappe.call({
												method: 'frappe.client.get_list',
												args: {
													doctype: 'New Daily Plan Detail',
													filters: {
														parent: dailyPlanName
													},
													fields: ['*'] // Replace with actual field names
												},
												callback: function(response) {
													var dailyPlanDetails = response.message;
													newDailyPlanDetails.push(dailyPlanDetails);
												}
											});
										}


										console.log("Newly created variable with daily plan details:", newDailyPlanDetails);
										flattenedArray = [].concat.apply([], newDailyPlanDetails);
										console.log("Flattned arrays:", flattenedArray);


									}
								})



							}
						})
					}

					const endTime = performance.now();
					const executionTime = endTime - startTime;


					var activities = [];
					response.message.map((item, index) => {
						if (item["w_" + week_value] != 0) {
							activities.push(item)
						}
					})

					// Use setTimeout to call WPAutoPopulate after one second plus the execution time
					setTimeout(function() {
						MPAutoPopulate(frm, activities, null);
					}, executionTime + 1000); // Add one second (1000 milliseconds)

				}
			})
			frappe.model.with_doc('Monthly Plan', frm.doc.monthly_plan, function() {
				let source_doc = frappe.model.get_doc('Monthly Plan', frm.doc.monthly_plan);
				console.log("source tas list", source_doc.task_list.slice(1))
			});
		}
	}

});



frappe.ui.form.on("Weekly detail plan", {
	d_1: function(frm, cdt, cdn) {
		assignMachineryWeek(frm, cdt, cdn, "d_1");
		assignManpowerWeek(frm, cdt, cdn, "d_1");
		assignMaterialWeek(frm, cdt, cdn, "d_1");
	},
	d_2: function(frm, cdt, cdn) {
		assignMachineryWeek(frm, cdt, cdn, "d_2");
		assignManpowerWeek(frm, cdt, cdn, "d_2");
		assignMaterialWeek(frm, cdt, cdn, "d_2");
	},
	d_3: function(frm, cdt, cdn) {
		assignMachineryWeek(frm, cdt, cdn, "d_3");
		assignManpowerWeek(frm, cdt, cdn, "d_3");
		assignMaterialWeek(frm, cdt, cdn, "d_3");
	},
	d_4: function(frm, cdt, cdn) {
		assignMachineryWeek(frm, cdt, cdn, "d_4");
		assignManpowerWeek(frm, cdt, cdn, "d_4");
		assignMaterialWeek(frm, cdt, cdn, "d_4");
	},
	d_5: function(frm, cdt, cdn) {
		assignMachineryWeek(frm, cdt, cdn, "d_5");
		assignManpowerWeek(frm, cdt, cdn, "d_5");
		assignMaterialWeek(frm, cdt, cdn, "d_5");
	},
	d_6: function(frm, cdt, cdn) {
		assignMachineryWeek(frm, cdt, cdn, "d_6");
		assignManpowerWeek(frm, cdt, cdn, "d_6");
		assignMaterialWeek(frm, cdt, cdn, "d_6");
	}
});


frappe.ui.form.on("Non Payable Weekly Detail Plan", {
	d_1: function(frm, cdt, cdn) {
			assignMachineryWeekNonpayable(frm, cdt, cdn, "d_1");
			assignManpowerWeekNonpayable(frm, cdt, cdn, "d_1");
			assignMaterialWeekNonpayable(frm, cdt, cdn, "d_1");
	},
	d_2: function(frm, cdt, cdn) {
			assignMachineryWeekNonpayable(frm, cdt, cdn, "d_2");
			assignManpowerWeekNonpayable(frm, cdt, cdn, "d_2");
			assignMaterialWeekNonpayable(frm, cdt, cdn, "d_2");
	},
	d_3: function(frm, cdt, cdn) {
			assignMachineryWeekNonpayable(frm, cdt, cdn, "d_3");
			assignManpowerWeekNonpayable(frm, cdt, cdn, "d_3");
			assignMaterialWeekNonpayable(frm, cdt, cdn, "d_3");
	},
	d_4: function(frm, cdt, cdn) {
			assignMachineryWeekNonpayable(frm, cdt, cdn, "d_4");
			assignManpowerWeekNonpayable(frm, cdt, cdn, "d_4");
			assignMaterialWeekNonpayable(frm, cdt, cdn, "d_4");
	},
	d_5: function(frm, cdt, cdn) {
			assignMachineryWeekNonpayable(frm, cdt, cdn, "d_5");
			assignManpowerWeekNonpayable(frm, cdt, cdn, "d_5");
			assignMaterialWeekNonpayable(frm, cdt, cdn, "d_5");
	},
	d_6: function(frm, cdt, cdn) {
			assignMachineryWeekNonpayable(frm, cdt, cdn, "d_6");
			assignManpowerWeekNonpayable(frm, cdt, cdn, "d_6");
			assignMaterialWeekNonpayable(frm, cdt, cdn, "d_6");
	}
});



function AutoPopulatee(frm, cdt, cdn, planned_this_week) {

	if (!frm.doc.project) {
		frappe.show_alert("Please select project first to effectively continue with weekly plan");
		cur_frm.clear_table("daily_plan_detail");
		cur_frm.clear_table("weekly_plan_detail");
		cur_frm.refresh_fields();
		return;
	}

	var date1 = frm.doc.start_date;
	var date2 = frm.doc.end_date;

	var d = locals[cdt][cdn];
	var monthly_plan_code = frappe.model.get_value(d.doctype, d.name, "monthly_plan_code");

	if (monthly_plan_code) {
		frappe.call({
			method: "erpnext.weekly_api_get_monthly_plan01.get_monthly_plan_total_by_monthly_code",
			args: { monthly_code: monthly_plan_code }
		}).done((r) => {
			if (r.message.length >= 1)
				if (r.message[0]) {

					var total_contracted_qty_for_month = r.message[0];
					frappe.model.set_value(d.doctype, d.name, "contract_quantity", parseFloat(total_contracted_qty_for_month));
				}
		})

		refresh_field("contract_quantity");
	}

	if (monthly_plan_code && date1 && date2) {
		frappe.call({
			method: "erpnext.weekly_api_get_monthly_plan02.get_monthly_plan_executed_total_by_monthly_code",
			args: { monthly_code: monthly_plan_code, date1: date1, date2: date2 }
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


	ExecuteWeeklyPlanDetail(frm, planned_this_week);
}

function MPAutoPopulate(frm, mp_activites, planned_this_week) {

	//console.log(mp_activites);

	if (!frm.doc.project) {
		show_alert("Please select project first to effectively continue with monthly plan");
		cur_frm.clear_table("weekly_plan_detail_master");
		cur_frm.clear_table("weekly_detail_plan");
		cur_frm.refresh_fields();
		return;
	}

	var date1 = frm.doc.start_date;
	var date2 = frm.doc.end_date;

	//var d = locals[cdt][cdn];

	$.each(mp_activites, function(eachIndex, mp_activity) {

		//add row
		const target_row = frm.add_child('weekly_plan_detail_master');
		target_row.activity = mp_activity.activity;
		target_row.activity_name = mp_activity.subject;
		target_row.uom = mp_activity.uom;
		console.log("week value", week_value)
		console.log("can i get the flatted array also please", flattenedArray)
		var previous_total = 0;
		flattenedArray && flattenedArray.map((item) => {
			if (item.activity == mp_activity.activity) {
				previous_total = (item.planned_qty - item.executed_qty);
			}
		
		})
		target_row.previous_non_performed_qty = previous_total;
		console.log("previous_non_perfomrmed_qty", previous_total)
		target_row.planned_this_week = mp_activity["w_" + week_value]
		target_row.total_planned = (target_row.previous_non_performed_qty || 0) + (target_row.planned_this_week || 0)
		
		console.log("mp activities", mp_activity)
		//fetching the quantity from the database
		frappe.call({
			method: 'frappe.client.get_list',
			args: {
				doctype: 'Task',
				filters: {
					'name': mp_activity.activity,
				},
				fields: ["quantity"],
			},
			callback: async function(response) {

				target_row.quantity = response.message[0].quantity;;
				frm.refresh_field("weekly_plan_detail_master");
			}
		})

		target_row.rate = mp_activity.rate;
		target_row.amount = target_row.quantity * target_row.rate;

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

	ExecuteWeeklyPlanDetail(frm, planned_this_week);
	cur_frm.refresh_fields("weekly_plan_detail_master");

}

function ExecuteWeeklyPlanDetail(frm, planned_this_week) {
	var grand_total_cost_for_machinary = 0;
	var number_of_items_for_machinary = 0;
	var sum_of_unit_rate_for_machinary = 0;

	var grand_total_cost_for_manpower = 0;
	var number_of_items_for_manpower = 0;
	var sum_of_unit_rate_for_manpower = 0;

	var grand_total_cost_for_material = 0;
	var number_of_items_for_material = 0;
	var sum_of_unit_rate_for_material = 0;

	var task_lists = frm.doc.weekly_plan_detail_master;

	var allMachinesMap = new Map();
	var allMaterialMap = new Map();
	var allManpowerMap = new Map();

	frm.doc.machinery = []
	frm.doc.manpower1 = []
	frm.doc.material1 = []

	frm.doc.machinery_detail_summerized = []
	frm.doc.manpower_detail_summerized = []
	frm.doc.material_detail_summerized = []


	// if(monthly_plan_code) {
	//     frappe.call({

	//         method:  "erpnext.weekly_api_get_monthly_plan03.get_task_list_by_monthly_code",
	//         args: { monthly_code: monthly_plan_code }

	//     }).done((r) => {

	//         if(r.message.length >= 1) {



	//         }
	//     })
	// }

	$.each(task_lists, function(_i, eMain) {

		var taskParent = eMain.activity;
		var activity_name = eMain.activity_name;

		frm.doc.weekly_detail_plan = []
		frm.doc.machinery = []
		frm.doc.manpower1 = []
		frm.doc.material1 = []

		frm.doc.machinery_detail_summerized = []
		frm.doc.manpower_detail_summerized = []
		frm.doc.material_detail_summerized = []
		frm.doc.weekly_machinery_detail_plan_by_day = [];
		frm.doc.weekly_manpower_detail_plan_by_day = [];
		frm.doc.weekly_material_detail_plan_by_day = [];



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
					entry.equp_no = e.qty;
					entry.subject = activity_name;

					//fetching the quantity from the database
					frappe.call({
						method: 'frappe.client.get_list',
						args: {
							doctype: 'Task',
							filters: {
								'name': e.parent,
							},
							fields: ["quantity", "productivity"],
						},
						callback: async function(response) {
							console.log("Response ", response.message[0].quantity)
							entry.qty = response.message[0].quantity;
							entry.productivity = response.message[0].productivity;

							entry.uf = e.uf;
							entry.efficency = e.efficency;
							entry.rental_rate = e.rental_rate;
							grand_total_cost_for_machinary += entry.qty * entry.rental_rate;
							number_of_items_for_machinary += 1;
							sum_of_unit_rate_for_machinary += entry.rental_rate;
							entry.total_hourly_cost = entry.qty * entry.rental_rate;
							entry.machinery_cost = entry.total_hourly_cost / entry.productivity
							console.log("uf ", entry.uf, "eff ", entry.efficency, "qty ", entry.qty, "item no ", entry.item_no, "prod", entry.productivity)
							entry.equp_hour = (entry.uf * entry.efficency * entry.qty * entry.equp_no) / entry.productivity;
							frm.refresh_field("machinery")

						}
					})



					var entrySummerized = frm.add_child("machinery_detail_summerized");
					entrySummerized.id_mac = e.id_mac;
					entrySummerized.type = e.type;
					entrySummerized.qty = e.qty * planned_this_week;
					entrySummerized.uf = e.uf;
					entrySummerized.efficency = e.efficency;
					entrySummerized.rental_rate = e.rental_rate;
					entrySummerized.total_hourly_cost = entrySummerized.qty * entrySummerized.rental_rate;

					//add to the machinery by day table
					var material_exist = false;

					frm.doc.weekly_machinery_detail_plan_by_day.map((row, index) => {
						if (row.machinery_type == e.type) {
							material_exist = true;
						}
					})

					if (!material_exist) {
						const material_week_row = frappe.model.add_child(frm.doc, 'Weekly Machinery Detail Plan By Day', 'weekly_machinery_detail_plan_by_day');
						material_week_row.machinery_type = e.type;
					}


					frm.refresh_field("weekly_machinery_detail_plan_by_day");

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
		if (taskParent) {
			frappe.call({
				method: "erpnext.manpower_populate_api.get_manpower_by_task",
				args: { parent: taskParent }
			}).done((r) => {
				$.each(r.message, function(_i, e) {
					var entry = frm.add_child("manpower1");
					entry.id_map = e.id_map;
					entry.job_title = e.job_title;
					entry.activity = taskParent;
					entry.subject = activity_name;
					entry.li_permanent = e.li_permanent;
					entry.labor_no = parseFloat(e.no_of_labor)

					entry.uf = e.uf;
					entry.efficency = e.efficency;
					entry.hourly_cost = e.hourly_cost;
					entry.total_hourly_cost = entry.qty * entry.hourly_cost;

					//fetching the quantity from the database
					frappe.call({
						method: 'frappe.client.get_list',
						args: {
							doctype: 'Task',
							filters: {
								'name': e.parent,
							},
							fields: ["quantity", "productivity"],
						},
						callback: async function(response) {
							console.log("Response ", response.message[0].quantity)
							entry.qty = response.message[0].quantity;
							entry.productivity = response.message[0].productivity;

							console.log("uf ", entry.uf, "li ", entry.li_permanent, "qty ", entry.qty, "labor no ", entry.labor_no, "prod", entry.productivity)
							entry.labor_hour = (entry.uf * entry.li_permanent * entry.labor_no * entry.qty) / entry.productivity;


							frm.refresh_field("manpower1")

						}
					})


					var entryMPSummerized = frm.add_child("manpower_detail_summerized");
					entryMPSummerized.id_map = e.id_map;
					entryMPSummerized.job_title = e.job_title;
					entryMPSummerized.qty = e.qty * planned_this_week;
					entryMPSummerized.uf = e.uf;
					entryMPSummerized.efficency = e.efficency;
					entryMPSummerized.hourly_cost = e.hourly_cost;
					entryMPSummerized.total_hourly_cost = entryMPSummerized.qty * entryMPSummerized.hourly_cost;


					//add to the manpower by day table
					var manpower_exist = false;

					frm.doc.weekly_manpower_detail_plan_by_day.map((row, index) => {
						if (row.labor_type == e.job_title) {
							manpower_exist = true;
						}
					})

					if (!manpower_exist) {
						const material_week_row = frappe.model.add_child(frm.doc, 'Weekly Manpower Detail Plan By Day', 'weekly_manpower_detail_plan_by_day');
						material_week_row.labor_type = e.job_title;
					}

					frm.refresh_field("weekly_manpower_detail_plan_by_day");



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
					entry.subject = activity_name;
					entry.uom = e.uom;
					entry.material_qty = e.qty;

					entry.uf = e.uf;
					entry.efficency = e.efficency;
					entry.unit_price = e.unit_price;

					//fetching the quantity from the database
					frappe.call({
						method: 'frappe.client.get_list',
						args: {
							doctype: 'Task',
							filters: {
								'name': taskParent,
							},
							fields: ["quantity"],
						},
						callback: async function(response) {
							console.log("Response ", response.message[0].quantity)
							entry.qty = response.message[0].quantity;
							entry.total_material = entry.qty * entry.material_qty;
							frm.refresh_field("material1");


						}
					})


					entry.total_cost = entry.qty * entry.unit_price;

					var entryMaterialSummerized = frm.add_child("material_detail_summerized");
					entryMaterialSummerized.id_mat = e.id_mat;
					entryMaterialSummerized.item1 = e.item1;
					entryMaterialSummerized.uom = e.uom;
					entryMaterialSummerized.qty = e.qty * planned_this_week;
					entryMaterialSummerized.uf = e.uf;
					entryMaterialSummerized.efficency = e.efficency;
					entryMaterialSummerized.unit_price = e.unit_price;
					entryMaterialSummerized.total_cost = entryMaterialSummerized.qty * entryMaterialSummerized.unit_price;

					//add to the manpower by day table
					var material_exist = false;

					frm.doc.weekly_material_detail_plan_by_day.map((row, index) => {
						if (row.material_name == e.item1) {
							material_exist = true;
						}
					})

					if (!material_exist) {
						const material_week_row = frappe.model.add_child(frm.doc, 'Weekly Material Detail Plan By Day', 'weekly_material_detail_plan_by_day');
						material_week_row.material_name = e.item1;
					}

					frm.refresh_field("weekly_material_detail_plan_by_day");


				})

				frm.doc.material_total_cost = grand_total_cost_for_material;
				//frm.doc.man_power_unit_rate = (sum_of_unit_rate/number_of_items);

				refresh_field("material1");
				refresh_field("material_total_cost");
				refresh_field("material_detail_summerized");
			})
		}

		//Script to populate child tables for task detail by week
		if (taskParent) {

			frappe.call({

				method: "erpnext.task_week_detail_populate_api.get_task_by_task_id",
				args: { activity: taskParent }

			}).done((r) => {
				$.each(r.message, function(_i, e) {

					var entry = frm.add_child("weekly_detail_plan");
					entry.activity = taskParent;

					for (var j = 0; j < frm.doc.weekly_plan_detail_master.length; j++) {
						if (frm.doc.weekly_plan_detail_master[j].activity === taskParent) {
							entry.planned_this_week = frm.doc.weekly_plan_detail_master[j].total_planned;
							break; // Once a match is found, no need to continue searching
						}
					}
					entry.subject = activity_name;
					entry.uom = e[61];

					//console.log("WAHHHHHATTAHHHAHAHHA?");

					if (planned_this_week) {
						entry.planned_this_week = planned_this_week;
						entry.d_1 = planned_this_week / 6;
						entry.d_2 = planned_this_week / 6;
						entry.d_3 = planned_this_week / 6;
						entry.d_4 = planned_this_week / 6;
						entry.d_5 = planned_this_week / 6;
						entry.d_6 = planned_this_week / 6;
					}

				})

				refresh_field("weekly_detail_plan");
			})
		}

		//Script to populate child tables for task detail by week
		// if (taskParent) {

		// 	frappe.call({

		// 		method: "erpnext.task_week_detail_populate_api.get_task_by_task_id",
		// 		args: { activity: taskParent }

		// 	}).done((r) => {
		// 		$.each(r.message, function(_i, e) {

		// 			var entry = frm.add_child("weekly_detail_plan");
		// 			entry.activity = taskParent;

		// 			for (var j = 0; j < frm.doc.weekly_plan_detail_master.length; j++) {
		// 				if (frm.doc.weekly_plan_detail_master[j].activity === taskParent) {
		// 					entry.planned_this_week = frm.doc.weekly_plan_detail_master[j].planned_this_week;
		// 					break; // Once a match is found, no need to continue searching
		// 				}
		// 			}
		// 			entry.subject = activity_name;
		// 			entry.uom = e[61];

		// 			//console.log("WAHHHHHATTAHHHAHAHHA?");

		// 			if (planned_this_week) {
		// 				entry.planned_this_week = planned_this_week;
		// 				entry.d_1 = planned_this_week / 6;
		// 				entry.d_2 = planned_this_week / 6;
		// 				entry.d_3 = planned_this_week / 6;
		// 				entry.d_4 = planned_this_week / 6;
		// 				entry.d_5 = planned_this_week / 6;
		// 				entry.d_6 = planned_this_week / 6;
		// 			}

		// 		})

		// 		refresh_field("weekly_detail_plan");
		// 	})
		// }
	})
}

function AutoCalculateDayValue(doctype, name, planned_this_week) {
	frappe.model.set_value(doctype, name, 'd_1', (planned_this_week / 6));
	frappe.model.set_value(doctype, name, 'd_2', (planned_this_week / 6));
	frappe.model.set_value(doctype, name, 'd_3', (planned_this_week / 6));
	frappe.model.set_value(doctype, name, 'd_4', (planned_this_week / 6));
	frappe.model.set_value(doctype, name, 'd_5', (planned_this_week / 6));
	frappe.model.set_value(doctype, name, 'd_6', (planned_this_week / 6));
}

frappe.ui.form.on("Weekly detail plan master", {
	planned_this_week: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		AutoPopulate(frm, cdt, cdn, d.planned_this_week);
	}
});

frappe.ui.form.on("Weekly detail plan", {
	planned_this_week: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		AutoCalculateDayValue(d.doctype, d.name, d.planned_this_week);
	}
});

//fetching for the bill of quantity other than the previous values
frappe.ui.form.on("Weekly Non Payable Tasks", {
	activity_id: function(frm, cdt, cdn) {
		AutoPopulate(frm, cdt, cdn);
	},
	planned_qty: function(frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		var detailTable = frm.doc.non_payable_weekly_detail_plan;
		console.log("detail table", detailTable);
		console.log("row", row)

		var matchedItem;
		detailTable.map((item, idx) => {
			if (item.activity == row.activity_id) {
				matchedItem = idx;
				return
			}
		});
		console.log("mached item", matchedItem)
		frm.doc.non_payable_weekly_detail_plan[matchedItem].planned_this_week = row.planned_qty;
		console.log("mached item after", frm.doc.non_payable_weekly_detail_plan)


		frm.refresh_field("non_payable_weekly_detail_plan");
	}
});

function AutoPopulate(frm, cdt, cdn) {``

	var d = locals[cdt][cdn];
	var activity = frappe.model.get_value(d.doctype, d.name, "activity_id");
	console.log("accccccc", activity)

	var task_lists = frm.doc.weekly_non_payable_tasks;
	console.log("taaaaaaaaaaaaak list", task_lists)

	$.each(task_lists, function(_i, eMain) {

		// Script to populate child tables for machinary
		var taskParent = eMain.activity_id;
		console.log("emain", eMain)
		var subject = eMain.subject;
		var uom = eMain.uom;

		// Check if activity exists in non_payable_weekly_detail_plan
		var non_payable_weekly_detail_plan = frm.doc.non_payable_weekly_detail_plan || [];
		var detailPlanExists = false;

		for (var i = 0; i < non_payable_weekly_detail_plan.length; i++) {
			if (non_payable_weekly_detail_plan[i].activity === taskParent) {
				detailPlanExists = true;
				break;
			}
		}

		if (!detailPlanExists) {
			var task_entry = frm.add_child("non_payable_weekly_detail_plan");
			task_entry.subject = subject;
			task_entry.activity = taskParent;
			task_entry.uom = uom;
			frm.refresh_field("non_payable_weekly_detail_plan");
		}
		console.log("abebe beso libela")

		// auto assign the machinary table
		frappe.call({
			method: "erpnext.machinary_populate_api.get_machinary_by_task",
			args: { parent: taskParent }
		}).done((r) => {
			$.each(r.message, function(_i, e) {
				console.log("abebe beso bela", e)

				// Check if activity exists in non_payable_weekly_machinery_detail_plan_by_day
				var non_payable_weekly_machinery_detail_plan_by_day = frm.doc.non_payable_weekly_machinery_detail_plan_by_day || [];
				var machineryPlanExists = false;

				for (var i = 0; i < non_payable_weekly_machinery_detail_plan_by_day.length; i++) {
					if (non_payable_weekly_machinery_detail_plan_by_day[i].machinery_type === e.type) {
						machineryPlanExists = true;
						break;
					}
				}

				console.log("machinery exists", machineryPlanExists)

				if (!machineryPlanExists) {
					var entry = frm.add_child("non_payable_weekly_machinery_detail_plan_by_day");
					entry.id = e.id_mac;
					entry.machinery_type = e.type;
					entry.eff = e.efficency;
					entry.uf = e.uf;
					entry.material_no = e.qty;
					entry.task = taskParent;
				}
			});

			frm.refresh_field("non_payable_weekly_machinery_detail_plan_by_day");
		});



		// Script to populate child tables for manpower
		frappe.call({
			method: "erpnext.manpower_populate_api.get_manpower_by_task",
			args: { parent: taskParent }
		}).done((r) => {
			$.each(r.message, function(_i, e) {
				console.log("abebe beso bela", e)
				// Check if activity exists in non_payable_weekly_manpower_detail_plan_by_day
				var non_payable_weekly_manpower_detail_plan_by_day = frm.doc.non_payable_weekly_manpower_detail_plan_by_day || [];
				var manpowerPlanExists = false;

				for (var i = 0; i < non_payable_weekly_manpower_detail_plan_by_day.length; i++) {
					if (non_payable_weekly_manpower_detail_plan_by_day[i].labor_type === e.job_title) {
						manpowerPlanExists = true;
						break;
					}
				}
				console.log("manpower exist", manpowerPlanExists)

				if (!manpowerPlanExists) {
					var entry = frm.add_child("non_payable_weekly_manpower_detail_plan_by_day");
					entry.id = e.id_map;
					entry.labor_type = e.job_title;
					entry.li_permanent = e.li_permanent;
					entry.labor_no = e.no_of_labor;
					entry.uf = e.uf;
					entry.task = taskParent;
				}
				frm.refresh_field("non_payable_weekly_manpower_detail_plan_by_day");

			})
		})

		// Script to populate child tables for material
		frappe.call({
			method: "erpnext.material_populate_api.get_material_by_task",
			args: { parent: taskParent }
		}).done((r) => {
			$.each(r.message, function(_i, e) {
				console.log("abebe beso bela", e)

				// Check if activity exists in non_payable_weekly_material_detail_plan_by_day
				var non_payable_weekly_material_detail_plan_by_day = frm.doc.non_payable_weekly_material_detail_plan_by_day || [];
				var materialPlanExists = false;

				for (var i = 0; i < non_payable_weekly_material_detail_plan_by_day.length; i++) {
					if (non_payable_weekly_material_detail_plan_by_day[i].material_name === e.item1) {
						materialPlanExists = true;
						break;
					}
				}
				console.log("material exist", materialPlanExists)


				if (!materialPlanExists) {
					var entry = frm.add_child("non_payable_weekly_material_detail_plan_by_day");
					entry.id = e.id_mat;
					entry.material_name = e.item1;
					entry.material_qty = e.qty;

					entry.task = taskParent;
				}
				frm.refresh_field("non_payable_weekly_material_detail_plan_by_day");

			})
		})


		//assign to the machinery detail
		// Check if activity exists in non_payable_weekly_detail_plan
		var non_payable_weekly_plan_machinery_detail = frm.doc.non_payable_weekly_plan_machinery_detail || [];
		var detailMachineryPlanExists = false;

		for (var i = 0; i < non_payable_weekly_plan_machinery_detail.length; i++) {
			if (non_payable_weekly_plan_machinery_detail[i].activity === taskParent) {
					detailMachineryPlanExists = true;
				break;
			}
		}

		if (!detailMachineryPlanExists) {
			frappe.call({
				method: "erpnext.machinary_populate_api.get_machinary_by_task",
				args: { parent: taskParent }
			}).done((r) => {
				$.each(r.message, function(_i, e) {

					var entry = frm.add_child("non_payable_weekly_plan_machinery_detail");
					entry.id_mac = e.id_mac;
					entry.type = e.type;
					entry.activity = taskParent;
					entry.equp_no = e.qty;
					entry.subject = e.subject;

					//fetching the quantity from the database
					frappe.call({
						method: 'frappe.client.get_list',
						args: {
							doctype: 'Task',
							filters: {
								'name': e.parent,
							},
							fields: ["quantity", "productivity"],
						},
						callback: async function(response) {
							console.log("Response ", response.message[0].quantity)
							entry.qty = response.message[0].quantity;
							entry.productivity = response.message[0].productivity;

							entry.uf = e.uf;
							entry.efficency = e.efficency;
							entry.rental_rate = e.rental_rate;
							entry.total_hourly_cost = entry.qty * entry.rental_rate;
							entry.machinery_cost = entry.total_hourly_cost / entry.productivity
							console.log("uf ", entry.uf, "eff ", entry.efficency, "qty ", entry.qty, "item no ", entry.item_no, "prod", entry.productivity)
							entry.equp_hour = (entry.uf * entry.efficency * entry.qty * entry.equp_no) / entry.productivity;
							frm.refresh_field("non_payable_weekly_plan_machinery_detail")

						}
					})

				})
			})
		}


		//assign to the manpower detail
		// Check if activity exists in non_payable_weekly_detail_plan
		var non_payable_weekly_plan_manpower_detail = frm.doc.non_payable_weekly_plan_manpower_detail || [];
		var detailManpowerPlanExists = false;

		for (var i = 0; i < non_payable_weekly_plan_manpower_detail.length; i++) {
			if (non_payable_weekly_plan_manpower_detail[i].activity === taskParent) {
						detailManpowerPlanExists = true;
				break;
			}
		}

		if (!detailManpowerPlanExists) {
			frappe.call({
				method: "erpnext.manpower_populate_api.get_manpower_by_task",
				args: { parent: taskParent }
			}).done((r) => {
				$.each(r.message, function(_i, e) {
					var entry = frm.add_child("non_payable_weekly_plan_manpower_detail");
					entry.id_map = e.id_map;
					entry.job_title = e.job_title;
					entry.activity = taskParent;
					entry.subject = e.subject;
					entry.li_permanent = e.li_permanent;
					entry.labor_no = parseFloat(e.no_of_labor)

					entry.uf = e.uf;
					entry.efficency = e.efficency;
					entry.hourly_cost = e.hourly_cost;
					entry.total_hourly_cost = entry.qty * entry.hourly_cost;

					//fetching the quantity from the database
					frappe.call({
						method: 'frappe.client.get_list',
						args: {
							doctype: 'Task',
							filters: {
								'name': e.parent,
							},
							fields: ["quantity", "productivity"],
						},
						callback: async function(response) {
							console.log("Response ", response.message[0].quantity)
							entry.qty = response.message[0].quantity;
							entry.productivity = response.message[0].productivity;

							console.log("uf ", entry.uf, "li ", entry.li_permanent, "qty ", entry.qty, "labor no ", entry.labor_no, "prod", entry.productivity)
							entry.labor_hour = (entry.uf * entry.li_permanent * entry.labor_no * entry.qty) / entry.productivity;


							frm.refresh_field("non_payable_weekly_plan_manpower_detail")

						}
					})

				})
			})
		}


		//assign to the material detail
		// Check if activity exists in non_payable_weekly_detail_plan
		var non_payable_weekly_plan_material_detail = frm.doc.non_payable_weekly_plan_material_detail || [];
		var detailMaterialPlanExists = false;

		for (var i = 0; i < non_payable_weekly_plan_material_detail.length; i++) {
			if (non_payable_weekly_plan_material_detail[i].activity === taskParent) {
							detailMaterialPlanExists = true;
				break;
			}
		}

		if (!detailMaterialPlanExists) {
			frappe.call({

				method: "erpnext.material_populate_api.get_material_by_task",
				args: { parent: taskParent }

			}).done((r) => {
				$.each(r.message, function(_i, e) {

					var entry = frm.add_child("non_payable_weekly_plan_material_detail");
					entry.id_mat = e.id_mat;
					entry.item1 = e.item1;
					entry.activity = taskParent;
					entry.subject = e.subject;
					entry.uom = e.uom;
					entry.material_qty = e.qty;

					entry.uf = e.uf;
					entry.efficency = e.efficency;
					entry.unit_price = e.unit_price;

					//fetching the quantity from the database
					frappe.call({
						method: 'frappe.client.get_list',
						args: {
							doctype: 'Task',
							filters: {
								'name': taskParent,
							},
							fields: ["quantity"],
						},
						callback: async function(response) {
							console.log("Response ", response.message[0].quantity)
							entry.qty = response.message[0].quantity;
							entry.total_material = entry.qty * entry.material_qty;
							frm.refresh_field("non_payable_weekly_plan_material_detail");

						}
					})

				})

				frm.doc.material_total_cost = grand_total_cost_for_material;
				//frm.doc.man_power_unit_rate = (sum_of_unit_rate/number_of_items);

				refresh_field("material1");
				refresh_field("material_total_cost");
				refresh_field("material_detail_summerized");
			})
		}


		
	});

}

function assignMachineryWeek(frm, cdt, cdn, w) {

	var machineryAggrigate = {};
	//assign to the machinery table
	frm.doc.machinery.map((machine, index) => {
		var act_qty = 0;
		frm.doc.weekly_detail_plan.map((week, i) => {
			if (week.activity == machine.activity) {
				act_qty = week[w] || 0;
			}
		})

		if (machineryAggrigate[machine.type]) {
			machineryAggrigate[machine.type] += ((act_qty * machine.uf * machine.efficency * machine.equp_no) / machine.productivity);
		}
		else {
			machineryAggrigate[machine.type] = ((act_qty * machine.uf * machine.efficency * machine.equp_no) / machine.productivity);
		}
	})

	console.log("machinery aggrigate", machineryAggrigate)

	frm.doc.weekly_machinery_detail_plan_by_day.map((item, idx) => {
		if (machineryAggrigate[item.machinery_type]) {
			item[w] = machineryAggrigate[item.machinery_type];
		} else {
			item[w] = 0;
		}
	})

	frm.refresh_field("weekly_machinery_detail_plan_by_day")
}

function assignMachineryWeekNonpayable(frm, cdt, cdn, w) {

	var machineryAggrigate = {};
	//assign to the machinery table
	frm.doc.non_payable_weekly_plan_machinery_detail.map((machine, index) => {
		var act_qty = 0;
		frm.doc.non_payable_weekly_detail_plan.map((week, i) => {
			if (week.activity == machine.activity) {
				act_qty = week[w] || 0;
			}
		})

		if (machineryAggrigate[machine.type]) {
			machineryAggrigate[machine.type] += ((act_qty * machine.uf * machine.efficency * machine.equp_no) / machine.productivity);
		}
		else {
			machineryAggrigate[machine.type] = ((act_qty * machine.uf * machine.efficency * machine.equp_no) / machine.productivity);
		}
	})

	console.log("machinery aggrigate", machineryAggrigate)

	frm.doc.non_payable_weekly_machinery_detail_plan_by_day.map((item, idx) => {
		if (machineryAggrigate[item.machinery_type]) {
			item[w] = machineryAggrigate[item.machinery_type];
		} else {
			item[w] = 0;
		}
	})

	frm.refresh_field("non_payable_weekly_machinery_detail_plan_by_day")
}

function assignManpowerWeekNonpayable(frm, cdt, cdn, w) {

	var manpowerAggrigate = {};
	//assign to the machinery table
	frm.doc.non_payable_weekly_plan_manpower_detail && frm.doc.non_payable_weekly_plan_manpower_detail.map((manpower, index) => {
		var act_qty = 0;
		frm.doc.non_payable_weekly_detail_plan.map((week, i) => {
			console.log("weeeeeeeeeeeeeeek", week)
			console.log("manpower", manpower)
			if (week.activity == manpower.activity) {
				console.log("week value", week[w])
				act_qty = week[w] || 0;
			}
		})
		console.log("activityyyyyyy quantity", act_qty)

		if (manpowerAggrigate[manpower.job_title]) {
			manpowerAggrigate[manpower.job_title] += ((act_qty * manpower.uf * manpower.labor_no * manpower.li_permanent) / manpower.productivity);
		}
		else {
			manpowerAggrigate[manpower.job_title] = ((act_qty * manpower.uf * manpower.efficency * manpower.li_permanent) / manpower.productivity);
		}
	})

	console.log("manpower aggrigate", manpowerAggrigate)

	frm.doc.non_payable_weekly_manpower_detail_plan_by_day.map((item, idx) => {
		if (manpowerAggrigate[item.labor_type]) {
			item[w] = manpowerAggrigate[item.labor_type];
		} else {
			item[w] = 0;
		}
	})

	frm.refresh_field("non_payable_weekly_manpower_detail_plan_by_day")
}

function assignMaterialWeek(frm, cdt, cdn, w) {

	var materialAggrigate = {};
	//assign to the machinery table
	frm.doc.material1 && frm.doc.material1.map((material, index) => {
		var act_qty = 0;
		frm.doc.weekly_detail_plan.map((week, i) => {
			if (week.activity == material.activity) {
				act_qty = week[w] || 0;
			}
		})
		console.log("activity quantity", act_qty)
		console.log("uf", material.material_qty)

		if (materialAggrigate[material.item1]) {
			materialAggrigate[material.item1] += (act_qty * material.material_qty);
		}
		else {
			materialAggrigate[material.item1] = (act_qty * material.material_qty);
		}
	})

	console.log("material aggrigate", materialAggrigate)

	frm.doc.weekly_material_detail_plan_by_day.map((item, idx) => {
		if (materialAggrigate[item.material_name]) {
			item[w] = materialAggrigate[item.material_name];
		} else {
			item[w] = 0;
		}
	})

	frm.refresh_field("weekly_material_detail_plan_by_day")
}

function assignMaterialWeekNonpayable(frm, cdt, cdn, w) {

	var materialAggrigate = {};
	//assign to the machinery table
	frm.doc.non_payable_weekly_plan_material_detail && frm.doc.non_payable_weekly_plan_material_detail.map((material, index) => {
		var act_qty = 0;
		frm.doc.non_payable_weekly_detail_plan.map((week, i) => {
			if (week.activity == material.activity) {
				act_qty = week[w] || 0;
			}
		})
		console.log("activity quantity", act_qty)
		console.log("uf", material.material_qty)

		if (materialAggrigate[material.item1]) {
			materialAggrigate[material.item1] += (act_qty * material.material_qty);
		}
		else {
			materialAggrigate[material.item1] = (act_qty * material.material_qty);
		}
	})

	console.log("material aggrigate", materialAggrigate)

	frm.doc.non_payable_weekly_material_detail_plan_by_day.map((item, idx) => {
		if (materialAggrigate[item.material_name]) {
			item[w] = materialAggrigate[item.material_name];
		} else {
			item[w] = 0;
		}
	})

	frm.refresh_field("non_payable_weekly_material_detail_plan_by_day")
}