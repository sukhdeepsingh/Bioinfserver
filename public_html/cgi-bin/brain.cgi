#!/usr/bin/perl

# loading usual development settings/
use strict;
use warnings;
use CGI;
use Time::HiRes qw/gettimeofday tv_interval/;
use CGI::Carp qw(fatalsToBrowser);
my $a=2;

# basic html starts for outputting
print "Content-Type: text/html\n\n";
print "<html>\n";
print "<head> \n";
print "<title> Insect brain signal data </title>\n";
print "</head>\n\n";
print <<END_HTML;
<br><br>
<center>
<form action="sessionscripts.cgi" method="post">
<table width="500" cellpadding="3" cellspacing="2" border="0">
 <tr>
   <td valign="middle" align="left" bgcolor="660000">
     <font color="white" size="2"><b>Choose Session </b></font>
   </td>
   <td valign="middle" align="left" bgcolor="#660000>
     <font color="white" size="2">
<select name="sessions"> 
<option value="1">5d8e6d688d9e81de800000110961a575</option>
<option value="2">72cf2d2c868a81de800000110961a575</option>
</select>
</font>
<input type="submit" name="submit" value="OK">
</td>

END_HTML
# Going to system now
system("bugsess");
