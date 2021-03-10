function onFocus(e){
  let value = convert_number(e.target.value);
  e.target.value = value ? value : ''
}

function onBlur(e){
  let value = convert_number(e.target.value);
  if(value == 0){
	  e.target.value = value.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})
  }else{
	  e.target.value = value ? value.toLocaleString('it-IT', {style : 'currency', currency : 'VND'}) : ''
  }

}
function get_time_convert(date_time){
	let date = date_time.split(" ")[0];
	let time = date_time.split(" ")[1];
	return new Date(date.split("/")[1] + ' ' + date.split("/")[0] + ' ' + date.split("/")[2] + ' ' + time)
}
function onFocusPercent(e){
  let value = convert_number(e.target.value);
  e.target.value = value ? value : ''
}

function onBlurPercent(e){
  let value = convert_number(e.target.value);
  e.target.value = value 
    ? value+' %'
    : ''
}
const reduce_string = (string)=>{
    if(string.length > 25){
        return string.slice(0,25) + ' ...'
    }else{
        return string
    }
}
const convert_vnd = (number)=>{
	if ($('html').is(':lang(vi)')) {
		if(Number.isInteger(number))return number.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
		else return "lỗi";
	}else{
		if(Number.isInteger(number))return number.toLocaleString('en-US', {style:'currency', currency:'USD'});
		else return "error";
	}
	
}
const convert_percent = (number)=>{
	if(Number.isInteger(number))return number+ ' %';
	else return "lỗi";
}
const convert_number = (string)=>{
  return Number(string.replace(/[^0-9 ]/g, ""))
}