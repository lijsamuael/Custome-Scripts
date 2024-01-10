frappe.ui.form.on('Fleet Management Plan Table', {
    income_hr: function(frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        console.log("we are here", row)
        if(row.income_hr && row.income_km){
            row.total_income = row.income_hr + row.income_km;
        }
        frm.refresh_field('items');
    },
    income_km: function(frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        console.log("we are here", row)
        if(row.income_hr && row.income_km){
            row.total_income = row.income_hr + row.income_km;
        }
        frm.refresh_field('items');
    },
  
});