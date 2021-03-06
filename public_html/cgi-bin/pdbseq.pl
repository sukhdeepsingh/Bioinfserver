
# loading usual development settings/
use strict;
use warnings;
my $blastoutput;
my $templatename;

# running blast on local server
system ("/home/ss533/blast-2.2.20/bin/blastall -p blastp -i model.txt -d pdb.fasta -o r.txt");

# storing the result of blast in local variable
$blastoutput = "/home/ss533/public_html/cgi-bin/pdb.txt";

# opening filename or printing error messsage
open(FH,$blastoutput) or die "Cannot open $blastoutput :$! ";

# regex or matching pattern for most significant hit
while ($_=<FH>) {
if($_ =~/^>/){
$templatename=$1;
last;
}
}

