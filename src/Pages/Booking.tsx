import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import BookingCalendar from '../components/Booking/BookingCalendar';
import TimePicker from '../components/Booking/TimePicker';
import CustomDropdown from '../components/Booking/CustomDropdown';
import CommentInput from '../components/Booking/CommentInput';
import { paths } from '../Routes/path';

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
        <div className="min-h-screen p-4 max-w-md mx-auto w-full flex flex-col font-sans">
            {/* Header */}
            <div className="flex items-center justify-between mb-8 relative">
                <button onClick={() => navigate(-1)} className="text-blue-500 text-xl p-2 z-10">
                    <FaArrowLeft />
                </button>
                <h1 className="text-blue-600 text-3xl font-bold absolute left-0 right-0 text-center pointer-events-none">Запись</h1>
                <div className="w-8"></div>
            </div>

            <div className="space-y-6 pb-12">
                <CustomDropdown
                    placeholder="Выберите стоматолога"
                    value={selectedDoctor}
                    options={doctors}
                    onChange={setSelectedDoctor}
                    type="doctor"
                />

                <CustomDropdown
                    placeholder="Выберите услугу"
                    value={selectedService}
                    options={services}
                    onChange={(val) => {
                        setSelectedService(val);
                        if (val === 's1') {
                            navigate(paths.checkupPreview);
                        }
                    }}
                    type="service"
                />

                <BookingCalendar
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                />

                <TimePicker
                    selectedTime={selectedTime}
                    onTimeChange={setSelectedTime}
                />

                <CommentInput
                    value={comment}
                    onChange={setComment}
                />
            </div>

            <div className="flex justify-center pb-8">
                <button
                    onClick={handleBooking}
                    className='w-[427px] h-[56px] rounded-[16px] bg-[#11D76A] font-bold text-[20px] text-center text-white shadow-lg hover:bg-green-500 transition-colors'
                >
                    Отправить
                </button>
            </div>
        </div>
    );
};

export default Booking;
