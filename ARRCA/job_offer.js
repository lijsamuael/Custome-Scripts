// frappe.ui.form.on("Job Offer", {
//     offer_date_ec:function(frm, cdt, cdn) {
//         if(frm.doc.offer_date_ec) {

//             var finalgc = convertDateTOGC(frm.doc.offer_date_ec.toString());
//             frm.doc.offer_date = finalgc;
//             refresh_field("offer_date");
            
//         }
//     }
// });

frappe.ui.form.on("Job Offer", {
    offer_date_ec: function(frm) {
        if(frm.doc.offer_date_ec){
            var date = convertDateTOGC(frm.doc.offer_date_ec.toString());
            var dateObject = new Date(date);
    // Format the date as a string in a desired format
           var formattedDate = dateObject.toISOString().slice(0, 10);  // YYYY-MM-DD
            frm.set_value("offer_date", formattedDate);
            frm.refresh_field("offer_date")
        }
    },
});