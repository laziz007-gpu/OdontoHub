import json
import os

files = {
    'ru.json': {
        'common': {
            'save': 'Сохранить',
            'cancel': 'Отмена',
            'add': 'Добавить',
            'saving': 'Сохранение...',
            'paid': 'Оплачено',
            'partial': 'Частично',
            'unpaid': 'Не оплачено'
        },
        'modals': {
            'appointment': {
                'title': 'Добавить приём',
                'start_time': 'Время начала',
                'end_time': 'Время окончания',
                'service': 'Услуга',
                'notes': 'Примечания',
                'placeholder_service': 'Например: Консультация',
                'placeholder_notes': 'Дополнительная информация...',
                'error_time': 'Укажите время начала и окончания',
                'error_save': 'Не удалось добавить приём'
            },
            'prescription': {
                'title': 'Добавить рецепт',
                'edit_title': 'Редактировать рецепт',
                'medication': 'Название препарата',
                'dosage': 'Дозировка',
                'frequency': 'Частота приёма',
                'duration': 'Длительность',
                'notes': 'Примечания',
                'placeholder_medication': 'Например: Амоксициллин',
                'placeholder_dosage': 'Например: 500 мг',
                'placeholder_frequency': 'Например: 3 раза в день',
                'placeholder_duration': 'Например: 7 дней',
                'placeholder_notes': 'Дополнительные инструкции...',
                'error_fields': 'Пожалуйста, заполните все обязательные поля',
                'error_save': 'Не удалось добавить рецепт',
                'error_update': 'Не удалось обновить рецепт'
            },
            'allergy': {
                'title': 'Добавить аллергию',
                'edit_title': 'Редактировать аллергию',
                'allergen': 'Аллерген',
                'reaction': 'Тип реакции',
                'severity': {
                    'title': 'Степень тяжести',
                    'mild': 'Легкая',
                    'moderate': 'Средняя',
                    'severe': 'Тяжелая'
                },
                'notes': 'Примечания',
                'placeholder_allergen': 'Например: Пенициллин',
                'placeholder_reaction': 'Например: Сыпь, отек',
                'placeholder_notes': 'Дополнительная информация...',
                'error_fields': 'Пожалуйста, заполните все обязательные поля',
                'error_save': 'Не удалось добавить аллергию',
                'error_update': 'Не удалось обновить аллергию'
            },
            'note': {
                'title': 'Новая заметка',
                'patient': 'Пациент',
                'placeholder_patient': 'Выберите пациента',
                'not_found': 'Пациент не найден',
                'note_label': 'Заметка',
                'placeholder_note': 'Введите заметку',
                'error_fields': 'Пожалуйста, выберите пациента и введите заметку',
                'error_save': 'Ошибка при добавлении заметки',
                'no_phone': 'Нет номера'
            },
            'payment': {
                'title': 'Добавить платеж',
                'amount': 'Сумма',
                'date': 'Дата',
                'method': {
                    'title': 'Метод оплаты',
                    'cash': 'Наличные',
                    'card': 'Карта',
                    'transfer': 'Перевод'
                },
                'notes': 'Примечания',
                'error_fields': 'Укажите сумму',
                'error_save': 'Не удалось добавить платеж'
            },
            'photo': {
                'title': 'Добавить фото',
                'name': 'Название',
                'placeholder_name': 'Например: Рентген зуба 16',
                'select_file': 'Выберите файл',
                'max_size': 'Максимальный размер: 5 МБ. Форматы: JPG, PNG, GIF',
                'preview': 'Предпросмотр',
                'category': {
                    'title': 'Категория',
                    'xray': 'Рентген',
                    'treatment': 'Лечение',
                    'before': 'До',
                    'after': 'После',
                    'other': 'Другое'
                },
                'description': 'Описание',
                'placeholder_description': 'Дополнительная информация...',
                'error_file': 'Выберите файл для загрузки',
                'error_file_type': 'Пожалуйста, выберите изображение',
                'error_file_size': 'Размер файла не должен превышать 5 МБ',
                'error_name': 'Введите название фотографии',
                'error_save': 'Не удалось добавить фотографию',
                'adding': 'Добавление...'
            }
        }
    },
    'en.json': {
        'common': {
            'save': 'Save',
            'cancel': 'Cancel',
            'add': 'Add',
            'saving': 'Saving...',
            'paid': 'Paid',
            'partial': 'Partial',
            'unpaid': 'Unpaid'
        },
        'modals': {
            'appointment': {
                'title': 'Add Appointment',
                'start_time': 'Start Time',
                'end_time': 'End Time',
                'service': 'Service',
                'notes': 'Notes',
                'placeholder_service': 'e.g., Consultation',
                'placeholder_notes': 'Additional information...',
                'error_time': 'Specify start and end time',
                'error_save': 'Failed to add appointment'
            },
            'prescription': {
                'title': 'Add Prescription',
                'edit_title': 'Edit Prescription',
                'medication': 'Medication Name',
                'dosage': 'Dosage',
                'frequency': 'Frequency',
                'duration': 'Duration',
                'notes': 'Notes',
                'placeholder_medication': 'e.g., Amoxicillin',
                'placeholder_dosage': 'e.g., 500 mg',
                'placeholder_frequency': 'e.g., 3 times a day',
                'placeholder_duration': 'e.g., 7 days',
                'placeholder_notes': 'Additional instructions...',
                'error_fields': 'Please fill in all required fields',
                'error_save': 'Failed to add prescription',
                'error_update': 'Failed to update prescription'
            },
            'allergy': {
                'title': 'Add Allergy',
                'edit_title': 'Edit Allergy',
                'allergen': 'Allergen',
                'reaction': 'Reaction Type',
                'severity': {
                    'title': 'Severity',
                    'mild': 'Mild',
                    'moderate': 'Moderate',
                    'severe': 'Severe'
                },
                'notes': 'Notes',
                'placeholder_allergen': 'e.g., Penicillin',
                'placeholder_reaction': 'e.g., Rash, swelling',
                'placeholder_notes': 'Additional information...',
                'error_fields': 'Please fill in all required fields',
                'error_save': 'Failed to add allergy',
                'error_update': 'Failed to update allergy'
            },
            'note': {
                'title': 'New Note',
                'patient': 'Patient',
                'placeholder_patient': 'Select a patient',
                'not_found': 'Patient not found',
                'note_label': 'Note',
                'placeholder_note': 'Enter note',
                'error_fields': 'Please select a patient and enter a note',
                'error_save': 'Error adding note',
                'no_phone': 'No number'
            },
            'payment': {
                'title': 'Add Payment',
                'amount': 'Amount',
                'date': 'Date',
                'method': {
                    'title': 'Payment Method',
                    'cash': 'Cash',
                    'card': 'Card',
                    'transfer': 'Transfer'
                },
                'notes': 'Notes',
                'error_fields': 'Specify amount',
                'error_save': 'Failed to add payment'
            },
            'photo': {
                'title': 'Add Photo',
                'name': 'Name',
                'placeholder_name': 'e.g., X-ray of tooth 16',
                'select_file': 'Select file',
                'max_size': 'Max size: 5 MB. Formats: JPG, PNG, GIF',
                'preview': 'Preview',
                'category': {
                    'title': 'Category',
                    'xray': 'X-ray',
                    'treatment': 'Treatment',
                    'before': 'Before',
                    'after': 'After',
                    'other': 'Other'
                },
                'description': 'Description',
                'placeholder_description': 'Additional information...',
                'error_file': 'Select a file to upload',
                'error_file_type': 'Please select an image',
                'error_file_size': 'File size must not exceed 5 MB',
                'error_name': 'Enter photo name',
                'error_save': 'Failed to add photo',
                'adding': 'Adding...'
            }
        }
    },
    'uz.json': {
        'common': {
            'save': 'Saqlash',
            'cancel': 'Bekor qilish',
            'add': 'Qo\'shish',
            'saving': 'Saqlanmoqda...',
            'paid': 'To\'langan',
            'partial': 'Qisman',
            'unpaid': 'To\'lanmagan'
        },
        'modals': {
            'appointment': {
                'title': 'Qabul qo\'shish',
                'start_time': 'Boshlanish vaqti',
                'end_time': 'Tugash vaqti',
                'service': 'Xizmat',
                'notes': 'Eslatmalar',
                'placeholder_service': 'Masalan: Konsultatsiya',
                'placeholder_notes': 'Qo\'shimcha ma\'lumot...',
                'error_time': 'Boshlanish va tugash vaqtini ko\'rsating',
                'error_save': 'Qabulni qo\'shib bo\'lmadi'
            },
            'prescription': {
                'title': 'Retsept qo\'shish',
                'edit_title': 'Retseptni tahrirlash',
                'medication': 'Preparat nomi',
                'dosage': 'Dozalash',
                'frequency': 'Qabul qilish chastotasi',
                'duration': 'Davomiyligi',
                'notes': 'Eslatmalar',
                'placeholder_medication': 'Masalan: Amoksitsillin',
                'placeholder_dosage': 'Masalan: 500 mg',
                'placeholder_frequency': 'Masalan: Kuniga 3 mahal',
                'placeholder_duration': 'Masalan: 7 kun',
                'placeholder_notes': 'Qo\'shimcha ko\'rsatmalar...',
                'error_fields': 'Iltimos, barcha majburiy maydonlarni to\'ldiring',
                'error_save': 'Retseptni qo\'shib bo\'lmadi',
                'error_update': 'Retseptni yangilab bo\'lmadi'
            },
            'allergy': {
                'title': 'Allergiya qo\'shish',
                'edit_title': 'Allergiyani tahrirlash',
                'allergen': 'Allergen',
                'reaction': 'Reaksiya turi',
                'severity': {
                    'title': 'Og\'irlik darajasi',
                    'mild': 'Yengil',
                    'moderate': 'O\'rtacha',
                    'severe': 'Og\'ir'
                },
                'notes': 'Eslatmalar',
                'placeholder_allergen': 'Masalan: Penitsillin',
                'placeholder_reaction': 'Masalan: Toshma, shish',
                'placeholder_notes': 'Qo\'shimcha ma\'lumot...',
                'error_fields': 'Iltimos, barcha majburiy maydonlarni to\'ldiring',
                'error_save': 'Allergiyani qo\'shib bo\'lmadi',
                'error_update': 'Allergiyani yangilab bo\'lmadi'
            },
            'note': {
                'title': 'Yangi eslatma',
                'patient': 'Bemor',
                'placeholder_patient': 'Bemorni tanlang',
                'not_found': 'Bemor topilmadi',
                'note_label': 'Eslatma',
                'placeholder_note': 'Eslatmani kiriting',
                'error_fields': 'Iltimos, bemorni tanlang va eslatmani kiriting',
                'error_save': 'Eslatmani qo\'shishda xatolik',
                'no_phone': 'Raqam yo\'q'
            },
            'payment': {
                'title': 'To\'lov qo\'shish',
                'amount': 'Summa',
                'date': 'Sana',
                'method': {
                    'title': 'To\'lov usuli',
                    'cash': 'Naqd',
                    'card': 'Karta',
                    'transfer': 'O\'tkazma'
                },
                'notes': 'Eslatmalar',
                'error_fields': 'Summani ko\'rsating',
                'error_save': 'To\'lovni qo\'shib bo\'lmadi'
            },
            'photo': {
                'title': 'Rasm qo\'shish',
                'name': 'Nomi',
                'placeholder_name': 'Masalan: 16-tish rentgeni',
                'select_file': 'Faylni tanlang',
                'max_size': 'Maksimal hajm: 5 MB. Formatlar: JPG, PNG, GIF',
                'preview': 'Oldindan ko\'rish',
                'category': {
                    'title': 'Kategoriya',
                    'xray': 'Rentgen',
                    'treatment': 'Davolash',
                    'before': 'Oldin',
                    'after': 'Keyin',
                    'other': 'Boshqa'
                },
                'description': 'Tavsif',
                'placeholder_description': 'Qo\'shimcha ma\'lumot...',
                'error_file': 'Yuklash uchun faylni tanlang',
                'error_file_type': 'Iltimos, rasm tanlang',
                'error_file_size': 'Fayl hajmi 5 MB dan oshmasligi kerak',
                'error_name': 'Rasm nomini kiriting',
                'error_save': 'Rasmni qo\'shib bo\'lmadi',
                'adding': 'Qo\'shilmoqda...'
            }
        }
    },
    'kz.json': {
        'common': {
            'save': 'Сақтау',
            'cancel': 'Бас тарту',
            'add': 'Қосу',
            'saving': 'Сақталуда...',
            'paid': 'Төленген',
            'partial': 'Жартылай',
            'unpaid': 'Төленбеген'
        },
        'modals': {
            'appointment': {
                'title': 'Қабылдауды қосу',
                'start_time': 'Басталу уақыты',
                'end_time': 'Аяқталу уақыты',
                'service': 'Қызмет',
                'notes': 'Ескертпелер',
                'placeholder_service': 'Мысалы: Консультация',
                'placeholder_notes': 'Қосымша ақпарат...',
                'error_time': 'Басталу және аяқталу уақытын көрсетіңіз',
                'error_save': 'Қабылдауды қосу мүмкін болмады'
            },
            'prescription': {
                'title': 'Рецепт қосу',
                'edit_title': 'Рецептті өңдеу',
                'medication': 'Препарат атауы',
                'dosage': 'Дозалануы',
                'frequency': 'Қабылдау жиілігі',
                'duration': 'Ұзақтығы',
                'notes': 'Ескертпелер',
                'placeholder_medication': 'Мысалы: Амоксициллин',
                'placeholder_dosage': 'Мысалы: 500 мг',
                'placeholder_frequency': 'Мысалы: Күніне 3 рет',
                'placeholder_duration': 'Мысалы: 7 күн',
                'placeholder_notes': 'Қосымша нұсқаулар...',
                'error_fields': 'Барлық міндетті өрістерді толтырыңыз',
                'error_save': 'Рецептті қосу мүмкін болмады',
                'error_update': 'Рецептті жаңарту мүмкін болмады'
            },
            'allergy': {
                'title': 'Аллергия қосу',
                'edit_title': 'Аллергияны өңдеу',
                'allergen': 'Аллерген',
                'reaction': 'Реакция түрі',
                'severity': {
                    'title': 'Ауырлық дәрежесі',
                    'mild': 'Жеңіл',
                    'moderate': 'Орташа',
                    'severe': 'Ауыр'
                },
                'notes': 'Ескертпелер',
                'placeholder_allergen': 'Мысалы: Пенициллин',
                'placeholder_reaction': 'Мысалы: Бөртпе, ісіну',
                'placeholder_notes': 'Қосымша ақпарат...',
                'error_fields': 'Барлық міндетті өрістерді толтырыңыз',
                'error_save': 'Аллергияны қосу мүмкін болмады',
                'error_update': 'Аллергияны жаңарту мүмкін болмады'
            },
            'note': {
                'title': 'Жаңа ескертпе',
                'patient': 'Пациент',
                'placeholder_patient': 'Пациентті таңдаңыз',
                'not_found': 'Пациент табылмады',
                'note_label': 'Ескертпе',
                'placeholder_note': 'Ескертпені енгізіңіз',
                'error_fields': 'Пациентті таңдап, ескертпені енгізіңіз',
                'error_save': 'Ескертпені қосудағы қате',
                'no_phone': 'Нөмір жоқ'
            },
            'payment': {
                'title': 'Төлем қосу',
                'amount': 'Сома',
                'date': 'Күні',
                'method': {
                    'title': 'Төлеу әдісі',
                    'cash': 'Қолма-қол',
                    'card': 'Карта',
                    'transfer': 'Аударым'
                },
                'notes': 'Ескертпелер',
                'error_fields': 'Соманы көрсетіңіз',
                'error_save': 'Төлемді қосу мүмкін болмады'
            },
            'photo': {
                'title': 'Сурет қосу',
                'name': 'Атауы',
                'placeholder_name': 'Мысалы: 16-тіс рентгені',
                'select_file': 'Файлды таңдаңыз',
                'max_size': 'Максималды мөлшер: 5 МБ. Форматтар: JPG, PNG, GIF',
                'preview': 'Алдын ала қарау',
                'category': {
                    'title': 'Санат',
                    'xray': 'Рентген',
                    'treatment': 'Емдеу',
                    'before': 'Дейін',
                    'after': 'Кейін',
                    'other': 'Басқа'
                },
                'description': 'Сипаттама',
                'placeholder_description': 'Қосымша ақпарат...',
                'error_file': 'Жүктеу үшін файлды таңдаңыз',
                'error_file_type': 'Суретті таңдаңыз',
                'error_file_size': 'Файл мөлшері 5 МБ-тан аспауы керек',
                'error_name': 'Сурет атауын енгізіңіз',
                'error_save': 'Суретті қосу мүмкін болмады',
                'adding': 'Қосылуда...'
            }
        }
    }
}

base_path = '.'

for filename, data in files.items():
    file_path = os.path.join(base_path, filename)
    if not os.path.exists(file_path):
        print(f"Skipping {filename}, not found.")
        continue
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = json.load(f)
    
    # Update common
    if 'common' not in content:
        content['common'] = {}
    content['common'].update(data['common'])
    
    # Add modals
    content['modals'] = data['modals']
    
    # Remove old deep modals if they exist
    if 'analytics' in content and 'charts' in content['analytics'] and 'patients' in content['analytics']['charts']:
        if 'modals' in content['analytics']['charts']['patients']:
            del content['analytics']['charts']['patients']['modals']
    
    if 'analytics' in content and 'charts' in content['analytics'] and 'add_patient_modal' in content['analytics']['charts']:
         pass
            
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(content, f, ensure_ascii=False, indent=2)
    print(f"Updated {filename}")
