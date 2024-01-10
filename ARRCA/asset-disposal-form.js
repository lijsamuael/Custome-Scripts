cur_frm.add_fetch("item_code", "item_name", "item_description");
cur_frm.add_fetch("item_code", "stock_uom", "uom");

cur_frm.add_fetch("plate_no", "chasis_no", "chasis_number");
cur_frm.add_fetch("plate_no", "model", "model");
cur_frm.add_fetch("plate_no", "location", "location_of_property");
cur_frm.add_fetch("plate_no", "year_of_manufacturing", "year_of_manufacture");


frappe.ui.form.on('Asset Disposal Form', {
	type_of_equipmentvehicle: function(frm, cdt, cdn) {
		if(frm.doc.type_of_equipmentvehicle && frm.doc.service_periodyear  && frm.doc.manufactured_country && frm.doc.current_price && frm.doc.equipment_model && frm.doc.equipment_current_status){
            calculatePrice(frm)
        }
	},
	service_periodyear: function(frm, cdt, cdn) {
        if(frm.doc.type_of_equipmentvehicle && frm.doc.service_periodyear  && frm.doc.manufactured_country && frm.doc.current_price && frm.doc.equipment_model && frm.doc.equipment_current_status){
            calculatePrice(frm)
        }
	},
	price_correction: function(frm, cdt, cdn) {
		if(frm.doc.type_of_equipmentvehicle && frm.doc.service_periodyear  && frm.doc.manufactured_country && frm.doc.current_price && frm.doc.equipment_model && frm.doc.equipment_current_status){
            calculatePrice(frm)
        }
	},
	manufactured_country: function(frm, cdt, cdn) {
		if(frm.doc.type_of_equipmentvehicle && frm.doc.service_periodyear  && frm.doc.manufactured_country && frm.doc.current_price && frm.doc.equipment_model && frm.doc.equipment_current_status){
            calculatePrice(frm)
        }
	},
    current_price: function(frm, cdt, cdn) {
		if(frm.doc.type_of_equipmentvehicle && frm.doc.service_periodyear  && frm.doc.manufactured_country && frm.doc.current_price && frm.doc.equipment_model && frm.doc.equipment_current_status){
            calculatePrice(frm)
        }
	},
    equipment_model: function(frm, cdt, cdn) {
		if(frm.doc.type_of_equipmentvehicle && frm.doc.service_periodyear  && frm.doc.manufactured_country && frm.doc.current_price && frm.doc.equipment_model && frm.doc.equipment_current_status){
            calculatePrice(frm)
        }
	},
    equipment_current_status: function(frm, cdt, cdn) {
		if(frm.doc.type_of_equipmentvehicle && frm.doc.service_periodyear  && frm.doc.manufactured_country && frm.doc.current_price && frm.doc.equipment_model && frm.doc.equipment_current_status){
            calculatePrice(frm)
        }
	}
})

