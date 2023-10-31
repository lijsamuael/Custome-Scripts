//Old Script Section Begin
cur_frm.add_fetch('project', 'consultant', 'consultant');
cur_frm.add_fetch('project', 'client', 'client');

frappe.ui.form.on("Monthly Plan", {
	  quantity: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
				frappe.model.set_value(d.doctype, d.name, 'equipment_hour', (d.quantity / d.productivity));	
	 }
 });
frappe.ui.form.on("Monthly Plan", {
	  productivity: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
				frappe.model.set_value(d.doctype, d.name, 'equipment_hour', (d.quantity / d.productivity));	
	 },
	operational_plan: async function(frm, cdt, cdn) {

				mainFunction(frm, cdt, cdn)

	}
 });




function mainFunction(frm, cdt, cdn) {

	var d = locals[cdt][cdn];
	if (frm.doc.operational_plan) {
		frm.clear_table('task_list');

		frappe.model.with_doc('Operational Plan', frm.doc.operational_plan, function() {

			let source_doc = frappe.model.get_doc('Operational Plan', frm.doc.operational_plan);
			console.log("month  number", frm.doc.date);
			var month_number = frappe.datetime.str_to_obj(frm.doc.date).getMonth() + 1;
			console.log("month  number", month_number);

			var filteredResults;
			var monthName = frm.doc.month;

			//get the operational plan detail one
			frappe.call({
				method: 'frappe.client.get_list',
				args: {
					doctype: 'Operational Plan Detail One',
					filters: {
						'parent': frm.doc.operational_plan,

					},
					fields: ['*']
				},
				callback: async function(response) {
					var resp = response.message;
					console.log("response", resp)

					// Get the non-null idx value
					var idxValue =
						monthName === "Sep" ? 1 :
							monthName === "Oct" ? 2 :
								monthName === "Nov" ? 3 :
									monthName === "Dec" ? 4 :
										monthName === "Jan" ? 5 :
											monthName === "Feb" ? 6 :
												monthName === "Mar" ? 7 :
													monthName === "Apr" ? 8 :
														monthName === "May" ? 9 :
															monthName === "Jun" ? 10 :
																monthName === "July" ? 11 :
																	monthName === "Aug" ? 12 :
																		null;
					console.log("index value", idxValue);


					// Filter the resp to get records with matching idx
					filteredResults = resp.filter(function(item) {
						return item["m_" + idxValue] != 0;
					});


					console.log("Filtered results", filteredResults);

					source_doc.task_list = [];
					frm.doc.monthly_plan_detail_week_view = [];
					frm.doc.monthly_plan_machinery_detail_week = []
					frm.doc.monthly_plan_manpower_detail_week = []
					frm.doc.monthly_plan_material_detail_week = []

					var task_qty = 0;
					var task_productivity = 0;

					//iterate and get the full information of the tasks from the oprational detail plan
					filteredResults.map((item, index) => {
						frappe.call({
							method: 'frappe.client.get_list',
							args: {
								doctype: 'Operational Plan Detail',
								filters: {
									'activity': item.activity,
								},
								fields: ['*']
							},
							callback: async function(response) {
								console.log("response", response.message[0])
								var op_activity = response.message[0];
								console.log("op aaacc", op_activity);

								//adding to the monthly plan detail table
								const target_row = frappe.model.add_child(frm.doc, 'Monthly Plan Detail', 'task_list');
								target_row.activity = op_activity.activity;
								target_row.activity_name = op_activity.activity_name;
								target_row.uom = op_activity.uom;
								target_row.quantity = op_activity.quantity;;
								target_row.rate = op_activity.rate;
								target_row.amount = target_row.quantity * target_row.rate;
								target_row.planned_this_month = filteredResults[index]["m_" + idxValue];
								target_row.remaining = op_activity.quantity

								frm.refresh_field("task_list");

								//adding row to the montly plan detail weekly view table
								const target_row2 = frappe.model.add_child(frm.doc, 'Monthly Plan Detail Week View1', 'monthly_plan_detail_week_view');
								target_row2.activity = op_activity.activity;
								target_row2.subject = op_activity.activity_name;
								target_row2.uom = op_activity.uom;
								target_row2.planned_this_month = filteredResults[index]["m_" + idxValue];

								frm.refresh_field("monthly_plan_detail_week_view");
								// ExecutePlanDetail(frm);


							}
						});
					})
					frm.refresh_field("task_list");
					console.log("Detail task beki", frm.doc.task_list);


					//get the machinery
					frm.doc.machinery = []
					filteredResults.map((item, index) => {
						frappe.call({
							method: 'frappe.client.get_list',
							args: {
								doctype: 'Machinery Detail2',
								filters: {
									'parent': item.activity
								},
								fields: ['*']
							},
							callback: async function(response) {
								var value = response.message;
								console.log("value", value)

								// adding to the row
								value.map((val, idx) => {
									const target_row = frm.add_child('machinery');

									target_row.id_mac = val.id_mac;
									target_row.type = val.type;
									target_row.activity = item.activity;
									target_row.task_name = item.activity_name;
									target_row.equp_no = val.qty;
									target_row.uf = val.uf;
									target_row.efficency = val.efficency;
									target_row.rental_rate = val.rental_rate;
									target_row.total_hourly_cost = target_row.qty * target_row.rental_rate;

									//fetching the quantity from the database
									frappe.call({
										method: 'frappe.client.get_list',
										args: {
											doctype: 'Task',
											filters: {
												'name': item.activity,
											},
											fields: ["quantity", "productivity"],
										},
										callback: async function(response) {
											console.log("Response ", response.message[0].quantity)
											target_row.qty = response.message[0].quantity;
											task_qty = response.message[0].quantity;
											task_productivity = response.message[0].productivity;
											target_row.productivity = response.message[0].productivity;
											target_row.equp_hour = (target_row.uf * target_row.efficency * target_row.qty * target_row.equp_no) / target_row.productivity;
											frm.refresh_field("machinery");


										}
									})

									//get the machinery detail by week
									var material_exist = false;

									frm.doc.monthly_plan_machinery_detail_week.map((row, index) => {
										if (row.machinery_type == val.type) {
											material_exist = true;
										}
									})

									if (!material_exist) {
										const material_week_row = frm.add_child('monthly_plan_machinery_detail_weekly');
										material_week_row.machinery_type = val.type;
									}


									frm.refresh_field("monthly_plan_machinery_detail_weekly");


								})

								frm.refresh_field("machinery");

							}
						})
					})

					//get the manpower
					frm.doc.manpower1 = []
					filteredResults.map((item, index) => {
						console.log("item activity", item.activity);
						frappe.call({
							method: 'frappe.client.get_list',
							args: {
								doctype: 'Manpower Detail',
								filters: {
									'parent': item.activity
								},
								fields: ['*'],
							},
							callback: async function(response) {
								var value = response.message;
								console.log("valuesssssss", value)

								//adding to the row
								value.map((val, idx) => {
									const target_row = frm.add_child('manpower1');

									target_row.id_map = val.id_map;
									target_row.job_title = val.job_title;
									target_row.activity = item.activity;
									target_row.subject = item.activity_name;
									target_row.li_permanent = val.li_permanent;
									target_row.labor_no = parseFloat(val.mp_number);

									target_row.uf = val.uf;
									target_row.hourly_cost = val.hourly_cost;


									//fetching the quantity from the database
									frappe.call({
										method: 'frappe.client.get_list',
										args: {
											doctype: 'Task',
											filters: {
												'name': item.activity,
											},
											fields: ["quantity", "productivity"],
										},
										callback: async function(response) {
											console.log("Response ", response.message[0].quantity)
											target_row.qty = response.message[0].quantity;
											target_row.productivity = response.message[0].productivity;
											target_row.labor_hour = (target_row.uf * target_row.labor_no * target_row.li_permanent * target_row.qty) / target_row.productivity;
											target_row.total_hourly_cost = target_row.qty * target_row.hourly_cost;
											frm.refresh_field("manpower1");

										}
									})

									//get the machinery detail by week
									var manpower_exist = false;
									frm.doc.monthly_plan_manpower_detail_week.map((row, index) => {
										// console.log("rowlabor", row, "/n val", val)
										if (row.labor_type == val.job_title) {
											manpower_exist = true;
										}
									})
									console.log("manpower exist boolean value", manpower_exist)
									if (!manpower_exist) {
										const manpower_week_row = frm.add_child('monthly_plan_manpower_detail_week');
										manpower_week_row.labor_type = val.job_title;
									}


									frm.refresh_field("monthly_plan_manpower_detail_week");

								})
								frm.refresh_field("monthly_plan_manpower_detail_week");
								frm.refresh_field("manpower1");


							}
						});
					})


					// //get the material
					frm.doc.material1 = []
					filteredResults.map((item, index) => {
						console.log("item activity", item.activity);
						frappe.call({
							method: 'frappe.client.get_list',
							args: {
								doctype: 'Material DetailARRCA',
								filters: {
									'parent': item.activity
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
									target_row.subject = item.activity_name;
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
												'name': item.activity,
											},
											fields: ["quantity"],
										},
										callback: async function(response) {
											console.log("Response ", response.message[0].quantity)
											target_row.qaty = response.message[0].quantity;
											target_row.total_material = target_row.qaty * target_row.material_qty;
											frm.refresh_field("material1");


										}
									})

									//get the material detail by week
									var equip_exist = false;

									frm.doc.monthly_plan_material_detail_week.map((row, index) => {
										if (row.material_name == val.item1) {
											equip_exist = true;
										}
									})

									if (!equip_exist) {
										const equip_week_row = frm.add_child('monthly_plan_material_detail_week');
										equip_week_row.material_name = val.item1;
									}


									frm.refresh_field("monthly_plan_material_detail_week");



								})
							}
						});

						frm.refresh_field("material1");

					})



				}
			})
		});
	}
}







