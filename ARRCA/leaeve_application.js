frappe.ui.form.on("Leave Application", {
    
    from_date_ec:function(frm, cdt, cdn) {
            if(frm.doc.from_date_ec) {
                var finalgc = convertDateTOGC(frm.doc.from_date_ec.toString());
                frm.doc.from_date = finalgc;
                refresh_field("from_date");
            }
        },
    to_date_ec:function(frm, cdt, cdn) {
            if(frm.doc.to_date_ec) {
                var finalgc = convertDateTOGC(frm.doc.to_date_ec.toString());
                frm.doc.to_date = finalgc;
                refresh_field("to_date");
            }
        },
        half_start_date_ec:function(frm, cdt, cdn) {
            if(frm.doc.half_start_date_ec) {
                var finalgc = convertDateTOGC(frm.doc.half_start_date_ec.toString());
                frm.doc.half_start_date_gc = finalgc;
                refresh_field("half_start_date_gc");
                halfDay(frm)
            }
        },
        half_end_date_ec:function(frm, cdt, cdn) {
            if(frm.doc.half_end_date_ec) {
                var finalgc = convertDateTOGC(frm.doc.half_end_date_ec.toString());
                frm.doc.half_end_date_gc = finalgc;
                refresh_field("half_end_date_gc");
                halfDay(frm)
            }
        },
    
    });
    
    function halfDay(frm){
        if(frm.doc.half_start_date_gc && frm.doc.half_end_date_gc){
            var days = frm.doc.half_end_date_ec.split('/')[0] - frm.doc.half_start_date_ec.split('/')[0] + 1;
            console.log("days", days)
            console.log("total leave days", frm.doc.total_leave_days)
            frm.doc.total_leave_days = (frm.doc.total_leave_days || 0) + (days / 2);
            frm.refresh_field("total_leave_days")
        }
    }


