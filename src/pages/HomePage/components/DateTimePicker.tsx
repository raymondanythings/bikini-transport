import { useState } from "react";
import Picker from "react-mobile-picker";
import { css } from "styled-system/css";
import { Box } from "styled-system/jsx";

type DateTimeValue = {
	date: string;
	period: string;
	hour: string;
	minute: string;
};

type DateTimePickerProps = {
	initialValue?: Date;
	onChange: (date: Date) => void;
};

export const DateTimePicker = ({
	initialValue = new Date(),
	onChange,
}: DateTimePickerProps) => {
	const [value, setValue] = useState<DateTimeValue>(
		dateToPickerValue(initialValue),
	);

	const selections = {
		date: generateDates(),
		period: generatePeriods(),
		hour: generateHours(),
		minute: generateMinutes(),
	};

	const handleChange = (newValue: DateTimeValue) => {
		setValue(newValue);
		const dateObject = pickerValueToDate(newValue);
		onChange(dateObject);
	};

	return (
		<Box className={pickerStyles}>
			<Picker
				value={value}
				onChange={handleChange}
				wheelMode="natural"
				height={250}
				itemHeight={50}
			>
				{Object.keys(selections).map((name) => (
					<Picker.Column key={name} name={name}>
						{Object.keys(selections[name as keyof typeof selections]).map(
							(option) => (
								<Picker.Item key={option} value={option}>
									{({ selected }) => (
										<div
											className={
												selected
													? "picker-item picker-item-selected"
													: "picker-item"
											}
										>
											{selections[name as keyof typeof selections][option]}
										</div>
									)}
								</Picker.Item>
							),
						)}
					</Picker.Column>
				))}
			</Picker>
		</Box>
	);
};

const dateToPickerValue = (date: Date): DateTimeValue => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");

	let hour = date.getHours();
	const period = hour >= 12 ? "오후" : "오전";

	if (hour > 12) {
		hour -= 12;
	} else if (hour === 0) {
		hour = 12;
	}

	return {
		date: `${year}-${month}-${day}`,
		period,
		hour: String(hour),
		minute: String(date.getMinutes()),
	};
};

const pickerValueToDate = (value: DateTimeValue): Date => {
	const [year, month, day] = value.date.split("-").map(Number);
	let hour = Number(value.hour);

	if (value.period === "오후" && hour !== 12) {
		hour += 12;
	} else if (value.period === "오전" && hour === 12) {
		hour = 0;
	}

	return new Date(year, month - 1, day, hour, Number(value.minute));
};

const generateDates = () => {
	const dates: { [key: string]: string } = {};
	const today = new Date();

	for (let i = 0; i < 365; i++) {
		const date = new Date(today);
		date.setDate(today.getDate() + i);

		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");

		const key = `${year}-${month}-${day}`;
		const label =
			i === 0 ? "오늘" : i === 1 ? "내일" : `${year}.${month}.${day}`;
		dates[key] = label;
	}

	return dates;
};

const generatePeriods = (): { [key: string]: string } => ({
	오전: "오전",
	오후: "오후",
});

const generateHours = () => {
	const hours: { [key: string]: string } = {};
	for (let i = 1; i <= 12; i++) {
		const key = String(i);
		hours[key] = key;
	}
	return hours;
};

const generateMinutes = () => {
	const minutes: { [key: string]: string } = {};
	for (let i = 0; i < 60; i++) {
		const key = String(i);
		minutes[key] = key.padStart(2, "0");
	}
	return minutes;
};

const pickerStyles = css({
	p: 4,
	"& .picker-column": {
		flex: 1,
	},
	"& .picker-column:nth-child(1)": {
		flex: 2,
	},
	"& .picker-scroller": {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	"& .picker-item": {
		height: "50px",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		color: "line.normal",
		transition: "all 0.3s ease",
		textStyle: "H1_Medium",
		whiteSpace: "nowrap",
	},
	"& .picker-item.picker-item-selected": {
		color: "primary.normal",
		textStyle: "H1_Bold",
	},
	"& .picker-highlight": {
		position: "absolute",
		top: "50%",
		left: 0,
		right: 0,
		height: "50px",
		transform: "translateY(-50%)",
		borderTop: "1px solid",
		borderBottom: "1px solid",
		borderColor: "line.normal",
		pointerEvents: "none",
	},
});
