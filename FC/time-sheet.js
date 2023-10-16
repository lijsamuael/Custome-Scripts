frappe.ui.form.on('Employee Monthly Timesheet', {
	onload: function(frm) {
		frappe.call({
			method: 'frappe.client.get_value',
			args: {
				doctype: 'User',
				filters: { name: frappe.session.user },
				fieldname: ['full_name']
			},
			callback: function(response) {
				var user = response.message;
				if (user) {
					frm.set_value('employee_name', user.full_name);
				}
			}
		});
	}
});




frappe.ui.form.on('Employee Monthly Timesheet', {
	refresh: function(frm) {
		// Set the current month and year
		var currentDate = new Date();
		var monthNames = [
			"January", "February", "March", "April", "May", "June",
			"July", "August", "September", "October", "November", "December"
		];
		var currentMonthIndex = frappe.datetime.str_to_obj(currentDate).getMonth();
		var currentMonth = monthNames[currentMonthIndex];
		var currentYear = currentDate.getFullYear().toString();

		// Set the values of the month and year fields
		frm.set_value("month", currentMonth);
		frm.set_value("year", currentYear);
	}
});




frappe.ui.form.on("Employee Monthly Timesheet", {
	onload: function(frm) {
		const dates2023 = generateDates2023();

		const monthName = frm.doc.month;
		const result = getMonthDaysAndNames(monthName);


		if (!frm.doc.time_sheets) {
			frm.set_value("time_sheets", []);

			for (var i = 0; i < result.days.length; i++) {
				var timeSheetRow = frappe.model.add_child(frm.doc, "Time Sheet", "time_sheets");
				// Set any default values for the new row
				timeSheetRow.day = result.names[i];
				timeSheetRow.working_hours = "";
				timeSheetRow.public_holidays = "";
				timeSheetRow.annual_paid_leave ="";
				timeSheetRow.sick_leave = "";
				timeSheetRow.unpaid_leave = "";
				timeSheetRow.holiday_leave = "";
				timeSheetRow.compensation_leave = "";

				if (result.names[i] == "Saturday" || result.names[i] == "Sunday") {

					timeSheetRow.working_hours = "0";
					timeSheetRow.public_holidays = "0";
					timeSheetRow.annual_paid_leave = "0";
					timeSheetRow.sick_leave = "0";
					timeSheetRow.unpaid_leave = "0";
					timeSheetRow.holiday_leave = "0";
					timeSheetRow.compensation_leave = "0";

				}

			}
			var timeSheetRow1 = frappe.model.add_child(frm.doc, "Time Sheet", "time_sheets");
			var timeSheetRow2 = frappe.model.add_child(frm.doc, "Time Sheet", "time_sheets");

			timeSheetRow1.day = "Total Working Hours";
			timeSheetRow1.working_hours = "";
			timeSheetRow1.public_holidays = "";
			timeSheetRow1.annual_paid_leave = "";
			timeSheetRow1.sick_leave = "";
			timeSheetRow1.unpaid_leave = "";
			timeSheetRow1.holiday_leave = "";
			timeSheetRow1.compensation_leave = "";

			timeSheetRow2.day = "Total Working Days";
			timeSheetRow2.working_hours = "";
			timeSheetRow2.public_holidays = "";
			timeSheetRow2.annual_paid_leave = "";
			timeSheetRow2.sick_leave = "";
			timeSheetRow2.unpaid_leave = "";
			timeSheetRow2.holiday_leave = "";
			timeSheetRow2.compensation_leave = "";

			frm.refresh_field("time_sheets");
		}
	}
});





function getMonthDaysAndNames(monthName) {
	const monthDays = [];
	const monthNames = [];

	// Iterate through each month (0-based index)
	for (let month = 0; month < 12; month++) {
		// Check if the current month matches the specified monthName
		if (new Date(2023, month).toLocaleString("default", { month: "long" }).toLowerCase() === monthName.toLowerCase()) {
			// Iterate through each day of the month (1-based index)
			for (let day = 1; day <= 31; day++) {
				const date = new Date(2023, month, day);

				// Check if the month is correct to avoid invalid dates (e.g., February 30)
				if (date.getMonth() !== month) {
					break;
				}

				// Add the day number to the monthDays array
				monthDays.push(day);

				// Add the day name to the monthNames array
				const dayName = date.toLocaleString("default", { weekday: "long" });
				monthNames.push(dayName);
			}

			break; // Break out of the loop once the specified month is found
		}
	}

	return {
		days: monthDays,
		names: monthNames
	};
}




function generateDates2023() {
	const dates2023 = [];

	// Iterate through each month (0-based index)
	for (let month = 0; month < 12; month++) {
		// Iterate through each day of the month (1-based index)
		for (let day = 1; day <= 31; day++) {
			const date = new Date(2023, month, day);

			// Check if the month is correct to avoid invalid dates (e.g., February 30)
			if (date.getMonth() !== month) {
				continue;
			}

			// Format the date as "Month Day, DayOfWeek"
			const formattedDate = `${date.toLocaleString("default", { month: "long" })} ${date.getDate()}, ${date.toLocaleString("default", { weekday: "long" })}`;

			// Add the formatted date to the array
			dates2023.push(formattedDate);
		}
	}

	return dates2023;
}



// frappe.ui.form.on("Employee Monthly Timesheet", "refresh", function(frm) {
//     // Make a field in the child table read-only
//     frm.fields_dict.time_sheets.grid.toggle_enable("working_hours", false);
// });




