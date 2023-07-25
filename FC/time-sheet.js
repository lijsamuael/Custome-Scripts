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
				timeSheetRow.annual_paid_leave = "";
				timeSheetRow.sick_leave = "";
				timeSheetRow.unpaid_leave = "";
				timeSheetRow.holiday_leave = "";
				timeSheetRow.compensation_leave = "";

				if(result.names[i] == "Saturday" || result.names[i] == "Sunday"){

					timeSheetRow.working_hours = "0";
					timeSheetRow.public_holidays = "0";
					timeSheetRow.annual_paid_leave = "0";
					timeSheetRow.sick_leave = "0";
					timeSheetRow.unpaid_leave = "0";
					timeSheetRow.holiday_leave = "0";
					timeSheetRow.compensation_leave = "0";

					frm.fields_dict.time_sheets.grid.toggle_enable("working_hours", false);
				}
				
			}

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