function calculatePrice(frm){
    var total = 0;
    var equipment_model = frm.doc.equipment_model;
    var type_of_equipmentvehicle = frm.doc.type_of_equipmentvehicle
    var manufactured_country = frm.doc.manufactured_country; 
    var status = frm.doc.equipment_current_status;
    var year = frm.doc.service_periodyear; 
    var is_machinery = frm.doc.is_machinery;




    // Using the ternary operator for each type of equipment
    var model_value = equipment_model === "መርሰዴስ" ? 1.2 :
                equipment_model === "ኒሳን" ? 1 :
                equipment_model === "አይሱዙ" ? 1 :
                equipment_model === "ሚትሱቢሺ" ? 0.9 :
                equipment_model === "ፊያት / ኢቨኮ" ? 1.2 :
                equipment_model === "ቮልቮ" ? 1.1 :
                equipment_model === "ስካኒያ" ? 1.1 :
                equipment_model === "ዳፍ" ? 1.1 :
                equipment_model === "ሂኖ" ? 0.95 :
                equipment_model === "ካማዝ" ? 0.8 :
                equipment_model === "ካተርፒላር" ? 1.2 :
                equipment_model === "ኮማትሎ" ? 1 :
                equipment_model === "ድሬሰር" ? 0.9 :
                equipment_model === "ፊያት / አሊቼ" ? 0.8 :
                equipment_model === "ቻምፒዮን" ? 0.8 :
                equipment_model === "ዋቢኮ" ? 0.9 :
                equipment_model === "ጋሊዮን" ? 0.9 :
                equipment_model === "ሚቼጋን" ? 1.1 :
                equipment_model === "ሂቻ" ? 1 :
                equipment_model === "ካዝ" ? 1 :
                equipment_model === "ቲ ኤስ ኤም" ? 0.9 :
                equipment_model === "ፍሩካዋ" ? 0.9 :
                equipment_model === "ሃኖማግ" ? 0.8 :
                equipment_model === "ስካይ" ? 0.8 :
                equipment_model === "ዳይናፓክ" ? 1.1 :
                equipment_model === "ቦማግ" ? 1.1 :
                equipment_model === "ኢንግርሶሌናዴ" ? 1.1 :
                equipment_model === "ሃይስተር" ? 1.1 :
                equipment_model === "ቪኖማስክ" ? 1 :
                equipment_model === "ማሪኒ" ? 1 :
                equipment_model === "ቬትል" ? 0.9 :
                equipment_model === "ሃም" ? 0.9 :
                equipment_model === "አትላስ ኮፕኮ" ? 1.1 :
                equipment_model === "ደማግ" ? 1.1 :
                equipment_model === "ያማሃ" ? 1.1 :
                equipment_model === "ሱዙኪ" ? 1 :
                equipment_model === "ሆንዳ" ? 1 :
                equipment_model === "ኡራል" ? 0.9 :
                equipment_model === "ሌሎች ሞተር ብስክሌት" ? 0.8 :
                equipment_model === "ማሲ ፈርጉሰርን" ? 1.25 :
                equipment_model === "ፊያት" ? 1 :
                equipment_model === "ዛቲ" ? 0.85 :
                equipment_model === "ኢ ኤም ቲ ትራክተር" ? 0.85 :
                equipment_model === "ጆን ዲር" ? 1.1 :
                equipment_model === "ዛማይ" ? 1 :
                equipment_model === "ኢ-512/ኢ-514" ? 1 :
                equipment_model === "ኒቫ" ? 0.8 :
                equipment_model === "መርሰዴስ አ" ? 1.25 :
                equipment_model === "ቲዮ" ? 1.25 :
                equipment_model === "ኒሳን" ? 1.05 :
                equipment_model === "አይሱዙ" ? 0.95 :
                equipment_model === "ሚትሱቢሺ አውቶ" ? 0.95 :
                equipment_model === "ማዝዳ" ? 0.95 :
                equipment_model === "ሱዙኪ" ? 0.95 :
                equipment_model === "ፔቮ" ? 0.95 :
                equipment_model === "ሬኖ" ? 0.95 :
                equipment_model === "ቮክስዋገን" ? 0.95 :
                equipment_model === "ኦዲ" ? 0.95 :
                equipment_model === "ቢ ኤም ደብልዩ" ? 0.95 :
                equipment_model === "ኦፔል" ? 0.95 :
                equipment_model === "ፊያት / ኢቬኮ" ? 0.95 :
                equipment_model === "ላንድሮቨር" ? 0.95 :
                equipment_model === "ፎርድ" ? 0.8 :
                equipment_model === "ላዳ" ? 0.8 :
                equipment_model === "ኒቫ" ? 0.8 :
                equipment_model === "ሌሎች" ? 0.8 :
                0; // Default value if the equipment type doesn't match any condition

    var type_value = type_of_equipmentvehicle === "አውቶሞቢል" ? 0.9 :
                type_of_equipmentvehicle === "ስቴሽን ዋገን" ? 1.1 :
                type_of_equipmentvehicle === "አውቶቡስ" ? 1.1 :
                type_of_equipmentvehicle === "ፒካፕ" ? 1.1 :
                type_of_equipmentvehicle === "ከባድ መኪና" ? 0.95 :
                type_of_equipmentvehicle === "ባለክሬን ከባድ መኪና" ? 0.85 :
                type_of_equipmentvehicle === "ተሳቢ" ? 0.9 :
                type_of_equipmentvehicle === "የአፈር መግፊያ ማሽነሪ" ? 0.75 :
                type_of_equipmentvehicle === "ክራሸር" ? 0.75 :
                type_of_equipmentvehicle === "የአስፋልት ቦይለር" ? 0.75 :
                type_of_equipmentvehicle === "የአስፋልት ሚክሰር" ? 0.75 :
                type_of_equipmentvehicle === "ኮንክሪት ሚክሰር" ? 0.75 :
                type_of_equipmentvehicle === "ኮንክሪት ቫይብሬተር" ? 0.75 :
                type_of_equipmentvehicle === "ፓምፕ" ? 0.9 :
                type_of_equipmentvehicle === "ኮምፕሬሰር" ? 0.85 :
                type_of_equipmentvehicle === "ጀነሬተር" ? 0.75 :
                type_of_equipmentvehicle === "ክሬን" ? 0.75 :
                type_of_equipmentvehicle === "ፎርክሊፍት" ? 0.75 :
                type_of_equipmentvehicle === "ሞተር ብስክሊት" ? 0.85 :
                type_of_equipmentvehicle === "ትራክተር" ? 0.9 :
                type_of_equipmentvehicle === "ሃርቬስተር እና ትሬሸር" ? 0.75 :
                0; // Default value if the equipment type doesn't match any condition


        var country_value = manufactured_country === "ምእራብ አውሮፓ እና አሜሪካ" ? 1 :
                            manufactured_country === "ጃፓን" ? 1 :
                            manufactured_country === "ሩሲያ እና ምስራቅ አውሮፓ" ? 0.8 :
                            manufactured_country === "ሌሎች" ? 0.8 :
                            0; 


        var status_value = status === "የሚሰራ ተሽከርካሪ" ? 0.75 :
                    status === "ዋና ዋና ክፍሎቹ እና እቃዎቹ ሁሉ እንዳሉ ሆኖ የሚሰራ" ? 0.55 :
                    status === "ዋና ዋና እቃዎቹ የተጓደሉ በመሆናቸው የማይሰራ" ? 0.4 :
                    status === "ዋና ዋና  የተጓደሉ በመሆናቸው የማይሰራ" ? 0.17 :
                    0; // Default value if the status type do


        var year_first_value =
            year === "1" ? 0.9 :
            year === "2" ? 0.8 :
            year === "3" ? 0.7 :
            year === "4" ? 0.633 :
            year === "5" ? 0.567 :
            year === "6" ? 0.5 :
            year === "7" ? 0.475 :
            year === "8" ? 0.45 :
            year === "9" ? 0.425 :
            year === "10" ? 0.4 :
            year === "11" ? 0.38 :
            year === "12" ? 0.36 :
            year === "13" ? 0.34 :
            year === "14" ? 0.32 :
            year === "15" ? 0.3 :
            year === "16" ? 0.28 :
            year === "17" ? 0.26 :
            year === "18" ? 0.24 :
            year === "19" ? 0.22 :
            year === "20" ? 0.2 :
            year === "21" ? 0.19 :
            year === "22" ? 0.18 :
            year === "23" ? 0.17 :
            year === "24" ? 0.16 :
            year === "ከ25 በላይ" ? 0.15 :
            year === "< 1" ? 1 : 0;

    var year_second_value =
        year === "1" ? 0.79 :
        year === "2" ? 0.622 :
        year === "3" ? 0.494 :
        year === "4" ? 0.422 :
        year === "5" ? 0.392 :
        year === "6" ? 0.35 :
        year === "7" ? 0.308 :
        year === "8" ? 0.265 :
        year === "9" ? 0.222 :
        year === "10" ? 0.19 :
        year === "11" ? 0.17 :
        year === "12" ? 0.15 :
        year === "13" ? 0.14 :
        year === "14" ? 0.13 :
        year === "15" ? 0.12 :
        year === "16" ? 0.28 :
        year === "17" ? 0.26 :
        year === "18" ? 0.24 :
        year === "19" ? 0.22 :
        year === "20" ? 0.2 :
        year === "21" ? 0.19 :
        year === "22" ? 0.18 :
        year === "23" ? 0.17 :
        year === "24" ? 0.16 :
        year === "ከ25 በላይ" ? 0.15 :
        year === "< 1" ? 1 : 0;



        console.log("second Y", year_second_value)
        console.log("first Y", year_first_value)
        console.log("c", status_value)
        console.log("ct", country_value)
        console.log("mk", type_value)
        console.log("md", model_value)
        console.log("r", frm.doc.current_price)



        if(is_machinery != 1){
            total = year_second_value * status_value * country_value * type_value * model_value * frm.doc.current_price;
        }else{
            total = year_first_value * status_value * country_value * type_value * model_value * frm.doc.current_price;

        }

    frm.set_value("proposed_sale_price", total);
    frm.refresh_field("proposed_sale_price")

}



