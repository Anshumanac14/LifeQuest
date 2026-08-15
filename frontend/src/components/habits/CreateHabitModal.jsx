import { useState } from 'react';
import Modal from '../ui/Modal';
import { Zap } from 'lucide-react';

const ICONS = [
  '⚡', '💪', '📚', '🧘', '🌙',
  '💡', '🏃', '🎯', '🔥', '🌅',
  '✍️', '🎸', '🥗', '💻', '🏋️',
  '📖', '🧠', '💤', '🚴', '🎨'
];

const CATEGORIES = [
  'Health',
  'Fitness',
  'Learning',
  'Career',
  'Mind',
  'Personal',
  'Social',
  'Custom'
];

const DIFFICULTIES = [
  'Easy',
  'Medium',
  'Hard',
  'Epic'
];

const STATS = [
  {
    value: 'strength',
    label: 'Strength',
    color: '#ef4444',
    icon: '⚔️'
  },
  {
    value: 'intelligence',
    label: 'Intelligence',
    color: '#6366f1',
    icon: '🧠'
  },
  {
    value: 'focus',
    label: 'Focus',
    color: '#06b6d4',
    icon: '🎯'
  },
  {
    value: 'wisdom',
    label: 'Wisdom',
    color: '#f59e0b',
    icon: '📚'
  },
  {
    value: 'recovery',
    label: 'Recovery',
    color: '#10b981',
    icon: '💚'
  },
  {
    value: 'discipline',
    label: 'Discipline',
    color: '#8b5cf6',
    icon: '🔱'
  },
  {
    value: 'none',
    label: 'None',
    color: '#64748b',
    icon: '⚡'
  }
];

const CATEGORY_DEFAULT_STAT = {
  Learning: 'intelligence',
  Fitness: 'strength',
  Health: 'recovery',
  Mind: 'focus',
  Career: 'discipline',
  Personal: 'wisdom',
  Social: 'discipline',
  Custom: 'none'
};

const DEFAULT_FORM = {
  name: '',
  description: '',
  category: 'Learning',
  difficulty: 'Medium',
  target: '',
  minimumTarget: '',
  stat: 'intelligence',
  icon: '📚'
};

