//Property of ERP Solutions PLC Custom Script Written by Bereket T May 24 2023

cur_frm.add_fetch('project', 'consultant', 'consultant');
cur_frm.add_fetch('project', 'client', 'client');

//fetch the list of task fields
cur_frm.add_fetch('activity', 'quantity', 'quantity');
cur_frm.add_fetch('activity', 'quantity', 'actual_quantity');
cur_frm.add_fetch('activity', 'quantity', 'remaining_planned_qty');
cur_frm.add_fetch('activity', 'direct_cost_after_conversion', 'rate');
cur_frm.add_fetch('activity', 'unit', 'uom');
cur_frm.add_fetch('activity', 'subject', 'activity_name');
cur_frm.add_fetch('activity', 'productivity', 'productivity');
cur_frm.add_fetch('activity', 'item_no', 'item_no');

//fetch the qquipment fields
cur_frm.add_fetch('id_mac', 'type', 'type');
cur_frm.add_fetch('id_mac', 'rental_rate', 'rental_rate');
cur_frm.add_fetch('id_mac', 'mc_number', 'uf');


//trigger on row deletion
frappe.ui.form.on('Operational Plan Detail', {
	task_list_before_remove: function(frm, cdt, cdn) {
		console.log("frm", frm)
		console.log("cdt", cdt)
		console.log("cdn", cdn)

		console.log('row remove is here sami. Awo eyesera new ende');
		var row = locals[cdt][cdn];
		console.log("removed row", row)
	}
})

frappe.ui.form.on('Operational Plan Detail One1', {
	m_1: function(frm, cdt, cdn){
		prohobitUpperSum1(frm, cdt, cdn, "m_1")
	},
	m_2: function(frm, cdt, cdn){
		prohobitUpperSum1(frm, cdt, cdn, "m_2")
	},
	m_3: function(frm, cdt, cdn){
		prohobitUpperSum1(frm, cdt, cdn, "m_3")
	},
	m_4: function(frm, cdt, cdn){
		prohobitUpperSum1(frm, cdt, cdn, "m_4")
	},
	m_5: function(frm, cdt, cdn){
		prohobitUpperSum1(frm, cdt, cdn, "m_5")
	},
	m_6: function(frm, cdt, cdn){
		prohobitUpperSum1(frm, cdt, cdn, "m_6")
	},
})

frappe.ui.form.on('Operational Plan Detail Two2', {
	m_7: function(frm, cdt, cdn){
		prohobitUpperSum2(frm, cdt, cdn, "m_7")
	},
	m_8: function(frm, cdt, cdn){
		prohobitUpperSum2(frm, cdt, cdn, "m_8")
	},
	m_9: function(frm, cdt, cdn){
		prohobitUpperSum2(frm, cdt, cdn, "m_9")
	},
	m_10: function(frm, cdt, cdn){
		prohobitUpperSum2(frm, cdt, cdn, "m_10")
	},
	m_11: function(frm, cdt, cdn){
		prohobitUpperSum2(frm, cdt, cdn, "m_11")
	},
	m_12: function(frm, cdt, cdn){
		prohobitUpperSum2(frm, cdt, cdn, "m_12")
	},
})

function prohobitUpperSum1(frm, cdt, cdn, month) {
	var total = 0;
	var row = locals[cdt][cdn];
	console.log("localssss for each month", row);

	// Calculate the total
	total += row.m_1 ? parseFloat(row.m_1) : 0;
	total += row.m_2 ? parseFloat(row.m_2) : 0;
	total += row.m_3 ? parseFloat(row.m_3) : 0;
	total += row.m_4 ? parseFloat(row.m_4) : 0;
	total += row.m_5 ? parseFloat(row.m_5) : 0;
	total += row.m_6 ? parseFloat(row.m_6) : 0;

	console.log("total sum", total);

	if(total > row.planned){
		row[month] = null;
		frm.refresh_field("operational_plan_detail_one1")
		frappe.show_alert("Each month sum should be lower than the planned")
	}
}

function prohobitUpperSum2(frm, cdt, cdn, month) {
	var total = 0;
	var row = locals[cdt][cdn];
	console.log("localssss for each month", row);

	// Calculate the total
	total += row.m_7 ? parseFloat(row.m_7) : 0;
	total += row.m_8 ? parseFloat(row.m_8) : 0;
	total += row.m_9 ? parseFloat(row.m_9) : 0;
	total += row.m_10 ? parseFloat(row.m_10) : 0;
	total += row.m_11 ? parseFloat(row.m_11) : 0;
	total += row.m_12 ? parseFloat(row.m_12) : 0;

	console.log("total sum", total);

	if(total > row.planned){
		row[month] = null;
		frm.refresh_field("operational_plan_detail_two2")
		frappe.show_alert("Each month sum should be lower than the planned")
	}
}

