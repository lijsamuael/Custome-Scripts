


frappe.ui.form.on('Payment Certificate for Construction', {
	onload: function(frm) {
		console.log("abebe beso bela")
		addRowToCPT(frm);
		addRowToTSPC(frm);
		addRowToTDCPT(frm);
		addRowVORT(frm);
		addRowTST(frm);
	
});

var mainContract = 0;
var greaterDate;
var dValue = 0;
var iValue = 0;
var retention = 0;
var varOnRetention = 0;
var executedAmount = 0;


frappe.ui.form.on('Payment Certificate for Construction', {
	contractor: function(frm) {
		frm.set_query("contract_no", function() {
			return {
				"filters": {
					"cn": frm.doc.contractor
				}
			}
		});
	},

	contract_no: function(frm, cdt, cdn) {
		frappe.call({
			method: 'frappe.client.get_list',
			args: {
				doctype: 'Appendices To Contract',
				filters: { "name": frm.doc.contract_no },
				fields: ['total_amount']
			},
			callback: function(response) {
				var contract = response.message[0];
				if (contract) {
					mainContract = contract.total_amount;
					addRowToCPT(frm);
				}
			}
		});
		assignPreviousPayment(frm);

	},
});

frappe.ui.form.on('Payment Certificate for Construction', {
	contract_no: function(frm, cdt, cdn) {
		console.log("TESt 0")
		//fetch the timesheetsBridge Inventory Sheet Table
		frappe.call({
			method: 'frappe.client.get_list',
			args: {
				doctype: 'Timesheet',
				filters: [
					["appendicies_to_contract_no", "=", frm.doc.contract_no],
					["date", "<=", frm.doc.contract_date]
				],
				fields: ['quantity_executed']
			},
			callback: function(response) {
				console.log("response", response)
				var timesheets = response.message;

				var totalToDateAmount = 0;
				if (timesheets && timesheets.length > 0) {
					console.log("TESt Bridge Inventory Sheet Table2")
					timesheets.map((timesheet, index) => {
						totalToDateAmount += timesheet.quantity_executed;
					})
					console.log("total Amount", totalToDateAmount);
					addRowToTDCPT(frm, totalToDateAmount);
				}
			}
		});

		//fetch the appendicies to contract description
		frappe.call({
			method: 'frappe.client.get_value',
			args: {
				doctype: 'Appendices To Contract',
				filters: {
					"name": frm.doc.contract_no
				},
				fieldname: ['work_description']
			},
			callback: function(response) {
				var description = response.message.work_description;
				console.log("description", description)

				if (description) {
					var descriptionTable = frm.doc.grand_summary_sheet_of_payment;
					frm.clear_table("grand_summary_sheet_of_payment");
					frm.set_value("grand_summary_sheet_of_payment", []);
					var tableRow = frappe.model.add_child(frm.doc, "GRAND SUMMARY SHEET OF PAYMENT", "grand_summary_sheet_of_payment")
					tableRow.description = description;
					tableRow.contract_amount = mainContract;
					tableRow.executed_previous_payment = frm.doc.total_exe_vat || 0;
					tableRow.executed_this_period_payment = executedAmount
					tableRow.executed_to_date_payment = executedAmount + frm.doc.total_exe_vat;
					refresh_field("grand_summary_sheet_of_payment");
					console.log("grand_summary_sheet_of_payment", frm.doc.grand_summary_sheet_of_payment);
					console.log("TESt 2")
				}
			}
		});
		console.log("greader date")
		//fetch bill of quantity from timesheet
		frappe.call({
			method: 'frappe.client.get_list',
			args: {
				doctype: 'Timesheet',
				filters: [
					["appendicies_to_contract_no", "=", frm.doc.contract_no],
					// ["date", "<=", frm.doc.contract_date],
					// ["date", ">=", greaterDate],
				],
				fields: ['*']
			},
			callback: function(response) {
				var timesheet = response.message;
				console.log("timesheet for bill of quantity", timesheet)

				if (timesheet) {
					var boqTable = frm.doc.table_34;
					frm.clear_table("table_34");
					frm.set_value("table_34", []);

					// Create an object to store the summed quantities for each task
					var taskQuantities = {};

					for (var i = 0; i < timesheet.length; i++) {
						var task = timesheet[i].task;

						if (!taskQuantities[task]) {
							taskQuantities[task] = 0;
						}

						taskQuantities[task] += timesheet[i].quantity_executed;
					}

					// Add rows to table_34 using the aggregated quantities
					for (var task in taskQuantities) {
						var tableRow = frappe.model.add_child(frm.doc, " ", "table_34");
						tableRow.item_no = task;
						// You may need to retrieve other information (uom, billing_rate, etc.) here.
						tableRow.current_qty = taskQuantities[task];
					}

					refresh_field("table_34");
				}
			}
		});


		frappe.call({
			method: 'frappe.client.get_list',
			args: {
				doctype: 'Timesheet',
				filters: [
					["appendicies_to_contract_no", "=", frm.doc.contract_no],
					["date", "<=", frm.doc.contract_date],
					["date", "<", greaterDate],
				],
				fields: ['*']
			},
			callback: function(response) {
				var timesheet = response.message;
				console.log("Timesheet: ", timesheet);

				if (timesheet) {
					var boqTable = frm.doc.table_34;
					console.log("boa table", boqTable);

					for (var i = 0; i < boqTable.length; i++) {
						var totalExecutedQuantity = 0;

						for (var j = 0; j < timesheet.length; j++) {
							if (boqTable[i].item_no == timesheet[j].task) {
								totalExecutedQuantity += timesheet[j].quantity_executed;
							}
						}

						// Now 'totalExecutedQuantity' contains the sum of executed quantity for the task.
						// Assign it to the table row as previous quantity.
						boqTable[i].previous_qty = totalExecutedQuantity;
					}

					refresh_field("table_34");
				}
			}
		});

		//call to update the deduction table
		addRowTST(frm);
		addRowToTDCPT(frm);
		addRowToTSPC(frm);




	}
});

function addRowToTDCPT(frm, totalToDateAmount) {
	console.log(frm.doc.to_date_executed_table)
	var to_date_executed_table = frm.doc.to_date_executed_table;
	frm.clear_table("to_date_executed_table");
	console.log("Test 1");
	frm.set_value("to_date_executed_table", []);

	var tableRow1 = frappe.model.add_child(frm.doc, "Payment Certificate To Date Executed", "to_date_executed_table");
	var tableRow2 = frappe.model.add_child(frm.doc, "Payment Certificate To Date Executed", "to_date_executed_table");
	var tableRow3 = frappe.model.add_child(frm.doc, "Payment Certificate To Date Executed", "to_date_executed_table");
	var tableRow4 = frappe.model.add_child(frm.doc, "Payment Certificate To Date Executed", "to_date_executed_table");
	tableRow1.data_1 = "(A) Total Amount of work Executed to Date (Excl. VAT)";
	console.log("total in function", totalToDateAmount)
	tableRow1.amount = totalToDateAmount || 0;
	tableRow2.data_1 = "(B) Supplementary agreement Executed";
	tableRow2.amount = 0;
	tableRow3.data_1 = "(C) Material on Site";
	tableRow3.amount = 0;
	tableRow4.data_1 = "(D) Total Amount of Work Executed = A + B + C";
	tableRow4.amount = 0;
	executedAmount = parseFloat(tableRow1.amount) + parseFloat(tableRow2.amount) + parseFloat(tableRow3.amount);
	tableRow4.amount = executedAmount;
	console.log("execeeeeeeeeeeeee", executedAmount)
	console.log("totlallllllllllllll", tableRow4.amount)
	dValue = tableRow4.amount;
	refresh_field("to_date_executed_table");
}

function addRowToTSPC(frm, cdt, cdn) {
	// console.log(frm.doc.total_sum_of_payment_certificate)
	var total_sum_of_payment_certificate = frm.doc.total_sum_of_payment_certificate;

	console.log("Test 111111");
	frm.clear_table(total_sum_of_payment_certificate);
	frm.set_value("total_sum_of_payment_certificate", []);

	var tableRow1 = frappe.model.add_child(frm.doc, "Total Sum of Payment Certificate", "total_sum_of_payment_certificate");
	var tableRow2 = frappe.model.add_child(frm.doc, "Total Sum of Payment Certificate", "total_sum_of_payment_certificate");
	var tableRow3 = frappe.model.add_child(frm.doc, "Total Sum of Payment Certificate", "total_sum_of_payment_certificate");
	var tableRow4 = frappe.model.add_child(frm.doc, "Total Sum of Payment Certificate", "total_sum_of_payment_certificate");
	var tableRow5 = frappe.model.add_child(frm.doc, "Total Sum of Payment Certificate", "total_sum_of_payment_certificate");
	tableRow1.deductions = "(E) Previous Payments";
	console.log("pre payyyy", frm.doc.total_exe_vat);
	tableRow1.amount = frm.doc.total_exe_vat || 0;
	tableRow2.deductions = "(F) Adv.Recovery(100%)";
	tableRow2.amount = 0;
	tableRow3.deductions = "(G) Retantion 5%";
	tableRow3.amount = 0;
	retention = tableRow3.amount;
	tableRow4.deductions = "(H) Deduction for material on site";
	tableRow4.amount = 0;
	tableRow5.deductions = "(I) Total Deduction";
	tableRow5.amount = parseFloat(tableRow1.amount) + parseFloat(tableRow2.amount) + parseFloat(tableRow3.amount) + parseFloat(tableRow4.amount);
	iValue = tableRow5.amount;
	refresh_field("total_sum_of_payment_certificate");

	//set value to the total contractor value
	console.log("dvalue, i value", dValue, iValue)
	frm.set_value("net_sum_due_to_contactor", dValue - iValue);
	frm.refresh_field("net_sum_due_to_contactor");

}




function addRowToCPT(frm, cdt, cdn) {
	console.log(frm.doc.contract_payment_table)
	var contract_payment_table = frm.doc.contract_payment_table;
	frm.clear_table("contract_payment_table");
	// if (!contract_payment_table) {
	console.log("Test 1");
	frm.set_value("contract_payment_table", []);

	var tableRow1 = frappe.model.add_child(frm.doc, "Contract Payment Table", "contract_payment_table");
	var tableRow2 = frappe.model.add_child(frm.doc, "Contract Payment Table", "contract_payment_table");
	var tableRow3 = frappe.model.add_child(frm.doc, "Contract Payment Table", "contract_payment_table");
	var tableRow4 = frappe.model.add_child(frm.doc, "Contract Payment Table", "contract_payment_table");
	var tableRow5 = frappe.model.add_child(frm.doc, "Contract Payment Table", "contract_payment_table");
	var tableRow6 = frappe.model.add_child(frm.doc, "Contract Payment Table", "contract_payment_table");
	tableRow1.data_1 = "Main Contract";
	tableRow1.amount = mainContract;
	tableRow2.data_1 = "Main Contract (Inc VAT)";
	tableRow2.amount = (mainContract + mainContract * 0.15) || 0;
	tableRow3.data_1 = "Amended Contract (Inc VAT)";
	tableRow3.amount = 0;
	tableRow4.data_1 = "Supplementary Contract (Inc VAT)";
	tableRow4.amount = 0;
	tableRow5.data_1 = "Variation Order";
	tableRow5.amount = 0;
	tableRow6.data_1 = "Total Sum (Inc VAT)";
	tableRow6.amount = parseFloat(tableRow1.amount) + parseFloat(tableRow2.amount);
	frm.set_value("total_amount", parseFloat(tableRow1.amount) + parseFloat(tableRow2.amount) + parseFloat(tableRow3.amount) + parseFloat(tableRow4.amount) + parseFloat(tableRow5.amount))
	refresh_field("contract_payment_table");
	frm.refresh_field("total_amount")

	// }
}


function addRowVORT(frm, cdt, cdn) {
	console.log(frm.doc.vat_on_retantion)
	var vat_on_retantion = frm.doc.vat_on_retantion;
	frm.clear_table("vat_on_retantion");
	console.log("Test 1");
	frm.set_value("vat_on_retantion", []);

	var tableRow1 = frappe.model.add_child(frm.doc, "Payment Certificate To Date Executed", "vat_on_retantion");
	var tableRow2 = frappe.model.add_child(frm.doc, "Payment Certificate To Date Executed", "vat_on_retantion");
	var tableRow3 = frappe.model.add_child(frm.doc, "Payment Certificate To Date Executed", "vat_on_retantion");
	tableRow1.data_1 = "(K) VAT on Total Retention Todate = 15% * G";
	tableRow1.amount = retention;
	tableRow2.data_1 = "(L) Previous Collected VAT";
	tableRow2.amount = 0;
	tableRow3.data_1 = "(M) VAT on Retention at this payment = K - L";
	tableRow3.amount = tableRow1.amount - tableRow2.amount
	varOnRetention = tableRow3.amount;
	refresh_field("vat_on_retantion");
}

function addRowTST(frm, cdt, cdn) {
	console.log(frm.doc.total_table)
	var total_table = frm.doc.total_table;
	frm.clear_table("total_table");
	console.log("Test 1");
	frm.set_value("total_table", []);

	var tableRow1 = frappe.model.add_child(frm.doc, "Payment Certificate To Date Executed", "total_table");
	var tableRow2 = frappe.model.add_child(frm.doc, "Payment Certificate To Date Executed", "total_table");
	var tableRow3 = frappe.model.add_child(frm.doc, "Payment Certificate To Date Executed", "total_table");
	var tableRow4 = frappe.model.add_child(frm.doc, "Payment Certificate To Date Executed", "total_table");
	tableRow1.data_1 = "(N) Sum Due to The Contractor = J";
	console.log("skldfjalsdjf;lsd", dValue, iValue);

	tableRow1.amount = dValue - iValue;
	tableRow2.data_1 = "(O) VAT on Sum Due to The Contractor = 15% * N";
	tableRow2.amount = tableRow1.amount * 0.15;
	tableRow3.data_1 = "(P) VAT on Retention at this Payment = M";
	tableRow3.amount = varOnRetention;
	tableRow4.data_1 = "(Q) Total VAT Payable at this Payment = O + P";
	tableRow4.amount = tableRow2.amount + tableRow3.amount;
	var finalValue = tableRow1.amount + tableRow4.amount;
	frm.set_value("total_payment_to_the_contractor_inc_vat", finalValue);
	frm.set_value("the_contractor_have_entitled_to_a_sum_of_bir", convertToWords(finalValue));
	frm.refresh_field("total_payment_to_the_contractor_inc_vat");
	frm.refresh_field("the_contractor_have_entitled_to_a_sum_of_bir");
	refresh_field("total_table");
}







// frappe.ui.form.on('Contract Payment Table', {
// 	amount: function(frm) {
// 		calculateTotalAmount(frm, 'contract_payment_table', "total_amount");
// 	}
// });

frappe.ui.form.on('Previous Payment Certification', {
	amount: function(frm) {
		calculateTotalAmount(frm, 'previous_payment', "total_exe_vat");
	}
});

frappe.ui.form.on('Total Sum of Payment Certificate', {
	amount: function(frm) {
		var totalAmount = calculateTotalAmount(frm, 'total_sum_of_payment_certificate', "net_sum_due_to_contactor");
		var vat = totalAmount * 0.15;
		var totalAmountWithVat = totalAmount + vat;
		//set the values to the respective fields and refreshing them
		frm.set_value("15_vat", vat);
		frm.set_value("net_sum_including_vat", totalAmountWithVat);
		frm.refresh_field("15_vat");
		frm.refresh_field("net_sum_including_vat");
	}
});

function calculateTotalAmount(frm, childTable, valueField) {
	var totalAmount = 0;

	if (!frm || !frm.doc || !frm.doc[childTable]) {
		console.error("Invalid form or child table data.");
		return NaN;
	}

	frm.doc[childTable].forEach((row) => {
		if (typeof row.amount === 'number') {
			totalAmount += row.amount;
		} else if (typeof row.amount === 'string' && !isNaN(parseFloat(row.amount))) {
			totalAmount += parseFloat(row.amount);
		} else {
			console.error("Invalid amount value in the child table:", row.amount);
		}
	});

	frm.set_value(valueField, totalAmount);
	frm.refresh_field(valueField);

	frm.refresh_field(valueField, totalAmount);
	frm.set_value(valueField, totalAmount);
	console.log("abebe beso bela ena mote eko kezama ena min yishala tiyalesh ene min akalehu kezama abebe beso bela ena mote eko ene min akalehu kezama ene min akalehu sihed simeta kayehut")

	return parseFloat(totalAmount);
}


frappe.ui.form.on("Payment Certificate for Construction", {
	onload: function(frm) {
		var table = frm.doc.contract_payment_table;
		//hide the add row buttons for a child tables
		frm.set_df_property("contract_payment_table", "read_only", 1);
		frm.set_df_property("total_sum_of_payment_certificate", "read_only", 1);
		frm.set_df_property("to_date_executed_table", "read_only", 1);
		frm.set_df_property("vat_on_retantion", "read_only", 1);

	}
});


function assignPreviousPayment(frm) {
	if (frm.doc.contract_no) {
		frappe.call({
			method: 'frappe.client.get_list',
			args: {
				doctype: 'Payment Certificate for Construction',
				filters: { "contract_no": frm.doc.contract_no },
				fields: ['name', 'total_payment_to_the_contractor_inc_vat', 'contract_date', 'net_sum_due_to_contactor']
			},
			callback: function(response) {
				var utilizationRegister = response.message;
				console.log("utilization", utilizationRegister)
				var totalAmount = 0;
				var totalVat = 0;
				for (var i in utilizationRegister) {
					var source_row = utilizationRegister[i];
					console.log("row", i)
					var vatValue;
					greaterDate = source_row.contract_date;
					if (source_row.contract_date > greaterDate) {
						greaterDate = source_row.contract_date;
					}
					vatValue = source_row.net_sum_due_to_contactor * 0.15;
					var target_row = frappe.model.add_child(frm.doc, 'Previous Payment Certification', 'previous_payment');
					target_row.payment_certification_no = source_row.name;
					target_row.date = source_row.contract_date;
					target_row.amount = source_row.net_sum_due_to_contactor;
					target_row.vat = vatValue;
					totalAmount += source_row.net_sum_due_to_contactor;
					totalVat += vatValue


				}
				console.log("last previous payent date", greaterDate);
				frm.set_value("total_inc_vat", vatValue);
				frm.set_value("total_exe_vat", totalAmount);
				refresh_field('previous_payment');

			}
		});
	}
	else {
		console.log("nothing excuted")

	}

}


function convertToWords(number) {
	const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
	const teens = ['eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
	const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

	function convertGroup(num) {
		let output = '';

		if (num > 0) {
			if (num < 10) {
				output += ones[num];
			} else if (num < 20) {
				output += teens[num - 11];
			} else {
				output += tens[Math.floor(num / 10)];
				if (num % 10 !== 0) {
					output += ' ' + ones[num % 10];
				}
			}
		}

		return output;
	}

	function convertChunk(num, chunkPosition) {
		let output = '';

		if (num > 0) {
			if (num >= 100) {
				output += ones[Math.floor(num / 100)] + ' hundred';
				num %= 100;
				if (num > 0) {
					output += ' and ';
				}
			}

			output += convertGroup(num);
		}

		if (output.length > 0) {
			if (chunkPosition > 0) {
				output += ' ' + ['', 'thousand', 'million', 'billion'][chunkPosition];
			}
			return output;
		} else {
			return '';
		}
	}

	const isNegative = number < 0;
	const integerPart = Math.floor(Math.abs(number));
	const decimalPart = Math.round((Math.abs(number) - integerPart) * 100);

	let result = isNegative ? 'negative ' : '';
	result += convertChunk(integerPart, 0);

	if (decimalPart > 0) {
		result += ' point ' + convertGroup(decimalPart);
	}

	return result.trim();
}




frappe.ui.form.on('Payment Certificate for Construction', {
	contract_no: function(frm) {
		console.log("eee 1");
		frappe.call({
			method: 'frappe.client.get_list',
			args: {
				doctype: 'Appendices To Contract',
				filters: {
					"name": frm.doc.contract_no
				},
			},
			callback: async function(response) {
				if (response.message && Array.isArray(response.message)) {
					var records = response.message;
					console.log("response for appendicies", records);

					// Assuming 'CFF' is the child table name
					records.forEach(async function(record) {
						await frappe.call({
							method: 'frappe.client.get_list',
							args: {
								doctype: 'CFF',
								filters: {
									'parent': record.name // Assuming 'name' is the field linking the child table to the parent
								},
								fields: ["*"]
							},
							callback: async function(childResponse) {
								if (childResponse.message && Array.isArray(childResponse.message)) {
									var childRecords = childResponse.message;
									var boqTable = frm.doc.table_34;
									console.log("Child records for appendicies", childRecords);
									console.log("table of bill of quantity", boqTable);

									for (var i = 0; i < boqTable.length; i++) {
										for (var j = 0; j < childRecords.length; j++) {
											if (boqTable[i].item_no == childRecords[j].for_which_task) {
												boqTable[i].contract_quantity = childRecords[j].quantity;
												console.log("unit value", childRecords[j].rate)
												boqTable[i].unit_price = childRecords[j].rate;
												boqTable[i].previous_qty = childRecords[j].quantity;
												boqTable[i].todate_qty = boqTable[i].previous_qty + boqTable[i].current_qty;
												boqTable[i].previous_amount = boqTable[i].previous_qty * boqTable[i].unit_price;
												boqTable[i].current__amount = boqTable[i].current_qty * boqTable[i].unit_price;
												boqTable[i].todate_amount = boqTable[i].todate_qty * boqTable[i].unit_price;

											}
										}
									}
									frm.refresh_field("table_34");

								}
							}
						});
					});
				}
			}
		});
	}
});




