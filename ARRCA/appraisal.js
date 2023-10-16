frappe.ui.form.on('Appraisal Goal', {
    score_final: function(frm, cdt, cdn) {
		var child = locals[cdt][cdn];
        console.log("child", child)
		var total = 0
		var table  = frm.doc.goals;
		for(var i = 0; i < table.length; i++){
			total += table[i].score_final || 0;
			console.log("score", total)
		}
		frm.set_value("total_scores", total)
		frm.refresh_field("total_scores")
    },
});