function AutoPopulate(frm, cdt, cdn) {

		cur_frm.add_fetch('activity', 'quantity', 'quantity');
		cur_frm.add_fetch('activity', 'unit', 'uom');

		refresh_field("uom");
		refresh_field("quantity");

		var date1 = frm.doc.start_date;
		var date2 = frm.doc.end_date;

		var d = locals[cdt][cdn];
		var activity  = frappe.model.get_value(d.doctype, d.name, "activity");

		if(activity && date1 && date2) {
			frappe.call({
				method:  "erpnext.taskapi.get_executed_quantity_from_timesheet",
				args: {activity: activity, date1: date1, date2: date2}
			}).done((r) => {
				if(r.message.length>=1)
					if(r.message[0]) {

						var to_date_executed = r.message[0];
						frappe.model.set_value(d.doctype, d.name, "to_date_executed", parseFloat(to_date_executed));
						var quantity  = frappe.model.get_value(d.doctype, d.name, "quantity");
						var remaining_planned_qty = quantity - parseFloat(to_date_executed);
						frappe.model.set_value(d.doctype, d.name, "remaining_planned_qty", remaining_planned_qty);
					}
			})

			refresh_field("to_date_executed");
		}

		frm.doc.machinery = []
		frm.doc.monthly_plan_detail_week_view = []
		frm.doc.manpower1 = []
		frm.doc.material1 = []

		//console.log(frm);

		var grand_total_cost_for_machinary = 0;
		var number_of_items_for_machinary = 0;
		var sum_of_unit_rate_for_machinary = 0;

		var grand_total_cost_for_manpower = 0;
		var number_of_items_for_manpower = 0;
		var sum_of_unit_rate_for_manpower = 0;

		var grand_total_cost_for_material = 0;
		var number_of_items_for_material = 0;
		var sum_of_unit_rate_for_material = 0

		var task_lists = frm.doc.task_list;
		$.each(task_lists, function(_i, eMain) {

				//Script to populate child tables for machinary
				var taskParent  = eMain.activity;

				if(taskParent) {
					frappe.call({
						method:  "erpnext.machinary_populate_api.get_machinary_by_task",
						args: {parent: taskParent}
					}).done((r) => {
						$.each(r.message, function(_i, e){
							var entry = frm.add_child("machinery");
							entry.id_mac = e.id_mac;
							entry.type = e.type;
							entry.qty = e.qty*eMain.planned_this_month;
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
							entry.qty = e.qty*eMain.planned_this_month;
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


				;
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
							entry.qty = e.qty*eMain.planned_this_month;
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

							var entry = frm.add_child("monthly_plan_detail_week_view");
							entry.activity = e[0];
							entry.uom = e[61];

							if(eMain.planned_this_month) {
								entry.planned_this_month = eMain.planned_this_month;
								entry.w_1  = eMain.planned_this_month/4;
								entry.w_2  = eMain.planned_this_month/4;
								entry.w_3  = eMain.planned_this_month/4;
								entry.w_4  = eMain.planned_this_month/4;
							}

						})

						refresh_field("monthly_plan_detail_week_view");
					})
				}
		});
}

