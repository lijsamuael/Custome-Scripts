frappe.ui.form.on("Cannibalization request Form", {
    date_ec:function(frm, cdt, cdn) {
        if(frm.doc.date_ec) {
            var finalgc = convertDateTOGC(frm.doc.date_ec.toString());

                var dateObject = new Date(finalgc);
            // Format the date as a string in a desired format
                   var formattedDate = dateObject.toISOString().slice(0, 10);  // YYYY-MM-DD
                    frm.set_value("date", formattedDate);
                    frm.refresh_field("date")
                    refresh_field("date");
            
        }
    }
});
cur_frm.add_fetch('to', 'equipment_type', 'eqipment_type');

cur_frm.add_fetch('cannibalized_by', 'employee_name', 'full_name');

cur_frm.add_fetch('to', 'chasis_no', 'chasis_no');
cur_frm.add_fetch('to', 'engine_no', 'engine_no');
cur_frm.add_fetch('from', 'equipment_type', 'from_equipent_type');
cur_frm.add_fetch('from', 'chasis_no', 'from_chasis_no');
cur_frm.add_fetch('from', 'engine_no', 'from_engine_no');
frappe.ui.form.on('parts', {
    qty: function(frm) {
        // calculate incentives for each person on the deal
      var  total_cost = 0
        $.each(frm.doc.part, function(i, d) {
            var row_total=d.qty*d.estimated_price
            d.total_price=row_total
            total_cost+=d.total_price
            frm.refresh_field("part")
        });
        frm.set_value("total_cost",total_cost)
        frm.refresh_field("total_cost")

    } ,
    estimated_price: function(frm) {
        // calculate incentives for each person on the deal
        var total_cost = 0
        $.each(frm.doc.part, function(i, d) {
        var row_total=d.qty*d.estimated_price
           d.total_price=row_total
           total_cost+=d.total_price 
           frm.refresh_field("part")
          
        });
        frm.set_value("total_cost",total_cost);
        frm.refresh_field("total_cost")

    },
    description:function(frm,cdt,cdn){
     var child=locals[cdt][cdn]
     if(!frm.doc.to ||!frm.doc.from){
        frappe.throw({
            title: __("Insert"),
            message: __("Please Insert To or From vehicle")
        });

     }
     else{
        checkCannibalize(frm,"to",child);
        checkCannibalize(frm,"from",child);
     }    
    }
})
function checkCannibalize(frm,which,child){
    frappe.call({
        method: "frappe.client.get_list",
        args: {
            doctype: 'Cannibalization request Form',
            filters: {
                [which]: frm.doc[which]
            },
            fields: ['name']
        },
        callback: function(response) {
         console.log("the response message is",response) 
           for(var i=0;i<response.message.length;i++){
            frappe.call({
                method: "frappe.client.get_list",
                args: {
                    doctype: 'parts',
                    filters: {
                        parent: response.message[i].name
                    },
                    fields: ['description']
                },
                callback: function(response) {
                    for(var j=0;j<response.message.length;j++){
                         if(response.message[j].description==child.description){
                            frappe.throw({
                                title: __("Cannibalized"),
                                message: __(`${child.description} is already cannibalized ${which} ${frm.doc[which]}`)
                            });
                          
                         }  
                    }
                    console.log("parts are",response)         
                    
                }
            });

           }   
        }
    });
}