frappe.ui.form.on('Operational Plan Detail', {
	before_task_list_remove: function(frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		var removed_activity = row.activity;
		console.log("removed task id", removed_activity);

		var operational_plan_detail_one1 = frm.doc.operational_plan_detail_one1;
		var operational_plan_detail_two2 = frm.doc.operational_plan_detail_two2

		deleteRow(frm, removed_activity, "operational_plan_detail_one1");
		deleteRow(frm, removed_activity, "operational_plan_detail_two2");

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





//auto assign the start and end date table for the monthly plan use
frappe.ui.form.on("Operational Plan", {
	end_date: function(frm, cdt, cdn) {
		if (frm.doc.start_date && frm.doc.end_date) {
			frm.doc.operational_plan_months_date_data = [];
			var start_date = frm.doc.start_date;
			var end_date = frm.doc.end_date;

			// Loop through months
			for (var i = 0; i < 12; i++) {
				var row = frm.add_child("operational_plan_months_date_data")
				row.month_no = i + 1;
				if (i == 0) {
					console.log("first try")
					row.start_date = start_date;
					row.end_date = frappe.datetime.add_days(row.start_date, 29);

				} else {
					console.log("not first try")
					row.start_date = frappe.datetime.add_days(frm.doc.operational_plan_months_date_data[i - 1].end_date, 1);
					row.end_date = frappe.datetime.add_days(row.start_date, 29);

				}


				console.log("start date for month " + i + " is " + row.start_date);
				console.log("end date for month " + i + " is " + row.end_date);

				// Check if end date is in the past
				if (row.end_date > end_date) {
					console.log("now exited")
					row.end_date = end_date;
					break;
				}

			}
			console.log("operational_plan_months_date_data", frm.doc.operational_plan_months_date_data)

			frm.refresh_field("operational_plan_months_date_data"); // Move this line out of the loop
		}
	}

});

//calculation operatioanl plan detail table
frappe.ui.form.on('Operational Plan Detail', {
	to_date_executed: function(frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		console.log("rowwws", row)
		row.remaining_planned_qty = (row.actual_quantity || 0) - (row.to_date_executed || 0);
		frm.refresh_field("task_list")
	}
});

//preventing assigning  a planed quantity which is greter than the remining
frappe.ui.form.on('Operational Plan Detail', {
	planned: function(frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		console.log("rowwws", row)
		if (row.planned > row.remaining_planned_qty) {
			row.planned = null;
			frappe.show_alert("The palnned quantity shluld be less than the remaining!")
		}
		frm.refresh_field("task_list")
	}
});




//calculate the machinery plan fro the detail one
frappe.ui.form.on('Operational Plan Detail One1', {
	m_1: function(frm, cdt, cdn) {
		calculateMachineryValues(frm, cdt, cdn, "1");
		calculateMaterialValues(frm, cdt, cdn, "1");
		calculateManpowerValues(frm, cdt, cdn, "1");
	},
	m_2: function(frm, cdt, cdn) {
		calculateMachineryValues(frm, cdt, cdn, "2");
		calculateMaterialValues(frm, cdt, cdn, "2");
		calculateManpowerValues(frm, cdt, cdn, "2");
	},
	m_3: function(frm, cdt, cdn) {
		calculateMachineryValues(frm, cdt, cdn, "3");
		calculateMaterialValues(frm, cdt, cdn, "3");
		calculateManpowerValues(frm, cdt, cdn, "3");
	},
	m_4: function(frm, cdt, cdn) {
		calculateMachineryValues(frm, cdt, cdn, "4");
		calculateMaterialValues(frm, cdt, cdn, "4");
		calculateManpowerValues(frm, cdt, cdn, "4");
	},
	m_5: function(frm, cdt, cdn) {
		calculateMachineryValues(frm, cdt, cdn, "5");
		calculateMaterialValues(frm, cdt, cdn, "5");
		calculateManpowerValues(frm, cdt, cdn, "5");
	},
	m_6: function(frm, cdt, cdn) {
		calculateMachineryValues(frm, cdt, cdn, "6");
		calculateMaterialValues(frm, cdt, cdn, "6");
		calculateManpowerValues(frm, cdt, cdn, "6");
	},
});

frappe.ui.form.on('Operational Plan Detail Two2', {
	m_7: function(frm, cdt, cdn) {
		calculateMachineryValuesB(frm, cdt, cdn, "7");
		calculateMaterialValuesB(frm, cdt, cdn, "7");
		calculateManpowerValuesB(frm, cdt, cdn, "7");
	},
	m_8: function(frm, cdt, cdn) {
		calculateMachineryValuesB(frm, cdt, cdn, "8");
		calculateMaterialValuesB(frm, cdt, cdn, "8");
		calculateManpowerValuesB(frm, cdt, cdn, "8");
	},
	m_9: function(frm, cdt, cdn) {
		calculateMachineryValuesB(frm, cdt, cdn, "9");
		calculateMaterialValuesB(frm, cdt, cdn, "9");
		calculateManpowerValuesB(frm, cdt, cdn, "9");
	},
	m_10: function(frm, cdt, cdn) {
		calculateMachineryValuesB(frm, cdt, cdn, "10");
		calculateMaterialValuesB(frm, cdt, cdn, "10");
		calculateManpowerValuesB(frm, cdt, cdn, "10");
	},
	m_11: function(frm, cdt, cdn) {
		calculateMachineryValuesB(frm, cdt, cdn, "11");
		calculateMaterialValuesB(frm, cdt, cdn, "11");
		calculateManpowerValuesB(frm, cdt, cdn, "11");
	},
	m_12: function(frm, cdt, cdn) {
		calculateMachineryValuesB(frm, cdt, cdn, "12");
		calculateMaterialValuesB(frm, cdt, cdn, "12");
		calculateManpowerValuesB(frm, cdt, cdn, "12");
	},
});

function calculateMaterialValues(frm, cdt, cdn, m) {
	var materialAggregatedValues = {};

	// Iterate through the material1 array
	for (var i = 0; i < frm.doc.material1.length; i++) {
		var materialItem = frm.doc.material1[i];
		console.log("material item", materialItem);
		var itemName = materialItem.item1;
		var activityMonthQuantity = 0;

		for (var j = 0; j < frm.doc.operational_plan_detail_one1.length; j++) {
			var monthData = frm.doc.operational_plan_detail_one1[j];
			if (monthData.activity == materialItem.activity) {
				activityMonthQuantity = monthData["m_" + m] || 0;
				break;
			}
		}
		console.log("month quantity", activityMonthQuantity);

		if (materialAggregatedValues[itemName]) {
			materialAggregatedValues[itemName] += activityMonthQuantity * materialItem.qty;
		} else {
			materialAggregatedValues[itemName] = activityMonthQuantity * materialItem.qty;
		}
	}
	console.log("material aggregate", materialAggregatedValues);

	for (var i = 0; i < frm.doc.material_detail_summarized_by_month_section_a.length; i++) {
		var currentItem = frm.doc.material_detail_summarized_by_month_section_a[i];
		console.log("cureiejireb", currentItem)
		var itemName = currentItem.item;
		var aggregatedValueForType = materialAggregatedValues[itemName];

		if (aggregatedValueForType) {
			currentItem["op_m_m" + m] = aggregatedValueForType;
		} else {
			currentItem["op_m_m" + m] = 0;
		}
	}

	frm.refresh_field("material_detail_summarized_by_month_section_a");
}
function calculateMaterialValuesB(frm, cdt, cdn, m) {
	var materialAggregatedValues = {};

	// Iterate through the material1 array
	for (var i = 0; i < frm.doc.material1.length; i++) {
		var materialItem = frm.doc.material1[i];
		console.log("material item", materialItem);
		var itemName = materialItem.item1;
		var activityMonthQuantity = 0;

		for (var j = 0; j < frm.doc.operational_plan_detail_two2.length; j++) {
			var monthData = frm.doc.operational_plan_detail_two2[j];
			if (monthData.activity == materialItem.activity) {
				activityMonthQuantity = monthData["m_" + m] || 0;
				break;
			}
		}
		console.log("month quantity", activityMonthQuantity);

		if (materialAggregatedValues[itemName]) {
			materialAggregatedValues[itemName] += activityMonthQuantity * materialItem.qty;
		} else {
			materialAggregatedValues[itemName] = activityMonthQuantity * materialItem.qty;
		}
	}
	console.log("material aggregate", materialAggregatedValues);

	for (var i = 0; i < frm.doc.material_detail_summarized_by_month_section_b.length; i++) {
		var currentItem = frm.doc.material_detail_summarized_by_month_section_b[i];
		console.log("cureiejireb", currentItem)
		var itemName = currentItem.item;
		var aggregatedValueForType = materialAggregatedValues[itemName];

		if (aggregatedValueForType) {
			currentItem["op_m_m" + m] = aggregatedValueForType;
		} else {
			currentItem["op_m_m" + m] = 0;
		}
	}

	frm.refresh_field("material_detail_summarized_by_month_section_b");
}

function calculateManpowerValues(frm, cdt, cdn, m) {
	var manpowerAggregatedValues = {};

	// Iterate through the manpower array
	for (var i = 0; i < frm.doc.manpower1.length; i++) {
		var manpowerItem = frm.doc.manpower1[i];
		console.log("manp ower item", manpowerItem)
		var job_title = manpowerItem.job_title;
		var activityMonthQuantity = 0;

		for (var j = 0; j < frm.doc.operational_plan_detail_one1.length; j++) {
			var monthData = frm.doc.operational_plan_detail_one1[j];
			if (monthData.activity == manpowerItem.activity) {
				activityMonthQuantity = monthData["m_" + m] || 0;
				break;
			}
		}
		console.log("monthe qunttity", activityMonthQuantity)

		if (manpowerAggregatedValues[job_title]) {
			manpowerAggregatedValues[job_title] += activityMonthQuantity * (manpowerItem.uf * manpowerItem.li_permanent * manpowerItem.mp_number) / manpowerItem.productivity;
		} else {
			manpowerAggregatedValues[job_title] = activityMonthQuantity * (manpowerItem.uf * manpowerItem.li_permanent * manpowerItem.mp_number) / manpowerItem.productivity;
		}
	}
	console.log("manpoere aggrirgate", manpowerAggregatedValues);

	for (var i = 0; i < frm.doc.manpower_detail_summarized_by_month_section_a.length; i++) {
		var currentItem = frm.doc.manpower_detail_summarized_by_month_section_a[i];
		var job_title = currentItem.job_title;
		var aggregatedValueForType = manpowerAggregatedValues[job_title];

		if (aggregatedValueForType) {
			currentItem["op_mp_m" + m] = aggregatedValueForType;
		} else {
			currentItem["op_mp_m" + m] = 0;
		}
	}

	frm.refresh_field("manpower_detail_summarized_by_month_section_a");
}
function calculateManpowerValuesB(frm, cdt, cdn, m) {
	var manpowerAggregatedValues = {};

	// Iterate through the manpower array
	for (var i = 0; i < frm.doc.manpower1.length; i++) {
		var manpowerItem = frm.doc.manpower1[i];
		console.log("manp ower item", manpowerItem)
		var job_title = manpowerItem.job_title;
		var activityMonthQuantity = 0;

		for (var j = 0; j < frm.doc.operational_plan_detail_two2.length; j++) {
			var monthData = frm.doc.operational_plan_detail_two2[j];
			if (monthData.activity == manpowerItem.activity) {
				activityMonthQuantity = monthData["m_" + m] || 0;
				break;
			}
		}
		console.log("monthe qunttity", activityMonthQuantity)

		if (manpowerAggregatedValues[job_title]) {
			manpowerAggregatedValues[job_title] += activityMonthQuantity * (manpowerItem.uf * manpowerItem.li_permanent * manpowerItem.mp_number) / manpowerItem.productivity;
		} else {
			manpowerAggregatedValues[job_title] = activityMonthQuantity * (manpowerItem.uf * manpowerItem.li_permanent * manpowerItem.mp_number) / manpowerItem.productivity;
		}
	}
	console.log("manpoere aggrirgate", manpowerAggregatedValues);

	for (var i = 0; i < frm.doc.manpower_detail_summarized_by_month_section_b.length; i++) {
		var currentItem = frm.doc.manpower_detail_summarized_by_month_section_b[i];
		var job_title = currentItem.job_title;
		var aggregatedValueForType = manpowerAggregatedValues[job_title];

		if (aggregatedValueForType) {
			currentItem["op_mp_m" + m] = aggregatedValueForType;
		} else {
			currentItem["op_mp_m" + m] = 0;
		}
	}

	frm.refresh_field("manpower_detail_summarized_by_month_section_b");
}

function calculateMachineryValues(frm, cdt, cdn, m) {
	var machineryAggregatedValues = {};

	// Iterate through the machinery array
	for (var i = 0; i < frm.doc.machinery.length; i++) {
		var machineryItem = frm.doc.machinery[i];
		var type = machineryItem.type;
		var activityMonthQuantity = 0;

		for (var j = 0; j < frm.doc.operational_plan_detail_one1.length; j++) {
			var monthData = frm.doc.operational_plan_detail_one1[j];
			if (monthData.activity == machineryItem.activity) { // Compare activity
				activityMonthQuantity = monthData["m_" + m] || 0;
				console.log("activity month quantity", activityMonthQuantity)
				break;
			}
		}

		if (machineryAggregatedValues[type]) {
			// If type already exists in machineryAggregatedValues, add the value
			machineryAggregatedValues[type] += activityMonthQuantity * machineryItem.uf * machineryItem.efficency * machineryItem.item_no / machineryItem.productivity;
		} else {
			// If type doesn't exist, assign the value
			machineryAggregatedValues[type] = activityMonthQuantity * machineryItem.uf * machineryItem.efficency * machineryItem.item_no / machineryItem.productivity;
		}
	}
	console.log("AGGRICAGE", machineryAggregatedValues)

	// Iterate through the machinary_detail_summarized_by_month_section_a array
	for (var i = 0; i < frm.doc.machinary_detail_summarized_by_month_section_a.length; i++) {
		var currentItem = frm.doc.machinary_detail_summarized_by_month_section_a[i];
		var type = currentItem.type;
		var aggregatedValueForType = machineryAggregatedValues[type];

		if (aggregatedValueForType) {
			currentItem["op_e_m" + m] = aggregatedValueForType;
		} else {
			currentItem["op_e_m" + m] = 0; // or handle the case where there is no aggregated value for the type
		}
	}

	frm.refresh_field("machinary_detail_summarized_by_month_section_a");
}
function calculateMachineryValuesB(frm, cdt, cdn, m) {
	var machineryAggregatedValues = {};

	// Iterate through the machinery array
	for (var i = 0; i < frm.doc.machinery.length; i++) {
		var machineryItem = frm.doc.machinery[i];
		var type = machineryItem.type;
		var activityMonthQuantity = 0;

		for (var j = 0; j < frm.doc.operational_plan_detail_two2.length; j++) {
			var monthData = frm.doc.operational_plan_detail_two2[j];
			if (monthData.activity == machineryItem.activity) { // Compare activity
				activityMonthQuantity = monthData["m_" + m] || 0;
				console.log("activity month quantity", activityMonthQuantity)
				break;
			}
		}

		if (machineryAggregatedValues[type]) {
			// If type already exists in machineryAggregatedValues, add the value
			machineryAggregatedValues[type] += activityMonthQuantity * machineryItem.uf * machineryItem.efficency * machineryItem.item_no / machineryItem.productivity;
		} else {
			// If type doesn't exist, assign the value
			machineryAggregatedValues[type] = activityMonthQuantity * machineryItem.uf * machineryItem.efficency * machineryItem.item_no / machineryItem.productivity;
		}
	}
	console.log("AGGRICAGE", machineryAggregatedValues)

	// Iterate through the machinary_detail_summarized_by_month_section_a array
	for (var i = 0; i < frm.doc.machinary_detail_summarized_by_month_section_b.length; i++) {
		var currentItem = frm.doc.machinary_detail_summarized_by_month_section_b[i];
		var type = currentItem.type;
		var aggregatedValueForType = machineryAggregatedValues[type];

		if (aggregatedValueForType) {
			currentItem["op_e_m" + m] = aggregatedValueForType;
		} else {
			currentItem["op_e_m" + m] = 0; // or handle the case where there is no aggregated value for the type
		}
	}

	frm.refresh_field("machinary_detail_summarized_by_month_section_b");
}



// frappe.ui.form.on('Operational Plan Detail Two2', {
// 	m_7: function(frm, cdt, cdn) {
// 		calculateMachineryValuesB(frm, cdt, cdn, "7");
// 		calculateMaterialValuesB(frm, cdt, cdn, "7");
// 		calculateManpowerValuesB(frm, cdt, cdn, "7");
// 	},
// 	m_8: function(frm, cdt, cdn) {
// 		calculateMachineryValuesB(frm, cdt, cdn, "8");
// 		calculateMaterialValuesB(frm, cdt, cdn, "8");
// 		calculateManpowerValuesB(frm, cdt, cdn, "8");
// 	},
// 	m_9: function(frm, cdt, cdn) {
// 		calculateMachineryValuesB(frm, cdt, cdn, "9");
// 		calculateMaterialValuesB(frm, cdt, cdn, "9");
// 		calculateManpowerValuesB(frm, cdt, cdn, "9");
// 	},
// 	m_10: function(frm, cdt, cdn) {
// 		calculateMachineryValuesB(frm, cdt, cdn, "10");
// 		calculateMaterialValuesB(frm, cdt, cdn, "10");
// 		calculateManpowerValuesB(frm, cdt, cdn, "10");
// 	},
// 	m_11: function(frm, cdt, cdn) {
// 		calculateMachineryValuesB(frm, cdt, cdn, "11");
// 		calculateMaterialValuesB(frm, cdt, cdn, "11");
// 		calculateManpowerValuesB(frm, cdt, cdn, "11");
// 	},
// 	m_12: function(frm, cdt, cdn) {
// 		calculateMachineryValuesB(frm, cdt, cdn, "12");
// 		calculateMaterialValuesB(frm, cdt, cdn, "12");
// 		calculateManpowerValuesB(frm, cdt, cdn, "12");
// 	},
// });

//calculating duration
frappe.ui.form.on('Operational Plan', {
	end_date: function(frm) {
		if (frm.doc.start_date && frm.doc.end_date) {
			var start_date = frappe.datetime.str_to_obj(frm.doc.start_date);
			var end_date = frappe.datetime.str_to_obj(frm.doc.end_date);

			var time_difference = end_date.getTime() - start_date.getTime();
			var day_difference = Math.floor(time_difference / (1000 * 60 * 60 * 24)); // Calculate days

			frm.set_value('duration', day_difference);
			console.log("duration", day_difference);
			frm.refresh_field("duration");
			if (day_difference < 180) {
				frm.set_df_property("operational_plan_detail_two2", "hidden", 1);
				frm.set_df_property("manpower_detail_summarized_by_month_section_b", "hidden", 1);
				frm.set_df_property("machinary_detail_summarized_by_month_section_b", "hidden", 1);
				frm.set_df_property("material_detail_summarized_by_month_section_b", "hidden", 1);

			}
			else {
				frm.set_df_property("operational_plan_detail_two2", "hidden", 0);
				frm.set_df_property("manpower_detail_summarized_by_month_section_b", "hidden", 0);
				frm.set_df_property("machinary_detail_summarized_by_month_section_b", "hidden", 0);
				frm.set_df_property("material_detail_summarized_by_month_section_b", "hidden", 0);
			}
			//calculating th months
			var start_month = start_date.getMonth() + 1; // Months are 0-indexed, so we add 1
			var end_month = end_date.getMonth() + 1;
			var month_numbers = [];

			if (end_date.getFullYear() > start_date.getFullYear()) {
				for (var i = start_month; i <= 12; i++) {
					month_numbers.push(i);
				}
				for (var i = 1; i <= end_month; i++) {
					month_numbers.push(i);
				}
			} else {
				for (var i = start_month; i <= end_month; i++) {
					month_numbers.push(i);
				}
			}

			// Add the month numbers to the table
			var table = frm.doc.month_numbers;
			frm.doc.month_numbers = []; // Clear existing entries
			$.each(month_numbers, function(i, month_number) {
				var row = frappe.model.add_child(frm.doc, 'Operational Plan Month Numbers', 'month_numbers');
				row.month = month_number;
			});

			frm.refresh_field("month_numbers");
		}
	},

	start_date: function(frm) {
		if (frm.doc.start_date && frm.doc.end_date) {
			var start_date = frappe.datetime.str_to_obj(frm.doc.start_date);
			var end_date = frappe.datetime.str_to_obj(frm.doc.end_date);

			var time_difference = end_date.getTime() - start_date.getTime();
			var day_difference = Math.floor(time_difference / (1000 * 60 * 60 * 24)); // Calculate days

			frm.set_value('duration', day_difference);
			console.log("duration", day_difference);
			frm.refresh_field("duration");
			if (day_difference < 180) {
				frm.set_df_property("operational_plan_detail_two2", "hidden", 1);
				frm.set_df_property("manpower_detail_summarized_by_month_section_b", "hidden", 1);
				frm.set_df_property("machinary_detail_summarized_by_month_section_b", "hidden", 1);
				frm.set_df_property("material_detail_summarized_by_month_section_b", "hidden", 1);

			}
			else {
				frm.set_df_property("operational_plan_detail_two2", "hidden", 0);
				frm.set_df_property("manpower_detail_summarized_by_month_section_b", "hidden", 0);
				frm.set_df_property("machinary_detail_summarized_by_month_section_b", "hidden", 0);
				frm.set_df_property("material_detail_summarized_by_month_section_b", "hidden", 0);
			}
			//calculating th months
			var start_month = start_date.getMonth() + 1; // Months are 0-indexed, so we add 1
			var end_month = end_date.getMonth() + 1;
			var month_numbers = [];

			if (end_date.getFullYear() > start_date.getFullYear()) {
				for (var i = start_month; i <= 12; i++) {
					month_numbers.push(i);
				}
				for (var i = 1; i <= end_month; i++) {
					month_numbers.push(i);
				}
			} else {
				for (var i = start_month; i <= end_month; i++) {
					month_numbers.push(i);
				}
			}

			// Add the month numbers to the table
			var table = frm.doc.month_numbers;
			frm.doc.month_numbers = []; // Clear existing entries
			$.each(month_numbers, function(i, month_number) {
				var row = frappe.model.add_child(frm.doc, 'Operational Plan Month Numbers', 'month_numbers');
				row.month = month_number;
			});

			frm.refresh_field("month_numbers");
		}
	}
});

frappe.ui.form.on('Operational Plan', {
	onload: function(frm){
		var start_date = frappe.datetime.str_to_obj(frm.doc.start_date);
		var end_date = frappe.datetime.str_to_obj(frm.doc.end_date);

		var time_difference = end_date.getTime() - start_date.getTime();
		var day_difference = Math.floor(time_difference / (1000 * 60 * 60 * 24)); // Calculate days
		if(frm.doc.duration){
			if (day_difference < 180) {
				frm.set_df_property("operational_plan_detail_two2", "hidden", 1);
				frm.set_df_property("manpower_detail_summarized_by_month_section_b", "hidden", 1);
				frm.set_df_property("machinary_detail_summarized_by_month_section_b", "hidden", 1);
				frm.set_df_property("material_detail_summarized_by_month_section_b", "hidden", 1);

			}
			else {
				frm.set_df_property("operational_plan_detail_two2", "hidden", 0);
				frm.set_df_property("manpower_detail_summarized_by_month_section_b", "hidden", 0);
				frm.set_df_property("machinary_detail_summarized_by_month_section_b", "hidden", 0);
				frm.set_df_property("material_detail_summarized_by_month_section_b", "hidden", 0);
			}
		}
	}
})



//fetching the task for all other tables
frappe.ui.form.on('Operational Plan Detail', {
	activity: function(frm, cdt, cdn) {
		if (!frm.doc.project) {
			show_alert("Please select project first to effectively continue.");
			cur_frm.clear_table("task_list");
			cur_frm.refresh_fields("task_list");
			return;
		}
		var row = locals[cdt][cdn];
		var eqTable = frappe.model.add_child(frm.doc, "Operational Plan Machinery Detail", "machinery");
		eqTable.activity = frm.doc.task_list[0].activity;
		eqTable.productivity = frm.doc.task_list[0].productivity;
		eqTable.subject = frm.doc.task_list[0].activity_name;
		frm.refresh_field("machinery")
	}
});

//calculate the total machinery cost for each equipment
frappe.ui.form.on('Operational Plan Machinery Detail', {
	qty: function(frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		if (row.qty && row.rental_rate) {
			row.total_hourly_cost = row.rental_rate * row.qty
		}
		if (row.total_hourly_cost && row.productivity) {
			row.machinery_cost = row.total_hourly_cost / row.productivity;
		}
		console.log("realy ork",)
		row.eqt_hour = (row.uf || 1 * row.efficiency || 1 * row.quantity * row.item_no) / row.productivity
		frm.refresh_field("machinery");
	}
});


//calculating amount
frappe.ui.form.on('Operational Plan Detail', {
	planned: function(frm, cdt, cdn) {
		var row = locals[cdt][cdn];

		if (row.planned && row.rate) {
			row.amount = row.planned * row.rate;
			console.log(row.amount)
			frm.refresh_field("machinary_detail_summarized_by_month_section_a")
		}
	}
});

//assign value to the Operational Plan Detail two
frappe.ui.form.on('Operational Plan Detail One1', {
	m_1: function(frm, cdt, cdn) {
		AssignPlannedQuantityToOperationalPlanDetailTwo(frm, cdt, cdn);
	},
	m_2: function(frm, cdt, cdn) {
		AssignPlannedQuantityToOperationalPlanDetailTwo(frm, cdt, cdn);
	},
	m_3: function(frm, cdt, cdn) {
		AssignPlannedQuantityToOperationalPlanDetailTwo(frm, cdt, cdn);
	},
	m_4: function(frm, cdt, cdn) {
		AssignPlannedQuantityToOperationalPlanDetailTwo(frm, cdt, cdn);
	},
	m_5: function(frm, cdt, cdn) {
		AssignPlannedQuantityToOperationalPlanDetailTwo(frm, cdt, cdn);
	},
	m_6: function(frm, cdt, cdn) {
		AssignPlannedQuantityToOperationalPlanDetailTwo(frm, cdt, cdn);
	}
});
//calculate the planned for operatinal plan detail two
function AssignPlannedQuantityToOperationalPlanDetailTwo(frm, cdt, cdn) {
	var total = 0;
	var row = locals[cdt][cdn];
	console.log("localssss", row);

	// Calculate the total
	total += row.m_1 ? parseFloat(row.m_1) : 0;
	total += row.m_2 ? parseFloat(row.m_2) : 0;
	total += row.m_3 ? parseFloat(row.m_3) : 0;
	total += row.m_4 ? parseFloat(row.m_4) : 0;
	total += row.m_5 ? parseFloat(row.m_5) : 0;
	total += row.m_6 ? parseFloat(row.m_6) : 0;

	console.log("total sum", total);

	var matchingRow;
	frm.doc.operational_plan_detail_two2.forEach(function(item) {
		if (item.activity == row.activity) {
			matchingRow = item;
		}
	});

	if (matchingRow) {
		matchingRow.planned = row.planned - total;
		frm.refresh_field("operational_plan_detail_two2");
	} else {
		console.log("Matching row not found");
	}
}



//assign value to the machinery Plan Detail one
frappe.ui.form.on('Operational Plan Machinery Detail Summarized One', {
	op_e_m1: function(frm, cdt, cdn) {
		AssignPlannedQuantityToOperationalPlanMachineryDetail(frm, cdt, cdn);
	},
	op_e_m2: function(frm, cdt, cdn) {
		AssignPlannedQuantityToOperationalPlanMachineryDetail(frm, cdt, cdn);
	},
	op_e_m3: function(frm, cdt, cdn) {
		AssignPlannedQuantityToOperationalPlanMachineryDetail(frm, cdt, cdn);
	},
	op_e_m4: function(frm, cdt, cdn) {
		AssignPlannedQuantityToOperationalPlanMachineryDetail(frm, cdt, cdn);
	},
	op_e_m5: function(frm, cdt, cdn) {
		AssignPlannedQuantityToOperationalPlanMachineryDetail(frm, cdt, cdn);
	},
	op_e_m6: function(frm, cdt, cdn) {
		AssignPlannedQuantityToOperationalPlanMachineryDetail(frm, cdt, cdn);
	}
});
//calculate the planned for operatinal plan detail one
function AssignPlannedQuantityToOperationalPlanMachineryDetail(frm, cdt, cdn) {
	var total = 0;
	var row = locals[cdt][cdn];
	console.log("locals", row);
	// Calculate the total
	total += row.op_e_m1 ? parseFloat(row.op_e_m1) : 0;
	total += row.op_e_m2 ? parseFloat(row.op_e_m2) : 0;
	total += row.op_e_m3 ? parseFloat(row.op_e_m3) : 0;
	total += row.op_e_m4 ? parseFloat(row.op_e_m4) : 0;
	total += row.op_e_m5 ? parseFloat(row.op_e_m5) : 0;
	total += row.op_e_m6 ? parseFloat(row.op_e_m6) : 0;

	console.log("total sum", total);
	var table = frm.doc.operational_plan_detail_two2[0];
	console.log("table", frm.doc.machinery[0])
	frm.refresh_field("machinary_detail_summarized_by_month_section_b")

}

//assign value to the Operational Plan Detail two
frappe.ui.form.on('Operational Plan Manpower Detail Summarized One', {
	op_mp_m1: function(frm, cdt, cdn) {
		AssignPlannedQuantityToManpower(frm, cdt, cdn);
	},
	op_mp_m2: function(frm, cdt, cdn) {
		AssignPlannedQuantityToManpower(frm, cdt, cdn);
	},
	op_mp_m3: function(frm, cdt, cdn) {
		AssignPlannedQuantityToManpower(frm, cdt, cdn);
	},
	op_mp_m4: function(frm, cdt, cdn) {
		AssignPlannedQuantityToManpower(frm, cdt, cdn);
	},
	op_mp_m5: function(frm, cdt, cdn) {
		AssignPlannedQuantityToManpower(frm, cdt, cdn);
	},
	op_mp_m6: function(frm, cdt, cdn) {
		AssignPlannedQuantityToManpower(frm, cdt, cdn);
	}
});
//calculate the planned for operatinal plan detail two
function AssignPlannedQuantityToManpower(frm, cdt, cdn) {
	var total = 0;
	var row = locals[cdt][cdn];
	console.log("locals", row);
	// Calculate the total
	total += row.op_mp_m1 ? parseFloat(row.op_mp_m1) : 0;
	total += row.op_mp_m2 ? parseFloat(row.op_mp_m2) : 0;
	total += row.op_mp_m3 ? parseFloat(row.op_mp_m3) : 0;
	total += row.op_mp_m4 ? parseFloat(row.op_mp_m4) : 0;
	total += row.op_mp_m5 ? parseFloat(row.op_mp_m5) : 0;
	total += row.op_mp_m6 ? parseFloat(row.op_mp_m6) : 0;

	console.log("total sum", total);
	frm.refresh_field("manpower_detail_summarized_by_month_section_b")

}



//assign value to the Operational Plan Detail two
frappe.ui.form.on('Operational Plan Material Detail Summarized One', {
	op_m_m1: function(frm, cdt, cdn) {
		AssignPlannedQuantityToMaterial(frm, cdt, cdn);
	},
	op_m_m2: function(frm, cdt, cdn) {
		AssignPlannedQuantityToMaterial(frm, cdt, cdn);
	},
	op_m_m3: function(frm, cdt, cdn) {
		AssignPlannedQuantityToMaterial(frm, cdt, cdn);
	},
	op_m_m4: function(frm, cdt, cdn) {
		AssignPlannedQuantityToMaterial(frm, cdt, cdn);
	},
	op_m_m5: function(frm, cdt, cdn) {
		AssignPlannedQuantityToMaterial(frm, cdt, cdn);
	},
	op_m_m6: function(frm, cdt, cdn) {
		AssignPlannedQuantityToMaterial(frm, cdt, cdn);
	}
});
//calculate the planned for operatinal plan detail two
function AssignPlannedQuantityToMaterial(frm, cdt, cdn) {
	var total = 0;
	var row = locals[cdt][cdn];
	console.log("locals", row);
	// Calculate the total
	total += row.op_m_m1 ? parseFloat(row.op_m_m1) : 0;
	total += row.op_m_m2 ? parseFloat(row.op_m_m2) : 0;
	total += row.op_m_m3 ? parseFloat(row.op_m_m3) : 0;
	total += row.op_m_m4 ? parseFloat(row.op_m_m4) : 0;
	total += row.op_m_m5 ? parseFloat(row.op_m_m5) : 0;
	total += row.op_m_m6 ? parseFloat(row.op_m_m6) : 0;

	console.log("total sum", total);
	frm.refresh_field("material_detail_summarized_by_month_section_b")

}


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
					"project": frm.doc.project,
					"is_group": 0
				}
			}
		});
	}
});

