/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function cellid(e) {
	fetchingcellid(e);
	var currentcellvalue;
	var userquerycolumns=colcount;
	currentcellid = currentcell.substring(0,4);
	var mymatch = /(\d$)/;
	var currentcellidnumber = currentcell.match(mymatch);
	currentcellidnumber = parseInt(currentcellidnumber[0], 10);
}
// condition ? value if true : value if false
/*if statement is incorporated so as to know that if user has clicked the sheet first time else the value will automatically will be sent by 
sheetmigration.js*/
function fetchingcellid(e) {
//if (typeof(currentcell) == "undefined") {
	if(e.target.match("td")) currentcell = e.target.id;
	else
	 if(e.target.up("td")) currentcell= e.target.up("td").id;
	else {}
	}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Mind all brackets need to be completed and mind all variable names do not get confused, stay focus
var  previouscell= null;
	function selectcell(e){
//			if (typeof(currentcll)!="undefined") {$(currentcll).style.border = "1px solid white";}
		fetchingcellid(e);
		currentcellid = currentcell.substring(0,4);
		var userqueryid  = currentcell.substring(0,9);
		var mymatch = /(\d$)/;
		var currentcellidnumber = currentcell.match(mymatch);
		currentcellidnumber = parseInt(currentcellidnumber[0]);
			if (currentcell == previouscell) {
			$(currentcell).style.border="4px solid red";	
			previouscell = currentcell;
			}
				else  if (currentcell !=previouscell) {
					if (firsttimeselect==0) $(currentcell).style.border="4px solid red";
					if (firsttimeselect!=0) {
					$(previouscell).style.border = "1px solid white";
					$(currentcell).style.border = "4px solid red";
					}
					var currentcellvalue = $(currentcell).innerHTML;
					if (currentcellid == "name"){		
					new Ajax.Updater('detailask','http://bioinf3.bioc.le.ac.uk/~ss533/cgi-bin/migrationsessionshow.cgi',{
					parameters:{session:currentcellvalue}});
					}
						else if (currentcellid == "date") {
						var datecell = ("name"+currentcellidnumber);
						currentcellvalue = $(datecell).innerHTML;
						new Ajax.Updater('detailask','http://bioinf3.bioc.le.ac.uk/~ss533/cgi-bin/migrationdateshow.cgi',{
						parameters:{session:currentcellvalue}});
						}
							else if (currentcellid == "mode"){
							var modecell = $(currentcell).innerHTML;
							var sessionname = $("name"+currentcellidnumber).innerHTML;
								new Ajax.Updater('detailask','http://bioinf3.bioc.le.ac.uk/~ss533/cgi-bin/migrationmoduleshow.cgi',{
								parameters:{module:modecell,session:sessionname}}); 
							}
							
								//can't define currentcell for userquery //else if(userqueryid== "userquery")alert("hello");
								
								previouscell = currentcell;
				}
			else  {
			$(previouscell).style.border = "1px solid white";
			$(currentcell).style.border="4px solid red";
			previouscell = currentcell;
			}
				firsttimeselect++;
		}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