function AutoCalculateWeekValue(doctype, name, planned_this_month){
	  frappe.model.set_value(doctype, name, 'w_1', (planned_this_month / 4));
	  frappe.model.set_value(doctype, name, 'w_2', (planned_this_month / 4));
	  frappe.model.set_value(doctype, name, 'w_3', (planned_this_month / 4));
	  frappe.model.set_value(doctype, name, 'w_4', (planned_this_month / 4));
}

frappe.ui.form.on("Monthly Plan Detail", {
	activity:function(frm, cdt, cdn) {
		AutoPopulate(frm,cdt,cdn);
	},

	planned_this_month:function(frm, cdt, cdn) {
		AutoPopulate(frm,cdt,cdn);
	}
});

frappe.ui.form.on("Monthly Plan Detail Week View1", {
	planned_this_month: function(frm, cdt, cdn) {
	  var d = locals[cdt][cdn];
	  AutoCalculateWeekValue(d.doctype, d.name, d.planned_this_month);
   }
});

frappe.ui.form.on("Monthly Plan", {
	date_ec:function(frm, cdt, cdn) {
		if(frm.doc.date_ec) {

			var finalgc = convertDateTOGC(frm.doc.date_ec.toString());
			frm.doc.date= finalgc;
			refresh_field("date");

		}
	}
});

