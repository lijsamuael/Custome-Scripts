frappe.ui.form.on("Item", {
    item_category: function(frm, cdt, cdn) {
     
     var d = locals[cdt][cdn];

     frm.set_query("item_sub_category", function() {
        return {
            "filters": {
                "item_category": frm.doc.item_category
            }
        }
     });
   },

   item_sub_category: function(frm) {
    cur_frm.add_fetch('item_sub_category', 'item_category', 'item_category');
    updateItemCode(frm);
   }
});




frappe.ui.form.on('PR', {
  onload: function(frm) {
    frm.set_query("sr_no", function() {
      return {
        filters: {
          doctype: 'Material Request',
          docstatus: 1 // Filter to show only submitted Material Requests (docstatus = 1)
        }
      };
    });
  }
});
