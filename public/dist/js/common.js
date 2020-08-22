function onFocus(e){
  let value = Number(e.target.value.replace(/[^0-9 ]/g, ""));
  e.target.value = value ? value : ''
}

function onBlur(e){
  let value = Number(e.target.value.replace(/[^0-9 ]/g, ""));
  console.log(value)
  e.target.value = value 
    ? value.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})
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
	if(Number.isInteger(number))return number.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
	else return "lỗi";
}