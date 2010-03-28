    /**
    * o------------------------------------------------------------------------------o
    * | This file is part of the RGraph package - you can learn more at:             |
    * |                                                                              |
    * |                          http://www.rgraph.net                               |
    * |                                                                              |
    * | This package is licensed under the RGraph license. For all kinds of business |
    * | purposes there is a small one-time licensing fee to pay and for personal,    |
    * | charity and educational purposes it is free to use. You can read the full    |
    * | license here:                                                                |
    * |                      http://www.rgraph.net/LICENSE.txt                       |
    * o------------------------------------------------------------------------------o
    */
    
    if (typeof(RGraph) == 'undefined') RGraph = {};

    /**
    * The scatter graph constructor
    * 
    * @param object canvas The cxanvas object
    * @param array  data   The chart data
    */
    RGraph.Scatter = function (id, data)
    {
        // Get the canvas and context objects
        this.id      = id;
        this.canvas  = document.getElementById(id);
        this.canvas.__object__  = this;
        this.context = this.canvas.getContext ? this.canvas.getContext("2d") : null;
        this.max     = 0;
        this.coords  = [];
        this.data    = [];
        this.type    = 'scatter';

        // Various config type stuff
        this.properties                                 = [];
        this.properties['chart.background.barcolor1']   = 'white';
        this.properties['chart.background.barcolor2']   = 'white';
        this.properties['chart.background.grid']        = true;
        this.properties['chart.background.grid.width']  = 1;
        this.properties['chart.background.grid.color']  = '#ddd';
        this.properties['chart.background.grid.hsize']  = 20;
        this.properties['chart.background.grid.vsize']  = 20;
        this.properties['chart.background.hbars']       = null;
        this.properties['chart.background.grid.vlines'] = true;
        this.properties['chart.background.grid.hlines'] = true;
        this.properties['chart.background.grid.border'] = true;
        this.properties['chart.text.size']              = 10;
        this.properties['chart.text.angle']             = 0;
        this.properties['chart.text.color']             = 'black';
        this.properties['chart.text.font']              = 'Verdana';
        this.properties['chart.tooltip.effect']         = 'fade';
        this.properties['chart.tooltip.hotspot']        = 3;
        this.properties['chart.units.pre']              = '';
        this.properties['chart.units.post']             = '';
        this.properties['chart.tickmarks']              = 'cross';
        this.properties['chart.ticksize']               = 2;
        //this.properties['chart.margin']                = 10;
        this.properties['chart.gutter']                 = 25;
        this.properties['chart.xmax']                   = 0;
        this.properties['chart.ymax']                   = null;
        this.properties['chart.scale.decimals']         = 0;
        this.properties['chart.title']                  = '';
        this.properties['chart.title.vpos']             = null;
        this.properties['chart.labels']                 = [];
        this.properties['chart.contextmenu']            = null;
        this.properties['chart.defaultcolor']           = '#000';
        this.properties['chart.xaxispos']               = 'bottom';
        this.properties['chart.crosshairs']             = false;
        this.properties['chart.crosshairs.color']       = '#333';
        this.properties['chart.annotatable']            = false;
        this.properties['chart.annotate.color']         = '#000';
        this.properties['chart.line']                   = false;
        this.properties['chart.line.colors']            = ['green', 'red'];
        this.properties['chart.line.shadow.color']      = 'rgba(0,0,0,0)';
        this.properties['chart.line.shadow.blur']       = 2;
        this.properties['chart.line.shadow.offsetx']    = 3;
        this.properties['chart.line.shadow.offsety']    = 3;
        this.properties['chart.noaxes']                 = false;
        this.properties['chart.key']                    = [];
        this.properties['chart.key.background']         = '#fff';
        this.properties['chart.key.position']           = 'graph';
        this.properties['chart.key.shadow']             = false;
        this.properties['chart.axis.color']             = 'black';

        // Handle multiple datasets being given as one argument
        if (arguments[1][0] && arguments[1][0][0] && typeof(arguments[1][0][0][0]) == 'number') {
            // Store the data set(s)
            for (var i=0; i<arguments[1].length; ++i) {
                this.data[i] = arguments[1][i];
            }

        // Handle multiple data sets being supplied as seperate arguments
        } else {
            // Store the data set(s)
            for (var i=1; i<arguments.length; ++i) {
                this.data[i - 1] = arguments[i];
            }
        }

        // Check for support
        if (!this.canvas) {
            alert('[SCATTER] No canvas support');
            return;
        }
        
        // Check the common library has been included
        if (typeof(RGraph) == 'undefined') {
            alert('[SCATTER] Fatal error: The common library does not appear to have been included');
        }
    }


    /**
    * A simple setter
    * 
    * @param string name  The name of the property to set
    * @param string value The value of the property
    */
    RGraph.Scatter.prototype.Set = function (name, value)
    {
        /**
        * This is here because the key expects a name of "chart.colors"
        */
        if (name == 'chart.line.colors') {
            this.properties['chart.colors'] = value;
        }

        this.properties[name] = value;
    }


    /**
    * A simple getter
    * 
    * @param string name  The name of the property to set
    */
    RGraph.Scatter.prototype.Get = function (name)
    {
        return this.properties[name];
    }


    /**
    * The function you call to draw the line chart
    */
    RGraph.Scatter.prototype.Draw = function ()
    {
        // Go through all the data points and see if a tooltip has been given
        this.Set('chart.tooltips', false);
        this.hasTooltips = false;
        var overHotspot  = false;

        // Reset the coords array
        this.coords = [];

        for (var i=0; i<this.data.length; ++i) {
            for (var j =0;j<this.data[i].length; ++j) {
                if (typeof(this.data[i][j][3]) == 'string' && this.data[i][j][3].length) {
                    this.Set('chart.tooltips', [1]); // An array
                    this.hasTooltips = true;
                }
            }
        }

        // Reset the maximum value
        this.max = 0;

        // Work out the maximum Y value
        if (this.Get('chart.ymax') && this.Get('chart.ymax') > 0) {
            this.max   = this.Get('chart.ymax');
            this.scale = [
                          (this.max * (1/5)).toFixed(this.Get('chart.scale.decimals')),
                          (this.max * (2/5)).toFixed(this.Get('chart.scale.decimals')),
                          (this.max * (3/5)).toFixed(this.Get('chart.scale.decimals')),
                          (this.max * (4/5)).toFixed(this.Get('chart.scale.decimals')),
                           this.max.toFixed(this.Get('chart.scale.decimals'))
                          ];

        } else {

            var i = 0;
            var j = 0;

            for (i=0; i<this.data.length; ++i) {
                for (j=0; j<this.data[i].length; ++j) {
                    this.max   = Math.max(this.max, Math.abs(this.data[i][j][1]));
                }
            }

            this.scale = RGraph.getScale(this.max);
            this.max   = this.scale[4];
            
            this.scale = [
                          this.scale[0].toFixed(this.Get('chart.scale.decimals')),
                          this.scale[1].toFixed(this.Get('chart.scale.decimals')),
                          this.scale[2].toFixed(this.Get('chart.scale.decimals')),
                          this.scale[3].toFixed(this.Get('chart.scale.decimals')),
                          this.scale[4].toFixed(this.Get('chart.scale.decimals'))
                         ];
        }

        this.grapharea = this.canvas.height - (2 * this.Get('chart.gutter'));

        // Progressively Draw the chart
        RGraph.background.Draw(this);

        /**
        * Draw any horizontal bars that have been specified
        */
        if (this.Get('chart.background.hbars') && this.Get('chart.background.hbars').length) {
            RGraph.DrawBars(this);
        }

        if (!this.Get('chart.noaxes')) {
            this.DrawAxes();
        }

        this.DrawLabels();

        i = 0;
        for(i=0; i<this.data.length; ++i) {
            this.DrawMarks(i);

            // Set the shadow
            this.context.shadowColor   = this.Get('chart.line.shadow.color');
            this.context.shadowOffsetX = this.Get('chart.line.shadow.offsetx');
            this.context.shadowOffsetY = this.Get('chart.line.shadow.offsety');
            this.context.shadowBlur    = this.Get('chart.line.shadow.blur');
            
            this.DrawLine(i);

            // Turn the shadow off
            this.context.shadowColor   = 'rgba(0,0,0,0)';
            this.context.shadowOffsetX = 0;
            this.context.shadowOffsetY = 0;
            this.context.shadowBlur    = 0;
        }


        if (this.Get('chart.line')) {
            for (var i=0;i<this.data.length; ++i) {
                this.DrawMarks(i); // Call this again so the tickmarks appear over the line
            }
        }



        /**
        * Setup the context menu if required
        */
        RGraph.ShowContext(this);

        /**
        * Install the event handler for tooltips
        */
        if (this.hasTooltips) {

            /**
            * Register all charts
            */
            RGraph.Register(this);

            var overHotspot = false;

            this.canvas.onmousemove = function (e)
            {
                e = RGraph.FixEventObject(document.all ? event : e);
    
                var canvas      = e.target;
                var obj         = canvas.__object__;
                var context     = canvas.getContext('2d');
                var mouseCoords = RGraph.getMouseXY(e);
                var overHotspot = false;

                /**
                * Now loop through each point comparing the coords
                */

                var offset = obj.Get('chart.tooltip.hotspot'); // This is how far the hotspot extends

                for (var set=0; set<obj.coords.length; ++set) {
                    for (var i=0; i<obj.coords[set].length; ++i) {
                        var xCoord = obj.coords[set][i][0];
                        var yCoord = obj.coords[set][i][1];
                        var tooltip = obj.coords[set][i][2];
        
                        if (mouseCoords[0] <= (xCoord + offset) &&
                            mouseCoords[0] >= (xCoord - offset) &&
                            mouseCoords[1] <= (yCoord + offset) &&
                            mouseCoords[1] >= (yCoord - offset) &&
                            tooltip &&
                            tooltip.length > 0) {
        
                            overHotspot = true;
                            canvas.style.cursor = document.all ? 'hand' : 'pointer';
    
                            if (!RGraph.Registry.Get('chart.tooltip') || RGraph.Registry.Get('chart.tooltip').__text__ != tooltip) {
    
                                RGraph.Redraw();
        
                                RGraph.Tooltip(canvas, tooltip, e.pageX, e.pageY);
        
                                // Draw a circle around the mark
                                context.beginPath();
                                context.fillStyle = 'rgba(255,255,255,0.5)';
                                context.arc(xCoord, yCoord, 3, 0, 6.28, 0);
        
                                context.fill();
                            
                            }
                        }
                    }
                }

                /**
                * Reset the pointer
                */
                if (!overHotspot) {
                    canvas.style.cursor = null;
                }
            }

        // This resets the canvas events - getting rid of any installed event handlers
        } else {
            this.canvas.onmousemove = null;
        }
        
        
        /**
        * Draw the key if necessary
        */
        if (this.Get('chart.key') && this.Get('chart.key').length) {
            RGraph.DrawKey(this, this.Get('chart.key'), this.Get('chart.line.colors'));
        }


        /**
        * Draw crosschairs
        */
        RGraph.DrawCrosshairs(this);
        
        /**
        * If the canvas is annotatable, do install the event handlers
        */
        RGraph.Annotate(this);
    }


    /**
    * Draws the axes of the scatter graph
    */
    RGraph.Scatter.prototype.DrawAxes = function ()
    {
        var canvas      = this.canvas;
        var context     = this.context;
        var graphHeight = this.canvas.height - (this.Get('chart.gutter') * 2);
        var gutter      = this.Get('chart.gutter');

        context.beginPath();
        context.strokeStyle = this.Get('chart.axis.color');
        context.lineWidth   = 1;

        // Draw the Y axis
        context.moveTo(gutter, gutter);
        context.lineTo(gutter, this.canvas.height - gutter);
        
        // Draw the X axis
        if (this.Get('chart.xaxispos') == 'center') {
            this.context.moveTo(gutter, this.canvas.height / 2);
            this.context.lineTo(this.canvas.width - gutter, this.canvas.height / 2);
        } else {
            this.context.moveTo(gutter, this.canvas.height - gutter);
            this.context.lineTo(this.canvas.width - gutter, this.canvas.height - gutter);
        }

        // Draw the Y tickmarks
        for (y=gutter; y < this.canvas.height - gutter + (this.Get('chart.xaxispos') == 'center' ? 1 : 0) ; y+=(graphHeight / 5) / 2) {
            
            // This is here to accomodate the X axis being at the center
            if (y == (this.canvas.height / 2) ) continue;

            this.context.moveTo(gutter, y);
            this.context.lineTo(gutter - 3, y);
        }
        
        var x, y;
        // Draw the X tickmarks
        x             = 0;
        y             =  (this.Get('chart.xaxispos') == 'center') ? (this.canvas.height / 2) : (this.canvas.height - gutter);
        this.xTickGap = (this.canvas.width - (2 * gutter) ) / this.Get('chart.labels').length;

        for (x = (gutter + (this.xTickGap / 2) ); x<=(this.canvas.width - gutter); x += this.xTickGap / 2) {
            this.context.moveTo(x, y - (this.Get('chart.xaxispos') == 'center' ? 3 : 0));
            this.context.lineTo(x, y + 3);
        }

        this.context.stroke();
    }


    /**
    * Draws the labels on the scatter graph
    */
    RGraph.Scatter.prototype.DrawLabels = function ()
    {
        this.context.fillStyle = this.Get('chart.text.color');
        var font       = this.Get('chart.text.font');
        var xMax       = this.Get('chart.xmax');
        var yMax       = this.scale[4];
        var gutter     = this.Get('chart.gutter');
        var text_size  = this.Get('chart.text.size');
        var units_pre  = this.Get('chart.units.pre');
        var units_post = this.Get('chart.units.post');
        var context    = this.context;
        var canvas     = this.canvas;

        /**
        * Draw the Y qaxis labels, be it at the top or center
        */
        if (this.Get('chart.xaxispos') == 'center') {
        
            this.halfGraphHeight = (this.canvas.height - (2 * this.Get('chart.gutter'))) / 2;
        
            // Draw the top halves labels
            RGraph.Text(context, font, text_size, gutter - 5, gutter + 5, RGraph.number_format(this.scale[4], units_pre, units_post), null, 'right');
            RGraph.Text(context, font, text_size, gutter - 5, gutter + 5 + ((canvas.height - (2 * gutter)) * (1/10) ), RGraph.number_format(this.scale[3], units_pre, units_post), null, 'right');
            RGraph.Text(context, font, text_size, gutter - 5, gutter + 5 + ((canvas.height - (2 * gutter)) * (2/10) ), RGraph.number_format(this.scale[2], units_pre, units_post), null, 'right');
            RGraph.Text(context, font, text_size, gutter - 5, gutter + 5 + ((canvas.height - (2 * gutter)) * (3/10) ), RGraph.number_format(this.scale[1], units_pre, units_post), null, 'right');
            RGraph.Text(context, font, text_size, gutter - 5, gutter + 5 + ((canvas.height - (2 * gutter)) * (4/10) ), RGraph.number_format(this.scale[0], units_pre, units_post), null, 'right');
            
            // Draw the bottom halves labels
            RGraph.Text(context, font, text_size, gutter - 5, gutter + 5 + ((canvas.height - (2 * gutter)) * (1/10) ) + this.halfGraphHeight, '-' + RGraph.number_format(this.scale[0], units_pre, units_post), null, 'right');
            RGraph.Text(context, font, text_size, gutter - 5, gutter + 5 + ((canvas.height - (2 * gutter)) * (2/10) ) + this.halfGraphHeight, '-' + RGraph.number_format(this.scale[1], units_pre, units_post), null, 'right');
            RGraph.Text(context, font, text_size, gutter - 5, gutter + 5 + ((canvas.height - (2 * gutter)) * (3/10) ) + this.halfGraphHeight, '-' + RGraph.number_format(this.scale[2], units_pre, units_post), null, 'right');
            RGraph.Text(context, font, text_size, gutter - 5, gutter + 5 + ((canvas.height - (2 * gutter)) * (4/10) ) + this.halfGraphHeight, '-' + RGraph.number_format(this.scale[3], units_pre, units_post), null, 'right');
            RGraph.Text(context, font, text_size, gutter - 5, gutter + 5 + ((canvas.height - (2 * gutter)) * (5/10) ) + this.halfGraphHeight, '-' + RGraph.number_format(this.scale[4], units_pre, units_post), null, 'right');
        } else {
            RGraph.Text(context, font, text_size, gutter - 5, gutter + 5, RGraph.number_format(this.scale[4], units_pre, units_post), null, 'right');
            RGraph.Text(context, font, text_size, gutter - 5, gutter + 5 + ((canvas.height - (2 * gutter)) * (1/5) ), RGraph.number_format(this.scale[3], units_pre, units_post), null, 'right');
            RGraph.Text(context, font, text_size, gutter - 5, gutter + 5 + ((canvas.height - (2 * gutter)) * (2/5) ), RGraph.number_format(this.scale[2], units_pre, units_post), null, 'right');
            RGraph.Text(context, font, text_size, gutter - 5, gutter + 5 + ((canvas.height - (2 * gutter)) * (3/5) ), RGraph.number_format(this.scale[1], units_pre, units_post), null, 'right');
            RGraph.Text(context, font, text_size, gutter - 5, gutter + 5 + ((canvas.height - (2 * gutter)) * (4/5) ), RGraph.number_format(this.scale[0], units_pre, units_post), null, 'right');
        }
        
        // Put the text on the X axis
        var graphArea = this.canvas.width - (2 * gutter);
        var xInterval = graphArea / this.Get('chart.labels').length;
        var xPos      = gutter;
        var yPos      = (this.canvas.height - gutter) + 15

        /**
        * Text angle
        */
        var angle  = 0;
        var valign = null;
        var halign = 'center';

        if (this.Get('chart.text.angle') == 45 || this.Get('chart.text.angle') == 90) {
            angle  = -1 * this.Get('chart.text.angle');
            valign = 'center';
            halign = 'right';
            yPos -= 10;
        }

        for (i=0; i<this.Get('chart.labels').length; ++i) {
            RGraph.Text(context, font, this.Get('chart.text.size'), xPos + (this.xTickGap / 2), yPos, String(this.Get('chart.labels')[i]) , valign, halign, null, angle);
            
            // Do this for the next time around
            xPos += xInterval;
        }
    }


    /**
    * Draws the actual scatter graph marks
    * 
    * @param i integer The dataset index
    */
    RGraph.Scatter.prototype.DrawMarks = function (i)
    {
        /**
        *  Reset the coords array
        */
        this.coords[i] = [];

        /**
        * Plot the values
        */
        var xmax          = this.Get('chart.xmax');
        var default_color = this.Get('chart.defaultcolor');

        for (var j=0; j<this.data[i].length; ++j) {
            /**
            * This is here because tooltips are optional
            */
            var data_point = this.data[i];
            var tooltip = data_point[j][3] ? data_point[j][3] : null;
        
            this.DrawMark(data_point[j][0], data_point[j][1], xmax, this.scale[4], data_point[j][2] ? data_point[j][2] : default_color, tooltip, this.coords[i]);
        }
    }


    /**
    * Draws a single scatter mark
    */
    RGraph.Scatter.prototype.DrawMark = function (x, y, xMax, yMax, color, tooltip, coords)
    {
        var tickmarks = this.Get('chart.tickmarks');
        var gutter    = this.Get('chart.gutter');
        var x = (x / xMax) * (this.canvas.width - (2 * gutter));
        var y = (y / yMax) * (this.canvas.height - (2 * gutter));

        /**
        * Account for the X axis being at the centre
        */
        if (this.Get('chart.xaxispos') == 'center') {
            y /= 2;
            y += this.halfGraphHeight;
        }

        // This is so that points are on the graph, and not the gutter
        x += gutter;
        y  = this.canvas.height - gutter - y;


        var halfTickSize = this.Get('chart.ticksize') / 2;

        this.context.beginPath();
        
        // Color
        this.context.strokeStyle = color;

        if (tickmarks == 'circle') {
            this.context.arc(x, y, halfTickSize, 0, 6.28, 0);
            this.context.fillStyle = color;
            this.context.fill();
        
        } else if (tickmarks == 'plus') {
            this.context.moveTo(x, y - halfTickSize);
            this.context.lineTo(x, y + halfTickSize);
            this.context.moveTo(x - halfTickSize, y);
            this.context.lineTo(x + halfTickSize, y);
            this.context.stroke();
        
        } else if (tickmarks == 'square') {
            this.context.strokeStyle = color;
            this.context.fillStyle = color;
            this.context.fillRect(
                                  x - halfTickSize,
                                  y - halfTickSize,
                                  this.Get('chart.ticksize'),
                                  this.Get('chart.ticksize')
                                 );
            //this.context.fill();

        } else if (tickmarks == 'cross') {
            var ticksize = this.Get('chart.ticksize');

            this.context.moveTo(x - ticksize, y - ticksize);
            this.context.lineTo(x + ticksize, y + ticksize);
            this.context.moveTo(x + ticksize, y - ticksize);
            this.context.lineTo(x - ticksize, y + ticksize);
            
            this.context.stroke();
        
        // Unknown tickmark type
        } else {
            alert('[SCATTER] (' + this.id + ') Unknown tickmark style: ' + tickmarks );
        }

        /**
        * Add the tickmark to the coords array
        */
        coords.push([x, y, tooltip]);
    }
    
    
    /**
    * Draws an optional line connecting the tick marks.
    * 
    * @param i The index of the dataset to use
    */
    RGraph.Scatter.prototype.DrawLine = function (i)
    {
        if (this.Get('chart.line') && this.coords[i].length >= 2) {

            this.context.strokeStyle = this.Get('chart.line.colors')[i];
            this.context.beginPath();
            
            var len = this.coords[i].length;

            for (var j=0; j<this.coords[i].length; ++j) {

                var xPos = this.coords[i][j][0];
                var yPos = this.coords[i][j][1];

                if (j == 0) {
                    this.context.moveTo(xPos, yPos);
                } else {
                    this.context.lineTo(xPos, yPos);
                }
            }
            
            this.context.stroke();
        }
    }