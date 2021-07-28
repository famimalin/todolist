
const Main = '#5bb9b9';
const Dark = '#565151';
const Dark2 = '#6C6666';
const Dark3 = '#8A807F';
const Dark4 = '#A79E9D';
const Dark5 = '#C6BDBC';
const Dark6 = '#E2DFDE';
const Dark7 = '#F0EFEE';
const Dark8 = '#FDF3F3';

const LightBlue = '#E1ECFD';

const AllColor =  '#d98597';
const SelfColor =  '#7acbff';
const WorkColor =  '#df9c01';
const BuyColor =  '#9680f0';

const Red = '#e04131';

// 轉換公式
function hex(x) {
	return ("0" + parseInt(x, 10).toString(16)).slice(-2);
}

// 1 ~ 100 變亮
// -1 ~ -100 變暗
function LightenDarkenColor(col, amt) {
  
    var usePound = false;
  
    if (col[0] === "#") {
        col = col.slice(1);
        usePound = true;
    }
 
    var num = parseInt(col,16);
 
    var r = (num >> 16) + amt;
 
    if (r > 255) r = 255;
    else if  (r < 0) r = 0;
 
    var b = ((num >> 8) & 0x00FF) + amt;
 
    if (b > 255) b = 255;
    else if  (b < 0) b = 0;
 
    var g = (num & 0x0000FF) + amt;
 
    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    const _hex = (g | (b << 8) | (r << 16)).toString(16);
    if(_hex.length !== 6) {
    	return (usePound?"#":"") + (hex(r) + hex(g) + hex(b));
    } else {
    	return (usePound?"#":"") + _hex;
    }
}

function RGBA(hex, opacity) {

	// http://stackoverflow.com/a/5624139
  	var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  	hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    	return r + r + g + g + b + b;
  	});

  	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  	result = result ? 'rgba(' + parseInt(result[1], 16) + ',' + parseInt(result[2], 16) + ',' + parseInt(result[3], 16) + ',' + opacity + ')' : null;
  	return result;
  	
}


const Colors = {
	Main,
	Dark,
	Dark2,
	Dark3,
	Dark4,
	Dark5,
	Dark6,
	Dark7,
	Dark8,
	LightBlue,
	AllColor,
	SelfColor,
	WorkColor,
	BuyColor,
	Red,
	LightenDarkenColor,
	RGBA,
}

export default Colors;