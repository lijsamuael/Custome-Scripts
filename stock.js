frappe.ui.form.on('Purchase Order Item', {
  //when equip_code of Tyre Control Table changes it fetches data from the database and assign to equp_type of table document rows
    item_code: function(frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        // Fetch information from the linked doctype using a server call
        frappe.call({
            method: "frappe.client.get_value",
             args: {
                doctype: 'Stock Ledger Entry',
                filters: { item_code: child.item_code},
                fieldname: ['qty_after_transaction']
            },
            callback: function(response) {
                if (response.message) {
                // Update the "equipment_type" field in the current child table row
                   frappe.model.set_value(cdt, cdn, "stock_quantity", response.message.qty_after_transaction);
                   frappe.model.set_df_property(cdt, cdn,'stock_quantity', 'read_only', 1); // Make stock_quantity read-only
					//  frappe.model.set_value(d.doctype, d.name, 'ot_total_in_birr', (d.ot_normal_amount + d.ot_knight_

                }
            }
        });
    }});