frappe.ui.form.on("Operational Plan", {
	onload: function(frm, cdt, cdn) {
		if (frm.doc.project) {
			var d = locals[cdt][cdn];
			frm.set_query("activity", "task_list", function() {
				return {
					"filters": {
						"project": frm.doc.project,
						"is_group": 0
					}
				}
			});
		}
	}
});



function AutoPopulate(frm, cdt, cdn) {

	var date1 = frm.doc.start_date;
	var date2 = frm.doc.end_date;

	var d = locals[cdt][cdn];
	var activity = frappe.model.get_value(d.doctype, d.name, "activity");

	// if (activity && date1 && date2) {
	// 	frappe.call({
	// 		method: "erpnext.timesheet_sum_of_executed_qty.get_executed_quantity_from_timesheet",
	// 		args: { activity: activity, date1: date1, date2: date2 }
	// 	}).done((r) => {
	// 		if (r.message.length >= 1)
	// 			if (r.message[0]) {

	// 				var to_date_executed = r.message[0];
	// 				// frappe.model.set_value(d.doctype, d.name, "to_date_executed", (parseFloat(to_date_executed) || 0));
	// 				var quantity = frappe.model.get_value(d.doctype, d.name, "quantity");
	// 				var rate = frappe.model.get_value(d.doctype, d.name, "rate");
	// 				var amount = quantity * rate;
	// 				var remaining_planned_qty = quantity - parseFloat(to_date_executed);
	// 				frappe.model.set_value(d.doctype, d.name, "remaining_planned_qty", remaining_planned_qty);
	// 				frappe.model.set_value(d.doctype, d.name, "amount", amount);
	// 				frappe.model.set_value(d.doctype, d.name, "actual_quantity", quantity);
	// 				frappe.model.set_value(d.doctype, d.name, "to_date_executed", 0);


	// 			}
	// 	})

	// 	refresh_field("task_list");
	// }

	// frm.doc.operational_plan_detail_one1 = []
	// frm.doc.operational_plan_detail_two2 = []

	frm.doc.machinery = []
	frm.doc.manpower1 = []
	frm.doc.material1 = []

	frm.doc.machinery_detail_summerized = []
	// frm.doc.machinary_detail_summarized_by_month_section_a = []
	// frm.doc.machinary_detail_summarized_by_month_section_b = []

	frm.doc.manpower_detail_summerized = []
	// frm.doc.manpower_detail_summarized_by_month_section_a = []
	// frm.doc.manpower_detail_summarized_by_month_section_b = []

	frm.doc.material_detail_summerized = []
	// frm.doc.material_detail_summarized_by_month_section_a = []
	// frm.doc.material_detail_summarized_by_month_section_b = []

	var allMachinesMap = new Map();
	var allManpowerMap = new Map();
	var allMaterialMap = new Map();



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
	allManpowerMap.clear();
	allMaterialMap.clear();

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
					entry.item_no = e.qty;
					console.log("eee", e);
					entry.subject = subject;

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
							entry.eqt_hour = (entry.uf * entry.efficency * entry.qty * entry.item_no) / entry.productivity;
							frm.refresh_field("machinery")

						}
					})





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

						var machinery_exist1 = false;
						var machinery_exist2 = false;

						$.each(frm.doc.operational_plan_detail_one1, function(index, row) {
							console.log("eeeee", e)
							if (row.activity === e.parent) {
								machinery_exist1 = true;
								return false; // Exit the loop if activity is found
							}
						});
						$.each(frm.doc.operational_plan_detail_one1, function(index, row) {
							if (row.activity === e.parent) {
								machinery_exist2 = true;
								return false; // Exit the loop if activity is found
							}
						});

						console.log("machinery exist 1", machinery_exist1)
						console.log("machinery exist 2", machinery_exist2)

						if (!machinery_exist1) {
							var newEntrySummerized_section_a = frm.add_child("machinary_detail_summarized_by_month_section_a");
							newEntrySummerized_section_a.id_mac = e.id_mac;
							newEntrySummerized_section_a.activity = e.parent;

							newEntrySummerized_section_a.type = e.type;
						}


						if (!machinery_exist2) {
							var newEntrySummerized_section_b = frm.add_child("machinary_detail_summarized_by_month_section_b");
							newEntrySummerized_section_b.id_mac = e.id_mac;
							newEntrySummerized_section_b.activity = e.parent;

							newEntrySummerized_section_b.type = e.type;
						}
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
				refresh_field("machinary_detail_summarized_by_month_section_a");
				refresh_field("machinary_detail_summarized_by_month_section_b");
			})
		}

		//Script to populate child tables for manpower
		if (taskParent) {
			frappe.call({
				method: "erpnext.manpower_populate_api.get_manpower_by_task",
				args: { parent: taskParent }
			}).done((r) => {
				$.each(r.message, function(_i, e) {
					console.log("mppppe eeeee", e)
					var entry = frm.add_child("manpower1");
					entry.id_map = e.id_map;
					entry.job_title = e.job_title;
					entry.activity = taskParent;
					entry.subject = subject;
					// entry.productivity = frm.doc.task_list[0].productivity;

					entry.qty = e.qty * planned_qty;
					entry.li_permanent = e.li_permanent;
					entry.mp_number = parseFloat(e.qty);
					console.log("mppppppp number", entry.mp_number)
					entry.uf = e.uf;
					entry.efficency = e.efficency;
					entry.hourly_cost = e.hourly_cost;
					entry.mp_hour = entry.uf
					grand_total_cost_for_manpower += entry.qty * entry.hourly_cost;
					number_of_items_for_manpower += 1;
					sum_of_unit_rate_for_manpower += entry.hourly_cost;
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
							entry.act_quantity = response.message[0].quantity;
							entry.productivity = response.message[0].productivity;

							entry.mp_hour = (entry.uf * entry.li_permanent * entry.mp_number * entry.act_quantity) / entry.productivity;
							entry.act_quantity = entry.act_quantity;


							frm.refresh_field("manpower1")

						}
					})


					if (!frm.doc.manpower_detail_summarized_by_month_section_a) {
						console.log("first")
						var manpower_exist1 = false;
						var manpower_exist2 = false;
						console.log("eeeeeee2", e);
						$.each(frm.doc.operational_plan_detail_one1, function(index, row) {
							if (row.activity === e.parent) {
								manpower_exist1 = true;
								return false; // Exit the loop if activity is found
							}
						});

						$.each(frm.doc.operational_plan_detail_one1, function(index, row) {
							if (row.activity === e.parent) {
								manpower_exist2 = true;
								return false; // Exit the loop if activity is found
							}
						});

						if (!manpower_exist1) {
							var newEntrySummerized_section_a = frm.add_child("manpower_detail_summarized_by_month_section_a");
							newEntrySummerized_section_a.id_map = e.id_map;
							newEntrySummerized_section_a.activity = e.parent;

							newEntrySummerized_section_a.job_title = e.job_title;
						}

						if (!manpower_exist2) {
							var newEntrySummerized_section_b = frm.add_child("manpower_detail_summarized_by_month_section_b");
							newEntrySummerized_section_b.id_map = e.id_map;
							newEntrySummerized_section_b.activity = e.parent;

							newEntrySummerized_section_b.job_title = e.job_title;
						}


						var entryMPSummerized = frm.add_child("manpower_detail_summerized");
						entryMPSummerized.id_map = e.id_map;
						entryMPSummerized.job_title = e.job_title;
						entryMPSummerized.qty = e.qty * planned_qty;
						entryMPSummerized.uf = e.uf;
						entryMPSummerized.efficency = e.efficency;
						entryMPSummerized.hourly_cost = e.hourly_cost;
						entryMPSummerized.total_hourly_cost = entryMPSummerized.qty * entryMPSummerized.hourly_cost;
					}
					else {

						var manpower_exist = false;


						$.each(frm.doc.manpower_detail_summarized_by_month_section_a, function(index, row) {
							if (row.id_map === e.id_map) {
								manpower_exist = true;
								return false; // Exit the loop if manpower entry is found
							}
						});

						if (!manpower_exist) {

							var manpower_exist1 = false;
							var manpower_exist2 = false;
							console.log("eeeeeee2", e);
							$.each(frm.doc.operational_plan_detail_one1, function(index, row) {
								if (row.activity === e.parent) {
									manpower_exist1 = true;
									return false; // Exit the loop if activity is found
								}
							});

							$.each(frm.doc.operational_plan_detail_one1, function(index, row) {
								if (row.activity === e.parent) {
									manpower_exist2 = true;
									return false; // Exit the loop if activity is found
								}
							});

							if (!manpower_exist1) {
								var newEntrySummerized_section_a = frm.add_child("manpower_detail_summarized_by_month_section_a");
								newEntrySummerized_section_a.id_map = e.id_map;
								newEntrySummerized_section_a.activity = e.parent;

								newEntrySummerized_section_a.job_title = e.job_title;
							}

							if (!manpower_exist2) {
								var newEntrySummerized_section_b = frm.add_child("manpower_detail_summarized_by_month_section_b");
								newEntrySummerized_section_b.id_map = e.id_map;
								newEntrySummerized_section_b.activity = e.parent;

								newEntrySummerized_section_b.job_title = e.job_title;
							}
						} else {
							var entryMPSummerized = frm.add_child("manpower_detail_summerized");
							entryMPSummerized.id_map = e.id_map;
							entryMPSummerized.job_title = e.job_title;
							entryMPSummerized.qty = e.qty * planned_qty;
							entryMPSummerized.uf = e.uf;
							entryMPSummerized.efficency = e.efficency;
							entryMPSummerized.hourly_cost = e.hourly_cost;
							entryMPSummerized.total_hourly_cost = entryMPSummerized.qty * entryMPSummerized.hourly_cost;
						}
					}










				})


				frm.doc.man_power_total_cost = grand_total_cost_for_manpower;
				frm.doc.man_power_unit_rate = (sum_of_unit_rate_for_manpower / number_of_items_for_manpower);

				refresh_field("manpower1");
				refresh_field("man_power_total_cost");
				refresh_field("man_power_unit_rate");
				refresh_field("manpower_detail_summerized");
				refresh_field("manpower_detail_summarized_by_month_section_a");
				refresh_field("manpower_detail_summarized_by_month_section_b");
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
					entry.qty = e.qty;
					
					//fetching the quantity from the database
					frappe.call({
						method: 'frappe.client.get_list',
						args: {
							doctype: 'Task',
							filters: {
								'name': e.parent,
							},
							fields: ["quantity"],
						},
						callback: async function(response) {
							console.log("Response ", response.message[0].quantity)
							entry.task_qty = response.message[0].quantity;
							entry.qty = e.qty
							entry.uf = e.uf;
							entry.efficency = e.efficency;
							entry.unit_price = e.unit_price;
							grand_total_cost_for_material += entry.qty * entry.unit_price;
							number_of_items_for_material += 1;
							sum_of_unit_rate_for_material += entry.unit_price;
							entry.total_cost = entry.qty * entry.unit_price;

							entry.material_no = entry.qty * entry.task_qty;


							frm.refresh_field("material1")

						}
					})


					if (!frm.doc.material_detail_summarized_by_month_section_a) {

						var entryMaterialSummerized = frm.add_child("material_detail_summerized");
						entryMaterialSummerized.id_mat = e.id_mat;
						entryMaterialSummerized.item1 = e.item1;
						entryMaterialSummerized.uom = e.uom;
						entryMaterialSummerized.qty = e.qty * planned_qty;
						entryMaterialSummerized.uf = e.uf;
						entryMaterialSummerized.efficency = e.efficency;
						entryMaterialSummerized.unit_price = e.unit_price;
						entryMaterialSummerized.total_cost = entryMaterialSummerized.qty * entryMaterialSummerized.unit_price;

						var material_exist1 = false;
						var material_exist2 = false;

						console.log("eeeeeeeeee material", e);

						$.each(frm.doc.operational_plan_detail_one1, function(index, row) {
							if (row.activity === e.parent) {
								material_exist1 = true;
								return false; // Exit the loop if activity is found
							}
						});

						$.each(frm.doc.operational_plan_detail_one1, function(index, row) {
							if (row.activity === e.parent) {
								material_exist2 = true;
								return false; // Exit the loop if activity is found
							}
						});

						console.log(" material exist 1", material_exist1);
						console.log(" material exist 2", material_exist2);


						if (!material_exist1) {
							var newEntrySummerized_section_a = frm.add_child("material_detail_summarized_by_month_section_a");
							newEntrySummerized_section_a.id_mat = e.id_mat;
							newEntrySummerized_section_a.unit = e.uom;
							newEntrySummerized_section_a.item = e.item1;
						}

						if (!material_exist2) {
							var newEntrySummerized_section_b = frm.add_child("material_detail_summarized_by_month_section_b");
							newEntrySummerized_section_b.id_mat = e.id_mat;
							newEntrySummerized_section_b.unit = e.uom;
							newEntrySummerized_section_b.item = e.item1;
						}
					}
					else {

						var material_exist = false;


						$.each(frm.doc.material_detail_summarized_by_month_section_a, function(index, row) {
							if (row.id_mat === e.id_mat) {
								material_exist = true;
								return false; // Exit the loop if manpower entry is found
							}
						});

						if (!material_exist) {
							var material_exist1 = false;
							var material_exist2 = false;

							$.each(frm.doc.operational_plan_detail_one1, function(index, row) {
								if (row.activity === e.parent) {
									material_exist1 = true;
									return false; // Exit the loop if activity is found
								}
							});

							$.each(frm.doc.operational_plan_detail_one1, function(index, row) {
								if (row.activity === e.parent) {
									material_exist2 = true;
									return false; // Exit the loop if activity is found
								}
							});

							if (!material_exist1) {
								var newEntrySummerized_section_a = frm.add_child("material_detail_summarized_by_month_section_a");
								newEntrySummerized_section_a.id_mat = e.id_mat;
								newEntrySummerized_section_a.unit = e.uom;
								newEntrySummerized_section_a.item = e.item1;
							}

							if (!material_exist2) {
								var newEntrySummerized_section_b = frm.add_child("material_detail_summarized_by_month_section_b");
								newEntrySummerized_section_b.id_mat = e.id_mat;
								newEntrySummerized_section_b.unit = e.uom;
								newEntrySummerized_section_b.item = e.item1;
							}
						} else {
							var entryMaterialSummerized = frm.add_child("material_detail_summerized");
							entryMaterialSummerized.id_mat = e.id_mat;
							entryMaterialSummerized.item1 = e.item1;
							entryMaterialSummerized.uom = e.uom;
							entryMaterialSummerized.qty = e.qty * planned_qty;
							entryMaterialSummerized.uf = e.uf;
							entryMaterialSummerized.efficency = e.efficency;
							entryMaterialSummerized.unit_price = e.unit_price;
							entryMaterialSummerized.total_cost = entryMaterialSummerized.qty * entryMaterialSummerized.unit_price;
						}
					}





				})

				frm.doc.material_total_cost = grand_total_cost_for_material;
				//frm.doc.man_power_unit_rate = (sum_of_unit_rate/number_of_items);

				refresh_field("material1");
				refresh_field("material_total_cost");
				refresh_field("material_detail_summerized");
				refresh_field("material_detail_summarized_by_month_section_a");
				refresh_field("material_detail_summarized_by_month_section_b");
			})
		}

		//Script to populate child tables for task detail by month
		if (taskParent) {

			frappe.call({

				method: "erpnext.task_week_detail_populate_api.get_task_by_task_id",
				args: { activity: taskParent }

			}).done((r) => {
				$.each(r.message, function(_i, e) {
					var activity_exists1 = false;
					var activity_exists2 = false;

					$.each(frm.doc.operational_plan_detail_one1, function(index, row) {
						if (row.activity === e[0]) {
							activity_exists1 = true;
							if (eMain.planned) {
								row.planned = eMain.planned;
							}
							return false;
						}
					});

					$.each(frm.doc.operational_plan_detail_two2, function(index, row) {
						if (row.activity === e[0]) {
							activity_exists2 = true;
							return false;
						}
					});

					if (!activity_exists1) {
						var entryOne = frm.add_child("operational_plan_detail_one1");
						entryOne.activity = e[0];
						entryOne.activity_name = e[17];
						entryOne.uom = e[61];
						if (eMain.planned) {
							entryOne.planned = eMain.planned;
						}
					}

					if (!activity_exists2) {
						var entryTwo = frm.add_child("operational_plan_detail_two2");
						entryTwo.activity = e[0];
						entryTwo.activity_name = e[17];
						entryTwo.uom = e[61];
					}
				});


				refresh_field("operational_plan_detail_one1");
				refresh_field("operational_plan_detail_two2");
			})
		}

	});
}

