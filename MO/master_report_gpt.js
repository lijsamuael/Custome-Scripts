frappe.ui.form.on('Master Schedule', {
	project: fetchAndAssign,
	from_date: fetchAndAssign,
	to_date: fetchAndAssign,
	report_type: fetchAndAssign // Add this line to execute the code when report_type is changed
});

frappe.ui.form.on('Master Schedule', {
	project: fetchActual,
	from_date: fetchActual,
	to_date: fetchActual,
	report_type: fetchActual // Add this line to execute the code when report_type is changed
});

function updateMaterialReportTable(frm, materialDetails, report) {
	for (var j = 0; j < materialDetails.length; j++) {
		var materialDetail = materialDetails[j];

		if (report === "material_detail_summerized") {
			var id = materialDetail.id_mat;
			var quantity = materialDetail.qty;

			var existingRow = null;

			// Check if item already exists in material_report_table
			for (var k = 0; k < frm.doc.material_report_table.length; k++) {
				if (frm.doc.material_report_table[k].id === id) {
					existingRow = frm.doc.material_report_table[k];
					break;
				}
			}

			// If item already exists, update the quantity and total_cost
			if (existingRow) {
				existingRow.quantity += quantity;
				existingRow.total_cost = existingRow.unit_rate * existingRow.quantity; // Update total_cost
			} else {
				// If item doesn't exist, add a new row
				var newRow = frappe.model.add_child(frm.doc, "Material Report Table", "material_report_table");
				newRow.id = id;
				newRow.item = materialDetail.item1;
				newRow.uom = materialDetail.uom;
				newRow.quantity = quantity;
				newRow.unit_rate = materialDetail.unit_price;
				newRow.total_cost = newRow.unit_rate * newRow.quantity; // Calculate total_cost
				frm.refresh_fields(newRow);
			}
		}


		else if (report === "manpower_detail_summerized") {
		    var id = materialDetail.id_map;
		    var quantity = materialDetail.efficency;
		
		    var existingRow = null;
		
		    // Check if item already exists in material_report_table
		    for (var k = 0; k < frm.doc.material_report_table.length; k++) {
		        if (frm.doc.material_report_table[k].id === id) {
		            existingRow = frm.doc.material_report_table[k];
		            break;
		        }
		    }
		
		    // If item already exists, update the quantity and total_cost
		    if (existingRow) {
		        existingRow.quantity += quantity;
		        existingRow.total_cost = existingRow.unit_rate * existingRow.quantity; // Update total_cost
		    } else {
		        // If item doesn't exist, add a new row
		        var newRow = frappe.model.add_child(frm.doc, "Material Report Table", "material_report_table");
		        newRow.id = id;
		        newRow.item = materialDetail.job_title;
		        newRow.quantity = quantity;
		        newRow.unit_rate = materialDetail.hourly_cost;
		        newRow.total_cost = newRow.unit_rate * newRow.quantity;
		        frm.refresh_fields(newRow);
		    }
		}

		else if (report === "machinery_detail_summerized") {
			 var id = materialDetail.id_mac;
			    var quantity = materialDetail.qty;
			
			    var existingRow = null;
			
			    // Check if item already exists in material_report_table
			    for (var k = 0; k < frm.doc.material_report_table.length; k++) {
			        if (frm.doc.material_report_table[k].id === id) {
			            existingRow = frm.doc.material_report_table[k];
			            break;
			        }
			    }
			
			    // If item already exists, update the quantity and total_cost
			    if (existingRow) {
			        existingRow.quantity += quantity;
			        existingRow.total_cost = existingRow.unit_rate * existingRow.quantity; // Update total_cost
			    } else {
			        // If item doesn't exist, add a new row
			        var newRow = frappe.model.add_child(frm.doc, "Material Report Table", "material_report_table");
			        newRow.id = id;
			        newRow.item = materialDetail.type;
			        newRow.quantity = quantity;
			        newRow.unit_rate = materialDetail.rental_rate;
			        newRow.total_cost = newRow.unit_rate * newRow.quantity;
			        frm.refresh_fields(newRow);
			    }
		}


	}
	
	console.log("materil report final", frm.doc.material_report_table);
	var table = frm.doc.material_report_table;
	var totalCost = 0;
	for (var i = 0; i < table.length; i++){
		totalCost += table[i].total_cost;
		console.log("total cost inside", totalCost);
	}
	frm.set_value("total_cost", totalCost);
	frm.refresh_fields("total_cost");
	
	frm.refresh_fields("material_report_table");
}



