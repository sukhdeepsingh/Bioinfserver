
#!/usr/bin/perl

# loading usual development settings/
use strict;
use warnings;
use CGI;
use Time::HiRes qw/gettimeofday tv_interval/;
use CGI::Carp qw(fatalsToBrowser);

# declaring variables
my @i;
my $i;
my $templateseq;
my $templateseq1;
my $templateseq2;
my $templateseq3;
my $templateseq4;
my $templateseq5;
my $digits_basedir;
my $count_file;
my $alifile;
my $place;
my $Write;
my $count;
my @chiffres;
my $blastoutput;
my $input;
my $a=0;
my $q= new CGI;
my $templatename;

# user name is inputted
my $name = $q-> param ('name');
# user email is inputted
my $email = $q-> param ('email');
# organisation is inputted
my $organization = $q-> param ('organization');
# user sequence is inputted
my $seq = $q->param( 'seq' );
# getting the system date
my $date;
$date = `/bin/date`;
chomp( $date );

# checking the name, email and organization text field
if ($name eq "Sukhdeep Singh") {
die("Please fill out your name please you cant be me !!");
}
if ($email eq 'vanbug@gmail.com') {
die "Thats my email please fill yours !!";
}
#if ($organization eq 'University of Leicester') {
#die "Don't be lazy please fill your organization where you work or study !!";
#}

# running the counter script which enables the visitor counter
my $counter ="/home/ss533/public_html/cgi-bin/counter.txt";
open (COUNTER,$counter);
my $a=<COUNTER>;
$a++;
open (COUNTER,">$counter");
print COUNTER $a;

# storing the user details in a new csv file
my $user = "/home/ss533/public_html/cgi-bin/user.csv";
open(USER,">>$user");
#print USER "NAME\t\t EMAIL\t\t ORGANIZATION\t\t\t DATE\n";
print USER "$a.$name\t $email\t $organization\t $date\n";

# if no sequence is entered the default message is printed
$seq = '' unless $seq;

# removing illegal characters from sequence viz, spaces and digits and special characters
$seq =~ s/\s*\d*\W*//g;

# converting the sequence to uppercase for searching in blast database
$seq = uc($seq);

# basic html starts for outputting
print "Content-Type: text/html\n\n";
print "<html>\n";
print "<head>\n";
print "<title>Output Window </title>\n";
print "</head>\n\n";
print "<h2>$name!! \nThank you for using my Webmodeller</h2>";
print "<body>\n\n";
print "Your sequence: <KBD>$seq</KBD><br><br>\n";

# storing the input sequence in a new file
$input = "/home/ss533/public_html/cgi-bin/model.txt";
open(INPUT,">$input");
print INPUT "\>model\n$seq";

# running blast on local server
system ("/home/ss533/blast-2.2.20/bin/blastall -p blastp -i model.txt -d pdb.fasta -o r.txt");

# storing the result of blast in local variable
$blastoutput = "/home/ss533/public_html/cgi-bin/r.txt";

# opening filename or printing error messsage
open(FH,$blastoutput) or die "Cannot open $blastoutput :$! ";

# regex or matching pattern for most significant hit
while ($_=<FH>) {
if($_ =~ /^gi\|\d+\|pdb\|(\w\w\w\w)\|/){
$templatename=$1;
last;
}
}

#checking for template name
if (defined($templatename) && $templatename ne ""){
print "The template found out for your sequence is $templatename\n\n";
}
else
{
print "No siginficant hits found for your sequence\n\n";
}


# protein name is changed from uppercase to lowercase to fetch correct sequence from ftp.
$templatename=lc($templatename);

# regex or matching pattern for the sequence of most significant protein
# first part of seq
while ($_=<FH>) {
if($_ =~ /^Sbjct:\s+\d+\s+(\w+\w+)/){             # work here to remove digit 
$templateseq1=$1;
last;
}
}

# second part of seq
while ($_=<FH>) {
if($_ =~ /^Sbjct:\s+\w+\s+(\w+\w+)/){
$templateseq2=$1;
last;
}
}

# third part of seq
while ($_=<FH>) {
if($_ =~ /^Sbjct:\s+\w+\s+(\w+\w+)/){
$templateseq3=$1;
last;
}
}

# fourth part of seq
while ($_=<FH>) {
if($_ =~ /^Sbjct:\s+\w+\s+(\w+\w+)/){
$templateseq4=$1;
last;
}
}

# fifth part of seq
while ($_=<FH>) {
if($_ =~ /^Sbjct:\s+\w+\s+(\w+\w+)/){
$templateseq5=$1;
last;
}
}
# concatenation used for joining the 2 parts of sequence to get complete sequence
if ($templatename=='1W5Y') {
$templateseq = $templateseq1.$templateseq2;
			   }		   
else
{
$templateseq = $templateseq1.$templateseq2.$templateseq3.$templateseq4.$templateseq5;
}

