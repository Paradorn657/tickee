"use client"

import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Key, useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/dropdown";

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Graph() {
    const [recdata, setrecdata] = useState<any | null>(null);
    const [inYearData, setInYearData] = useState<any | null>(null);
    const [onLoad, setOnLoad] = useState<boolean>(true);
    const [selectYear, setSelectYear] = useState<number>(0);
    const [yearArray, setYearArray] = useState<number[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setOnLoad(true)
            try {
                const res = await fetch('/api/admin/graph');
                if (!res.ok) {
                    const errorResponse = await res.json();
                    console.warn('API Error:', errorResponse.message || 'Unknown error');
                    setrecdata(null);
                    setYearArray([]);
                    
                    throw Error
                }
                const { data, yearArray } = await res.json();
                if (data && Array.isArray(yearArray)) {
                    setrecdata(data);
                    setYearArray(yearArray);

                    let seperate = JSON.parse(JSON.stringify(data));
                    seperate.datasets = [data.datasets[selectYear]]
                    setInYearData(seperate)
                    
                } else {
                    setrecdata(null);
                    setYearArray([]);
                    
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            setOnLoad(false)
        };
        fetchData();
    }, []);

    const yearChangeAction = (key: Key) => {
        setOnLoad(true)
        try {
            setSelectYear(Number(key))
            let seperate = JSON.parse(JSON.stringify(recdata))
            seperate.datasets = [recdata.datasets[Number(key)]]
            setInYearData(seperate)
        } catch (error) {
            console.error('Error Setting data:', error);
        }
        setOnLoad(false)
    }


    return (
        <>
            <h1 className="font-bold text-inherit uppercase text-3xl">Graph</h1>
            <div className="relative h-[520px] min-w-56 overflow-x-scroll scroll-smooth scrollbar-hide whitespace-nowrap w-full px-32">
                {(!onLoad && recdata != null) && (
                    <>
                        <Dropdown placement="bottom-start" className='text-center'>
                            <DropdownTrigger>
                                <Button
                                    variant="bordered"
                                    className="capitalize absolute z-30 top-3 left-36"
                                >
                                    {yearArray[selectYear]}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                aria-label="Year Selection"
                                variant="flat"
                                disallowEmptySelection
                                selectionMode="single"
                                onAction={(key) => { yearChangeAction(key) }}
                            >
                                {yearArray.map((item: number, index) => (
                                    <DropdownItem key={index}>{item}</DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Line
                            className="size-full mx-auto"
                            data={inYearData}
                            options={{
                                maintainAspectRatio: true,
                                plugins: {
                                    title: {
                                        text: 'Profit / Year',
                                        display: true,
                                    },
                                },
                                scales: {
                                    x: {
                                        type: "time",
                                        time: {
                                            unit: 'month'
                                        },
                                        title: {
                                            display: true,
                                            text: 'Time',
                                        },
                                    },
                                    y: {
                                        title: {
                                            display: true,
                                            text: 'Value',
                                        },
                                    },
                                }
                            }} />
                    </>
                )}
                {!(!onLoad && recdata != null) && (
                    <div className="flex flex-wrap justify-center items-center min-w-56 size-full border-1 border-default">
                        <p className="text-3xl text-default text-ellipsis overflow-hidden">No Data For Display</p>
                    </div>
                )}
            </div>
        </>
    )
};
