frappe.ui.form.on("Bridge Inventory Sheet", {
    onload: function(frm, cdt, cdn) {
        var list = [
            "GeneraL Information",
            "Bridge Reference number",
            "Chainage/Station",
            "Name of river",
            "Length of Bridge",
            "Width of carriageway",
            "Clear Height of opening",
            "Clear width of opening",
            "River flow direction",
            "number of spans",
            "Landmarks",
            "COnstruction Detail",
            "Running Surface",
            "Type of Super Structure",
            "Type of Pier Structure",
            "Type of Abutemen Structure",
            "Type of foundation structure",
            "Movement(bearing type)",
            "Orientation(Skew/Orthogonal)"
        ];

        for (var i = 0; i < list.length; i++) {
            var table_row = frm.add_child("bridge_inventory_sheet_table");
             table_row.title=list[i];
             table_row.data=" ";
        }

        frm.refresh_field("bridge_inventory_sheet_table");
    }
});
