import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import BookingCalendar from '../components/Booking/BookingCalendar';
import TimePicker from '../components/Booking/TimePicker';
import CustomDropdown from '../components/Booking/CustomDropdown';
import CommentInput from '../components/Booking/CommentInput';


const Booking = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const preSelectedDoctor = location.state?.doctor;

    const [selectedDoctor, setSelectedDoctor] = useState(preSelectedDoctor?.value || "");
    const [selectedService, setSelectedService] = useState("");
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [selectedTime, setSelectedTime] = useState("");
    const [comment, setComment] = useState("");

    const doctors = [
        { value: "d1", label: "Махмуд Пулатов" },
    ];

    const services = [
        { value: "s1", label: "Осмотр" },
        { value: "s2", label: "Имплантация" },
        { value: "s3", label: "Пломбирование" },
        { value: "s4", label: "Удаление" },
        { value: "s5", label: "Очистка" },
    ];

    React.useEffect(() => {
        if (preSelectedDoctor) {
            const match = doctors.find(d => d.label === preSelectedDoctor.name);
            if (match) setSelectedDoctor(match.value);
        }
    }, [preSelectedDoctor]);


    const handleBooking = () => {
        if (!selectedDoctor || !selectedService || !selectedDate || !selectedTime) {
            alert("Пожалуйста, заполните все обязательные поля!");
            return;
        }

        const bookingData = {
            doctor: selectedDoctor,
            service: selectedService,
            date: selectedDate,
            time: selectedTime,
            comment: comment
        };

        // Simulate server request
        console.log("Отправка данных на сервер:", bookingData);

        // Mock success after 1 second
        setTimeout(() => {
            alert("Заявка успешно отправлена!");
            navigate('/'); // Navigate to home or dashboard
        }, 1000);
    };

    return (
        <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto w-full flex flex-col font-sans">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 md:mb-12">
                <button
                    onClick={() => navigate(-1)}
                    className="w-12 h-12 flex items-center justify-center bg-white border border-gray-100 rounded-2xl text-blue-500 shadow-sm hover:bg-blue-50 transition-all active:scale-95"
                >
                    <FaArrowLeft />
                </button>
                <h1 className="text-2xl md:text-3xl font-black text-[#1D1D2B] tracking-tight">Новая запись</h1>
                <div className="w-12"></div>
            </div>

            <div className="flex flex-col space-y-6 lg:space-y-8">
                {/* Calendar Section - Full Width, Larger on Desktop */}
                <div className="bg-white rounded-[2rem] lg:rounded-[3rem] p-6 lg:p-10 shadow-sm border border-gray-100">
                    <h3 className="text-lg lg:text-2xl font-bold mb-6 lg:mb-8 text-[#1D1D2B] flex items-center gap-3">
                        <div className="w-1.5 lg:w-2 h-6 lg:h-8 bg-[#4361EE] rounded-full"></div>
                        Выберите дату и время
                    </h3>

                    <div className="mb-8 lg:mb-10">
                        <BookingCalendar
                            selectedDate={selectedDate}
                            onDateChange={setSelectedDate}
                        />
                    </div>

                    <div className="pt-6 lg:pt-8 border-t border-gray-50">
                        <TimePicker
                            selectedTime={selectedTime}
                            onTimeChange={setSelectedTime}
                        />
                    </div>
                </div>

                {/* Two Column Layout for Inputs and Comment */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    {/* Left: Doctor & Service Selection */}
                    <div className="bg-white rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:p-8 shadow-sm border border-gray-50 space-y-6 lg:space-y-8">
                        <div className="space-y-4">
                            <label className="text-xs lg:text-sm font-black uppercase text-gray-300 tracking-widest ml-1">Стоматолог</label>
                            <CustomDropdown
                                placeholder="Выберите стоматолога"
                                value={selectedDoctor}
                                options={doctors}
                                onChange={setSelectedDoctor}
                                type="doctor"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-xs lg:text-sm font-black uppercase text-gray-300 tracking-widest ml-1">Услуга</label>
                            <CustomDropdown
                                placeholder="Выберите услуgu"
                                value={selectedService}
                                options={services}
                                onChange={setSelectedService}
                                type="service"
                            />
                        </div>
                    </div>

                    {/* Right: Comment */}
                    <div className="bg-white rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:p-8 shadow-sm border border-gray-50 space-y-4">
                        <label className="text-xs lg:text-sm font-black uppercase text-gray-300 tracking-widest ml-1">Комментарий к записи</label>
                        <CommentInput
                            value={comment}
                            onChange={setComment}
                        />
                    </div>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-center mt-8 lg:mt-12 pb-8">
                <button
                    onClick={handleBooking}
                    className='w-full max-w-md lg:max-w-xl h-14 lg:h-20 rounded-2xl lg:rounded-3xl bg-[#11D76A] font-black text-lg lg:text-2xl text-center text-white shadow-xl shadow-green-500/20 hover:brightness-105 hover:-translate-y-1 transition-all active:scale-95'
                >
                    Записаться
                </button>
            </div>
        </div>
    );
};

export default Booking;
