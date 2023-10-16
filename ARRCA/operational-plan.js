cur_frm.add_fetch('activity', 'quantity', 'quantity');
cur_frm.add_fetch('activity', 'direct_cost_after_conversion', 'rate');
cur_frm.add_fetch('activity', 'unit', 'uom');
cur_frm.add_fetch('activity', 'subject', 'activity_name');
cur_frm.add_fetch('activity', 'productivity', 'productivity');


frappe.ui.form.on('Operational Plan', {
	onload: function(frm) {
		console.log("abe", frm.doc.no)
		addRowToCPT(frm);
	}
});

function addRowToCPT(frm, cdt, cdn) {
	console.log(frm.doc.no)
	var no = frm.doc.no;
	frm.clear_table("no");

	frm.set_value("no", []);

	var tableRow1 = frappe.model.add_child(frm.doc, "No of working days", "no");
	tableRow1.sep = 26;
	tableRow1.oct = 26;
	tableRow1.nov = 26;
	tableRow1.dec = 26;
	tableRow1.jan = 26;
	tableRow1.feb = 26;
	tableRow1.mar = 26;
	tableRow1.apr = 26;
	tableRow1.may = 26;
	tableRow1.jun = 26;
	tableRow1.july = 26;
	tableRow1.aug = 26;

	console.log("table row", tableRow1)

	refresh_field("no");

}




var month_totals = {};


// Calfulate total Holidayss
frappe.ui.form.on('Holidayss', {
	from_date: function(frm, cdt, cdn) {
		var child = locals[cdt][cdn];
		console.log("child", child)
		if (child.from_date && child.to_date) {
			var start_date = frappe.datetime.str_to_obj(child.from_date);
			var end_date = frappe.datetime.str_to_obj(child.to_date);

			var day_diff = end_date.getDate() - start_date.getDate();
			child.total = Math.ceil(day_diff);

			var month_number = start_date.getMonth() + 1; // Adding 1 because getMonth() returns zero-based month (0 for January)
			child.month = month_number;
			console.log("month", child.month)



			frm.refresh_field("holiday")
		}


	},
	to_date: function(frm, cdt, cdn) {
		var child = locals[cdt][cdn];
		console.log("child", child)
		if (child.from_date && child.to_date) {

			var start_date = frappe.datetime.str_to_obj(child.from_date);
			var end_date = frappe.datetime.str_to_obj(child.to_date);

			var day_diff = end_date.getDate() - start_date.getDate();

			child.total = Math.ceil(day_diff);

			var month_number = start_date.getMonth() + 1; // Adding 1 because getMonth() returns zero-based month (0 for January)
			child.month = month_number;
			console.log("month", child.month)


			if (month_totals[child.month]) {
				month_totals[child.month] += child.total;
			} else {
				month_totals[child.month] = child.total;
			}

			console.log("month", month_totals)
			console.log("no", frm.doc.no)

			frm.doc.no[0].sep = 26 - (month_totals[9] || 0);  // September
			frm.doc.no[0].oct = 26 - (month_totals[10] || 0); // October
			frm.doc.no[0].nov = 26 - (month_totals[11] || 0); // November
			frm.doc.no[0].dec = 26 - (month_totals[12] || 0); // December
			frm.doc.no[0].jan = 26 - (month_totals[1] || 0);  // January
			frm.doc.no[0].feb = 26 - (month_totals[2] || 0);  // February
			frm.doc.no[0].mar = 26 - (month_totals[3] || 0);  // March
			frm.doc.no[0].apr = 26 - (month_totals[4] || 0);  // April
			frm.doc.no[0].may = 26 - (month_totals[5] || 0);  // May
			frm.doc.no[0].jun = 26 - (month_totals[6] || 0);  // June
			frm.doc.no[0].july = 26 - (month_totals[7] || 0); // July
			frm.doc.no[0].aug = 26 - (month_totals[8] || 0);  // August
			frm.refresh_field("no")
			console.log("sth", frm.doc.no[0])

			frm.refresh_field("holiday")


			frm.refresh_field("holiday")
		}
	}
});









//calculating duration
frappe.ui.form.on('Operational Plan', {
	end_date: function(frm) {
		if (frm.doc.start_date && frm.doc.end_date) {
			var start_date = frappe.datetime.str_to_obj(frm.doc.start_date);
			var end_date = frappe.datetime.str_to_obj(frm.doc.end_date);

			var year_diff = end_date.getFullYear() - start_date.getFullYear();
			var month_diff = end_date.getMonth() - start_date.getMonth();
			var day_diff = end_date.getDate() - start_date.getDate();

			var total_months = year_diff * 12 + month_diff + day_diff / 30; // Approximate days in a month

			var year_diff_decimal = total_months / 12;
			frm.set_value('duration', year_diff_decimal.toFixed(2));
			console.log("duration", year_diff_decimal.toFixed(2));
			frm.refresh_field("duration")
		}
	}
});


