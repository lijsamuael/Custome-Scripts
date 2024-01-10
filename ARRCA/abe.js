date_of_joining_ec: function(frm, cdt, cdn) {
    if (frm.doc.date_of_joining_ec) {
        var finalgc = convertDateTOGC(frm.doc.date_of_joining_ec.toString());
        var dateObj = new Date(finalgc);
        
        // Extract year, month, and date parts
        var year = dateObj.getFullYear();
        var month = ('0' + (dateObj.getMonth() + 1)).slice(-2); // Adding 1 to month as it starts from 0
        var day = ('0' + dateObj.getDate()).slice(-2);

        console.log("year month date", dateObj.getFullYear(), dateObj.getMonth(), dateObj.getFullYear())

        // Format the date in DD-MM-YYYY
        var formattedDate = day + '-' + month + '-' + year;
        console.log("format date", formattedDate)

        frm.doc.date_of_joining = formattedDate;
        frm.set_value("date_of_joining", formattedDate)
        console.log("date of value", frm.doc.date_of_joining)
        frm.refresh_field("date_of_joining");
        console.log("date of value again", frm.doc.date_of_joining)
    }
},