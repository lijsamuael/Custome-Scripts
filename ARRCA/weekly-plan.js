//Script by Bereket Begin
function addDays(date, days) {
	var result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
  }
var week_value;
frappe.ui.form.on("Weekly Plan", {
	start_date:function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		var start_date = frappe.model.get_value(d.doctype, d.name, "start_date");
		if(start_date){
			var end_date = addDays(start_date, 6);
			frappe.model.set_value(d.doctype, d.name, "end_date", end_date);
		}
	}
});

frappe.ui.form.on("Daily Detail Plan", {
	activity:function(frm, cdt, cdn) {
		console.log("looooged")
		AutoPopulate(frm, cdt, cdn, 0)
	}
});


frappe.ui.form.on("Weekly Plan", {
	monthly_plan: function(frm, cdt, cdn) {
		console.log("we are here");
		var d = locals[cdt][cdn];
		if (frm.doc.monthly_plan) {
			frm.clear_table('weekly_plan_detail_master');
			frappe.call({
				method: "frappe.client.get_list",
				args: {
					doctype: 'Monthly Plan Detail Week View1',
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




					var activities = [];
					console.log("week value before", week_value)

					response.message.map((item, index) => {
						if (item["w_" + week_value] != 0) {
							activities.push(item)
						}
					})
					MPAutoPopulate(frm, activities, null);
				}
			})
			frappe.model.with_doc('Monthly Plan', frm.doc.monthly_plan, function() {
				let source_doc = frappe.model.get_doc('Monthly Plan', frm.doc.monthly_plan);
				console.log("source tas list", source_doc.task_list.slice(1))
			});
		}
	},

	planned_qty:function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		AutoPopulate(frm,cdt,cdn, d.planned_qty);
	}
});


function MPAutoPopulate(frm, mp_activites, planned_this_week) {

	$.each(mp_activites, function(eachIndex, mp_activity) {

		var date1 = frm.doc.start_date;
		var today = frm.doc.date;
		console.log("today ", today);

		//add row
		const target_row = frm.add_child('weekly_plan_detail_master');
		
		target_row.activity = mp_activity.activity;
		target_row.activity_name = mp_activity.subject;
		target_row.uom = mp_activity.uom;
		console.log("week value", week_value)
		target_row.planned = mp_activity["w_" + week_value]
		console.log("mp activities", mp_activity)

		frappe.call({
			method: 'frappe.client.get_list',
			args: {
				doctype: 'Timesheet',
				filters: [
					['date', ">", date1],
					["date", "<", today],
					["task_name", "=", mp_activity.activity]
				],
				fields: ["*"],
			},
			callback: async function(response) {
				console.log("Response about timesheeeeeeeeeeeeeeeeeetA", response.message)
				var total_executed = 0;
				response.message.map((item) => {
					total_executed += item.executed_quantity;
				})
				target_row.to_date = total_executed;
				target_row.planned_this_week = target_row.planned - target_row.to_date;
				frm.refresh_field("weekly_plan_detail_master")

			}
		})

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

		var date1 = frm.doc.start_date;
		var date2 = frm.doc.end_date;





	});

	ExecuteWeeklyPlanDetail(frm, planned_this_week);
	cur_frm.refresh_fields("weekly_plan_detail_master");

}

