// Function insert to insert new column for query using prototype.
var counter;
function ins() {
	var columncounter =(colcount+1);
	var i;
	var toprow=$("sesRow");
	var topitem='<td><input type="text"  onChange="result(0,'+columncounter+');" id="userquery'+columncounter+'"></input>';
	toprow.insert({Bottom:topitem});
		for (i=0;i<numberofRows;i++)
		{
		var row=$("sessRow"+i);
		var item='<td id="qvry'+i+'_'+columncounter+'"><i>Query Result</i></td>';
		row.insert({Bottom:item});
		}
		var meanrow=$("MeanRow");
			var rowmean='<td id="mean-'+columncounter+'"><i>Mean </i></td>';
			meanrow.insert({Bottom:rowmean});
				var stdevrow=$("stdevrow");
				var rowstdev='<td id="stdv-'+columncounter+'"><i>Standard Deviation </i></td>';
				stdevrow.insert({Bottom:rowstdev});
				
		$("userquery"+columncounter).focus();
		colcount++;
	}

////////////////////////////////////////////////////
// Function for user column entry using prototype.
function usercol() {
	var i;
	var topII=$("sesRow");
	colcount=colcount+1;
	topII.insert({Bottom:'<td><input type="text"  onChange="usercolprocessor(0);" id="usercol'+colcount+'" value="         User Column"></input>'});
		for (i=0;i<numberofRows;i++)
		{
		var rowII=$("sessRow"+i);
		var item='<td><input type="text" id="usercol'+i+'_'+colcount+'" onChange="usercolprocessor(0);"></input></td>';
		rowII.insert({Bottom:item});
		}
			var meanrow=$("MeanRow");
			var itemm='<td id="mean-'+colcount+'"><input type="text" id="usermean"></input></td>';
			meanrow.insert({Bottom:itemm});
				var stdevrow=$("stdevrow");
				var rowstdev='<td id="stdv-'+colcount+'"><input type="text" id="userstdev"></input></td>';
				stdevrow.insert({Bottom:rowstdev});
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function result(rowNumber,columnnumber) {
$("userquery"+columnnumber).blur();
currentcell=("qvry"+0+'_'+columnnumber);
$(currentcell).style.border = "7px inset white";
//$("qvry"+0+'_'+columnnumber).focus();
firsttimeselect=1;
var query=$("userquery"+columnnumber).value;
new Ajax.Request('/cgi-bin/ask2.cgi', {
	method : 'get',
	parameters : {query:query,session:sessionName[rowNumber],i:rowNumber},
	onSuccess: function (resp) {
		$('qvry'+rowNumber+'_'+columnnumber).update(resp.responseText);
		if(rowNumber<numberofRows) result(rowNumber+1,columnnumber);}})
		/*$("userquery"+columnnumber).blur();      
		currentcell=("qvry"+0+'_'+columnnumber);
		$(currentcell).style.border = "7px inset white";
//$(nextcell).style.border = "1px solid white";
		firsttimeselect=1;
currentcell=nextcell;*/
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// function for processing of usercolumn
function usercolprocessor(userrowNumber) {
var uservariable = $("usercol"+colcount).value;
	for (var sendsession=0;sendsession<numberofRows;sendsession++) {
	var uservalue = $("usercol"+userrowNumber+'_'+colcount).value;
		new Ajax.Updater('','/cgi-bin/usercolprocessor.cgi',{
		parameters:{uservariable:uservariable,session:sessionName[sendsession],uservalue:uservalue}});
		userrowNumber++;
	}
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
