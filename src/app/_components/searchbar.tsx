'use client'

import {Button, NativeSelect} from "@mantine/core";
import {DatePickerInput, TimeInput} from "@mantine/dates";
import {useState} from "react";
import {api} from "~/trpc/react";
import {Ride} from "@prisma/client";

const locations = [
	"Ithaca",
	"New York",
	"Los Angeles",
]

export default function SearchBar() {
	const [fromLocation, setFromLocation] = useState(locations[0] ?? "");
	const [toLocation, setToLocation] = useState(locations[1] ?? "");
	const [date, setDate] = useState(new Date());
	const [searchParams, setSearchParams] = useState({
		fromLocation,
		toLocation,
		date,
	});

	const handleClick = async () => {
		setSearchParams({
			fromLocation,
			toLocation,
			date
		});

		console.log(searchParams)
	}

	return (
		<div className={'flex flex-col'}>
			<div className={'flex flex-row m-3 items-end'}>
				<div className={'mx-3'}/>
				<NativeSelect label={"From"} data={locations} id={'fromLocation'} value={fromLocation} onChange={(e) => setFromLocation(e.target.value)} />
				<div className={'mx-3'}/>
				<NativeSelect label={"To"} data={locations} id={'toLocation'} value={toLocation} onChange={e => setToLocation(e.target.value)}/>
				<div className="mx-3"/>
				<DatePickerInput className={'w-48'} label={"Date"} id={'dateDay'} value={date} onChange={e => setDate(e)} />
				<div className={'mx-3'}/>
				<Button onClick={handleClick}> Find Ride </Button>
			</div>
			<div className="flex flex-col">

			</div>
		</div>
	)

}