function AutoPopulate(frm, cdt, cdn, planned_this_week) {

		var date1 = frm.doc.start_date;
		var date2 = frm.doc.end_date;
		var today = frappe.datetime.today();
		console.log("today ", today);

		frappe.call({
			method: 'frappe.client.get_list',
			args: {
				doctype: 'Timesheet',
				filters: [
					['date', ">", date1],
					["date", "<", today]
				],
				fields: ["*"],
			},
			callback: async function(response) {
				console.log("Response about timesheeeeeeeeeeeeeeeeeetA", response.message)

				frm.refresh_field("manpower1")

			}
		})

		var d = locals[cdt][cdn];
		var monthly_plan_code  = frappe.model.get_value(d.doctype, d.name, "monthly_plan_code");

		if(monthly_plan_code) {
			frappe.call({
				method:  "erpnext.weekly_api_get_monthly_plan01.get_monthly_plan_total_by_monthly_code",
				args: {monthly_code: monthly_plan_code}
			}).done((r) => {
				if(r.message.length>=1)
					if(r.message[0]) {

						var total_contracted_qty_for_month = r.message[0];
						frappe.model.set_value(d.doctype, d.name, "contract_quantity", parseFloat(total_contracted_qty_for_month));
					}
			})

			refresh_field("contract_quantity");
		}

		if(monthly_plan_code && date1 && date2) {
			frappe.call({
				method:  "erpnext.weekly_api_get_monthly_plan02.get_monthly_plan_executed_total_by_monthly_code",
				args: {monthly_code: monthly_plan_code, date1: date1, date2: date2}
			}).done((r) => {
				if(r.message.length>=1)
					if(r.message[0]) {

						var done_till_now = r.message[0];
						frappe.model.set_value(d.doctype, d.name, "done_till_now", parseFloat(done_till_now));
						var contract_quantity  = frappe.model.get_value(d.doctype, d.name, "contract_quantity");
						var remaining_qty = contract_quantity - parseFloat(done_till_now);
						frappe.model.set_value(d.doctype, d.name, "remaining_qty", remaining_qty);
					}
			})

			refresh_field("done_till_now");
			refresh_field("remaining_qty");
		}


		var grand_total_cost_for_machinary = 0;
		var number_of_items_for_machinary = 0;
		var sum_of_unit_rate_for_machinary = 0;

		var grand_total_cost_for_manpower = 0;
		var number_of_items_for_manpower = 0;
		var sum_of_unit_rate_for_manpower = 0;

		var grand_total_cost_for_material = 0;
		var number_of_items_for_material = 0;
		var sum_of_unit_rate_for_material = 0;


		if(monthly_plan_code) {
			frappe.call({

				method:  "erpnext.weekly_api_get_monthly_plan03.get_task_list_by_monthly_code",
				args: { monthly_code: monthly_plan_code }

			}).done((r) => {

				if(r.message.length >= 1) {

					console.log(r.message.length);
					$.each(r.message, function(_i, r) {

							var taskParent  = r[0];

							frm.doc.weekly_detail_plan = []
							frm.doc.machinery = []
							frm.doc.manpower1 = []
							frm.doc.material1 = []




							if(taskParent) {
								frappe.call({
									method:  "erpnext.machinary_populate_api.get_machinary_by_task",
									args: {parent: taskParent}
								}).done((r) => {
									$.each(r.message, function(_i, e) {

										var entry = frm.add_child("machinery");
										entry.id_mac = e.id_mac;
										entry.type = e.type;
										entry.qty = e.qty*planned_this_week;
										entry.uf = e.uf;
										entry.efficency = e.efficency;
										entry.rental_rate = e.rental_rate;
										grand_total_cost_for_machinary += entry.qty*entry.rental_rate;
										number_of_items_for_machinary += 1;
										sum_of_unit_rate_for_machinary += entry.rental_rate;
										entry.total_hourly_cost = entry.qty*entry.rental_rate;

									})

									frm.doc.equipment_total_cost = grand_total_cost_for_machinary;
									frm.doc.equipment_unit_rate = (sum_of_unit_rate_for_machinary/number_of_items_for_machinary);

									refresh_field("machinery");
									refresh_field("equipment_total_cost");
									refresh_field("equipment_unit_rate");
								})
							}




							//Script to populate child tables for manpower
							if(taskParent) {
								frappe.call({
									method:  "erpnext.manpower_populate_api.get_manpower_by_task",
									args: {parent: taskParent}
								}).done((r) => {
									$.each(r.message, function(_i, e){
										var entry = frm.add_child("manpower1");
										entry.id_map = e.id_map;
										entry.job_title = e.job_title;
										entry.qty = e.qty*planned_this_week;
										entry.uf = e.uf;
										entry.efficency = e.efficency;
										entry.hourly_cost = e.hourly_cost;
										grand_total_cost_for_manpower += entry.qty*entry.hourly_cost;
										number_of_items_for_manpower += 1;
										sum_of_unit_rate_for_manpower += entry.hourly_cost;
										entry.total_hourly_cost = entry.qty*entry.hourly_cost;
									})


									frm.doc.man_power_total_cost = grand_total_cost_for_manpower;
									frm.doc.man_power_unit_rate = (sum_of_unit_rate_for_manpower/number_of_items_for_manpower);

									refresh_field("manpower1");
									refresh_field("man_power_total_cost");
									refresh_field("man_power_unit_rate");
								})
							}


							//Script to populate child tables for material
							if(taskParent) {
								frappe.call({

									method:  "erpnext.material_populate_api.get_material_by_task",
									args: {parent: taskParent}

								}).done((r) => {
									$.each(r.message, function(_i, e){

										var entry = frm.add_child("material1");
										entry.id_mat = e.id_mat;
										entry.item1 = e.item1;
										entry.uom = e.uom;
										entry.qty = e.qty*planned_this_week;
										entry.uf = e.uf;
										entry.efficency = e.efficency;
										entry.unit_price = e.unit_price;
										grand_total_cost_for_material += entry.qty*entry.unit_price;
										number_of_items_for_material += 1;
										sum_of_unit_rate_for_material += entry.unit_price;
										entry.total_cost = entry.qty*entry.unit_price;
									})

									frm.doc.material_total_cost = grand_total_cost_for_material;
									//frm.doc.man_power_unit_rate = (sum_of_unit_rate/number_of_items);

									refresh_field("material1");
									refresh_field("material_total_cost");
								})
							}

							//Script to populate child tables for task detail by week
							if(taskParent) {

								frappe.call({

									method:  "erpnext.task_week_detail_populate_api.get_task_by_task_id",
									args: {activity: taskParent}

								}).done((r) => {
									$.each(r.message, function(_i, e){

										var entry = frm.add_child("weekly_detail_plan");
										entry.activity = e[0];
										entry.uom = e[61];

										if(planned_this_week) {
											entry.planned_this_week = planned_this_week;
											entry.d_1  = planned_this_week/6;
											entry.d_2  = planned_this_week/6;
											entry.d_3  = planned_this_week/6;
											entry.d_4  = planned_this_week/6;
											entry.d_5  = planned_this_week/6;
											entry.d_6  = planned_this_week/6;
										}

									})

									refresh_field("weekly_detail_plan");
								})
							}
					})
				}
			})
		}
}

