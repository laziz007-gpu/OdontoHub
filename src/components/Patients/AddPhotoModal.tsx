import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createPhoto } from '../../api/photos';

interface AddPhotoModalProps {
  patientId: number;
  onClose: () => void;
  onSuccess: () => void;
}

const AddPhotoModal = ({ patientId, onClose, onSuccess }: AddPhotoModalProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: '',
    category: 'treatment',
    description: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError(t('modals.photo.error_file_type'));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError(t('modals.photo.error_file_size'));
        return;
      }

      setSelectedFile(file);
      setError(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setError(t('modals.photo.error_file'));
      return;
    }

    if (!formData.title.trim()) {
      setError(t('modals.photo.error_name'));
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64String = reader.result as string;

          await createPhoto(patientId, {
            title: formData.title,
            file_url: base64String,
            category: formData.category,
            description: formData.description || undefined
          });

          onSuccess();
          onClose();
        } catch (err) {
          console.error('Error in reader.onloadend:', err);
          setError(t('modals.photo.error_save'));
          setLoading(false);
        }
      };
      reader.readAsDataURL(selectedFile);
    } catch (err) {
      console.error('Error creating photo:', err);
      setError(t('modals.photo.error_save'));
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{t('modals.photo.title')}</h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('modals.photo.name')} *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t('modals.photo.placeholder_name')}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('modals.photo.select_file')} *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {t('modals.photo.max_size')}
            </p>
          </div>

          {previewUrl && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('modals.photo.preview')}:
              </label>
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg border border-gray-200"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('modals.photo.category.title')} *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="xray">{t('modals.photo.category.xray')}</option>
              <option value="treatment">{t('modals.photo.category.treatment')}</option>
              <option value="before">{t('modals.photo.category.before')}</option>
              <option value="after">{t('modals.photo.category.after')}</option>
              <option value="other">{t('modals.photo.category.other')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('modals.photo.description')}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder={t('modals.photo.placeholder_description')}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? t('modals.photo.adding') : t('common.add')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPhotoModal;