//Property of ERP Solutions PLC Custom Script Written by Bereket T May 24 2023

cur_frm.add_fetch('project', 'consultant', 'consultant');
cur_frm.add_fetch('project', 'client', 'client');

function DurationMessage(years, months, days) {
	var message = "";
	if (years > 0) {

		if (years == 1)
			message += years + " year ";
		else
			message += years + " years ";
	}

	if (months > 0 || years > 0) {

		if (months == 1)
			message += months + " month ";
		else if (months != 0)
			message += months + " months";

	}

	if (days == 1)
		message += days + " day ";
	else if (days != 0)
		message += days + " days ";

	return message;
}

function CalDaysInBetweenDates(date1, date2) {
	if ((Object.prototype.toString.call(date1) === '[object Date]') && (Object.prototype.toString.call(date2) === '[object Date]')) {

		var diff = Math.floor(date2.getTime() - date1.getTime());
		var secs = Math.floor(diff / 1000);
		var mins = Math.floor(secs / 60);
		var hours = Math.floor(mins / 60);
		var days = Math.floor(hours / 24);
		return days;
	}
	var days = 0;
	return days;
}

function RemainDays(days) {
	days = Math.floor(days % 31);
	return days
}

function CalMonthFromDays(days) {
	var months = Math.floor(days / 31);
	return months;
}

function RemainMonths(months) {
	months = Math.floor(months % 12);
	return months
}

function CalYearFromMonth(months) {
	var years = Math.floor(months / 12);
	return years;
}

function GetDuration(date1, date2) {
	var totalDays = CalDaysInBetweenDates(date1, date2);
	var month = CalMonthFromDays(totalDays);
	var year = CalYearFromMonth(month);
	var remainDays = RemainDays(totalDays);
	var remainMonth = RemainMonths(month);
	var message = DurationMessage(year, remainMonth, remainDays);
	return message;
}

frappe.ui.form.on("Operational Plan", {
	quantity: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frappe.model.set_value(d.doctype, d.name, 'equipment_hour', (d.quantity / d.productivity));
	}
});

frappe.ui.form.on("Operational Plan", {
	productivity: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frappe.model.set_value(d.doctype, d.name, 'equipment_hour', (d.quantity / d.productivity));
	}
});

frappe.ui.form.on("Operational Plan", {
	project: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frm.set_query("activity", "task_list", function() {
			return {
				"filters": {
					"project": frm.doc.project
				}
			}
		});
	}
});


function addDays(date, days) {
	var result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}

frappe.ui.form.on("Operational Plan", {
	start_date: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		var start_date = frappe.model.get_value(d.doctype, d.name, "start_date");
		if (start_date) {

			var end_date = addDays(start_date, 372);
			frappe.model.set_value(d.doctype, d.name, "end_date", end_date);

			var date1 = new Date(start_date.toString());
			var date2 = new Date(end_date.toString());

			var duration_result = GetDuration(date1, date2);
			frappe.model.set_value(d.doctype, d.name, "duration", duration_result);


			refresh_field("end_date");
			refresh_field("duration");
		}
	}
});