function processMaterialReportTable(frm, allDatas, report) {
	console.log("ere gudeee");
	console.log("allDatas length", allDatas.length);

	if (!frm.doc.material_report_table) {
		console.log("aebebebe")
		frm.set_value("material_report_table", []);
		var length = allDatas[0][report].length;
		var dataToBeInserted = allDatas[0][report];
		console.log("alskkld", dataToBeInserted);
		console.log("lengththth", length);

		for (var i = 0; i < length; i++) {
			console.log("all dddddd", dataToBeInserted)
			var tableRow = frappe.model.add_child(frm.doc, "Material Report Table", "material_report_table");
			var dataRow = dataToBeInserted[i]; // Access the correct index
			console.log("table row", tableRow);
			console.log("data row", dataRow);
			if (report === "material_detail_summerized") {
				tableRow.id = dataRow.id_mat;
				tableRow.item = dataRow.item1; // Assuming this property exists in dataRow
				tableRow.uom = dataRow.uom;
				tableRow.quantity = dataRow.qty;
				tableRow.unit_rate = dataRow.unit_price;
				tableRow.total_cost = dataRow.total_cost;
			}
			else if (report === "manpower_detail_summerized") {
				tableRow.id = dataRow.id_map;
				tableRow.item = dataRow.job_title; // Assuming this property exists in dataRow
				// tableRow.uom = dataRow.uom;
				tableRow.quantity = dataRow.efficency;
				tableRow.unit_rate = dataRow.hourly_cost;
				tableRow.total_cost = dataRow.total_hourly_cost;
			}
			else if (report === "machinery_detail_summerized") {
				tableRow.id = dataRow.id_mac;
				tableRow.item = dataRow.type; // Assuming this property exists in dataRow
				// tableRow.uom = dataRow.uom;
				tableRow.quantity = dataRow.qty;
				tableRow.unit_rate = dataRow.rental_rate;
				tableRow.total_cost = dataRow.total_hourly_cost;
			}
		}


		frm.refresh_fields();
	}

	var remainingData = allDatas.slice(1);
	console.log("remaining data", remainingData);

	// Process remainingData
	for (var i = 0; i < remainingData.length; i++) {
		var rowData = remainingData[i];
		var materialDetails = rowData[report];

		updateMaterialReportTable(frm, materialDetails, report);
	}
}

function fetchAndAssign(frm) {
	if (frm.doc.report_type) {
		frm.clear_table('material_report_table');
		let projectSelected = frm.doc.project;
		let startDate = frm.doc.from_date;
		let endDate = frm.doc.to_date;

		console.log("Project Selected:", projectSelected);
		console.log("Start Date:", startDate);
		console.log("End Date:", endDate);
		var allDatas = [];

		if (projectSelected) {

			let filters = {
				project: projectSelected
			};


			if (startDate && !endDate) {
				filters.date = ['>=', startDate];
			}

			if (endDate && !startDate) {
				filters.date = ['<=', endDate];
			}

			if (endDate && startDate) {
				filters.date = ['between', frm.doc.from_date, frm.doc.to_date]
			}

			frappe.call({
				method: 'frappe.client.get_list',
				args: {
					doctype: 'New Daily Plan',
					filters: filters,
				},
				callback: async function(response) {
					console.log("response", response);

					if (response.message && Array.isArray(response.message)) {
						var records = response.message;

						// Create a function that captures the correct index
						function fetchRecord(index) {
							if (index >= records.length) {
								console.log("all the data", allDatas);
								// Process data and populate table
								if (frm.doc.report_type === "Material Report") {
									processMaterialReportTable(frm, allDatas, "material_detail_summerized");
								}
								else if (frm.doc.report_type === "Manpower Report") {
									processMaterialReportTable(frm, allDatas, "manpower_detail_summerized");
								}
								else if (frm.doc.report_type === "Machinery/Equipment Report") {
									processMaterialReportTable(frm, allDatas, "machinery_detail_summerized");
								}
								return;
							}

							var record = records[index];
							frappe.call({
								method: 'frappe.client.get',
								args: {
									doctype: 'New Daily Plan',
									name: record.name
								},
								callback: function(recordResponse) {
									if (recordResponse.message) {
										var fetchedRecord = recordResponse.message;
										console.log("Fetched Record:", fetchedRecord);
										allDatas[index] = fetchedRecord;
									}
									// Fetch the next record
									fetchRecord(index + 1);
								}
							});
						}

						// Start fetching records from index 0
						fetchRecord(0);
					}
				}
			});
		}
		frm.refresh_fields("material_report_table");
	}
}















