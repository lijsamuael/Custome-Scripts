frappe.ui.form.on("Leave Allocation", {

	to_date_ec: function(frm, cdt, cdn) {
           if(frm.doc.to_date_ec){
                console.log("i am ere")

                var finalgc = convertDateTOGC(frm.doc.to_date_ec.toString());
        
                frm.doc.to_date = finalgc;
                console.log("todateee", frm.doc.to_date)
                frm.refresh_field("to_date");
           }
	},
        from_date_ec: function(frm, cdt, cdn) {
                if(frm.doc.from_date_ec){
                     console.log("i am ere")
     
                     var finalgc = convertDateTOGC(frm.doc.from_date_ec.toString());
             
                     frm.doc.from_date = finalgc;
                     console.log("todateee", frm.doc.from_date)
                     frm.refresh_field("from_date");
                }
             }
});