function AutoPopulate(frm, cdt, cdn) {

	cur_frm.add_fetch('activity', 'quantity', 'quantity');
	cur_frm.add_fetch('activity', 'direct_cost_after_conversion', 'rate');
	cur_frm.add_fetch('activity', 'unit', 'uom');
	cur_frm.add_fetch('activity', 'subject', 'activity_name');
	cur_frm.add_fetch('activity', 'productivity', 'productivity');


	refresh_field("task_list");
	refresh_field("uom");
	refresh_field("quantity");
	refresh_field("activity_name");

	var date1 = frm.doc.start_date;
	var date2 = frm.doc.end_date;

	var d = locals[cdt][cdn];
	var activity = frappe.model.get_value(d.doctype, d.name, "activity");

	if (activity && date1 && date2) {
		frappe.call({
			method: "erpnext.timesheet_sum_of_executed_qty.get_executed_quantity_from_timesheet",
			args: { activity: activity, date1: date1, date2: date2 }
		}).done((r) => {
			if (r.message.length >= 1)
				if (r.message[0]) {

					var to_date_executed = r.message[0];
					frappe.model.set_value(d.doctype, d.name, "to_date_executed", parseFloat(to_date_executed));
					var quantity = frappe.model.get_value(d.doctype, d.name, "quantity");
					var rate = frappe.model.get_value(d.doctype, d.name, "rate");
					var amount = quantity * rate;
					var remaining_planned_qty = quantity - parseFloat(to_date_executed);
					frappe.model.set_value(d.doctype, d.name, "remaining_planned_qty", remaining_planned_qty);
					frappe.model.set_value(d.doctype, d.name, "amount", amount);
				}
		})

		refresh_field("to_date_executed");
	}

	frm.doc.operational_plan_detail_one = []
	frm.doc.operational_plan_detail_two = []

	frm.doc.machinery = []
	frm.doc.manpower1 = []
	frm.doc.material1 = []

	frm.doc.machinery_detail_summerized = []
	frm.doc.manpower_detail_summerized = []
	frm.doc.material_detail_summerized = []

	var allMachinesMap = new Map();



	var grand_total_cost_for_machinary = 0;
	var number_of_items_for_machinary = 0;
	var sum_of_unit_rate_for_machinary = 0;

	var grand_total_cost_for_manpower = 0;
	var number_of_items_for_manpower = 0;
	var sum_of_unit_rate_for_manpower = 0;

	var grand_total_cost_for_material = 0;
	var number_of_items_for_material = 0;
	var sum_of_unit_rate_for_material = 0;

	allMachinesMap.clear();

	var task_lists = frm.doc.task_list;
	$.each(task_lists, function(_i, eMain) {

		//Script to populate child tables for machinary
		var taskParent = eMain.activity;
		var subject = eMain.activity_name;
		var planned_qty = eMain.planned ? eMain.planned : 1;




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
					entry.subject = subject;
					entry.qty = e.qty * planned_qty;
					entry.uf = e.uf;
					entry.efficency = e.efficency;
					entry.rental_rate = e.rental_rate;
					grand_total_cost_for_machinary += entry.qty * entry.rental_rate;
					number_of_items_for_machinary += 1;
					sum_of_unit_rate_for_machinary += entry.rental_rate;
					entry.total_hourly_cost = entry.qty * entry.rental_rate;

					if (allMachinesMap.has(e.id_mac)) {

						var existingVal = allMachinesMap.get(entry.id_mac);
						existingVal.qty += (entry.qty);
						existingVal.total_hourly_cost += (entry.total_hourly_cost);
						allMachinesMap.set(entry.id_mac, existingVal);
					}
					else {

						var newEntrySummerized = frm.add_child("machinery_detail_summerized");
						newEntrySummerized.id_mac = e.id_mac;
						newEntrySummerized.type = e.type;
						newEntrySummerized.qty = e.qty * planned_qty;
						newEntrySummerized.uf = e.uf;
						newEntrySummerized.efficency = e.efficency;
						newEntrySummerized.rental_rate = e.rental_rate;
						newEntrySummerized.total_hourly_cost = entry.qty * entry.rental_rate;
						allMachinesMap.set(e.id_mac, newEntrySummerized);
					}

				})

				frm.doc.equipment_total_cost = grand_total_cost_for_machinary;
				frm.doc.equipment_unit_rate = (sum_of_unit_rate_for_machinary / number_of_items_for_machinary);


				allMachinesMap.forEach(function(val, key) {


				})

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
					entry.subject = subject;
					entry.qty = e.qty * planned_qty;
					entry.uf = e.uf;
					entry.efficency = e.efficency;
					entry.hourly_cost = e.hourly_cost;
					grand_total_cost_for_manpower += entry.qty * entry.hourly_cost;
					number_of_items_for_manpower += 1;
					sum_of_unit_rate_for_manpower += entry.hourly_cost;
					entry.total_hourly_cost = entry.qty * entry.hourly_cost;


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


		;
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
					entry.subject = subject;
					entry.uom = e.uom;
					entry.qty = e.qty * planned_qty;
					entry.uf = e.uf;
					entry.efficency = e.efficency;
					entry.unit_price = e.unit_price;
					grand_total_cost_for_material += entry.qty * entry.unit_price;
					number_of_items_for_material += 1;
					sum_of_unit_rate_for_material += entry.unit_price;
					entry.total_cost = entry.qty * entry.unit_price;


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

		//Script to populate child tables for task detail by month
		if (taskParent) {

			frappe.call({

				method: "erpnext.task_week_detail_populate_api.get_task_by_task_id",
				args: { activity: taskParent }

			}).done((r) => {
				$.each(r.message, function(_i, e) {

					var entryOne = frm.add_child("operational_plan_detail_one");
					entryOne.activity = e[0];
					entryOne.activity_name = e[17];
					entryOne.uom = e[61];
					console.log("eee", e)
					entryOne.productivity = e[51]

						var value = planned_qty / entryOne.productivity;
						let remain = value;
					

					
					if (planned_qty) {


						console.log("value", value, planned_qty, entryOne.productivity)

						const months = ['sep', 'oct', 'nov', 'dec', 'jan', 'feb'];
						var total_planned = 0;

						for (let i = 0; i < months.length; i++) {
							const currentMonth = months[i];
							const allowedDays = frm.doc.no[0][currentMonth];

							if (remain <= allowedDays) {
								entryOne[`m_${i + 1}`] = remain;
								total_planned += entryOne[`m_${i + 1}`];
								console.log("remain", remain)
								break;
							} else {
								entryOne[`m_${i + 1}`] = allowedDays;
								total_planned += entryOne[`m_${i + 1}`];
								remain -= allowedDays;
								console.log("remain", remain)
							}
						}

						entryOne.planned = total_planned;

						frm.refresh_field("operational_plan_detail_one");

					}

					var entryTwo = frm.add_child("operational_plan_detail_two");
					entryTwo.activity = e[0];
					entryTwo.activity_name = e[17];
					entryTwo.uom = e[61];

					const monthsSecond = ['mar', 'apr', 'may', 'jun', 'july', 'oct'];

					var totalPlannedTwo = 0;

					if (planned_qty && remain > 0) {
						for (let i = 0; i < monthsSecond.length; i++) {
							const currentMonth = monthsSecond[i];
							const allowedDays = frm.doc.no[0][currentMonth];

							if (remain <= allowedDays) {
								entryTwo[`m_${i + 7}`] = remain;
								totalPlannedTwo += entryTwo[`m_${i + 7}`];
								console.log("remain", remain)
								break;
							} else {
								entryTwo[`m_${i + 7}`] = allowedDays;
								totalPlannedTwo += entryTwo[`m_${i + 7}`];
								remain -= allowedDays;
								console.log("remain", remain)
							}
						}
						entryTwo.planned = totalPlannedTwo;
				refresh_field("operational_plan_detail_two");
						

					}
				})

				refresh_field("operational_plan_detail_one");
				refresh_field("operational_plan_detail_two");
			})
		}
	});
}