x
function updateActualTable(frm, materialDetails, report) {
	for (var j = 0; j < materialDetails.length; j++) {
		var materialDetail = materialDetails[j];

		if (report === "material1") {
			var id = materialDetail.id_mat;
			var quantity = materialDetail.qty;

			var existingRow = null;

			// Check if item already exists in material_report_table
			for (var k = 0; k < frm.doc.material_report_table.length; k++) {
				if (frm.doc.material_report_table[k].id === id) {
					existingRow = frm.doc.material_report_table[k];
					break;
				}
			}

			// If item already exists, update the quantity and total_cost
			if (existingRow) {
				existingRow.quantity += quantity;
				existingRow.total_cost = existingRow.unit_rate * existingRow.quantity; // Update total_cost
			} else {
				// If item doesn't exist, add a new row
				var newRow = frappe.model.add_child(frm.doc, "Actual Table", "actual_table");
				newRow.id = id;
				newRow.item = materialDetail.item1;
				newRow.uom = materialDetail.uom;
				newRow.quantity = quantity;
				newRow.unit_rate = materialDetail.unit_price;
				newRow.total_cost = newRow.unit_rate * newRow.quantity; // Calculate total_cost
				frm.refresh_fields(newRow);
			}
		}


		else if (report === "manpower1") {
		    var id = materialDetail.id_map;
		    var quantity = materialDetail.efficency;
		
		    var existingRow = null;
		
		    // Check if item already exists in material_report_table
		    for (var k = 0; k < frm.doc.material_report_table.length; k++) {
		        if (frm.doc.material_report_table[k].id === id) {
		            existingRow = frm.doc.material_report_table[k];
		            break;
		        }
		    }
		
		    // If item already exists, update the quantity and total_cost
		    if (existingRow) {
		        existingRow.quantity += quantity;
		        existingRow.total_cost = existingRow.unit_rate * existingRow.quantity; // Update total_cost
		    } else {
		        // If item doesn't exist, add a new row
		        var newRow = frappe.model.add_child(frm.doc, "Actual Table", "actual_table");
		        newRow.id = id;
		        newRow.item = materialDetail.job_title;
		        newRow.quantity = quantity;
		        newRow.unit_rate = materialDetail.hourly_cost;
		        newRow.total_cost = newRow.unit_rate * newRow.quantity;
		        frm.refresh_fields(newRow);
		    }
		}

		else if (report === "machinery1") {
			 var id = materialDetail.id_mac;
			    var quantity = materialDetail.qty;
			
			    var existingRow = null;
			
			    // Check if item already exists in material_report_table
			    for (var k = 0; k < frm.doc.material_report_table.length; k++) {
			        if (frm.doc.material_report_table[k].id === id) {
			            existingRow = frm.doc.material_report_table[k];
			            break;
			        }
			    }
			
			    // If item already exists, update the quantity and total_cost
			    if (existingRow) {
			        existingRow.quantity += quantity;
			        existingRow.total_cost = existingRow.unit_rate * existingRow.quantity; // Update total_cost
			    } else {
			        // If item doesn't exist, add a new row
			        var newRow = frappe.model.add_child(frm.doc, "Actual Table", "actual_table");
			        newRow.id = id;
			        newRow.item = materialDetail.type;
			        newRow.quantity = quantity;
			        newRow.unit_rate = materialDetail.rental_rate;
			        newRow.total_cost = newRow.unit_rate * newRow.quantity;
			        frm.refresh_fields(newRow);
			    }
		}


	}
	
	console.log("materil report final", frm.doc.actual_table);
	var table = frm.doc.actual_table;
	var totalCost = 0;
	for (var i = 0; i < table.length; i++){
		totalCost += table[i].total_cost;
		console.log("total cost inside", totalCost);
	}
	frm.set_value("actual_total_cost", totalCost);
	frm.refresh_fields("actual_total_cost");
	
	frm.refresh_fields("actual_table");
}



