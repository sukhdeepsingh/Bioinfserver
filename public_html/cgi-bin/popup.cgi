#!/usr/bin/perl

# loading usual development settings/
use strict;
use warnings;
use CGI;
use Time::HiRes qw/gettimeofday tv_interval/;
use CGI qw(:cgi);
# Outputs any errors to the browser window
use CGI::Carp qw(fatalsToBrowser);
print header;
print start_html('CGI Form with Pop Up Menu');
print h1('CGI Form with Pop Up Menu');
print start_form;
print "What is your favourite color?";
print popup_menu(-name=>'color',
                  -values=>['red','orange','yellow',
                           'green','blue','indigo','violet'],
                  -default=>'blue');
print p;
print submit(-name=>'submit button');
print '      ';
print reset;
print end_form;
print hr;
if (param())
{
    print
        "Your favourite color is ", param('color'),
}
print a({href=>'http://www.school.net.hk/~hywong/cgipmtut.html#Pop_up_menu'},
      'Go Back');
print end_html;

