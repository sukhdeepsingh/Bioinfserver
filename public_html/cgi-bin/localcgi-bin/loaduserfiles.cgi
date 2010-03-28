#!/usr/bin/perl

# loading usual development settings/
use strict;
use warnings;
use CGI;
use Time::HiRes qw/gettimeofday tv_interval/;
use CGI::Carp qw(fatalsToBrowser);


# decalarations
my $userfiles;
my @userfiles;
my $historyfile;
my @historyfile;
# basic html starts for outputting
print "Content-Type: text/html\n\n";
@userfiles = `ls /var/usersheets/*.txt`;
@historyfile= `ls /var/www/cgi-bin/userhistory/*.txt`;
print "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp<b>Browse User userfiles</b> ";
print "<select id=\"download_chooser\" onChange=\"downloading();\">";
foreach $userfiles(@userfiles)
{
$userfiles =~/^\/\w+\/\w+\/(.+)/;
print "<option value=$1>$1</option>";
}
print "</select>";
print "<b> Browse History Files </b>";
print "<select id=\"historyfilechooser\" onChange=\"downloadhistoryfile();\">";
foreach $historyfile(@historyfile){
$historyfile =~/^\/\w+\/\w+\/\w+\-\w+\/\w+\/(.+)/;
print "<option>$1</option>;"
}
print "</select>";