# for printing of multiple sequence fasta file for alignment
my $multipleseq="/home/ss533/public_html/cgi-bin/multipleseq.fas";
open MULTI,">$multipleseq";
my $seqq;
my @seq;
my $i=1;
print MULTI "\>model\n$templateseq\n";
while (($_=<FH>)&& ($i<=10)) {
if($_ =~ /^Sbjct: \w*\s\s(\w+\w+)/){  
$seqq=$1;
print MULTI "\>$i\n$seqq\n";
$i++;
}
}
#second part of seq
my $seqqq;
while (($_=<FH>)&& ($i<6)) {
if($_ =~ /^Sbjct: \w+\s\s(\w+\w+)/){
$seqqq=$1;
print MULTI "\>$i\n$seqqq\n";
$i++;
}
}
close (MULTI);
system("rm multipleseq.aln");
system("rm multipleseq.dnd");
# storing protein pdb file link in variable
my $protein= "ftp://ftp.wwpdb.org/pub/pdb/data/structures/all/pdb/pdb"."$templatename".".ent.gz";
# downloading its sequence using wget
system("wget $protein");

# gunzipping the pdb file
system("gunzip /home/ss533/public_html/cgi-bin/*.ent.gz");
# renaming the file to template for modeler
system("mv /home/ss533/public_html/cgi-bin/*.ent template.pdb");

# opening the sequence with pymol only for offline
#system ("/usr/bin/pymol");


# storing the template pdb file into a variable

my $temp = "/home/ss533/public_html/cgi-bin/template.pdb";
my $firstresidue;
my $lastresidue;
my $firstnumber;
my $lastnumber;
my $HETATM;
my $dot;

open(TEMP,$temp);

while ($_=<TEMP>) {
if($_=~ /^ATOM\s+\d+\s+\w+\s+\w+\s(\w)\s+(\d+)/){
$firstresidue = $1;
$firstnumber = $2;
last;
		   }
						}
if ($templatename=='3D4F') {
while ($_=<TEMP>) 		{
if ($_=~ /^(HETATM)\s+\d+\s+(\w)+\d+\s+(\w+)+\s+(\d+)/)
					{
$lastresidue = $3;
$lastnumber = $4;
if ($1=="HETATM")
						{
$dot=".";
						}
else
						{
$dot="";
						}
					}
				}
	               		}
else 
{
while ($_=<TEMP>) {
if(($_=~ /^(HETATM)\s+\d+\s+\w+\d+\s+(\w+)+\s+(\w)(\d+)/) || ($_=~ /^(ATOM)\s+\d+\s+\w+\s+(\w+)+\s+(\w)\s+(\d+)/)  ||($_=~ /^(HETATM)\s+\d+\s+\w+\d+\s+(\w+)+\s+(\w+)\s(\d+)/)&& $2 ne "HOH")
				{
#print "$1\n";	
#print $2;
$lastresidue = $3;
$lastnumber = $4;
if ($1=="HETATM")
					{
$dot=".";
					}
else
					{
$dot="";
					}
				}
			}
}

# making ali file for modeler

if ($templatename eq '3d4f') {
$alifile ="/home/ss533/public_html/cgi-bin/alignment.ali";
open(FILE,">$alifile");
$templateseq='SPQPLEQIKLSESQLSGRVGMIEMDLASGRTLTAWRADERFPMMSTFKVVLCGAVLARVDAGDEQLERKIHYRQQDLVDYSPVSEKHLADGMTVGELCAAAITMSDNSAANLLLATVGGPAGLTAFLRQIGDNVTRLDRWETELNEALPGDARDTTTPASMAATLRKLLTSQRLSARSQRQLLQWMVDDRVAGPLIRSVLPAGWFIADKTGAGERGARGIVALLGPNNKAERIVVIYLRDTPASMAERNQQIAGIGAALIEHWQR'; $seq='SPQPLDQIKLSESELSGRVGLIKMDLASGRTLTAFRADERMPMMSTFKVVLCGAVLARVDAGDEQLERRIHYRQQDLVDYSPVSEKHLADGMTVGELCAAAITMSDNSAANLILATVAGPAGLTAYLRQIGDNVTRLDRWNTELNEALPGDARDTQTPASMAATLRKLLSSQRLSARSQRQLLQWMVDDRVAGPLIRSVLPAGWFIADETGASERGARGIVALLGPQNKAKRIVVIYLEDTPASMADRNQQIAGIGAALIEHWQR';

# printing the template sequence in ali file
print FILE 
">P1;template\nstructureX:template:$firstnumber:$firstresidue:$lastnumber:$lastresidue:.:.:.:.\n$templateseq\/$dot$dot$dot*\n\n";
# printing the model sequence in the ali file
print FILE ">P1;model\nsequence:model:.:.:.:.:.:.:.:.\n$seq\/$dot$dot$dot*";
			   }	
