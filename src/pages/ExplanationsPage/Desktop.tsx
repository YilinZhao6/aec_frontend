import React, { useState, useEffect } from 'react';
import { Calendar, Trash2, Clock, FileText, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import MainLayout from '../../components/Layout/MainLayout';
import ParticleBackground from '../../components/ParticleBackground';
import { explanationsAPI } from '../../api/explanations';
import { EXPLANATIONS_PAGE_STRINGS } from '../../constants/strings';
import './ExplanationsPage.css';

interface Explanation {
  article_path: string;
  character_count: number;
  conversation_id: string;
  estimated_reading_time: number;
  generated_at: string;
  topic: string;
  user_id: string;
  word_count: number;
}

interface DeleteConfirmation {
  explanation: Explanation;
  isVisible: boolean;
}

const Desktop = () => {
  const { t } = useLanguage();
  const [explanations, setExplanations] = useState<Explanation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmation | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem('user_id');

  useEffect(() => {
    fetchExplanations();
  }, []);

  const fetchExplanations = async () => {
    if (!userId) {
      setError(t(EXPLANATIONS_PAGE_STRINGS.ERRORS.USER));
      setLoading(false);
      return;
    }

    try {
      const response = await explanationsAPI.getExplanations(userId);
      if (response.success && response.data) {
        const sortedExplanations = response.data.articles.sort((a, b) => 
          new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime()
        );
        setExplanations(sortedExplanations);
      } else {
        setError(response.message || t(EXPLANATIONS_PAGE_STRINGS.ERRORS.FETCH));
      }
    } catch (error) {
      setError(t(EXPLANATIONS_PAGE_STRINGS.ERRORS.SERVER));
      console.error('Error fetching explanations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (explanation: Explanation) => {
    if (!userId || isDeleting) return;

    setIsDeleting(true);
    try {
      const response = await explanationsAPI.deleteExplanation(userId, explanation.conversation_id);
      if (response.success) {
        setExplanations(prev => prev.filter(e => e.conversation_id !== explanation.conversation_id));
        setDeleteConfirmation(null);
      } else {
        setError(response.error || t(EXPLANATIONS_PAGE_STRINGS.ERRORS.SERVER));
      }
    } catch (error) {
      console.error('Failed to delete explanation:', error);
      setError(t(EXPLANATIONS_PAGE_STRINGS.ERRORS.SERVER));
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="explanations-container">
          <div className="loading-state">
            <Loader2 className="animate-spin" size={24} />
            <p>{t(EXPLANATIONS_PAGE_STRINGS.LOADING)}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="explanations-container">
          <div className="error-state">
            <p>{error}</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="explanations-container">
        <div className="explanations-header">
          <h1 className="page-title">{t(EXPLANATIONS_PAGE_STRINGS.PAGE_TITLE)}</h1>
        </div>

        <div className="explanations-content">
          <ParticleBackground />
          
          <div className="explanations-list-header">
            <div className="name-cell">{t(EXPLANATIONS_PAGE_STRINGS.LIST_HEADERS.NAME)}</div>
            <div className="created-cell">{t(EXPLANATIONS_PAGE_STRINGS.LIST_HEADERS.CREATED)}</div>
            <div className="meta-cell">{t(EXPLANATIONS_PAGE_STRINGS.LIST_HEADERS.WORD_COUNT)}</div>
            <div className="meta-cell">{t(EXPLANATIONS_PAGE_STRINGS.LIST_HEADERS.READING_TIME)}</div>
            <div className="actions-cell">{t(EXPLANATIONS_PAGE_STRINGS.LIST_HEADERS.ACTIONS)}</div>
          </div>

          <div className="explanations-list">
            {explanations.map(explanation => (
              <div key={explanation.conversation_id} className="explanation-row">
                <div className="name-cell">
                  <FileText size={16} />
                  <span className="explanation-title">{explanation.topic}</span>
                </div>
                <div className="created-cell">
                  <Calendar size={14} />
                  <span>{formatDate(explanation.generated_at)}</span>
                </div>
                <div className="meta-cell">
                  <span>{explanation.word_count.toLocaleString()} {t(EXPLANATIONS_PAGE_STRINGS.WORD_COUNT_DISPLAY)}</span>
                </div>
                <div className="meta-cell">
                  <Clock size={14} />
                  <span>{explanation.estimated_reading_time} {t(EXPLANATIONS_PAGE_STRINGS.READING_TIME_DISPLAY)}</span>
                </div>
                <div className="actions-cell">
                  <button 
                    className="px-3 py-1 border border-gray-400 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors font-quicksand font-medium"
                    onClick={() => navigate(`/markdown-viewer/explanations/${explanation.user_id}/${explanation.conversation_id}`)}
                  >
                    {t(EXPLANATIONS_PAGE_STRINGS.ACTIONS.OPEN)}
                  </button>
                  <button 
                    className="explanation-action-button"
                    onClick={() => setDeleteConfirmation({ explanation, isVisible: true })}
                    disabled={isDeleting}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {deleteConfirmation?.isVisible && (
            <div className="delete-confirmation-overlay">
              <div className="delete-confirmation">
                <AlertCircle className="text-red-500" size={24} />
                <p className="confirmation-message">
                  {t(EXPLANATIONS_PAGE_STRINGS.DELETE_CONFIRMATION.TITLE)}
                </p>
                <div className="confirmation-actions">
                  <button 
                    className="cancel-button"
                    onClick={() => setDeleteConfirmation(null)}
                    disabled={isDeleting}
                  >
                    {t(EXPLANATIONS_PAGE_STRINGS.ACTIONS.CANCEL)}
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => handleDelete(deleteConfirmation.explanation)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <div className="flex items-center gap-2">
                        <Loader2 size={14} className="animate-spin" />
                        {t(EXPLANATIONS_PAGE_STRINGS.ACTIONS.DELETE)}
                      </div>
                    ) : (
                      t(EXPLANATIONS_PAGE_STRINGS.ACTIONS.DELETE)
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Desktop;