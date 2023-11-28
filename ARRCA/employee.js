frappe.ui.form.on("Employee", {
	date_of_birth_ec: function(frm, cdt, cdn) {
		if (frm.doc.date_of_birth_ec) {
			// Convert Ethiopian date to Gregorian date
			var finalgc = convertDateTOGC(frm.doc.date_of_birth_ec.toString());
			var inputDate = new Date(finalgc);
			var day = inputDate.getDate();
			var month = inputDate.getMonth() + 1; // Months are zero-based, so add 1
			var year = inputDate.getFullYear();
			var yearRetire = inputDate.getFullYear() + 53;
			// Pad day and month with leading zeros if necessary
			day = day < 10 ? '0' + day : day;
			month = month < 10 ? '0' + month : month;

			var retireDate = day + '-' + month + '-' + yearRetire;
			var formatted_date = year + '-' + month + '-' + day;
			console.log("formated date is ", formatted_date)
			// Create a Date object by specifying year, month (0-based), and day

			frm.doc.date_of_birth = formatted_date;
			refresh_field("date_of_birth");
			frm.set_value('retirement_date', retireDate);
			refresh_field('retirement_date');

		}
	},

	date_of_joining_ec: function(frm, cdt, cdn) {

		if (frm.doc.date_of_joining_ec) {
			var parts = frm.doc.date_of_joining_ec.split('/');
			// Create a Date object by specifying year, month (0-based), and day
			var formatedDate = parts[2] + '-' + (parts[1] - 1) + '-' + parts[0];
			frm.set_value('date_of_joining', formatedDate);
			refresh_field("date_of_joining");
		}
	},

	releiving_date_ec: function(frm, cdt, cdn) {

		if (frm.doc.releiving_date_ec) {

			var finalgc = convertDateTOGC(frm.doc.releiving_date_ec.toString());
			var d = locals[cdt][cdn];
			frappe.model.set_value(d.doctype, d.name, 'relieving_date', finalgc);
			refresh_field("relieving_date");
		}
	}

});

frappe.ui.form.on("Employee External Work History", {

	from_date_ec: function(frm, cdt, cdn) {

		if (frm.selected_doc.from_date_ec) {

			var finalgc = convertDateTOGC(frm.selected_doc.from_date_ec.toString());
			frm.selected_doc.from_date = finalgc;
			// CalculateExperiance(frm);
			calculateYearDifference(frm, cdt, cdn)
			calculateTotal(frm, "external_work_history", "total_previous_experience", "total_experience")
			if(frm.doc.total_current_experience && frm.doc.total_previous_experience){
				frm.set_value('grand_total_experience', parseFloat(frm.doc.total_current_experience + frm.doc.total_previous_experience));
				frm.refresh_field("grand_total_experience")
			}
			refresh_field("external_work_history");
		}

	},

	to_date_ec: function(frm, cdt, cdn) {

		if (frm.selected_doc.to_date_ec) {

			var finalgc = convertDateTOGC(frm.selected_doc.to_date_ec.toString());
			frm.selected_doc.to_date = finalgc;
			// CalculateExperiance(frm);
			calculateYearDifference(frm, cdt, cdn)
			calculateTotal(frm, "external_work_history", "total_previous_experience", "total_experience")
			if(frm.doc.total_current_experience && frm.doc.total_previous_experience){
				frm.set_value('grand_total_experience', parseFloat(frm.doc.total_current_experience + frm.doc.total_previous_experience));
				frm.refresh_field("grand_total_experience")
			}
			refresh_field("external_work_history");

		}
	}
});

frappe.ui.form.on("Employee Education", {

	year_of_finish_ec: function(frm, cdt, cdn) {

		if (frm.selected_doc.year_of_finish_ec) {

			var finalgc = convertDateTOGC(frm.selected_doc.year_of_finish_ec.toString());
			frm.selected_doc.graduating_year = finalgc;
			refresh_field("education");
		}

	},
});


frappe.ui.form.on("Child", {

	child_birth_date_ec: function(frm, cdt, cdn) {

		if (frm.selected_doc.child_birth_date_ec) {

			var finalgc = convertDateTOGC(frm.selected_doc.child_birth_date_ec.toString());
			frm.selected_doc.የልደት_ቀንና = finalgc;
			refresh_field("child");
		}

	},
});

