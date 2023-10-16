frappe.ui.form.on('Road Work Project Rental Vehicles Control Form', {
	onload: function(frm) {
		addRow(frm);
	}
});


frappe.ui.form.on('Rental Vehicle Control Table', {
	start_km: function(frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		console.log("row1", row)
        calculateAverageDistance(frm, row);
	},
	end_km: function(frm, cdt, cdn){
		var row = locals[cdt][cdn];
		console.log("row2", row)
        calculateAverageDistance(frm, row);
	},
	avarage_distance: function(frm, cdt, cdn){
		var row = locals[cdt][cdn];
		console.log("row2", row)
        calculateTotalDistance(frm, row);
	},
	distance: function(frm, cdt, cdn){
		var row = locals[cdt][cdn];
		console.log("row2", row)
        calculateTotalDistance(frm, row);
	},
	total_distance: function(frm, cdt, cdn){
		var row = locals[cdt][cdn];
		calculateTotalWorkL3(frm, row)
		calculateTotalWorkG3(frm, row)
	},
	less_than_three: function(frm, cdt, cdn){
		var row = locals[cdt][cdn];
		calculateTotalWorkL3(frm, row)
	},
	greater_than_three: function(frm, cdt, cdn){
		var row = locals[cdt][cdn];
		calculateTotalWorkG3(frm, row)
	},
	capacity: function(frm, cdt, cdn){
		var row = locals[cdt][cdn];
		calculateTotalWorkL3(frm, row)
		calculateTotalWorkG3(frm, row)
	}
});

// Function to calculate average distance
function calculateAverageDistance(frm, row) {
    if (row.start_km && row.end_km) {
        var average_distance = (row.end_km - row.start_km) / 2;
		console.log("avarage distance", average_distance)
        frappe.model.set_value(row.doctype, row.name, 'avarage_distance', average_distance);
        refresh_field('table');
    }
}

// Function to calculate total km distance
function calculateTotalDistance(frm, row) {
    if (row.avarage_distance && row.distance) {
        var total_distance = (row.avarage_distance + row.distance);
		console.log("total distance", total_distance)
        frappe.model.set_value(row.doctype, row.name, 'total_distance', total_distance);
        refresh_field('table');
    }
}

// Function to calculate work for less than 3 km
function calculateTotalWorkL3(frm, row) {
    if (row.total_distance && row.less_than_three && row.capacity) {
        var total_work = (row.total_distance * row.less_than_three * row.capacity);
		console.log("total work", total_work)
        frappe.model.set_value(row.doctype, row.name, 'work_capacity1', total_work);
        refresh_field('table');
    }
}

// Function to calculate work for greater than 3 km
function calculateTotalWorkG3(frm, row) {
    if (row.total_distance && row.greater_than_three && row.capacity) {
        var total_work = (row.total_distance * row.greater_than_three * row.capacity);
		console.log("total work", total_work)
        frappe.model.set_value(row.doctype, row.name, 'work_capacity2', total_work);
        refresh_field('table');
    }
}

//add row to the table
function addRow(frm, cdt, cdn) {
	var table = frm.doc.table;
	frm.clear_table("table");
	frm.set_value("table", []);

	for (var i = 0 ; i < 30; i++){
		var tableRow = frappe.model.add_child(frm.doc, "Rental Vehicle Control Table", "table");
	}
	refresh_field("table");
}