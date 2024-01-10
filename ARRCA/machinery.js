frappe.ui.form.on("Machinery", {
    mc_number: function(frm, cdt, cdn) {
      var d = locals[cdt][cdn];
              frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (d.
mc_number * d.rental_rate * d.uf * d.efficiency)); 
   }
});

frappe.ui.form.on("Machinery", {
    rental_rate: function(frm, cdt, cdn) {
      var d = locals[cdt][cdn];
              frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (d.
mc_number * d.rental_rate * d.uf * d.efficiency * d.mc_number)); 
   }
});

frappe.ui.form.on("Machinery", {
    efficiency: function(frm, cdt, cdn) {
      var d = locals[cdt][cdn];
              frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (d.
mc_number * d.rental_rate * d.uf * d.efficiency * d.mc_number)); 
   }
});

frappe.ui.form.on("Machinery", {
    uf: function(frm, cdt, cdn) {
      var d = locals[cdt][cdn];
              frappe.model.set_value(d.doctype, d.name, 'total_hourly_cost', (d.
mc_number * d.rental_rate * d.uf * d.efficiency * d.mc_number)); 
   }
});


frappe.ui.form.on("Machinery", {
    total_hourly_cost: function(frm, cdt, cdn) {
      var d = locals[cdt][cdn];
              frappe.model.set_value(d.doctype, d.name, 'fuel_cost_per_hour', (d.
total_hourly_cost* d.standard_fuel_consumption)); 
   }
});

frappe.ui.form.on("Machinery", {
    fuel_unit_price: function(frm, cdt, cdn) {
      var d = locals[cdt][cdn];
              frappe.model.set_value(d.doctype, d.name, 'fuel_cost_per_hour', (d.
total_hourly_cost* d.fuel_unit_price)); 
   }
});