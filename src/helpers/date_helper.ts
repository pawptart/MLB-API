const todaysDate = new Date;
const date = {
	year: todaysDate.getFullYear(),
	month: todaysDate.getMonth() + 1,
	day: todaysDate.getDate()
};

export default date;