function AutoCalculateDayValue(doctype, name, planned_this_week){
	  frappe.model.set_value(doctype, name, 'd_1', (planned_this_week / 6));
	  frappe.model.set_value(doctype, name, 'd_2', (planned_this_week / 6));
	  frappe.model.set_value(doctype, name, 'd_3', (planned_this_week / 6));
	  frappe.model.set_value(doctype, name, 'd_4', (planned_this_week / 6));
	  frappe.model.set_value(doctype, name, 'd_5', (planned_this_week / 6));
	  frappe.model.set_value(doctype, name, 'd_6', (planned_this_week / 6));
}



frappe.ui.form.on("Weekly detail plan", {
	planned_this_week: function(frm, cdt, cdn) {
	  var d = locals[cdt][cdn];
	  AutoCalculateDayValue(d.doctype, d.name, d.planned_this_week);
   }
});


frappe.ui.form.on("Weekly Plan", {
	date_ec:function(frm, cdt, cdn) {
		if(frm.doc.date_ec) {

			var finalgc = convertDateTOGC(frm.doc.date_ec.toString());
			frm.doc.date= finalgc;
			refresh_field("date");

		}
	}
});

frappe.ui.form.on("Weekly Plan", {
	start_date_ec:function(frm, cdt, cdn) {
		if(frm.doc.start_date_ec) {

			var finalgc = convertDateTOGC(frm.doc.start_date_ec.toString());
			frm.doc.start_date= finalgc;
			refresh_field("start_date");

		}
	}
});


