#!/usr/bin/perl

# loading usual development settings/
use strict;
use warnings;
use CGI;
use Time::HiRes qw/gettimeofday tv_interval/;
use CGI::Carp qw(fatalsToBrowser);

# decalarations
my $q = new CGI;
my $query = $q -> param('query');
# basic html starts for outputting
print "Content-Type: text/html\n\n";
print $query;
print "<hr size='2.5'>";
