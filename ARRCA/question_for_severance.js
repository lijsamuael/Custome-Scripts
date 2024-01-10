frappe.ui.form.on("Question of severance pay Table", {
    
    count:function(frm, cdt, cdn) {
        console.log("we are here")
        var row = locals[cdt][cdn];
        if(row.count && row.waiting_time && row.payment){
            row.total = row.count * row.waiting_time * row.payment;
        }
        frm.refresh_field("question_of_severance_pay")
        },
    waiting_time:function(frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        if(row.count && row.waiting_time && row.payment){
            row.total = row.count * row.waiting_time * row.payment;
        }
        frm.refresh_field("question_of_severance_pay")
        },
    payment:function(frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        if(row.count && row.waiting_time && row.payment){
            row.total = row.count * row.waiting_time * row.payment;
        }
        frm.refresh_field("question_of_severance_pay")
        }
    
    });



    // frappe.ui.form.on("Question of severance pay Table", {
    //     count: function (frm, cdt, cdn) {
    //         var sub_total = 0;
    //         $.each(frm.doc.question_of_severance_pay, function (i, d) {
    //             d.total = parseFloat(d.count) * d.payment * parseFloat(d.waiting_time);
    //             sub_total += d.total;
    //         })
    //         frm.set_value("sub_total", sub_total);
    //         refresh_field("sub_total");
    //        frm.refresh_field("question_of_severance_pay");
    //     },
    //     waiting_time: function (frm, cdt, cdn) {
    //         var sub_total = 0;
    //         $.each(frm.doc.question_of_severance_pay, function (i, d) {
    //             d.total = parseFloat(d.count) * d.payment * parseFloat(d.waiting_time);
     
    //             sub_total += d.total;
    //         })
    //          frm.refresh_field("question_of_severance_pay");
    //         frm.set_value("sub_total", sub_total);
    //         refresh_field("sub_total");
    //     },
    //     payment: function (frm, cdt, cdn) {
    //         var sub_total = 0;
    //         $.each(frm.doc.question_of_severance_pay, function (i, d) {
    //             d.total = parseFloat(d.count) * d.payment * parseFloat(d.waiting_time);
    //             sub_total += d.total;
    //         })
    //          frm.refresh_field("question_of_severance_pay");
    //         frm.set_value("sub_total", sub_total);
    //         refresh_field("sub_total");
    //     },
    // });