function AutoCalculateMonthValueOne(doctype, name, planned) {

	console.log("One DocType: " + doctype);
	console.log("One Name: " + name);

	//frappe.model.set_value(doctype, name, 'm_1', (planned / 12));
	//frappe.model.set_value(doctype, name, 'm_2', (planned / 12));
	//frappe.model.set_value(doctype, name, 'm_3', (planned / 12));
	//frappe.model.set_value(doctype, name, 'm_4', (planned / 12));
	//frappe.model.set_value(doctype, name, 'm_5', (planned / 12));
	//frappe.model.set_value(doctype, name, 'm_6', (planned / 12));
}

function AutoCalculateMonthValueTwo(doctype, name, planned) {

	console.log("Two DocType: " + doctype);
	console.log("Two Name: " + name);

	//frappe.model.set_value(doctype, name, 'm_7', (planned / 25));
	//frappe.model.set_value(doctype, name, 'm_8', (planned / 26));
	//frappe.model.set_value(doctype, name, 'm_9', (planned / 27));
	//frappe.model.set_value(doctype, name, 'm_10', (planned / 26));
	//frappe.model.set_value(doctype, name, 'm_11', (planned / 25));
	//frappe.model.set_value(doctype, name, 'm_12', (planned / 24));
}

frappe.ui.form.on("Operational Plan", {
	fetch: function(frm, cdt, cdn) {
		AutoPopulate(frm, cdt, cdn);
	},
});

