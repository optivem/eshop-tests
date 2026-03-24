export interface SystemErrorField {
	field: string;
	message: string;
	code?: string;
}

export interface SystemError {
	message: string;
	fields?: SystemErrorField[];
}
