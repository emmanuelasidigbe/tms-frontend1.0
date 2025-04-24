const formatDate = (date: Date): string => {
	return new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	}).format(date);
};

export default formatDate;