frappe.ui.form.on("Operational Plan Detail", {
	activity: function(frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		var table = frm.doc.task_list;
		console.log("row", row);
		console.log("table", table);

		for (var i = 0; i < table.length - 1; i++) {
			if (table[i].activity == row.activity) {
				frappe.show_alert("You cannot select a similar Task again!");
				frm.doc.task_list.splice(i, 1); // Remove the row from the task_list
				frm.refresh_field("task_list"); // Refresh the field to reflect the change
				return;
			}
		}
	},

	// planned: function(frm, cdt, cdn) {
	// 	AutoPopulate(frm, cdt, cdn);
	// }
});


frappe.ui.form.on("Operational Plan Detail One1", {
	planned: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frm.refresh_field("planned");
		AutoCalculateMonthValueOne(d.doctype, d.name, d.planned);
	}
});

frappe.ui.form.on("Operational Plan Detail Two2", {
	planned: function(frm, cdt, cdn) {
		var d = locals[cdt][cdn];
		frm.refresh_field("planned");
		AutoCalculateMonthValueTwo(d.doctype, d.name, d.planned);
	}
});

function checkActivityExistence(activity, detail) {
	var exists = false;
	$.each(detail, function(index, row) {
		if (row.activity === activity) {
			exists = true;
			return false;
		}
	});
	return exists;
}