frappe.ui.form.on("Employee Internal Work History", {

	from_date_ec: function(frm, cdt, cdn) {

		if (frm.selected_doc.from_date_ec) {

			var finalgc = convertDateTOGC(frm.selected_doc.from_date_ec.toString());
			frm.selected_doc.from_date = finalgc;
			// CalculateExperiance(frm);
			calculateYearDifference(frm, cdt, cdn)
			calculateTotal(frm, "internal_work_history", "total_current_experience", "total_experience")
			if(frm.doc.total_current_experience && frm.doc.total_previous_experience){
				frm.set_value('grand_total_experience', parseFloat(frm.doc.total_current_experience + frm.doc.total_previous_experience));
				frm.refresh_field("grand_total_experience")
			}
			refresh_field("internal_work_history");
		}
	},

	to_date_ec: function(frm, cdt, cdn) {

		if (frm.selected_doc.to_date_ec) {
			console.log("we are here")
			//frappe.show_alert("I am here Employee Internal Work History to_date_ec", 5);
			var finalgc = convertDateTOGC(frm.selected_doc.to_date_ec.toString());
			frm.selected_doc.to_date = finalgc;
			// CalculateExperiance(frm);
			calculateYearDifference(frm, cdt, cdn)
			calculateTotal(frm, "internal_work_history", "total_current_experience", "total_experience")
			if(frm.doc.total_current_experience && frm.doc.total_previous_experience){
				frm.set_value('grand_total_experience', parseFloat(frm.doc.total_current_experience + frm.doc.total_previous_experience));
				frm.refresh_field("grand_total_experience")
			}
			refresh_field("internal_work_history");
		}
	}
});

frappe.ui.form.on("Medical Form", {
	asked: function(frm, cdt, cdn) {
		calculateMedicine(frm, cdt, cdn);
	},
});

frappe.ui.form.on("Medical Form Two", {
	asked: function(frm, cdt, cdn) {
		calculateMedicineTwo(frm, cdt, cdn);
	},
});

function calculateMedicine(frm, cdt, cdn) {
	var used = 0;
	var allowSave = true;
    var forGlass = 0;

	$.each(frm.doc.medicine, function(index, row) {
		if(row.reason !== "የመነፅር"){
            console.log("wer are  inside")
			
		if (row.from_government == "Yes") {
			used += row.asked;
			row.amount_paid = row.asked;
			refresh_field("medicine")

		} else {
			used += row.asked * 0.8;
			row.amount_paid = row.asked * 0.8;
			refresh_field("medicine")
		}
		if (used > parseFloat(12000) && row.reason !== "የስራ ላይ አደጋ") {
			frappe.model.clear_doc(row.doctype, row.name);
			refresh_field("medicine")
			allowSave = false;
			frappe.throw("Total amount paid exceeds 12000 and reason is not 'የስራ ላይ አደጋ'. Cannot save the document.");
			return false;  // exit the loop
		}

		}else{
            console.log("we are not inside")
            if (row.from_government == "Yes") {
                forGlass += row.asked;
                row.amount_paid = row.asked;
                refresh_field("medicine")
    
            } else {
                forGlass += row.asked * 0.8;
                row.amount_paid = row.asked * 0.8;
                refresh_field("medicine")
            }
            if (forGlass > parseFloat(3000)) {
                frappe.model.clear_doc(row.doctype, row.name);
                refresh_field("medicine")
                allowSave = false;
                frappe.throw("Total amount paid for glass can not exceed 3000.");
                return false;  // exit the loop
            }
            
        }
	});

	if (allowSave) {
		frm.set_value("used_medicine__from_12000", used);
		frm.set_value("total_birr_for_glass", forGlass);
		frm.set_value("ramaining_from_12000", parseFloat(12000) - used);
		frm.refresh_field("sed_medicine__from_12000");
		frm.refresh_field("total_birr_for_glass");
		frm.refresh_field("ramaining_from_12000");
	}
}

function calculateMedicineTwo(frm, cdt, cdn) {
	var used = 0;

	$.each(frm.doc.medicine2, function(index, row) {
			
		if (row.from_government == "Yes") {
			used += row.asked;
			row.amount_paid = row.asked;
			refresh_field("medicine2")

		} else {
			used += row.asked * 0.8;
			row.amount_paid = row.asked * 0.8;
			refresh_field("medicine2")
		}
	});

		frm.set_value("total_medicine_in_birr", used);
		frm.refresh_field("total_medicine_in_birr");
}




// function CalculateExperiance(frm) {
// 	var previousTotalDays = 0;
// 	var currentTotalDays = 0;
// 	var totalDays = 0;

// 	var external_work_history = frm.doc.external_work_history;
// 	$.each(external_work_history, function (_i, e) {

// 		if (e.from_date && e.to_date) {
// 			var date1 = new Date(e.from_date.toString());
// 			var date2 = new Date(e.to_date.toString());
// 			var total_days_for_each_experiance = CalDaysInBetweenDates(date1, date2);

