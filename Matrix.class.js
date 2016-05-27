/**
 * Javascript Matrix v.1.1
 * 2009-02-02
 *
 * Jose Carlos Cruz Parra AKA internia
 * josecarlos@programadorphpfreelance.com
 * http://www.programadorphpfreelance.com
 *
 * Feel free to manipulate the code
 * but don't delete the author references
 */
function Matrix(varName, div_id)
{
	this._version = '1.1';
	this._varName = varName;
	this._matrix_div = document.getElementById(div_id == null ? 'matrix' : div_id);
	this._matrix_div.style.margin = '0 auto';
	this._matrix_div.style.textAlign = 'center';
	this._matrix_div.style.verticalAlign = 'middle';
	this._chars = '0123456789ABCDEF';
	this._endingChar = '&#165;';
	this._sizeX = 40;
	this._sizeY = 30;
	this._cellSize = 16;
	this._wormMinLength = 1;
	this._wormMaxLength = 16;
	this._background = '#000000';
	this._color1 = '#ffffff';
	this._color2 = '#55ee66';
	this._color3 = '#3ab340';
	this._delay = 10;
	this._loopTimes = 0; //0 or less makes infinite loop
	this._currentTime = 0;
	this._intervalId = 0;
	this._numWorms = 32;
	this._mode = "random";
	this._worms = new Array();
	this._set = function(variable, value)
	{
		if(value != null)
		{
			switch(typeof(value))
			{
				default:
				case "string":
					eval('this.'+variable+' = \''+value+'\'');
					break;
				case "number":
					eval('this.'+variable+' = '+value);
					break;
			}
		}
	}
	this.SetChars = function(chars,endingChar)
	{
		this._set('_chars', chars);
		this._set('_endingChar', endingChar);
	}
	this.SetSize = function(sizeX,sizeY,cellSize)
	{
		this._set('_sizeX', parseInt(sizeX));
		this._set('_sizeY', parseInt(sizeY));
		this._set('_cellSize', parseInt(cellSize));
	}
	this.SetWormLengthRange = function(min,max)
	{
		this._set('_wormMinLength', parseInt(min));
		this._set('_wormMaxLength', parseInt(max));
	}
	this.SetColors = function(background,color1,color2,color3) //background can be an image
	{
		this._set('_background', background);
		this._set('_color1', color1);
		this._set('_color2', color2);
		this._set('_color3', color3);
	}
	this.SetTiming = function(delay,loopTimes,numWorms)
	{
		this._set('_delay', parseInt(delay));
		this._set('_loopTimes', parseInt(loopTimes));
		this._set('_numWorms', parseInt(numWorms));
	}
	this.SetMode = function(mode)
	{
		switch(mode)
		{
			default:
				this._mode = "random";
				break;
			case "random":
			case "sequence":
				this._mode = mode;
				break;
		}
	}
	this.Run = function()
	{
		this._worms = new Array();
		this._matrix_div.name = this._varName;
		this._matrix_div.innerHTML = '';
		this._matrix_div.style.width = (this._sizeX * this._cellSize)+'px'; //adjust div width
		this._matrix_div.style.background = this._background;
		this._matrix_div.style.fontFamily = 'Courier New';
		this._matrix_div.style.fontWeight = 'bold';
		this._matrix_div.style.overflow = 'hidden';
		for(var c=0; c<this._sizeY; c++)
		{
			for(var k=0; k<this._sizeX; k++)
			{
				var matrix_cell = document.createElement('div');
				matrix_cell.style.width = this._cellSize+'px';
				matrix_cell.style.height = this._cellSize+'px';
				matrix_cell.id = 'matrix_'+k+'_'+c;
				matrix_cell.innerHTML = '&nbsp;';
				matrix_cell.style.cssFloat = 'left';
				this._matrix_div.appendChild(matrix_cell);
			}
			var matrix_endLine = document.createElement('div');
			matrix_endLine.style.clear = 'both';
			this._matrix_div.appendChild(matrix_endLine);
		}
		//this._matrix_div.onclick = function(){eval(document.getElementById('matrix').name+'.ShowForm()');}
		this._matrix_div.onclick=function(){}
		this._matrix_div.style.cursor = 'pointer';
		//this._matrix_div.title = 'Click to show configuration form';
				this._matrix_div.title = '';

		this._intervalId = setInterval(this._varName+'.running()', this._delay);
	}
	this.running = function()
	{
		for(var c=0; c<this._numWorms; c++)
		{
			//Preventing to change numWorms while running
			if(this._worms[c] == null || !this._worms[c].PrintChar())
			{
				this._worms[c] = this.getNewWorm();
			}
		}
		if(this._loopTimes > 0)
		{
			this._currentTime++;
			if(this._currentTime >= this._loopTimes)
			{
				clearInterval(this._intervalId);
			}
		}
	}
	this.getNewWorm = function()
	{
		return new MatrixWorm(this._chars,this._endingChar,this._sizeX,this._sizeY,this._cellSize,this._wormMinLength,this._wormMaxLength,this._color1,this._color2,this._color3,this._mode);
	}
	this.ShowForm = function()
	{
		clearInterval(this._intervalId);

		html = '<form action="" method="get" onsubmit="'+this._varName+'.ApplyConfig();'+this._varName+'.Run();return false"><table style="margin:0 auto;text-align:left">';
		html += '<tr><th colspan="2" style="padding-bottom:20px">Javascript MATRIX '+this._version+' - Configuration</th></tr>';
		html += '<tr><td>Chars</td><td><input type="text" name="chars" id="matrix_chars" value="'+this._chars+'" size="20" /></td></tr>'
		html += '<tr><td>Ending char</td><td><input type="text" name="endingChar" id="matrix_endingChar" value="'+this._endingChar+'" size="5" /></td></tr>';
		html += '<tr><td>Mode</td><td><input type="radio" name="mode" id="matrix_mode_random" value="random" '+(this._mode=='random' ? 'checked="checked"' : '')+' /><label for="matrix_mode_random"> Random</label> <input type="radio" name="mode" id="matrix_mode_sequence" value="sequence" '+(this._mode=='sequence' ? 'checked="checked"' : '')+' /><label for="matrix_mode_sequence"> Sequence</label></td></tr>';
		html += '<tr><td>Size X</td><td><input type="text" name="sizeX" id="matrix_sizeX" value="'+this._sizeX+'" size="5" /> cells</td></tr>';
		html += '<tr><td>Size Y</td><td><input type="text" name="sizeY" id="matrix_sizeY" value="'+this._sizeY+'" size="5" /> cells</td></tr>';
		html += '<tr><td>Cell size</td><td><input type="text" name="cellSize" id="matrix_cellSize" value="'+this._cellSize+'" size="5" /> pixels</td></tr>';
		html += '<tr><td>Worm min length</td><td><input type="text" name="wormMinLength" id="matrix_wormMinLength" value="'+this._wormMinLength+'" size="5" /> chars</td></tr>';
		html += '<tr><td>Worm max length</td><td><input type="text" name="wormMaxLength" id="matrix_wormMaxLength" value="'+this._wormMaxLength+'" size="5" /> chars</td></tr>';
		html += '<tr><td>Background</td><td><input type="text" name="background" id="matrix_background" value="'+this._background+'" size="10" /></td></tr>';
		html += '<tr><td>Color 1</td><td><input type="text" name="color1" id="matrix_color1" value="'+this._color1+'" size="10" /></td></tr>';
		html += '<tr><td>Color 2</td><td><input type="text" name="color2" id="matrix_color2" value="'+this._color2+'" size="10" /></td></tr>';
		html += '<tr><td>Color 3</td><td><input type="text" name="color3" id="matrix_color3" value="'+this._color3+'" size="10" /></td></tr>';
		html += '<tr><td>Delay</td><td><input type="text" name="delay" id="matrix_delay" value="'+this._delay+'" size="5" /></td></tr>';
		html += '<tr><td>Loop times</td><td><input type="text" name="loopTimes" id="matrix_loopTimes" value="'+this._loopTimes+'" size="5" /> (0 for infinite loop)</td></tr>';
		html += '<tr><td>Worms quantity</td><td><input type="text" name="numWorms" id="matrix_numWorms" value="'+this._numWorms+'" size="5" /></td></tr>';
		html += '<tr><td colspan="2" style="text-align:center;padding-top:20px"><input type="submit" value="Run MATRIX" /></td></tr>';
		html += '</table></form>';
		html += '<p>Once the MATRIX is running, click on the animation to get this form again</p>';
		html += '<p style="font-size:70%">Created by <a href="http://www.programadorphpfreelance.com">www.programadorphpfreelance.com</a></p>';

		this._matrix_div.innerHTML = html;
		this._matrix_div.style.background = '';
		this._matrix_div.style.textAlign = '';
		this._matrix_div.style.verticalAlign = '';
		this._matrix_div.style.fontFamily = '';
		this._matrix_div.style.fontWeight = '';
		this._matrix_div.onclick = function(){return;}
		this._matrix_div.style.cursor = '';
		this._matrix_div.title = '';
	}
	this.ApplyConfig = function()
	{
		this.SetChars(this._getFormValue('chars'), this._getFormValue('endingChar'));
		this.SetSize(this._getFormValue('sizeX'), this._getFormValue('sizeY'), this._getFormValue('cellSize'));
		this.SetWormLengthRange(this._getFormValue('wormMinLength'), this._getFormValue('wormMaxLength'));
		this.SetColors(this._getFormValue('background'), this._getFormValue('color1'), this._getFormValue('color2'), this._getFormValue('color3'));
		this.SetTiming(this._getFormValue('delay'), this._getFormValue('loopTimes'), this._getFormValue('numWorms'));
		this.SetMode(this._getFormValue('mode', new Array('random','sequence')));
	}
	this._getFormValue = function(key, options)
	{
		if(options != null)
		{
			for(var c=0; c<options.length; c++)
			{
				opt = document.getElementById('matrix_'+key+'_'+options[c]);
				if(opt.checked)
				{
					return opt.value;
				}
			}
			return null;
		}
		return document.getElementById('matrix_'+key).value;
	}
}