frappe.ui.form.on("Weekly Plan", {
	end_date_ec:function(frm, cdt, cdn) {
		if(frm.doc.end_date_ec) {

			var finalgc = convertDateTOGC(frm.doc.end_date_ec.toString());
			frm.doc.end_date= finalgc;
			refresh_field("end_date");

		}
	}
});


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
		console.log("eMain", eMain)
		var taskParent = eMain.activity;
		var activity_name = eMain.activity_name;
		var planned_this_week = eMain.planned

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


		//script to populate child tables for machinery
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
					entry.task_name = activity_name;

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


					//add to the machinery by day table
					var machinery_exist = false;
					

					frm.doc.weekly_machinery_detail_plan_by_day.map((row, index) => {
						if (row.machinery_type == e.type) {
								machinery_exist = true;
						}
					})

					if (!machinery_exist) {
						const machinery_week_row = frm.add_child('weekly_machinery_detail_plan_by_day');
							machinery_week_row.machinery_type = e.type;
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
					console.log("manpoer e", e)
					var entry = frm.add_child("manpower1");
					entry.id_map = e.id_map;
					entry.job_title = e.job_title;
					entry.activity = taskParent;
					entry.subject = activity_name;
					entry.li_permanent = e.li_permanent;
					entry.labor_no = parseFloat(e.qty)

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
			console.log("tttttttttttttttttttttttt")
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
					console.log("valuesssssss", value)
					value.map((val, index) => {

						const target_row = frm.add_child('material1');
						target_row.id_mat = val.id_mat;
						target_row.item1 = val.item1;
						target_row.uom = val.uom;
						target_row.activity = val.parent;
						target_row.subject = activity_name;
						target_row.material_qty = val.qaty
						target_row.uf = val.uf;
						target_row.efficency = val.efficency;
						target_row.unit_price = val.unit_price;
						target_row.total_cost = target_row.qty * target_row.unit_price;

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
								console.log("Response dddddddddddddd", response.message[0].quantity)
								target_row.qaty = response.message[0].quantity;
								target_row.total_material = target_row.qaty * target_row.material_qty;
								frm.refresh_field("material1");


							}
						})

						//get the material detail by week
						var equip_exist = false;

						frm.doc.weekly_material_detail_plan_by_day.map((row, index) => {
							if (row.material_name == val.item1) {
								equip_exist = true;
							}
						})

						if (!equip_exist) {
							const equip_week_row = frm.add_child('weekly_material_detail_plan_by_day');
							equip_week_row.material_name = val.item1;
						}


						frm.refresh_field("weekly_material_detail_plan_by_day");



					})
				}
			});
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
							entry.planned_this_week = frm.doc.weekly_plan_detail_master[j].planned_this_week;
							break; // Once a match is found, no need to continue searching
						}
					}
					entry.subject = activity_name;
					console.log("abebebebe", planned_this_week)
					entry.planned_this_week = planned_this_week;
					entry.uom = e[61];

				})

				refresh_field("weekly_detail_plan");
			})
		}

	})
}


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

function assignManpowerWeek(frm, cdt, cdn, w) {

	var manpowerAggrigate = {};
	//assign to the machinery table
	frm.doc.manpower1 && frm.doc.manpower1.map((manpower, index) => {
		var act_qty = 0;
		frm.doc.weekly_detail_plan.map((week, i) => {
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

	frm.doc.weekly_manpower_detail_plan_by_day.map((item, idx) => {
		if (manpowerAggrigate[item.labor_type]) {
			item[w] = manpowerAggrigate[item.labor_type];
		} else {
			item[w] = 0;
		}
	})

	frm.refresh_field("weekly_manpower_detail_plan_by_day")
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