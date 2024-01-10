frappe.ui.form.on("Performance Levels", {

	point: function(frm, cdt, cdn) {
		var row = locals[cdt][cdn];
		if (row.point && row.type) {
            if(row.type != "ጊዜ"){
                row.five = 0.95 * row.point;
                row.four = 0.8 * row.point;
                row.three = 0.65 * row.point;
                row.two = 0.5 * row.point;
                row.one = 0.5 * row.point;
            } else{
                console.log("wer are here")
                row.five = row.point + ((1 - 0.95) * row.point);
                row.four = row.point + ((1 - 0.8 )* row.point);
                row.three = row.point + ((1 - 0.65) * row.point);
                row.two = row.point + ((1 - 0.5 )* row.point);
                row.one = row.point + ((1 - 0.5 )* row.point);
            }
			refresh_field("goals");
		}
	}
});