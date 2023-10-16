
frappe.ui.form.on('Payment Certificate for Construction', {
	onload: function(frm) {
		console.log("abebe beso bela")
		addRowToCPT(frm);
		addRowToTSPC(frm);
		addRowToTDCPT(frm);
		addRowVORT(frm);
		addRowTST(frm);
	}
});

var mainContract=0;

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
	 
	 contract_no:function(frm,cdt,cdn){
	  frappe.call({
	   method: 'frappe.client.get_list',
	   args: {
	    doctype: 'Appendices To Contract',
	    filters: { "name": frm.doc.contract_no},
	    fields: ['total_amount']
	   },
	   callback: function(response) {
	    var contract = response.message[0];
          if(contract)	{
            mainContract=contract.total_amount;
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
		//fetch the timesheets
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
					console.log("TESt 2")
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
					refresh_field("grand_summary_sheet_of_payment");
					console.log("grand_summary_sheet_of_payment", frm.doc.grand_summary_sheet_of_payment);
					console.log("TESt 2")
				}
			}
		});
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
	tableRow4.amount = parseFloat(tableRow1.amount) + parseFloat(tableRow2.amount) + parseFloat(tableRow3.amount);
	refresh_field("to_date_executed_table");
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
	tableRow2.data_1 = "Main Contract (Inc VAT)";
	tableRow3.data_1 = "Amended Contract (Inc VAT)";
	tableRow4.data_1 = "Supplementary Contract (Inc VAT)";
	tableRow5.data_1 = "Variation Order";
	tableRow6.data_1 = "Total Sum (Inc VAT)";
    tableRow1.amount=mainContract;
	refresh_field("contract_payment_table");

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
	tableRow2.data_1 = "(L) Previous Collected VAT";
	tableRow3.data_1 = "(M) VAT on Retention at this payment = K - L";
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
	tableRow2.data_1 = "(O) VAT on Sum Due to The Contractor = 15% * N";
	tableRow3.data_1 = "(P) VAT on Retention at this Payment = M";
	tableRow4.data_1 = "(Q) Total VAT Payable at this Payment = O + P";
	refresh_field("total_table");
}


function addRowToTSPC(frm, cdt, cdn) {
	// console.log(frm.doc.total_sum_of_payment_certificate)
	var total_sum_of_payment_certificate = frm.doc.total_sum_of_payment_certificate;

	console.log("Test 1");
	frm.set_value("total_sum_of_payment_certificate", []);

	var tableRow1 = frappe.model.add_child(frm.doc, "Total Sum of Payment Certificate", "total_sum_of_payment_certificate");
	var tableRow2 = frappe.model.add_child(frm.doc, "Total Sum of Payment Certificate", "total_sum_of_payment_certificate");
	var tableRow3 = frappe.model.add_child(frm.doc, "Total Sum of Payment Certificate", "total_sum_of_payment_certificate");
	var tableRow4 = frappe.model.add_child(frm.doc, "Total Sum of Payment Certificate", "total_sum_of_payment_certificate");
	var tableRow5 = frappe.model.add_child(frm.doc, "Total Sum of Payment Certificate", "total_sum_of_payment_certificate");
	tableRow1.deductions = "(E) Previous Payments";
	tableRow2.deductions = "(F) Adv.Recovery(100%)";
	tableRow3.deductions = "(G) Retantion 5%";
	tableRow4.deductions = "(H) Deduction for material on site";
	tableRow5.deductions = "(I) Total Deduction";
	refresh_field("total_sum_of_payment_certificate");

}


frappe.ui.form.on('Contract Payment Table', {
	amount: function(frm) {
		calculateTotalAmount(frm, 'contract_payment_table', "total_amount");
	}
});

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
	frm.setValue(valueField, totalAmount);
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



function assignPreviousPayment(frm){
   if(frm.doc.contract_no){
   frappe.call({
                method: 'frappe.client.get_list',
                args: {
                    doctype: 'Payment Certificate for Construction',
                    filters:{"contract_no":frm.doc.contract_no},
                    fields: ['name','total_payment_to_the_contractor_inc_vat','contract_date','net_sum_due_to_contactor']
                },
                callback: function (response) {
                var utilizationRegister = response.message;
                  console.log("utilization",utilizationRegister)
                 var totalAmount=0;
                 var  totalVat=0;
                for (var i in utilizationRegister) {
                                 var source_row = utilizationRegister[i];
                                 console.log("row",i)
                                 var vatValue;
                                 vatValue= source_row.net_sum_due_to_contactor * 0.15;
                                 var target_row = frappe.model.add_child(frm.doc,'Previous Payment Certification','previous_payment');
                                 target_row.payment_certification_no=source_row.name;
                                target_row.date = source_row.contract_date;
                                target_row.amount=source_row.net_sum_due_to_contactor;
                                target_row.vat=vatValue;
                                totalAmount+=source_row.net_sum_due_to_contactor;
                                totalVat+=vatValue
             
    
                }
            frm.set_value("total_inc_vat",vatValue);
            frm.set_value("total_exe_vat",totalAmount);
            refresh_field('previous_payment'); 

                }
            });
}
else{
 console.log("nothing excuted")

}
 
}
