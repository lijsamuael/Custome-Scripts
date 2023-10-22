cur_frm.add_fetch('for_which_task', 'subject', 'description');


frappe.ui.form.on("Sub Contract Form", {
	project: function(frm, cdt, cdn) {
		frm.set_query("for_which_task", "list_of_activities", function() {
			return {
				"filters": {
					"project": frm.doc.project
				}
			}
		});
	}
});

frappe.ui.form.on("Activity Table For SubContract", {
	onload: function(frm, cdt, cdn) {
		if(frm.doc.project){
			frm.set_query("for_which_task", "list_of_activities", function() {
				return {
					"filters": {
						"project": frm.doc.project
					}
				}
			});
		}
	}
});