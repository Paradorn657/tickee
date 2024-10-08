"use client"

import React, { useEffect, useState } from 'react'
import { Button } from '@nextui-org/button'
import { DeleteIcon, PlusIcon } from "../icons";
import { Input } from "@nextui-org/input";
import { Event_Type, Promotion_Type } from '@prisma/client';
import { BusinessData } from '@/types/data_type';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';

export default function BusinessAdjustment() {
    const [display, setDisplay] = useState(false);
    const [banner, setBanner] = useState<string[] | null>([]);
    const [newImage, setNewImage] = useState<string>("");
    const [fee, setFee] = useState<number>(0);
    const [eventType, setEventType] = useState<Event_Type[]>([]);
    const [promotionType, setPromotionType] = useState<Promotion_Type[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/admin/business');
                const data: BusinessData = await res.json();
                setBanner(data.admin?.banner_images || null);
                setFee(data.admin?.fee || 0)
                setEventType(data.eventType)
                setPromotionType(data.promotionType)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);
    if (banner == null) {
        console.log("error banner")
    }

    const deleteClick = (idx: number) => {
        if (banner != null) {
            const newArray = banner.filter((_, index) => index !== idx);
            setBanner(newArray)
        }
    };

    const insertNewBanner = () => {
        setDisplay(true);
    };

    const updateNewBanner = () => {
        if (banner != null) {
            const newArray = [...banner]
            newArray.push(newImage)
            setBanner(newArray)
            setNewImage("")
            setDisplay(false);
        }
    };

    const handleFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFee(Number(e.target.value));
    };

    const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewImage(e.target.value);
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/business', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ banner, fee }),
            });
        } catch (error) {
            console.error('Error Upload banner:', error);
        }

        setDisplay(false)
    };

    return (
        <div className='flex flex-col items-center py-10'>
            <div className="flex flex-col items-center gap-5 w-full">
                <h1 className="font-bold text-inherit uppercase text-3xl">type</h1>
                <div className='flex justify-around w-full'>
                    <div className='flex w-1/3'>
                        <Table className="p-8" selectionMode="single" color="default" >
                            <TableHeader>
                                <TableColumn align="center">Event Type</TableColumn>
                            </TableHeader>
                            <TableBody emptyContent={"No Data for Display."}>
                                {eventType.map((item: Event_Type) => (
                                    <TableRow key={item.et_id}>
                                        <TableCell>{item.et_name}</TableCell>
                                        {/* <TableCell>
                                <div className="flex justify-center gap-2 w-full">
                                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                        <EditIcon onClick={() => editClick(item)} />
                                    </span>
                                    <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                        <DeleteIcon onClick={() => deleteClick(item)} />
                                    </span>
                                </div>
                            </TableCell> */}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className='flex w-1/3'>
                        <Table className="p-8" selectionMode="single" color="default" >
                            <TableHeader>
                                <TableColumn align="center">Promotion Type</TableColumn>
                            </TableHeader>
                            <TableBody emptyContent={"No Data for Display."}>
                                {promotionType.map((item: Promotion_Type) => (
                                    <TableRow key={item.pt_id}>
                                        <TableCell>{item.pt_name}</TableCell>
                                        {/* <TableCell>
                                <div className="flex justify-center gap-2 w-full">
                                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                        <EditIcon onClick={() => editClick(item)} />
                                    </span>
                                    <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                        <DeleteIcon onClick={() => deleteClick(item)} />
                                    </span>
                                </div>
                            </TableCell> */}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
                {/* <Input onChange={handleFeeChange} labelPlacement='outside' size='lg' type="number" value={fee.toString()} label="Fee Charge Per Reservation" endContent={
                    <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-medium">$</span>
                    </div>
                } /> */}
                {/* <Button onClick={handleSubmit} color='primary' variant='shadow' className="uppercase w-full" radius="full">submit</Button> */}
            </div>

            <h1 className="font-bold text-inherit uppercase text-3xl">Banners</h1>
            <div className="flex flex-col items-center gap-2 w-full my-10 p-10 bg-opacity-20 bg-gray-600 rounded-2xl">

                {banner?.map((src, index) => (
                    <div key={index} className='relative'>
                        <span className="absolute right-5 top-5 z-10 text-3xl rounded-3xl p-2 bg-danger cursor-pointer active:opacity-50" onClick={() => deleteClick(index)}>
                            <DeleteIcon />
                        </span>
                        <img src={src} style={{ width: '100%', height: 'auto' }} />
                    </div>
                ))}
                <div onClick={insertNewBanner} className='flex justify-center h-1/3 w-3/4 p-5'>
                    {!display && (
                        <PlusIcon className='size-52' />
                    )}

                    {display && (
                        <div className='flex flex-col items-center gap-3 size-full'>
                            <Input onChange={handleImageInputChange} value={newImage} type="text" label="Image URL" />
                            <Button onClick={updateNewBanner} color='primary' variant='shadow' className="uppercase w-full" radius="full">insert</Button>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col items-center gap-5 w-2/5">
                <h1 className="font-bold text-inherit uppercase text-3xl">Fee</h1>
                <Input onChange={handleFeeChange} labelPlacement='outside' size='lg' type="number" value={fee.toString()} label="Fee Charge Per Reservation" endContent={
                    <div className="pointer-events-none flex items-center">
                        <span className="text-default-400 text-medium">$</span>
                    </div>
                } />
                <Button onClick={handleSubmit} color='primary' variant='shadow' className="uppercase w-full" radius="full">submit</Button>
            </div>
        </div>

    )
};
