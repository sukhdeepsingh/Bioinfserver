#!/usr/bin/perl

# loading usual development settings/
use strict;
use warnings;
use CGI;
use Time::HiRes qw/gettimeofday tv_interval/;
use CGI::Carp qw(fatalsToBrowser);


# decalarations
my $q = new CGI;
my $module = $q -> param('module');
my $session = $q-> param('session');
# basic html starts for outputting
print "Content-Type: text/html\n\n";
print "<h4><center><b style='color:#008000'>This is <b style='color:#B22222'>'$module'</b> module for session <b style='color:#B22222'>'$session'</b></center></h4>";
print "<hr size='2.5'>";