frappe.ui.form.on('Asset Disposal Items', {
	qty: function(frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        console.log("row", row)
		if(row.current_item_price && row.qty && frm.doc.proposed_sale_price && frm.doc.type_of_equipmentvehicle && frm.doc.service_periodyear  && frm.doc.manufactured_country && frm.doc.current_price && frm.doc.equipment_model && frm.doc.equipment_current_status){
            var item_price = frm.doc.proposed_sale_price / frm.doc.current_price * row.qty * row.current_item_price;
            row.estimated_cost = item_price;
            row.unit_price = item_price / row.qty
            console.log("wer are here", item_price)

            frm.refresh_field("items")
        }
	},
    current_item_price: function(frm, cdt, cdn) {
        var row = locals[cdt][cdn];
        console.log("row", row)
		if(row.current_item_price && row.qty &&  frm.doc.proposed_sale_price && frm.doc.type_of_equipmentvehicle && frm.doc.service_periodyear  && frm.doc.manufactured_country && frm.doc.current_price && frm.doc.equipment_model && frm.doc.equipment_current_status){
            var item_price = frm.doc.proposed_sale_price / frm.doc.current_price * row.qty * row.current_item_price;
            row.estimated_cost = item_price;
            row.unit_price = item_price / row.qty

            console.log("wer are here", item_price)

            frm.refresh_field("items")
        }
	},
})