// 			var tExperianceMonth = CalMonthFromDays(total_days_for_each_experiance);
// 			var tExperianceYear = CalYearFromMonth(tExperianceMonth);
// 			var tExperianceRemainDays = RemainDays(total_days_for_each_experiance);
// 			var tExperianceRemainMonth = RemainMonths(tExperianceMonth);
// 			var tExperianceMessage = DurationMessage(tExperianceYear, tExperianceRemainMonth, tExperianceRemainDays);

// 			e.total_experience = tExperianceMessage;
// 			previousTotalDays += total_days_for_each_experiance;
// 			refresh_field("external_work_history");
// 		}

// 	});

// 	var previousMonth = CalMonthFromDays(previousTotalDays);
// 	var previousYear = CalYearFromMonth(previousMonth);
// 	var previousRemainDays = RemainDays(previousTotalDays);
// 	var previousRemainMonth = RemainMonths(previousMonth);
// 	var previousMessage = DurationMessage(previousYear, previousRemainMonth, previousRemainDays);
// 	frm.doc.total_previous_experience = previousMessage;

// 	var internal_work_history = frm.doc.internal_work_history;
// 	$.each(internal_work_history, function (_i, e) {
// 		if (e.from_date && e.to_date) {
// 			var date1 = new Date(e.from_date.toString());
// 			var date2 = new Date(e.to_date.toString());
// 			var total_days_for_each_experiance = CalDaysInBetweenDates(date1, date2);

// 			var tExperianceMonth = CalMonthFromDays(total_days_for_each_experiance);
// 			var tExperianceYear = CalYearFromMonth(tExperianceMonth);
// 			var tExperianceRemainDays = RemainDays(total_days_for_each_experiance);
// 			var tExperianceRemainMonth = RemainMonths(tExperianceMonth);
// 			var tExperianceMessage = DurationMessage(tExperianceYear, tExperianceRemainMonth, tExperianceRemainDays);

// 			e.total_experience = tExperianceMessage;
// 			currentTotalDays += total_days_for_each_experiance;
// 			refresh_field("external_work_history");
// 		}
// 	});

// 	var currentMonth = CalMonthFromDays(currentTotalDays);
// 	var currentYear = CalYearFromMonth(currentMonth);
// 	var currentRemainDays = RemainDays(currentTotalDays);
// 	var currentRemainMonth = RemainMonths(currentMonth);
// 	var currentMessage = DurationMessage(currentYear, currentRemainMonth, currentRemainDays);
// 	frm.doc.total_current_experience = currentMessage;

// 	totalDays = previousTotalDays + currentTotalDays;

// 	var month = CalMonthFromDays(totalDays);
// 	var year = CalYearFromMonth(month);
// 	var remainDays = RemainDays(totalDays);
// 	var remainMonth = RemainMonths(month);
// 	var message = DurationMessage(year, remainMonth, remainDays);
// 	frm.doc.grand_total_experience = message;

// 	refresh_field("total_previous_experience");
// 	refresh_field("total_current_experience");
// 	refresh_field("grand_total_experience");
// }


function calculateYearDifference(frm, cdt, cdn, ) {
	console.log("wer are here outside")
	var row = locals[cdt][cdn];
	if (row.from_date && row.to_date) {
		console.log("we are here inside")
		// Convert date strings to Date objects
		const formattedDate1 = new Date(row.from_date);
		const formattedDate2 = new Date(row.to_date);

		// Calculate the year difference
		const yearDifference = Math.abs(formattedDate1.getFullYear() - formattedDate2.getFullYear());

		// Round the result to one decimal place
		const roundedDifference = yearDifference.toFixed(1);

		row.total_experience = roundedDifference;
		console.log("year difference is ", row.total_experience)
		frm.refresh_field("internal_work_history")
	}

}


function calculateTotal(frm, childTable, valueField, input) {
	var totalAmount = 0;

	if (!frm || !frm.doc || !frm.doc[childTable]) {
		console.error("Invalid form or child table data.");
		return NaN;
	}

	frm.doc[childTable].forEach((row) => {
		if (typeof row[input] === 'number') {
			totalAmount += row[input];
		} else if (typeof row[input] === 'string' && !isNaN(parseFloat(row[input]))) {
			totalAmount += parseFloat(row[input]);
		} else {
			console.error("Invalid input value in the child table:", row[input]);
		}
	});

	frm.set_value(valueField, totalAmount);
	frm.refresh_field(valueField);

	frm.refresh_field(valueField, totalAmount);
	frm.set_value(valueField, totalAmount);


	return parseFloat(totalAmount);
}




