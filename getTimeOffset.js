
function getTimeOffset(){}
	var rightNow = new Date();
	var jan1 = new Date(rightNow.getFullYear(), rightNow.getMonth(), rightNow.getDate(), 0, 0, 0, 0);
	var temp = jan1.toUTCString();
	var jan2 = new Date(temp.substring(0, temp.lastIndexOf(" ")-1));
	var std_time_offset = (jan1 - jan2) / (1000 * 60 * 60);

	return std_time_offset;
}
​