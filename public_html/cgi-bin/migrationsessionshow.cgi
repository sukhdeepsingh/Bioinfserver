#!/usr/bin/perl

# loading usual development settings/
use strict;
use warnings;
use CGI;
use Time::HiRes qw/gettimeofday tv_interval/;
use CGI::Carp qw(fatalsToBrowser);


# decalarations
my $q = new CGI;
my $session = $q -> param('session');
my @bugshow;
@bugshow = `/home/ss533/.cabal/bin/bugsess show $session  2>/dev/null`;
# basic html starts for outputting
print "Content-Type: text/html\n\n";
print "<h4><center><b style='color:#008000'>Session Selected is <b style='color:#B22222'>'$session'</b></center></h4>";
print "<pre>@bugshow</pre>";
print "<hr size='2.5'>";
