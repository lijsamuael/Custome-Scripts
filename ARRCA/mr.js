cur_frm.add_fetch('plate_no', 'chasis_no', 'chasis_no');

frappe.ui.form.on('Material Request Item', {
    //when equip_code of Tyre Control Table changes it fetches data from the database and assign to equp_type of table document rows
    item_code: function (frm, cdt, cdn) {
        var child = locals[cdt][cdn];
        frappe.call({
            method: "frappe.client.get_list",
            args: {
                doctype: 'Stock Ledger Entry',
                filters: {
                    item_code: child.item_code,
                },
                fields: ['*']
            },
            callback: function (response) {
                if (response.message) {
                    let warehouseEntries = {};

                    response.message.forEach((entry) => {
                        if (!warehouseEntries[entry.warehouse]) {
                            warehouseEntries[entry.warehouse] = entry;
                        } else {
                            if (new Date(entry.posting_time) > new Date(warehouseEntries[entry.warehouse].posting_time)) {
                                warehouseEntries[entry.warehouse] = entry;
                            }
                        }
                    });
                    // let warehouseArray = Object.keys(warehouseEntries);
                    // for(var k=0;k<warehouseArray.length;k++){
                    //         console.log("ware house name is",warehouseArray[k])
                    //         frm.set_value("warehouse",warehouseArray[k])
                    //         frm.refresh_field("warehouse")
                    //       }
                    
                   // frappe.model.set_value(cdt, cdn, "location", warehouseArray);
                     frm.refresh_field("items")  
                    let total = 0;
                    Object.values(warehouseEntries).forEach((entry) => {
                        total += entry.qty_after_transaction;
                    });

                    frappe.model.set_value(cdt, cdn, "stock_quantity", total);
                    frm.refresh_field("items");
                }
            }
        });
    },
    });
  
  
frappe.ui.form.on("Material Request", {
    required_date_ec: function(frm) {
        if(frm.doc.required_date_ec){
            var date = convertDateTOGC(frm.doc.required_date_ec.toString());
            var dateObject = new Date(date);
    // Format the date as a string in a desired format
           var formattedDate = dateObject.toISOString().slice(0, 10);  // YYYY-MM-DD
            frm.set_value("schedule_date", formattedDate);
            frm.refresh_field("schedule_date")
        }
    },
});
frappe.ui.form.on("Material Request", {
    date_ec: function(frm) {
        if(frm.doc.date_ec){
            var date = convertDateTOGC(frm.doc.date_ec.toString());
            var dateObject = new Date(date);
    // Format the date as a string in a desired format
           var formattedDate = dateObject.toISOString().slice(0, 10);  // YYYY-MM-DD
            frm.set_value("date_gc", formattedDate);
            frm.refresh_field("date_gc")
        }
    },
}); 
  cur_frm.add_fetch("item_code", "brand", "shelf_no");
  
// frappe.ui.form.on('Material Request', {
//  onload: function(frm) {
//   frappe.call({
//    method: 'frappe.client.get_value',
//    args: {
//     doctype: 'User',
//     filters: { name: frappe.session.user },
//     fieldname: ['full_name']
//    },
//    callback: function(response) {
//     var user = response.message;
//     if (user) {
//      frm.set_value('prepared_by', user.full_name);
//     }
//    }
//   });
//  }
// });