const CreateHabitModal = ({
  isOpen,
  onClose,
  onSubmit,
  editHabit = null
}) => {

  const [form, setForm] = useState(() =>
    editHabit
      ? {
          name: editHabit.name,
          description: editHabit.description || '',
          category: editHabit.category,
          difficulty: editHabit.difficulty,
          target: editHabit.target || '',
          minimumTarget: editHabit.minimumTarget || '',
          stat: editHabit.stat || 'none',
          icon: editHabit.icon || '⚡'
        }
      : DEFAULT_FORM
  );

  const [loading, setLoading] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);

  /* =========================
     XP CALCULATION
  ========================= */

  const BASE_XP = {
    Health: 25,
    Fitness: 30,
    Learning: 35,
    Career: 30,
    Mind: 25,
    Personal: 20,
    Social: 20,
    Custom: 20
  };

  const XP_MULT = {
    Easy: 1.0,
    Medium: 1.5,
    Hard: 2.0,
    Epic: 3.0
  };

  const fullXp = Math.floor(
    (BASE_XP[form.category] || 20) *
    (XP_MULT[form.difficulty] || 1.5)
  );

  const minXp = Math.floor(fullXp * 0.5);

  /* =========================
     FORM HANDLER
  ========================= */

  const handleChange = (field, value) => {
    setForm(prev => {
      const updated = {
        ...prev,
        [field]: value
      };

      if (
        field === 'category' &&
        CATEGORY_DEFAULT_STAT[value]
      ) {
        updated.stat =
          CATEGORY_DEFAULT_STAT[value];
      }

      return updated;
    });
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async e => {
    e.preventDefault();

    if (!form.name.trim()) return;

    setLoading(true);

    try {
      await onSubmit(form);

      setForm(DEFAULT_FORM);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        editHabit
          ? 'Edit Quest'
          : 'Forge New Quest'
      }
    >

      <form
        onSubmit={handleSubmit}
        style={{
          padding: '20px 24px 24px'
        }}
      >

        {/* =========================
            ICON + TITLE
        ========================= */}

        <div
          style={{
            display: 'flex',
            gap: 14,
            marginBottom: 18
          }}
        >

          {/* Icon */}

          <div>
            <label className="form-label">
              Icon
            </label>

            <button
              type="button"
              onClick={() =>
                setShowIconPicker(!showIconPicker)
              }
              style={{
                width: 50,
                height: 50,
                fontSize: 23,

                background:
                  'rgba(255,255,255,0.04)',

                border:
                  '1px solid rgba(255,255,255,0.12)',

                borderRadius: 10,

                cursor: 'pointer',

                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',

                color: 'white',

                transition:
                  'border-color 0.2s ease, background 0.2s ease'
              }}

              onMouseEnter={e => {
                e.currentTarget.style.background =
                  'rgba(255,255,255,0.07)';

                e.currentTarget.style.borderColor =
                  'rgba(255,255,255,0.22)';
              }}

              onMouseLeave={e => {
                e.currentTarget.style.background =
                  'rgba(255,255,255,0.04)';

                e.currentTarget.style.borderColor =
                  'rgba(255,255,255,0.12)';
              }}
            >
              {form.icon}
            </button>
          </div>

          {/* Title */}

          <div style={{ flex: 1 }}>

            <label className="form-label">
              Quest Title *
            </label>

            <input
              className="form-input"
              placeholder="e.g. Study DSA for 60m"
              value={form.name}
              onChange={e =>
                handleChange(
                  'name',
                  e.target.value
                )
              }
              required
            />

          </div>
        </div>


        {/* =========================
            ICON PICKER
        ========================= */}

        {showIconPicker && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(10, 1fr)',
              gap: 6,

              marginBottom: 18,

              padding: 12,

              background:
                'rgba(255,255,255,0.025)',

              border:
                '1px solid rgba(255,255,255,0.10)',

              borderRadius: 12
            }}
          >

            {ICONS.map(icon => (
              <button
                key={icon}
                type="button"

                onClick={() => {
                  handleChange(
                    'icon',
                    icon
                  );

                  setShowIconPicker(false);
                }}

                style={{
                  width: 34,
                  height: 34,

                  fontSize: 17,

                  cursor: 'pointer',

                  background:
                    form.icon === icon
                      ? 'rgba(124,58,237,0.15)'
                      : 'transparent',

                  border:
                    form.icon === icon
                      ? '1px solid rgba(124,58,237,0.45)'
                      : '1px solid transparent',

                  borderRadius: 7,

                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',

                  transition:
                    'all 0.15s ease'
                }}
              >
                {icon}
              </button>
            ))}

          </div>
        )}


        {/* =========================
            DESCRIPTION
        ========================= */}

        <div
          style={{
            marginBottom: 16
          }}
        >

          <label className="form-label">
            Quest Description
          </label>

          <input
            className="form-input"
            placeholder="Why is this quest important for your growth?"
            value={form.description}

            onChange={e =>
              handleChange(
                'description',
                e.target.value
              )
            }
          />

        </div>


        {/* =========================
            CATEGORY + DIFFICULTY
        ========================= */}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              '1fr 1fr',

            gap: 12,

            marginBottom: 16
          }}
        >

          <div>

            <label className="form-label">
              Category
            </label>

            <select
              className="form-select"
              value={form.category}

              onChange={e =>
                handleChange(
                  'category',
                  e.target.value
                )
              }
            >

              {CATEGORIES.map(category => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}

            </select>

          </div>


          <div>

            <label className="form-label">
              Difficulty
            </label>

            <select
              className="form-select"
              value={form.difficulty}

              onChange={e =>
                handleChange(
                  'difficulty',
                  e.target.value
                )
              }
            >

              {DIFFICULTIES.map(difficulty => (
                <option
                  key={difficulty}
                  value={difficulty}
                >
                  {difficulty}
                </option>
              ))}

            </select>

          </div>

        </div>


        {/* =========================
            TARGETS
        ========================= */}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              '1fr 1fr',

            gap: 12,

            marginBottom: 18
          }}
        >

          <div>

            <label className="form-label">
              Full Target
            </label>

            <input
              className="form-input"
              placeholder="e.g. 60 minutes"
              value={form.target}

              onChange={e =>
                handleChange(
                  'target',
                  e.target.value
                )
              }
            />

          </div>


          <div>

            <label className="form-label">
              Minimum Target
            </label>

            <input
              className="form-input"
              placeholder="e.g. 10 minutes"
              value={form.minimumTarget}

              onChange={e =>
                handleChange(
                  'minimumTarget',
                  e.target.value
                )
              }
            />

          </div>

        </div>


        {/* =========================
            STAT SELECTION
        ========================= */}

        <div
          style={{
            marginBottom: 20
          }}
        >

          <label className="form-label">
            Character Attribute Boost
          </label>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 7
            }}
          >

            {STATS.map(stat => {

              const selected =
                form.stat === stat.value;

              return (
                <button
                  key={stat.value}
                  type="button"

                  onClick={() =>
                    handleChange(
                      'stat',
                      stat.value
                    )
                  }

                  style={{
                    padding:
                      '7px 11px',

                    borderRadius: 8,

                    fontSize: 12,

                    fontWeight: 600,

                    cursor: 'pointer',

                    border: selected
                      ? `1px solid ${stat.color}`
                      : '1px solid rgba(255,255,255,0.10)',

                    background: selected
                      ? `${stat.color}18`
                      : 'rgba(255,255,255,0.025)',

                    color: selected
                      ? stat.color
                      : 'var(--text-secondary)',

                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,

                    transition:
                      'all 0.15s ease'
                  }}
                >

                  <span>
                    {stat.icon}
                  </span>

                  <span>
                    {stat.label}
                  </span>

                </button>
              );
            })}

          </div>

        </div>


        {/* =========================
            REWARD PREVIEW
        ========================= */}

        <div
          style={{
            background:
              'rgba(255,255,255,0.025)',

            border:
              '1px solid rgba(255,255,255,0.10)',

            borderRadius: 12,

            padding:
              '13px 15px',

            marginBottom: 20,

            display: 'flex',
            alignItems: 'center',
            justifyContent:
              'space-between'
          }}
        >

          <div>

            <div
              style={{
                fontSize: 10,
                color:
                  'var(--text-muted)',

                textTransform:
                  'uppercase',

                letterSpacing:
                  '0.08em',

                marginBottom: 4
              }}
            >
              Calculated Rewards
            </div>

            <div
              style={{
                fontSize: 13,

                color:
                  'var(--text-primary)',

                fontWeight: 600
              }}
            >

              Full Quest:{' '}

              <span
                style={{
                  color:
                    'var(--violet-light)'
                }}
              >
                +{fullXp} XP
              </span>

              {' • '}

              Min Quest:{' '}

              <span
                style={{
                  color:
                    'var(--amber)'
                }}
              >
                +{minXp} XP
              </span>

            </div>

          </div>

          <Zap
            size={18}
            color="var(--violet-light)"
          />

        </div>


        {/* =========================
            SUBMIT
        ========================= */}

        <button
          type="submit"

          disabled={
            loading ||
            !form.name.trim()
          }

          className="btn btn-primary"

          style={{
            width: '100%',

            paddingTop: 13,
            paddingBottom: 13,

            fontSize: 15,

            opacity:
              loading ||
              !form.name.trim()
                ? 0.6
                : 1,

            transition:
              'opacity 0.2s ease'
          }}
        >

          {loading
            ? 'Saving Quest...'
            : editHabit
            ? 'Update Quest'
            : 'Add Quest to Log'}

        </button>

      </form>

    </Modal>
  );
};

export default CreateHabitModal;