frappe.ui.form.on("Cashflow  Schedule", {
    start_date: fetchAndAssign,
    project: fetchAndAssign,
    end_date: fetchAndAssign,
    onload: fetchAndAssign,
    

  });

  function fetchAndAssign(frm) {
    console.log("do anyways");
    if (frm) {
      frappe.call({
        method: "frappe.client.get_list",
        args: {
          doctype: "Operational Plan",
          filters: {
            start_date: frm.doc.start_date
              ? [">=", frm.doc.start_date]
              : undefined,
            end_date: frm.doc.end_date ? ["<=", frm.doc.end_date] : undefined,
            project: frm.doc.project ? frm.doc.project : undefined,
            name: ["!=", frm.docname],
          },
        },
        callback: function (response) {
          if (response.message && Array.isArray(response.message)) {
            var records = response.message;
            if (records.length === 0) {
              frm.clear_table("cashflow_table");
              refresh_field("cashflow_table");
            } else {
              console.log(`the operational plan obtained is ${records[0].name}`)
              fetchAndLogAllFields(records[0].name, frm);
            }
          }
        },
      });
    }
  }
  
  function fetchAndLogAllFields(utilizationRegisterName, frm) {
  
    const columns =
    [
      "1.1	Payments of completed Works",
      "1.2	Released Retentions",
      "1.3	Loan",
      "1.4	Miscellaneous",
      "Total Cash-inflow",
      "2.1	Cost of Construction Materials",
      " 2.2	Cost of Vehicles.Plants and Equipments",
      "2.3	Cost of Labors",
      "3.1	Project Staff Salaries",
      "3.2	Temporary Facilities",
      "3.3	Communication & Internet",
      "3.4	Office Supplies & Stationaries",
      "3.5	Transportation",
      "3.6	Vehicles & Equipment for Common works",
      "3.7	Head Office overhead Contribution",
      "Total Cash Out Flow",
      "Net Cash Flow",
    ];
    const months = [
      "m1",
      "m2",
      "m3",
      "m4",
      "m5",
      "m6",
      "m7",
      "m8",
      "m9",
      "m10",
      "m11",
      "m12",
    ];
    frm.clear_table("cashflow_table");
    for (var i = 0; i<columns.length; i++) {
      var timeSheetRow = frappe.model.add_child(
         frm.doc,
        "Cashflow Table",
        "cashflow_table"
      );
      timeSheetRow.flow = columns[i];
      timeSheetRow.m1 = "";
      timeSheetRow.m2 = "";
      timeSheetRow.m3 = "";
      timeSheetRow.m4 = "";
      timeSheetRow.m5 = "";
      timeSheetRow.m6 = "";
      timeSheetRow.m7 = "";
      timeSheetRow.m8 = "";
      timeSheetRow.m9 = "";
      timeSheetRow.m10 = "";
      timeSheetRow.m11 = "";
      timeSheetRow.m12 = "";
  }
    refresh_field("cashflow_table");
    frm.set_df_property('cashflow_table', 'read_only', 1);

    frappe.call({
      method: "frappe.client.get_list",
      args: {
        doctype: "Monthly Plan",
        filters: {
          operational_plan: utilizationRegisterName,
        },
      },
      callback: function (response) {
        if (response.message && Array.isArray(response.message)) {
          var monthlyPlans = response.message;
          for (var i = 0; i < monthlyPlans.length; i++) {
            (function (monthlyPlan) {
              frappe.call({
                method: "frappe.client.get_value",
                args: {
                  doctype: "Monthly Plan",
                  filters: {
                    name: monthlyPlan.name,
                  },
  
                  fieldname: [
                    "start_date",
                    "equipment_total_cost",
                    "man_power_total_cost",
                    "material_total_cost",
                  ],
                },
                callback: function (response) {
                  if (response.message) {
                    // Set any default values for the new row
                    const startDate = new Date(response.message.start_date);
                    const formattedMonth = months[startDate.getMonth()];
                    console.log(`formated month is ${formattedMonth}`);
                    frm.doc.cashflow_table[5][formattedMonth] =response.message.material_total_cost;
                    frm.doc.cashflow_table[6][formattedMonth] =response.message.equipment_total_cost;
                    frm.doc.cashflow_table[7][formattedMonth] =response.message.man_power_total_cost;
                    var total_outflow=response.message.material_total_cost+response.message.equipment_total_cost+response.message.man_power_total_cost;
                    var total_inflow=0;
                    var netCashflow=total_inflow-total_outflow;
                    frm.doc.cashflow_table[4][formattedMonth] =total_inflow;
                    frm.doc.cashflow_table[15][formattedMonth]=total_outflow;
                    frm.doc.cashflow_table[16][formattedMonth]=netCashflow;
                   
                  }  
                  else {
                  }
                  if (i === monthlyPlans.length - 1) {
                    // This is the last iteration, refresh the field
                    refresh_field("cashflow_table");
                  }
                },
              });
            })(monthlyPlans[i]);
          }
        } else {
          console.log(
            "No records found in the Monthly Plan for the given Operational Plan."
          );
        }
      },
    });
  }
  