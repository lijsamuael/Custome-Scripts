frappe.ui.form.on("Concrete Test Summision", {
	paid:function(frm, cdt, cdn) {
		if(frm.doc.paid == 1 && frm.doc.not_yet_paid){
            frm.set_value('not_yet_paid', 0)
            frm.refresh_field("not_yet_paid")
        }
	},
    not_yet_paid:function(frm, cdt, cdn) {
		if(frm.doc.paid == 1 && frm.doc.not_yet_paid){
            frm.set_value('paid', 0)
            frm.refresh_field("paid")
        }
	}
});