function MatrixWorm(chars,endingChar,sizeX,sizeY,cellSize,minLength,maxLength,color1,color2,color3,mode)
{
	this._chars = chars;
	this._endingChar = endingChar;
	switch(mode)
	{
		default:
			this._mode = "random";
			break;
		case "random":
		case "sequence":
			this._mode = mode;
			break;
	}
	this._charIndex = 0; //Index for sequence mode
	this._getRandomInt = function(min, max)
	{
		return min + Math.floor(Math.random() * (1 - min + max));
	}
	this._getChar = function()
	{
		switch(this._mode)
		{
			default:
			case "random":
				return this._chars.charAt(this._getRandomInt(0, this._chars.length-1));
			case "sequence":
				if(this._charIndex >= this._chars.length)
				{
					this._charIndex = 0;
				}
				return this._chars.charAt(this._charIndex++);
		}
	}
	this._minLength = minLength;
	this._maxLength = maxLength;
	this._length = this._getRandomInt(this._minLength, this._maxLength);
	this._fontSize = Math.floor(this._getRandomInt(cellSize,cellSize*3) / 2) + 'px';
	this._color1 = color1;
	this._color2 = color2;
	this._color3 = color3;
	this._sizeX = sizeX;
	this._sizeY = sizeY;
	this._X = this._getRandomInt(0, this._sizeX-1);
	this._Y = this._getRandomInt(0, this._sizeY-1);
	this._isBlank = this._getRandomInt(0,3) == 0;
	this._index = 0;
	this.PrintChar = function(index)
	{
		if(index != null)
		{
			this._index = index;
		}

		if(!this._isBlank && this._index > 0 && this._Y > 0)
		{
			document.getElementById('matrix_'+this._X+'_'+(this._Y-1)).style.color = this._color2;
			if(this._index > 1 && this._Y > 1)
			{
				document.getElementById('matrix_'+this._X+'_'+(this._Y-2)).style.color = this._color3;
			}
		}

		if(this._index < this._length)
		{
			//vertical wrap
			if(this._Y >= this._sizeY)
			{
				this._Y = 0;
			}

			var matrix_td = document.getElementById('matrix_'+this._X+'_'+this._Y);
			if(this._isBlank)
			{
				matrix_td.innerHTML = '&nbsp;';
			}
			else
			{
				matrix_td.style.fontSize = this._fontSize;
				matrix_td.style.color = this._color1;
				matrix_td.innerHTML = (this._index == this._length-1 ? this._endingChar : this._getChar());
			}
			this._Y++;
			this._index++;
			return true; //There are printable chars left
		}
		else
		{
			document.getElementById('matrix_'+this._X+'_'+(this._Y-1)).style.color = this._color3;
		}

		return false; //Print no more chars
	}
	this.Print = function()
	{
		this._index = 0;
		while(this.PrintChar());
	}
}