elsif ($templatename eq '1eri') {
$alifile ="/home/ss533/public_html/cgi-bin/alignment.ali";
open(FILE,">$alifile");
$templateseq='SQGVIGIFGDYAKAHDLAVGEVSKLVKKALSNEYPQLSFRYRDSIKKTEINEALKKIDPDLGGTLFVSNSSIKPDGGIVEVKDDYGEWRVVLVAEAKHQGKDIINIRNGLLVGKRGDQDLMAAGNAIERSHKNISEIANFMLSESHFPYVLFLEGSNFLTENISITRPDGRVVNLEYNSGILNRLDRLTAANYGMPINSNLCINKFVNHKDKSIMLQAASIYTQGDGREWDSKIMFEIMFDISTTSLRVLGRDLFEQLTSK'; $seq='GGGPLSIFGAAAQKHDLSIREVTAGVLTKLAEDFPNLEFQLRTSLTKKAINEKLRSFDPRLGQALFVESASIRPDGGITEVKDRHGNWRVILVGESKHQGNDVEKILAGVLQGKAKDQDFMAAGNAIERMHKNVLELRNYMLDEKHFPYVVFLQGSNFATESFEVTRPDGRVVKIVHDSGMLNRIDRVTASSLSREINQNYCENIVVRAGSFDHMFQIASLYCKAAPWTAGEMAEAMLAVAKTSLRIIADDLDQN';

# printing the template sequence in ali file
print FILE 
">P1;template\nstructureX:template:17:A:$lastnumber:$lastresidue:.:.:.:.\n$templateseq\/*\n\n";
# printing the model sequence in the ali file
print FILE ">P1;model\nsequence:model:.:.:.:.:.:.:.:.\n$seq\/*";
			   }	

else {
$alifile ="/home/ss533/public_html/cgi-bin/alignment.ali";
open(FILE,">$alifile");
# printing the template sequence in ali file
print FILE 
">P1;template\nstructureX:template:$firstnumber:$firstresidue:$lastnumber:$lastresidue:.:.:.:.\n$templateseq\/$templateseq\/$dot*\n\n";
# printing the model sequence in the ali file
print FILE ">P1;model\nsequence:model:.:.:.:.:.:.:.:.\n$seq\/$seq\/$dot*";
}

# removing template file after every run so as to print error message if no hit is found
#system ("rm template.pdb");

# closing of file handle
close(TEMP);


# date variable is use to print system date
print "<br><br><br>Date: $date<br>\n\n";
print "<form>";
print "</FORM>";

my $blast;
my $modeller;
my $alignment;
my $clustal;

# CLustalW page
print <<END_HTML;
<html>
<body>
<form action="clustal.cgi" method="post">
<input type="submit" name="modeller" value="Run ClustalW">
</form>
</body>
</html>
END_HTML


# Modeller page
print <<END_HTML;
<html>
<body>
<form action="modeller.cgi" method="post">
<input type="submit" name="modeller" value="Run Modeller">
</form>
</body>
</html>
END_HTML


print <<END_HTML;
<html>
<body>
<form><input type="button" value="Download Results" onClick="window.location.href='http://bioinf3.bioc.le.ac.uk/~ss533/cgi-bin/reports.html'"></form>
<form><input type="button" value="Download Template pdb file" onClick="window.location.href='http://bioinf3.bioc.le.ac.uk/~ss533/cgi-bin/template.pdb'"></form>
<form><input type="button" value="View Alignment file" onClick="window.location.href='http://bioinf3.bioc.le.ac.uk/~ss533/cgi-bin/alignment.ali'"></form>
<form><input type="button" value="View Blast Report" onClick="window.location.href='http://bioinf3.bioc.le.ac.uk/~ss533/cgi-bin/r.txt'"></form>
<form><input type="button" value="View Webmodeller's Manual" onClick="window.location.href='http://bioinf3.bioc.le.ac.uk/~ss533/Webmodeller.pdf'"></form>
<center><form><input type="button" value="Home" onClick="window.location.href='http://bioinf3.bioc.le.ac.uk/~ss533/input.html'"></form></center>
</body>
</html>
END_HTML


print "<HR>";
print "Thanks for visiting my page.<br> $name you are $a th visitor of my website.<br> <b>Total Visits : $a</b>";
print '<br><a href="http://www.emailmeform.com/fid.php?formid=365887" target="_new">Contact Me</a>';
print <<END_HTML;
<marquee style="font-family:Book Antiqua; color: #660000" bgcolor= "#660000"scrolldelay="99" ><form><input type="button" value="Click for Resume" onClick="window.location.href='http://bioinf3.bioc.le.ac.uk/~ss533/cgi-bin/SukhdeepSingh.pdf'"></form></marquee>
END_HTML
print "<marquee><font face=andy>Created by <b>Sukhdeep Singh</b> Webmodeller v 1.0</font></marquee>";
print "</body>\n";
print "</html>\n";
