#!/usr/bin/perl

# loading usual development settings
use strict;
use warnings;
use CGI;

my $blastoutput;

# storing the result of blast in local variable
$blastoutput = "/home/ss533/public_html/cgi-bin/r.txt";

# opening filename or printing error messsage
open(FH,$blastoutput) or die "Cannot open $blastoutput :$! ";

print $_;
