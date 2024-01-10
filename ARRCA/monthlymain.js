frappe.ui.form.on("Monthly monitoring of fuel_grease_oil child", {
    start: function(frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        console.log("i am here")
        if(row.start && row.end){
            var total = row.end - row.start;
            row.diff = total;
        }
        frm.refresh_field("data_9")
   },
   end: function(frm, cdt, cdn) {
    var row = locals[cdt][cdn];
    console.log("i am here")
    if(row.start && row.end){
        var total = row.end - row.start;
        row.diff = total;
    }
    frm.refresh_field("data_9")

}
});
