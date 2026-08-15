import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';
import HabitCard from '../components/habits/HabitCard';
import CreateHabitModal from '../components/habits/CreateHabitModal';
import LoadingScreen from '../components/ui/LoadingScreen';
import LevelUpModal from '../components/ui/LevelUpModal';
import {
  Plus,
  Search,
  Trash2,
  AlertTriangle,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'All',
  'Health',
  'Fitness',
  'Learning',
  'Career',
  'Mind',
  'Personal',
  'Social',
  'Custom',
];

const HabitsPage = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] =
    useState('All');

  const [searchQuery, setSearchQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editHabit, setEditHabit] = useState(null);

  const [levelUpData, setLevelUpData] = useState({
    show: false,
    oldLevel: 1,
    newLevel: 1,
    title: '',
  });

  // --------------------------------------------------
  // DELETE CONFIRMATION STATE
  // --------------------------------------------------

  const [deleteHabit, setDeleteHabit] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // --------------------------------------------------
  // FETCH HABITS
  // --------------------------------------------------

  const fetchHabits = useCallback(async () => {
    try {
      const res = await api.get('/habits');

      if (res.data.success) {
        setHabits(res.data.habits);
      }
    } catch (err) {
      toast.error('Failed to load habits');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  // --------------------------------------------------
  // COMPLETE HABIT
  // --------------------------------------------------

  const handleComplete = async (
    habit,
    isMinimum = false
  ) => {
    try {
      const res = await api.post(
        `/habits/${habit._id}/complete`,
        { isMinimum }
      );

      if (res.data.success) {
        toast.success(res.data.message);

        if (res.data.leveledUp) {
          setLevelUpData({
            show: true,
            oldLevel: res.data.oldLevel,
            newLevel: res.data.newLevel,
            title: res.data.user.title,
          });
        }

        fetchHabits();
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Completion failed'
      );
    }
  };

  // --------------------------------------------------
  // CREATE / UPDATE HABIT
  // --------------------------------------------------

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editHabit) {
        await api.put(
          `/habits/${editHabit._id}`,
          formData
        );

        toast.success('Habit updated!');
      } else {
        await api.post('/habits', formData);

        toast.success('Habit created!');
      }

      setEditHabit(null);

      fetchHabits();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Save failed'
      );
    }
  };

  // --------------------------------------------------
  // OPEN DELETE CONFIRMATION
  // --------------------------------------------------

  const handleDelete = (habit) => {
    setDeleteHabit(habit);
  };

  // --------------------------------------------------
  // ACTUALLY DELETE HABIT
  // --------------------------------------------------

  const confirmDelete = async () => {
    if (!deleteHabit) return;

    try {
      setIsDeleting(true);

      await api.delete(
        `/habits/${deleteHabit._id}`
      );

      toast.success('Habit deleted');

      setDeleteHabit(null);

      fetchHabits();
    } catch (err) {
      toast.error('Failed to delete habit');
    } finally {
      setIsDeleting(false);
    }
  };

  // --------------------------------------------------
  // PAUSE / RESUME
  // --------------------------------------------------

  const handleTogglePause = async (habit) => {
    try {
      await api.put(
        `/habits/${habit._id}`,
        {
          paused: !habit.paused,
        }
      );

      toast.success(
        habit.paused
          ? 'Habit resumed'
          : 'Habit paused'
      );

      fetchHabits();
    } catch (err) {
      toast.error(
        'Failed to update status'
      );
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return <LoadingScreen />;
  }

  // --------------------------------------------------
  // FILTER HABITS
  // --------------------------------------------------

  const filteredHabits = habits.filter((h) => {
    const matchesCat =
      selectedCategory === 'All' ||
      h.category === selectedCategory;

    const matchesSearch =
      h.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (h.description &&
        h.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()));

    return matchesCat && matchesSearch;
  });

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div
      style={{
        maxWidth: 1000,
        margin: '0 auto',
        paddingBottom: 40,
        position: 'relative',
      }}
    >
      {/* ==========================================
          LEVEL UP MODAL
      ========================================== */}

      <LevelUpModal
        isOpen={levelUpData.show}
        onClose={() =>
          setLevelUpData((prev) => ({
            ...prev,
            show: false,
          }))
        }
        oldLevel={levelUpData.oldLevel}
        newLevel={levelUpData.newLevel}
        title={levelUpData.title}
      />

      {/* ==========================================
          CREATE / EDIT HABIT MODAL
      ========================================== */}

      <CreateHabitModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditHabit(null);
        }}
        onSubmit={handleCreateOrUpdate}
        editHabit={editHabit}
      />

      {/* ==========================================
          DELETE CONFIRMATION MODAL
      ========================================== */}

      <AnimatePresence>
        {deleteHabit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',

              padding: 20,

              background:
                'rgba(2, 6, 23, 0.72)',

              backdropFilter: 'blur(8px)',
            }}
            onClick={() => {
              if (!isDeleting) {
                setDeleteHabit(null);
              }
            }}
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.94,
                y: 12,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.94,
                y: 12,
              }}
              transition={{
                duration: 0.2,
              }}
              onClick={(e) =>
                e.stopPropagation()
              }
              style={{
                width: '100%',
                maxWidth: 420,

                background:
                  'linear-gradient(145deg, rgba(20,27,42,0.98), rgba(10,15,25,0.98))',

                border:
                  '1px solid rgba(239,68,68,0.3)',

                borderRadius: 18,

                padding: 24,

                boxShadow:
                  '0 20px 60px rgba(0,0,0,0.45), 0 0 20px rgba(239,68,68,0.08)',

                position: 'relative',

                overflow: 'hidden',
              }}
            >
              {/* Subtle top accent */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '10%',
                  right: '10%',
                  height: 2,

                  background:
                    'linear-gradient(90deg, transparent, rgba(239,68,68,0.8), transparent)',

                  opacity: 0.7,
                }}
              />

              {/* Close button */}
              <button
                onClick={() => {
                  if (!isDeleting) {
                    setDeleteHabit(null);
                  }
                }}
                style={{
                  position: 'absolute',
                  top: 14,
                  right: 14,

                  width: 32,
                  height: 32,

                  borderRadius: 8,

                  border:
                    '1px solid rgba(255,255,255,0.08)',

                  background:
                    'rgba(255,255,255,0.04)',

                  color:
                    'var(--text-muted)',

                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',

                  cursor: isDeleting
                    ? 'default'
                    : 'pointer',

                  opacity: isDeleting
                    ? 0.5
                    : 1,
                }}
              >
                <X size={16} />
              </button>

              {/* Warning icon */}
              <div
                style={{
                  width: 52,
                  height: 52,

                  borderRadius: 14,

                  background:
                    'rgba(239,68,68,0.1)',

                  border:
                    '1px solid rgba(239,68,68,0.28)',

                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',

                  marginBottom: 18,
                }}
              >
                <AlertTriangle
                  size={25}
                  color="#ef4444"
                />
              </div>

              {/* Title */}
              <h2
                style={{
                  margin: 0,
                  marginBottom: 8,

                  fontSize: 21,
                  fontWeight: 700,

                  color:
                    'var(--text-primary)',
                }}
              >
                Delete Habit?
              </h2>

              {/* Description */}
              <p
                style={{
                  margin: 0,

                  color:
                    'var(--text-secondary)',

                  fontSize: 14,
                  lineHeight: 1.6,
                }}
              >
                Are you sure you want to delete{' '}
                <strong
                  style={{
                    color:
                      'var(--text-primary)',
                  }}
                >
                  "{deleteHabit.name}"
                </strong>
                ?
              </p>

              <p
                style={{
                  marginTop: 8,
                  marginBottom: 22,

                  color:
                    'var(--text-muted)',

                  fontSize: 12,
                  lineHeight: 1.5,
                }}
              >
                This action cannot be undone.
                Your habit history and progress
                associated with this habit may
                also be removed.
              </p>

              {/* Buttons */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 10,
                }}
              >
                {/* Cancel */}
                <button
                  onClick={() => {
                    if (!isDeleting) {
                      setDeleteHabit(null);
                    }
                  }}
                  disabled={isDeleting}
                  style={{
                    padding:
                      '9px 16px',

                    borderRadius: 10,

                    border:
                      '1px solid rgba(255,255,255,0.1)',

                    background:
                      'rgba(255,255,255,0.04)',

                    color:
                      'var(--text-secondary)',

                    fontSize: 13,
                    fontWeight: 600,

                    cursor: isDeleting
                      ? 'not-allowed'
                      : 'pointer',

                    opacity: isDeleting
                      ? 0.5
                      : 1,
                  }}
                >
                  Cancel
                </button>

                {/* Delete */}
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  style={{
                    padding:
                      '9px 16px',

                    borderRadius: 10,

                    border:
                      '1px solid rgba(239,68,68,0.45)',

                    background:
                      'linear-gradient(135deg, #ef4444, #dc2626)',

                    color: 'white',

                    fontSize: 13,
                    fontWeight: 700,

                    cursor: isDeleting
                      ? 'not-allowed'
                      : 'pointer',

                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,

                    boxShadow:
                      '0 4px 12px rgba(239,68,68,0.18)',

                    opacity: isDeleting
                      ? 0.65
                      : 1,
                  }}
                >
                  <Trash2 size={14} />

                  {isDeleting
                    ? 'Deleting...'
                    : 'Delete Habit'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==========================================
          HEADER
      ========================================== */}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',

          marginBottom: 24,

          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily:
                'Rajdhani, sans-serif',

              fontSize: 32,
              fontWeight: 700,
            }}
          >
            HABIT MANAGEMENT
          </h1>

          <p
            style={{
              color:
                'var(--text-secondary)',

              fontSize: 14,
            }}
          >
            Configure your active quests,
            set minimum targets, and
            associate stats.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            setEditHabit(null);
            setIsModalOpen(true);
          }}
        >
          <Plus size={16} />
          Add New Habit
        </button>
      </div>

      {/* ==========================================
          SEARCH + FILTER
      ========================================== */}

      <div
        style={{
          background:
            'var(--glass-bg)',

          border:
            '1px solid var(--glass-border)',

          borderRadius: 16,

          padding: '16px',

          marginBottom: 24,

          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 12,
            alignItems: 'center',
          }}
        >
          <div
            style={{
              position: 'relative',
              flex: 1,
            }}
          >
            <input
              className="form-input"
              placeholder="Search habits..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              style={{
                paddingLeft: 38,
              }}
            />

            <Search
              size={16}
              color="var(--text-muted)"
              style={{
                position: 'absolute',
                left: 12,
                top: '50%',
                transform:
                  'translateY(-50%)',
              }}
            />
          </div>
        </div>

        {/* Category Pills */}
        <div
          style={{
            display: 'flex',
            gap: 8,
            overflowX: 'auto',
            paddingBottom: 4,
          }}
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setSelectedCategory(cat)
              }
              style={{
                padding: '6px 14px',

                borderRadius: 20,

                fontSize: 13,
                fontWeight: 500,

                border: '1px solid',

                cursor: 'pointer',

                whiteSpace: 'nowrap',

                background:
                  selectedCategory === cat
                    ? 'var(--violet-dim)'
                    : 'transparent',

                borderColor:
                  selectedCategory === cat
                    ? 'var(--violet)'
                    : 'var(--border)',

                color:
                  selectedCategory === cat
                    ? 'var(--violet-light)'
                    : 'var(--text-secondary)',

                transition:
                  'all 0.2s ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ==========================================
          HABIT LIST
      ========================================== */}

      {filteredHabits.length === 0 ? (
        <div
          style={{
            background:
              'var(--glass-bg)',

            border:
              '1px dashed var(--glass-border)',

            borderRadius: 16,

            padding: '40px 20px',

            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 36,
              marginBottom: 10,
            }}
          >
            🔍
          </div>

          <h3
            style={{
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            No Habits Found
          </h3>

          <p
            style={{
              color:
                'var(--text-muted)',

              fontSize: 14,

              marginTop: 4,
            }}
          >
            Try selecting another category
            or create a new habit.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',

            gridTemplateColumns:
              'repeat(auto-fill, minmax(320px, 1fr))',

            gap: 16,
          }}
        >
          {filteredHabits.map((habit) => (
            <HabitCard
              key={habit._id}
              habit={habit}

              onComplete={() =>
                handleComplete(
                  habit,
                  false
                )
              }

              onMinComplete={() =>
                handleComplete(
                  habit,
                  true
                )
              }

              onEdit={(h) => {
                setEditHabit(h);
                setIsModalOpen(true);
              }}

              onDelete={handleDelete}

              onTogglePause={
                handleTogglePause
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HabitsPage;