function AutoCalculateMonthValueOne(doctype, name, planned) {

	console.log("One DocType: " + doctype);
	console.log("One Name: " + name);

	frappe.model.set_value(doctype, name, 'm_1', (planned / 12));
	frappe.model.set_value(doctype, name, 'm_2', (planned / 12));
	frappe.model.set_value(doctype, name, 'm_3', (planned / 12));
	frappe.model.set_value(doctype, name, 'm_4', (planned / 12));
	frappe.model.set_value(doctype, name, 'm_5', (planned / 12));
	frappe.model.set_value(doctype, name, 'm_6', (planned / 12));
}

function AutoCalculateMonthValueTwo(doctype, name, planned) {

	console.log("Two DocType: " + doctype);
	console.log("Two Name: " + name);

	frappe.model.set_value(doctype, name, 'm_7', (planned / 25));
	frappe.model.set_value(doctype, name, 'm_8', (planned / 26));
	frappe.model.set_value(doctype, name, 'm_9', (planned / 27));
	frappe.model.set_value(doctype, name, 'm_10', (planned / 26));
	frappe.model.set_value(doctype, name, 'm_11', (planned / 25));
	frappe.model.set_value(doctype, name, 'm_12', (planned / 24));
}

frappe.ui.form.on("Operational Plan Detail", {
	activity: function(frm, cdt, cdn) {
		AutoPopulate(frm, cdt, cdn);
	},

	planned: function(frm, cdt, cdn) {
		AutoPopulate(frm, cdt, cdn);
	}
});

frappe.ui.form.on("Operational Plan Detail One", {
	planned: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frm.refresh_field("planned");
		AutoCalculateMonthValueOne(d.doctype, d.name, d.planned);
	}
});

frappe.ui.form.on("Operational Plan Detail Two", {
	planned: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frm.refresh_field("planned");
		AutoCalculateMonthValueTwo(d.doctype, d.name, d.planned);
	}
});