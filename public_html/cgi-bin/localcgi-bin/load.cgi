#!/usr/bin/perl

# loading usual development settings/
use strict;
use warnings;
use CGI;
use Time::HiRes qw/gettimeofday tv_interval/;
use CGI::Carp qw(fatalsToBrowser);

# my decalarations

my $q = new CGI;
my $filedata;
my @filedata;
my $selectedquery;
my @selectedquery;
my $i=0;
my $selectedfile = $q -> param('selectedfile');
my $locatedfile = "/var/usersheets/$selectedfile";

print "Content-Type: text/html\n\n";
print '<script language="JavaScript" src="/jsfile.js"></script>';
print '<script language="JavaScript" src="/blackbird.js"></script>';
print '<script language="JavaScript" src="/prototype.js"></script>';
print "<select>";
open (FH,$locatedfile);
@filedata = <FH>;
foreach $filedata(@filedata)
{
	$filedata =~/^(.+)/;
	$selectedquery[$i] = $1;
	$i++;
	print "<option id='transportquery'>$1</option>";
}
print "</select>";
	
	print '<input type="button" value="load values" onClick="insertval();"/>';
