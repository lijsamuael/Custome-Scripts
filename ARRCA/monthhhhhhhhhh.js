monitoringfrappe.ui.form.on("Month Plan", {
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

								//adding to the row
								value.map((val, idx) => {
									const target_row = frappe.model.add_child(frm.doc, 'Monthly Plan Machinery Detail', 'machinery');

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
										const material_week_row = frappe.model.add_child(frm.doc, 'Monthly Plan Machinery Detail Weekly', 'monthly_plan_machinery_detail_weekly');
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
									const target_row = frappe.model.add_child(frm.doc, 'Monthly Plan Manpower Detail', 'manpower1');

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
										const manpower_week_row = frappe.model.add_child(frm.doc, 'Monthly Plan Manpower Detail Week', 'monthly_plan_manpower_detail_week');
										manpower_week_row.labor_type = val.job_title;
									}


									frm.refresh_field("monthly_plan_manpower_detail_week");

								})
								frm.refresh_field("monthly_plan_manpower_detail_week");
								frm.refresh_field("manpower1");


							}
						});
					})


					//get the material
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

									const target_row = frappe.model.add_child(frm.doc, 'Monthly Plan Material Detail', 'material1');
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
										const equip_week_row = frappe.model.add_child(frm.doc, 'Monthly Plan Material Detail Week', 'monthly_plan_material_detail_week');
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



frappe.ui.form.on("Month Plan", {
	date_ec:function(frm, cdt, cdn) {
		if(frm.doc.date_ec) {

			var finalgc = convertDateTOGC(frm.doc.date_ec.toString());
			frm.doc.date= finalgc;
			refresh_field("date");

		}
	}
});

frappe.ui.form.on("Month Plan", {
	start_date_ec:function(frm, cdt, cdn) {
		if(frm.doc.start_date_ec) {

			var finalgc = convertDateTOGC(frm.doc.start_date_ec.toString());
			frm.doc.start_date= finalgc;
			refresh_field("start_date");

		}
	}
});


frappe.ui.form.on("Month Plan", {
	end_date_ec:function(frm, cdt, cdn) {
		if(frm.doc.end_date_ec) {

			var finalgc = convertDateTOGC(frm.doc.end_date_ec.toString());
			frm.doc.end_date= finalgc;
			refresh_field("end_date");

		}
	}
});