function processActualTable(frm, allDatas, report) {
	console.log("allDatas length", allDatas.length);

	if (!frm.doc.material_report_table) {
		frm.set_value("actual_table", []);
		var length = allDatas[0][report].length;
		var dataToBeInserted = allDatas[0][report];
		console.log("alskkld", dataToBeInserted);
		console.log("lengththth", length);

		for (var i = 0; i < length; i++) {
			console.log("all dddddd", dataToBeInserted)
			var tableRow = frappe.model.add_child(frm.doc, "Actual Table", "actual_table");
			var dataRow = dataToBeInserted[i]; // Access the correct index
			console.log("table row", tableRow);
			console.log("data row", dataRow);
			if (report === "material1") {
				tableRow.id = dataRow.id_mat;
				tableRow.item = dataRow.item1; // Assuming this property exists in dataRow
				tableRow.uom = dataRow.uom;
				tableRow.quantity = dataRow.qty;
				tableRow.unit_rate = dataRow.unit_price;
				tableRow.total_cost = dataRow.total_cost;
			}
			else if (report === "manpower1") {
				tableRow.id = dataRow.id_map;
				tableRow.item = dataRow.job_title; // Assuming this property exists in dataRow
				// tableRow.uom = dataRow.uom;
				tableRow.quantity = dataRow.efficency;
				tableRow.unit_rate = dataRow.hourly_cost;
				tableRow.total_cost = dataRow.total_hourly_cost;
			}
			else if (report === "machinery1") {
				tableRow.id = dataRow.id_mac;
				tableRow.item = dataRow.type; // Assuming this property exists in dataRow
				// tableRow.uom = dataRow.uom;
				tableRow.quantity = dataRow.qty;
				tableRow.unit_rate = dataRow.rental_rate;
				tableRow.total_cost = dataRow.total_hourly_cost;
			}
		}


		frm.refresh_fields();
	}

	var remainingData = allDatas.slice(1);
	console.log("remaining data", remainingData);

	// Process remainingData
	for (var i = 0; i < remainingData.length; i++) {
		var rowData = remainingData[i];
		var materialDetails = rowData[report];

		updateActualTable(frm, materialDetails, report);
	}
}


function fetchActual(frm) {
	if (frm.doc.report_type) {
		frm.clear_table('actual_table');
		let projectSelected = frm.doc.project;
		let startDate = frm.doc.from_date;
		let endDate = frm.doc.to_date;

		console.log("Project Selected:", projectSelected);
		console.log("Start Date:", startDate);
		console.log("End Date:", endDate);
		var allDatas = [];

		if (projectSelected) {

			let filters = {
				project: projectSelected
			};


			if (startDate && !endDate) {
				filters.date = ['>=', startDate];
			}

			if (endDate && !startDate) {
				filters.date = ['<=', endDate];
			}

			if (endDate && startDate) {
				filters.date = ['between', frm.doc.from_date, frm.doc.to_date]
			}

			frappe.call({
				method: 'frappe.client.get_list',
				args: {
					doctype: 'Timesheet',
					filters: filters,
				},
				callback: async function(response) {
					console.log("response from actual", response);

					if (response.message && Array.isArray(response.message)) {
						var records = response.message;

						// Create a function that captures the correct index
						function fetchRecord(index) {
							if (index >= records.length) {
								console.log("all the datassssssss", allDatas);
								// Process data and populate table
								if (frm.doc.report_type === "Material Report") {
									processActualTable(frm, allDatas, "material1");
								}
								else if (frm.doc.report_type === "Manpower Report") {
									processActualTable(frm, allDatas, "manpower1");
								}
								else if (frm.doc.report_type === "Machinery/Equipment Report") {
									processActualTable(frm, allDatas, "machinery1");
								}
								return;
							}

							var record = records[index];
							frappe.call({
								method: 'frappe.client.get',
								args: {
									doctype: 'Timesheet',
									name: record.name
								},
								callback: function(recordResponse) {
									if (recordResponse.message) {
										var fetchedRecord = recordResponse.message;
										console.log("Fetched Record:", fetchedRecord);
										allDatas[index] = fetchedRecord;
									}
									// Fetch the next record
									fetchRecord(index + 1);
								}
							});
						}

						// Start fetching records from index 0
						fetchRecord(0);
					}
				}
			});
		}
		frm.refresh_fields("actual_table");
	}
}