frappe.ui.form.on('Employee Monthly Timesheet', {
	// Trigger the calculation on loading the form
	onload: function(frm) {
		calculateTotalHours(frm);
	}
});

frappe.ui.form.on('Employee Monthly Timesheet', {
	// Trigger the calculation whenever a value in the child table changes
	working_hours: function(frm, cdt, cdn) {
		console.log("asfhksj")
		calculateTotalHours(frm);
	},
	public_holidays: function(frm, cdt, cdn) {
		calculateTotalHours(frm);
	},
	annual_paid_leave: function(frm, cdt, cdn) {
		calculateTotalHours(frm);
	},
	sick_leave: function(frm, cdt, cdn) {
		calculateTotalHours(frm);
	},
	unpaid_leave: function(frm, cdt, cdn) {
		calculateTotalHours(frm);
	},
	holiday_leave: function(frm, cdt, cdn) {
		calculateTotalHours(frm);
	},
	compensation_leave: function(frm, cdt, cdn) {
		calculateTotalHours(frm);
	}
});


//calculate the total hous per column and set the
function calculateTotalHours(frm, cdt, cdn) {
	
	console.log("F Test 1");
	console.log("frm", frm);

	//get the timesheets child table
	var time_sheets = frm.doc.time_sheets;
	console.log("time sheets", time_sheets);

	var total_working_hours = 0;
	var total_public_holidays = 0;
	var total_annual_paid_leave = 0;
	var total_sick_leave = 0;
	var total_unpaid_leave = 0;
	var total_holiday_leave = 0;
	var total_compensation_leave = 0;

	//set total number of rows
	var total_rows = time_sheets.length;
	console.log("total rows", total_rows);

	//calculating total working hours
	time_sheets.map((row, index) => {
		
		if (row.working_hours) total_working_hours += parseInt(row.working_hours);
		if (row.public_holidays) total_public_holidays += parseInt(row.public_holidays);
		if (row.annual_paid_leave) total_annual_paid_leave += parseInt(row.annual_paid_leave);
		if (row.sick_leave) total_sick_leave += parseInt(row.sick_leave);
		if (row.unpaid_leave) total_unpaid_leave += parseInt(row.unpaid_leave);
		if (row.holiday_leave) total_holiday_leave += parseInt(row.holiday_leave);
		if (row.compensation_leave) total_compensation_leave += parseInt(row.compensation_leave);

		//setting the total working hours
		if (index == total_rows - 2) {
			row.working_hours = total_working_hours;
			frappe.model.set_value(row.doctype, row.name, 'working_hours', total_working_hours);
			frappe.model.set_value(row.doctype, row.name, 'public_holidays', total_public_holidays);
			frappe.model.set_value(row.doctype, row.name, 'annual_paid_leave', total_annual_paid_leave);
			frappe.model.set_value(row.doctype, row.name, 'sick_leave', total_sick_leave);
			frappe.model.set_value(row.doctype, row.name, 'unpaid_leave', total_unpaid_leave);
			frappe.model.set_value(row.doctype, row.name, 'holiday_leave', total_holiday_leave);
			frappe.model.set_value(row.doctype, row.name, 'compensation_leave', total_compensation_leave);
			frm.refresh_field("time_sheets");
			
			console.log("final working hours", row.working_hours);
		}
	});


	//calculating total working days
	var total_working_hours_day = 0;
	var total_public_holidays_day = 0;
	var total_annual_paid_leave_day = 0;
	var total_sick_leave_day = 0;
	var total_unpaid_leave_day = 0;
	var total_holiday_leave_day = 0;
	var total_compensation_leave_day = 0;
	
	time_sheets.map((row, index) => {
		if (row.working_hours && row.working_hours != 0) total_working_hours_day += 1;
		if (row.public_holidays && row.public_holidays != 0) total_public_holidays_day += 1;
		if (row.annual_paid_leave && row.annual_paid_leave != 0) total_annual_paid_leave_day += 1;
		if (row.sick_leave && row.sick_leave != 0) total_sick_leave_day += 1;
		if (row.unpaid_leave && row.unpaid_leave != 0) total_unpaid_leave_day += 1;
		if (row.holiday_leave && row.holiday_leave != 0) total_holiday_leave_day += 1;
		if (row.compensation_leave && row.compensation_leave != 0) total_compensation_leave_day += 1;

		//setting the total working days
		if (index == total_rows - 1) {
			row.working_hours = total_working_hours;
			frappe.model.set_value(row.doctype, row.name, 'working_hours', total_working_hours_day);
			frappe.model.set_value(row.doctype, row.name, 'public_holidays', total_public_holidays_day);
			frappe.model.set_value(row.doctype, row.name, 'annual_paid_leave', total_annual_paid_leave_day);
			frappe.model.set_value(row.doctype, row.name, 'sick_leave', total_sick_leave_day);
			frappe.model.set_value(row.doctype, row.name, 'unpaid_leave', total_unpaid_leave_day);
			frappe.model.set_value(row.doctype, row.name, 'holiday_leave', total_holiday_leave_day);
			frappe.model.set_value(row.doctype, row.name, 'compensation_leave', total_compensation_leave_day);
			frm.refresh_field("time_sheets");
			
			console.log("final working hours", row.working_hours);
		}
	});

}



							// tableRow.item = allDatas[i].item1.;
							// tableRow.uom = allDatas[i].uom;
							// tableRow.quantity = allDatas[i].qty;
							// tableRow.unit_rate = allDatas[i].unit_price;
							// tableRow.total_cost = allDatas[i].total_cost;