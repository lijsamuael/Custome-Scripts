frappe.ui.form.on('Fuel Request for Equipment Form', {
	plate_no: function(frm) {
		console.log("Test 1");

		if (frm.doc.plate_no) {
			
			console.log("Test 2");
			cur_frm.add_fetch('plate_no', 'make', 'equipment_description');
			cur_frm.add_fetch('plate_no', 'make', 'equipment_description');
			frm.refresh_field("equipment_description");
		}
	},
});