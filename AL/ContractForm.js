frappe.ui.form.on("CFF", {
	quantity: function(frm){
		console.log("Test 1");
		calclulateAmont(frm);
	}
})

frappe.ui.form.on("CFF", {
	rate: function(frm){
		console.log("Test 2");
		calclulateAmont(frm);
	}
})

function calclulateAmont(frm){
	console.log("frm doc value", frm.doc)
	var totalAmount = 0;
	frm.doc.cft.map((row) => {
		console.log("Each row", row);
		var quantity = row.quantity;
		var rate = row.rate;

		var amount = quantity * rate;
		totalAmount += amount;
		frappe.model.set_value(row.doctype, row.name, 'amount', amount)
		frm.refresh_field("cft");
	})
	console.log("total amount", totalAmount);
	frm.set_value("total_amount",totalAmount);	
}