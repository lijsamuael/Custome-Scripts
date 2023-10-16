frappe.ui.form.on('Supplier Quotation', {
  //when equip_code of Tyre Control Table changes it fetches data from the database and assign to equp_type of table document rows
    equip_code: function(frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        // Fetch information from the linked doctype using a server call
        frappe.call({
            method: "frappe.client.get_value",
             args: {
                doctype: 'Equipment Birth Certificate Form',
                filters: { plate_no: child.equip_code},
                fieldname: ['equipment_type']
            },
            callback: function(response) {
                if (response.message) {

                // Update the "equipment_type" field in the current child table row
                    frappe.model.set_value(cdt, cdn, "equip_type", response.message.equipment_type);
                 //  frappe.model.set_value(d.doctype, d.name, 'ot_total_in_birr', (d.ot_normal_amount + d.ot_knight_

                }
            }
        });
    }});
frappe.ui.form.on('Rejection criteria', {
   req_qutation:function(frm) {
        if (frm.doc.req_qutation) {
            frm.clear_table('suppliers_quatation_table');
            frappe.call({
             method: 'frappe.client.get_list',
		 args: {
           doctype: 'Supplier Quotation',
           filters: { req_qutation:frm.doc.req_qutation},
           fields: ['supplier','transaction_date']
         },
               
                callback: function(response) {
					 for(i=0;i<response.message.length;i++){
						console.log("the response of rejection is ",response.message)
                        var source_doc = response.message[i];
                        const target_row = frm.add_child('suppliers_quatation_table');
                        target_row.supplier = source_row.supplier;
                        target_row.date= source_row.transaction_date;

					 }
				 frm.refresh_field('suppliers_quatation_table'); // Refresh the child table

                }
            });
        }
    }
});
