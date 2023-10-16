frappe.ui.form.on('Project Evaluation Form', {
	onload: function(frm) {
		addRow(frm);
	},
});

var totalSum = 0;

frappe.ui.form.on('Project Evaluation Table', {
	value: function(frm, cdt, cdn) {
		var row = locals[cdt][cdn]
		totalSum += parseFloat(row.value);
		console.log("total sum", totalSum);
		frm.set_value("total", totalSum);
		frm.refresh_field("total");
	},
});

var amharicText = [
	{ no: "1", point:"18", text: "በተቀጣጠለት ጊዜ በተራትና ወደ ቅቤ በሆነ መንገድ ምግብታ ስራ ሁሉንም የሥራ ተግባራት መሠረት ባደረገ መልኩ የቅርብ ክትትልና ቁጥጥር" },
	{ no: "1.1", point:"5", text: "ሁሉንም የሥራ ተግባራት መሠረት ባደረገ መልኩ የቅርብ ክትትልና ቁጥጥች በማድረግ ሥራን በወቅቱ ማጠናቀቅ" },
	{ no: "1.2", point:"7", text: "የግንባታ ስራዎችን ተግባራትን በተቀጠለችው ስታንጻር ድ(ዲዛይነ መሰረት በጥራት መስራች፣" },
	{ no: "1.3", point:"6", text: "የሚሠሩ ሥራዎች ወጭ ቆጣቢ በሆነ ወንድ እየተሠሩ እና መረጃዎች እየተያዙ ስለሆኑ"},
	{ no: "2", point:"10", text: "ቴስት ከማሰራት አንፃር", code: "6213" },
	{ no: "2.1", point:"2.5", text: "ቢያንስ ሁለት ሌሌክትድ ማቴሪያል ወይም የስሮ ማቴሪያል ቴስት ያስራ" },
	{ no: "2.2", point:"1.5", text: "ቢያንስ አንድ የኮርስ አግሪጌት ማቴሪያል ቴስት ያሰራ ወይም የግብ ድንጋይ ቴስት ያሠራ" },
	{ no: "2.3", point:"1.5", text: "ቢያንስ አንድ የአሸዋ/ፋይን አግሪኒት ማቴሪያል ቴስት ያሰራ" },
	{ no: "2.4", point:"2", text: "ቢያነስ አንድ የኮንክሪት ሚክስ ዲዛይን ቴስት ያሰራል" },
	{ no: "2.5", point:"2.5", text: "ቢያንስ አንድ ኮንክራት ኪዩብ ቴስት ያሰራ" },
	{ no: "3", point:"12", text: "የአካባቢ ጥበቃ፣ የስብሃዊ መብትና የመልካም አስተዳደር ጋር የተሰሩ ስራዎች " },
	{ no: "3.1", point:"2", text: "ተቆፍረው የሚጠሉ አፈርና ሌሎች ማቴርያሎችን በትክክለኛ ቦታ ማስወገድና በአካባቢው ላይ ተፅህኖ የማያደርሱ ስለመሆናች"},
	{ no: "3.2", point:"2", text: "ለተለያዩ አገልግሎቶች የተቆፈሩ ስነታዎችን በሙሌት እስተካክሎ ለአካባቢው የተቹ ማድረግ"},
	{ no: "3.3", point:"2", text: "የተገነቡ ተፋሰሶች የድሬይኔጅ ሥራዎች የተፈጥሮ ቦታቸውን ያልለቀቁና በጣሳዎች እና ሌሎች ይዞታዎች ላይ ጉዳት የማያደርሱ መሆናቸው" },
	{ no: "3.4", point:"2", text: "የመንገድ ደህንነት የትራፊክ ምልክቶችን ጋይድ ፖስት፤ ኪሎ ሜትርና ሳን ፖስት፤ የመንግድ አመልካች ታፔላ አሟልቶ የመገንባት ዝግባሊ፣" },
	{ no: "3.5", point:"2", text: "ጤናማ የሆነ ከአካባቢው ሀብረተሰብና ከአመራር አካላት ጋር ያለ ባገኙነት ወሰን ከማስከበርና የግንባታ ማቴሪያል ከማስፈቀድ ጋር በተያያዘኝ" },
	{ no: "3.6", point:"2", text: "በቡድን የመስራት ፍላጎት፣ በሠራተኛው መካከል ያለ የእርስ በርስ ግንኙነት፣ ከሌሎች ፕሮጀክቶችና ጥገና ጽ/ቤቶች ጋር በመተባበር የመስራት ዝንባሌ" },
	{ no: "4", point:"12", text: "የተሟላ ሪፖርት አጠቃሎ በወቅቱ መላክ"},
	{ no: "4.1", point:"4", text: " ወቅታዊ የፊዚካል ዕቅድ አፈፃፀም፣ የማሽነሪና የሠው ኃይል ሪፖርቶችን አጠቃሎ በወቅቱ መላክ፣" },
	{ no: "4.2", point:"3", text: "የሚላኩ የፐሮግረስ የየዕለት ሪፖርቶች የቅየሳ መሳሪያን በመጠቀም ለኬታ 42 ተወስዶና ከዲዛይን ጋር ተሳክረው መሆኑ እዲሁም ቅን መሠረት ባደረገ መልኩ የተሟላ ሆኑ"},
	{ no: "4.3", point:"3", text: "የቀኑ የማሽነሪዎች የሥራ መጠን ምዝገባ የሚካሄድ ስለሆኑ፤" },
	{ no: "5", point:"4", text: "በፊልድ ድጋፍ ወቅት በሚሰጥ አስተያየት ላይ ተማምኖና ተቀብሎ የተሰጠውን አስተያት ተግባራዊ ማድረግ"},
	{ no: "6", point:"4", text: "ችግር ፈች የሆኑ አሰራሮችን በመከተል ያጋጠሙ ችግሮችን በራስ የመፍታች ጥረት፤" },
];


// Add row to the table
function addRow(frm, cdt, cdn) {
	var table = frm.doc.table;
	frm.clear_table("table");

	for (var i = 0; i < amharicText.length; i++) {

		var row = frappe.model.add_child(frm.doc, "Project Evaluation Table", "table");
		row.criteria = amharicText[i].text;
		row.evaluation_point = amharicText[i].point;
		row.no = amharicText[i].no;

		console.log("row after", row)
	}
	refresh_field("table");
}