frappe.ui.form.on("Monthly Plan", {
	start_date_ec:function(frm, cdt, cdn) {
		if(frm.doc.start_date_ec) {

			var finalgc = convertDateTOGC(frm.doc.start_date_ec.toString());
			frm.doc.start_date= finalgc;
			refresh_field("start_date");

		}
	}
});


frappe.ui.form.on("Monthly Plan", {
	end_date_ec:function(frm, cdt, cdn) {
		if(frm.doc.end_date_ec) {

			var finalgc = convertDateTOGC(frm.doc.end_date_ec.toString());
			frm.doc.end_date= finalgc;
			refresh_field("end_date");

		}
	}
});















frappe.ui.form.on("Monthly Plan Detail Week View1", {
	w_1: function(frm, cdt, cdn) {
		assignMachineryWeek(frm, cdt, cdn, "w_1");
		assignManpowerWeek(frm, cdt, cdn, "w_1");
		assignMaterialWeek(frm, cdt, cdn, "w_1");
	},
	w_2: function(frm, cdt, cdn) {
		assignMachineryWeek(frm, cdt, cdn, "w_2");
		assignManpowerWeek(frm, cdt, cdn, "w_2");
		assignMaterialWeek(frm, cdt, cdn, "w_2");
	},
	w_3: function(frm, cdt, cdn) {
		assignMachineryWeek(frm, cdt, cdn, "w_3");
		assignManpowerWeek(frm, cdt, cdn, "w_3");
		assignMaterialWeek(frm, cdt, cdn, "w_3");
	},
	w_4: function(frm, cdt, cdn) {
		assignMachineryWeek(frm, cdt, cdn, "w_4");
		assignManpowerWeek(frm, cdt, cdn, "w_4");
		assignMaterialWeek(frm, cdt, cdn, "w_4");
	}
});

