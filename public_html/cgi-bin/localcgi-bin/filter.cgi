#!/usr/bin/perl
#Wed 14 Oct 2009 20:43:27 
# loading usual development settings/
use strict;
use warnings;
use CGI;
use Time::HiRes qw/gettimeofday tv_interval/;
use CGI::Carp qw(fatalsToBrowser);

# declarations
my $q = new CGI;
my $query = $q -> param('query');
my $data;
my @data;
my @sessionName;
my $sessionName;
my $boolean;
my $line;
my $everyline;
my @session;
my @start;
my @start1;
my @module;
my $i=0;
print "Content-Type: text/javascript\n\n";
@data =`bugsess filter1 '$query' 2>/dev/null`;
print "<br>";
print "<b>Filtered Sessions returning true for the user inputted query</b>";
print '<table  onMouseover="changeto(event, \'GreenYellow\')" onMouseout="changeback(event, \'#1980AF\')" onClick="selectcell(event)"  								id="sessTable" border="1" >';
print '<tr id="sesRow">';
print "<td ><b>Session Name</b></td>";
print '<td id="ignore"><b>Start Time</b></td>';
print '<td id="ignore"><b>Modules Run</b></td></tr>';
	# AN EMPTY MODULE NAME WILL NOT LET THE MEAN AND STANDARD DEVIATION BOX TO COME IN

foreach $data(@data)
{
# no space should be there after "=" and pattern match start
$data =~/^(\d*\w*):\s+(\w+)/;
$sessionName[$i] = $1;
$boolean = $2;
if ($boolean eq 'True')
{
print '<tr id="sessRow'.$i.'">';
print '<td id="name'.$i.'">'.$sessionName[$i].'</td>';
my @show = `bugsess show $sessionName[$i]  2>/dev/null`;
foreach $everyline (@show)
{
if($everyline =~ /^Start\stime:\s\w+\s(\w+\s+\d+\s+)\d+\W+\d+\W\d+\s+\w+(\s+\d+.+)/mgis) {
  $start[$i]=$1;
  $start1[$i]=$2;
}
if($everyline =~ /^Modules\s\w+\W(.+)/) {
     $module[$i]=$1;
}
}
print '<td id="date'.$i.'">'.$start[$i].$start1[$i].'</td>';
print '<td id="mode'.$i.'">'.$module[$i].'</td>';
$i++;
}
}
print '<tr id="MeanRow">';
		print '<td id="mean0">Mean</td>';
		print '<td id="mean1"></td>';
		print '<td id="mean2"></td>';
		print '</tr>';
		print '<tr id="stdevrow">';
		print '<td id="stdv0">Standard Deviation</td>';
		print '<td id="stdv1"></td>';
		print '<td id="stdv2"></td>';
		print "</tr>";
		print "</table>";
print "</table>";
print "<hr size=2.5>";
print "<div id ='detailask'>";
print "</div>";
#(>0.099)//displacedAngle
