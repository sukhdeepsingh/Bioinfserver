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
print "<title> Session scripts </title>\n";
print "</head>\n\n";
print "<body>\n\n";

print <<END_HTML;

<form action="run.log" method="post"></p>
<input type="submit" name="go" value="BugSess ask"><br>
<input type="submit" name="go" value="BugSess show"><br>
<input type="submit" name="go" value="BugSess list"><br>
<input type="submit" name="go" value="BugSess compact"><br>
<input type="submit" name="go" value="BugSess convert1"><br>
BugSess OPTIONS $a<br>
<br><textarea name="options">
BugSess ask {session} '{query}'\n
BugSess show {session}\n
BugSess list\n
BugSess compact {session}\n
BugSess convert2 {session}\n
BugSess convert1 {session}"
</textarea>
</form>
</body>
</html>
END_HTML
system ("ls");
