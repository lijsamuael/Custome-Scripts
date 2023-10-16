frappe.ui.form.on('Operation Request and Permission Form', {
	onload: function(frm) {
		addRow(frm);
	}
});

var amharicText = [
    { type: "የቋሚ ሰራተኞች ሕክም", code: "6121" },
    { type: "የኮንት ሰራተኞች ሕክምና", code: "6123" },
    { type: "የደንብ ልብስ", code: "6211" },
    { type: "የጽህፈት መሳሪያ", code: "6212" },
    { type: "ሕትመት", code: "6213" },
    { type: "ነዳጅና ቅባት", code: "6217" },
    { type: "ለሌሎች አላቂ እቃዎች", code: "6218" },
    { type: "የጽዳት ዕቃዎች", code: "6219" },
    { type: "ውሎ አበል", code: "6231" },
    { type: "መጓጓዣ", code: "6232" },
    { type: "የተሽከርካሪዎች ጥገና", code: "6241" },
    { type: "ሀ/ጥገና", code: "" },
    { type: "ለ/መለዋወጫ", code: "" },
    { type: "ለማሽነሪና ኘላት ጥገና", code: "6243" },
    { type: "ሀ/ ጥገና", code: "" },
    { type: "ለ/ መለዋወጫ", code: "" },
    { type: "የጉልበት ኪራይ", code: "6255" },
    { type: "የአገልግሎት ክፍያ", code: "6356" },
    { type: "ሀ/ ለባንክ አገልግሎት", code: "" },
    { type: "ለ/ ለተሽከ ዓመታዊ ምርመራ", code: "" },
    { type: "ለስልክ", code: "6258" },
    { type: "ለውሃ", code: "6259" },
    { type: "ቋሚ ዕቃዎች", code: "6313" },
    { type: "ለሕንፃ ለቁሳቁስና", code: "6314" },
    { type: "ሀ/ የኤሌትሪክ ዕቃዎች", code: "" },
    { type: "ለ/ የቢሮ እቃወች", code: "" },
    { type: "ለመሠረተ ልማት ግንባታ", code: "6324" },
    { type: "ሀ/ ቆርቆሮ", code: "" },
    { type: "ለ/ ጣውላ/ሞራሌ", code: "" },
    { type: "ሐ/ ባህርዛፍ", code: "" },
    { type: "መ/ ምስማር", code: "" },
    { type: "ሠ/ አሽዋ", code: "" },
    { type: "ረ/ ማሰርያ ሽቦ", code: "" },
    { type: "ሸ/ ልዩ ልዩ", code: "" }
];


// Add row to the table
function addRow(frm, cdt, cdn) {
    var table = frm.doc.table;
    frm.clear_table("table");

    for (var i = 0; i < amharicText.length; i++) {
		
        var row = frappe.model.add_child(frm.doc, "Operation Request and Permission Table", "table");
        row.type = amharicText[i].type;
        row.code = amharicText[i].code;

		console.log("row after", row)
    }
	refresh_field("table");
}