function assignMachineryWeek(frm, cdt, cdn, w) {

	var machineryAggrigate = {};
	//assign to the machinery table
	frm.doc.machinery.map((machine, index) => {
		var act_qty = 0;
		frm.doc.monthly_plan_detail_week_view.map((week, i) => {
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

	frm.doc.monthly_plan_machinery_detail_weekly.map((item, idx) => {
		if (machineryAggrigate[item.machinery_type]) {
			item[w] = machineryAggrigate[item.machinery_type];
		} else {
			item[w] = 0;
		}
	})

	frm.refresh_field("monthly_plan_machinery_detail_weekly")
}


function assignManpowerWeek(frm, cdt, cdn, w) {

	var manpowerAggrigate = {};
	//assign to the machinery table
	frm.doc.manpower1.map((manpower, index) => {
		var act_qty = 0;
		frm.doc.monthly_plan_detail_week_view.map((week, i) => {
			if (week.activity == manpower.activity) {
				act_qty = week[w] || 0;
			}
		})
		console.log("activity quantity", act_qty)
		console.log("uf", manpower.uf)
		console.log("labor_no", manpower.labor_no)
		console.log("li_permanent", manpower.li_permanent)
		console.log("productivity", manpower.productivity)

		if (manpowerAggrigate[manpower.job_title]) {
			manpowerAggrigate[manpower.job_title] += ((act_qty * manpower.uf * manpower.labor_no * manpower.li_permanent) / manpower.productivity);
		}
		else {
			manpowerAggrigate[manpower.job_title] = ((act_qty * manpower.uf * manpower.labor_no * manpower.li_permanent) / manpower.productivity);
		}
	})

	console.log("manpower aggrigate", manpowerAggrigate)

	frm.doc.monthly_plan_manpower_detail_week.map((item, idx) => {
		if (manpowerAggrigate[item.labor_type]) {
			item[w] = manpowerAggrigate[item.labor_type];
		} else {
			item[w] = 0;
		}
	})

	frm.refresh_field("monthly_plan_manpower_detail_week")
}

function assignMaterialWeek(frm, cdt, cdn, w) {

	var materialAggrigate = {};
	//assign to the machinery table
	frm.doc.material1.map((material, index) => {
		var act_qty = 0;
		frm.doc.monthly_plan_detail_week_view.map((week, i) => {
			if (week.activity == material.activity) {
				act_qty = week[w] || 0;
			}
		})
		console.log("activity quantity", act_qty)
		console.log("mt q", material.material_qty)

		if (materialAggrigate[material.item1]) {
			materialAggrigate[material.item1] += (act_qty * material.material_qty);
		}
		else {
			materialAggrigate[material.item1] = (act_qty * material.material_qty);
		}
	})

	console.log("material aggrigate", materialAggrigate)

	frm.doc.monthly_plan_material_detail_week.map((item, idx) => {
		if (materialAggrigate[item.material_name]) {
			item[w] = materialAggrigate[item.material_name];
		} else {
			item[w] = 0;
		}
	})

	frm.refresh_field("monthly_plan_material_detail_week")
}