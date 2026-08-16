import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../lib/api';
import LoadingScreen from '../components/ui/LoadingScreen';
import {
  BarChart3,
  TrendingUp,
  Award,
  Lightbulb,
  Flame,
  Activity,
  Target,
  Zap,
  Trophy,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import toast from 'react-hot-toast';

const CATEGORY_COLORS = {
  Health: '#ef4444',
  Fitness: '#f59e0b',
  Learning: '#6366f1',
  Career: '#3b82f6',
  Mind: '#06b6d4',
  Personal: '#10b981',
  Social: '#ec4899',
  Custom: '#8b5cf6',
};

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ============================================================
     RESPONSIVE STATE
  ============================================================ */

  const [isMobile, setIsMobile] = useState(
    window.innerWidth <= 768
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  /* ============================================================
     FETCH ANALYTICS
  ============================================================ */

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics');

        if (res.data.success) {
          setData(res.data.analytics);
        }
      } catch (err) {
        console.error('Analytics error:', err);

        toast.error(
          err.response?.data?.message ||
            'Failed to load analytics'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  /* ============================================================
     LOADING
  ============================================================ */

  if (loading) {
    return <LoadingScreen />;
  }

  /* ============================================================
     DATA
  ============================================================ */

  const dailyCompletions =
    data?.dailyCompletions || [];

  const xpByCategory =
    (data?.xpByCategory || []).map((category) => ({
      name: category._id || 'General',
      value: category.totalXp || 0,
      count: category.count || 0,
      color:
        CATEGORY_COLORS[category._id] ||
        '#8b5cf6',
    }));

  const insights = data?.insights || [];

  const strongest =
    data?.strongestHabit?.habit;

  const weakest =
    data?.weakestHabit?.habit;

  const totalXp =
    data?.user?.totalXp || 0;

  const consistency =
    data?.user?.consistency || 0;

  const currentStreak =
    data?.user?.currentStreak || 0;

  const bestStreak =
    data?.user?.bestStreak || 0;

  const totalCompletions =
    data?.user?.totalCompletions || 0;

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 1180,
        margin: '0 auto',
        paddingBottom: 80,
        boxSizing: 'border-box',
      }}
    >

      {/* ========================================================
          HEADER
      ======================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 12,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.35,
        }}
        style={{
          marginBottom: 28,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 7,
          }}
        >

          <div
            style={{
              width: 38,
              height: 38,
              flexShrink: 0,
              borderRadius: 11,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background:
                'var(--violet-dim)',
              border:
                '1px solid var(--border-accent)',
            }}
          >
            <BarChart3
              size={21}
              color="var(--violet-light)"
            />
          </div>

          <h1
            style={{
              fontFamily:
                'Rajdhani, sans-serif',
              fontSize: isMobile ? 25 : 32,
              fontWeight: 700,
              letterSpacing: '0.02em',
              margin: 0,
            }}
          >
            PERFORMANCE ANALYTICS
          </h1>

        </div>

        <p
          style={{
            color:
              'var(--text-secondary)',
            fontSize: 14,
            marginLeft: isMobile ? 0 : 48,
            lineHeight: 1.5,
          }}
        >
          Track your consistency, progress,
          habits and performance over time.
        </p>
      </motion.div>


      {/* ========================================================
          STAT CARDS
      ======================================================== */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit, minmax(210px, 1fr))',
          gap: 14,
          marginBottom: 24,
        }}
      >

        <StatCard
          icon={<Target size={18} />}
          label="Consistency"
          value={`${consistency}%`}
          description="30-day performance"
          color="var(--cyan)"
        />

        <StatCard
          icon={<Flame size={18} />}
          label="Current Streak"
          value={`${currentStreak}d`}
          description={`Best: ${bestStreak} days`}
          color="var(--amber)"
        />

        <StatCard
          icon={<Zap size={18} />}
          label="Total XP"
          value={totalXp.toLocaleString()}
          description="Experience earned"
          color="var(--violet-light)"
        />

        <StatCard
          icon={<Trophy size={18} />}
          label="Completions"
          value={totalCompletions}
          description="Quests completed"
          color="var(--green-light)"
        />

      </div>


      {/* ========================================================
          INSIGHTS
      ======================================================== */}

      <motion.section
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
        }}
        style={{
          background:
            'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(6,182,212,0.035))',
          border:
            '1px solid rgba(124,58,237,0.2)',
          borderRadius: 18,
          padding: isMobile ? 15 : 20,
          marginBottom: 24,
          boxSizing: 'border-box',
        }}
      >

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            marginBottom: 15,
          }}
        >

          <Lightbulb
            size={19}
            color="var(--amber)"
          />

          <h2
            style={{
              fontSize: 17,
              fontWeight: 700,
              letterSpacing: '0.01em',
              margin: 0,
            }}
          >
            YOUR INSIGHTS
          </h2>

        </div>


        <div
          style={{
            display: 'grid',
            gap: 9,
          }}
        >

          {insights.length === 0 ? (

            <div
              style={{
                padding: '14px',
                color:
                  'var(--text-muted)',
                fontSize: 12,
              }}
            >
              Keep completing quests to
              generate personalized insights.
            </div>

          ) : (

            insights.map(
              (insight, index) => (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    x: -8,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay:
                      index * 0.05,
                  }}
                  style={{
                    display: 'flex',
                    alignItems:
                      'center',
                    gap: 12,
                    padding:
                      '12px 14px',
                    background:
                      'rgba(8,11,20,0.35)',
                    border:
                      '1px solid var(--border)',
                    borderRadius: 11,
                  }}
                >

                  <span
                    style={{
                      width: 32,
                      height: 32,
                      flexShrink: 0,
                      display: 'flex',
                      alignItems:
                        'center',
                      justifyContent:
                        'center',
                      borderRadius: 9,
                      background:
                        'rgba(255,255,255,0.04)',
                      fontSize: 17,
                    }}
                  >
                    {insight.icon}
                  </span>

                  <span
                    style={{
                      fontSize: 13,
                      color:
                        'var(--text-secondary)',
                      lineHeight: 1.5,
                    }}
                  >
                    {insight.text}
                  </span>

                </motion.div>
              )
            )

          )}

        </div>

      </motion.section>


      {/* ========================================================
          MAIN ANALYTICS GRID

          IMPORTANT:
          Desktop  -> Chart + Category side by side
          Mobile   -> Chart above Category

          This fixes the graph disappearing on phones.
      ======================================================== */}

      <div
        style={{
          display: 'grid',

          gridTemplateColumns:
            isMobile
              ? 'minmax(0, 1fr)'
              : 'minmax(0, 1.55fr) minmax(280px, 0.9fr)',

          gap: 20,
          marginBottom: 20,
          width: '100%',
          minWidth: 0,
        }}
      >

        {/* ======================================================
            COMPLETION CHART
        ====================================================== */}

        <AnalyticsCard
          icon={<TrendingUp size={17} />}
          title="Completion Trend"
          subtitle="Last 30 days"
        >

          {dailyCompletions.length === 0 ? (

            <EmptyState
              icon={
                <Activity size={25} />
              }
              text="Complete habits to see your progress trend."
            />

          ) : (

            <div
              style={{
                width: '100%',
                minWidth: 0,
                height: isMobile
                  ? 250
                  : 270,
              }}
            >

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <AreaChart
                  data={
                    dailyCompletions
                  }
                  margin={{
                    top: 10,
                    right: isMobile
                      ? 8
                      : 5,
                    left: isMobile
                      ? 0
                      : -20,
                    bottom: 0,
                  }}
                >

                  <defs>

                    <linearGradient
                      id="analyticsGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >

                      <stop
                        offset="0%"
                        stopColor="#8b5cf6"
                        stopOpacity={0.35}
                      />

                      <stop
                        offset="100%"
                        stopColor="#8b5cf6"
                        stopOpacity={0}
                      />

                    </linearGradient>

                  </defs>


                  <XAxis
                    dataKey="_id"
                    tick={{
                      fill: '#64748b',
                      fontSize: isMobile
                        ? 9
                        : 10,
                    }}
                    axisLine={false}
                    tickLine={false}
                    minTickGap={
                      isMobile ? 18 : 25
                    }
                  />


                  <YAxis
                    tick={{
                      fill: '#64748b',
                      fontSize: 10,
                    }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                    width={
                      isMobile ? 28 : 35
                    }
                  />


                  <Tooltip
                    contentStyle={{
                      background:
                        '#111827',
                      border:
                        '1px solid rgba(139,92,246,0.35)',
                      borderRadius: 10,
                      fontSize: 12,
                      color: '#f1f5f9',
                    }}
                    labelStyle={{
                      color: '#94a3b8',
                      marginBottom: 4,
                    }}
                  />


                  <Area
                    type="monotone"
                    dataKey="xpEarned"
                    name="XP Earned"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    fill="url(#analyticsGradient)"
                    dot={false}
                    activeDot={{
                      r: 4,
                      strokeWidth: 2,
                    }}
                  />

                </AreaChart>

              </ResponsiveContainer>

            </div>

          )}

        </AnalyticsCard>


        {/* ======================================================
            XP BY CATEGORY
        ====================================================== */}

        <AnalyticsCard
          icon={<Award size={17} />}
          title="XP by Category"
          subtitle="Where your XP comes from"
        >

          {xpByCategory.length === 0 ? (

            <EmptyState
              icon={
                <Award size={25} />
              }
              text="Complete habits to build category stats."
            />

          ) : (

            <div
              style={{
                display: 'flex',
                flexDirection:
                  'column',
                gap: 15,
              }}
            >

              {xpByCategory.map(
                (category) => {

                  const percentage =
                    totalXp > 0
                      ? Math.min(
                          100,
                          (category.value /
                            totalXp) *
                            100
                        )
                      : 0;

                  return (

                    <div
                      key={
                        category.name
                      }
                    >

                      <div
                        style={{
                          display:
                            'flex',
                          justifyContent:
                            'space-between',
                          alignItems:
                            'center',
                          marginBottom: 7,
                        }}
                      >

                        <div
                          style={{
                            display:
                              'flex',
                            alignItems:
                              'center',
                            gap: 7,
                          }}
                        >

                          <span
                            style={{
                              width: 7,
                              height: 7,
                              flexShrink: 0,
                              borderRadius:
                                '50%',
                              background:
                                category.color,
                            }}
                          />

                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                            }}
                          >
                            {
                              category.name
                            }
                          </span>

                        </div>


                        <span
                          style={{
                            fontSize: 11,
                            color:
                              'var(--text-muted)',
                          }}
                        >
                          {
                            category.value
                          }{' '}
                          XP
                        </span>

                      </div>


                      <div
                        style={{
                          height: 6,
                          background:
                            'rgba(255,255,255,0.05)',
                          borderRadius: 999,
                          overflow:
                            'hidden',
                        }}
                      >

                        <motion.div
                          initial={{
                            width: 0,
                          }}
                          animate={{
                            width: `${percentage}%`,
                          }}
                          transition={{
                            duration: 0.7,
                            ease:
                              'easeOut',
                          }}
                          style={{
                            height: '100%',
                            background:
                              category.color,
                            borderRadius:
                              999,
                          }}
                        />

                      </div>

                    </div>

                  );
                }
              )}

            </div>

          )}

        </AnalyticsCard>

      </div>


      {/* ========================================================
          HABIT PERFORMANCE
      ======================================================== */}

      <div
        style={{
          display: 'grid',

          gridTemplateColumns:
            isMobile
              ? 'minmax(0, 1fr)'
              : 'repeat(2, minmax(280px, 1fr))',

          gap: 20,
          width: '100%',
          minWidth: 0,
        }}
      >

        {/* STRONGEST */}

        <PerformanceCard
          title="Strongest Habit"
          subtitle="Your most consistent quest"
          icon={<Trophy size={18} />}
          color="var(--green-light)"
          habit={strongest}
          type="strong"
          completion={
            data?.strongestHabit
              ?.completions
          }
          xp={
            data?.strongestHabit
              ?.xpEarned
          }
        />


        {/* WEAKEST */}

        <PerformanceCard
          title="Needs Attention"
          subtitle="An opportunity to improve"
          icon={<Activity size={18} />}
          color="var(--amber)"
          habit={weakest}
          type="weak"
          completion={
            data?.weakestHabit
              ?.completions
          }
          xp={
            data?.weakestHabit
              ?.xpEarned
          }
        />

      </div>

    </div>
  );
};


/* ============================================================
   STAT CARD
============================================================ */

const StatCard = ({
  icon,
  label,
  value,
  description,
  color,
}) => {

  return (

    <motion.div
      whileHover={{
        y: -2,
      }}
      transition={{
        duration: 0.2,
      }}
      style={{
        background:
          'var(--glass-bg)',
        border:
          '1px solid var(--glass-border)',
        borderRadius: 15,
        padding:
          '16px 18px',
        minHeight: 112,
        minWidth: 0,
      }}
    >

      <div
        style={{
          display: 'flex',
          justifyContent:
            'space-between',
          alignItems: 'center',
          marginBottom: 10,
        }}
      >

        <span
          style={{
            fontSize: 11,
            color:
              'var(--text-muted)',
            textTransform:
              'uppercase',
            letterSpacing:
              '0.07em',
            fontWeight: 600,
          }}
        >
          {label}
        </span>


        <span
          style={{
            width: 30,
            height: 30,
            flexShrink: 0,
            borderRadius: 8,
            display: 'flex',
            alignItems:
              'center',
            justifyContent:
              'center',
            color,
            background:
              `${color}15`,
            border:
              `1px solid ${color}25`,
          }}
        >
          {icon}
        </span>

      </div>


      <div
        style={{
          fontFamily:
            'Rajdhani, sans-serif',
          fontSize: 30,
          fontWeight: 700,
          lineHeight: 1,
          color,
          marginBottom: 6,
        }}
      >
        {value}
      </div>


      <div
        style={{
          fontSize: 10,
          color:
            'var(--text-muted)',
        }}
      >
        {description}
      </div>

    </motion.div>

  );
};


/* ============================================================
   ANALYTICS CARD
============================================================ */

const AnalyticsCard = ({
  icon,
  title,
  subtitle,
  children,
}) => {

  return (

    <motion.div
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
      }}
      style={{
        background:
          'var(--glass-bg)',
        border:
          '1px solid var(--glass-border)',
        borderRadius: 17,
        padding: 20,
        minWidth: 0,
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >

      <div
        style={{
          display: 'flex',
          alignItems:
            'center',
          gap: 9,
          marginBottom: 3,
        }}
      >

        <span
          style={{
            color:
              'var(--violet-light)',
            display: 'flex',
          }}
        >
          {icon}
        </span>


        <h3
          style={{
            fontSize: 15,
            fontWeight: 700,
            margin: 0,
          }}
        >
          {title}
        </h3>

      </div>


      <p
        style={{
          color:
            'var(--text-muted)',
          fontSize: 11,
          marginBottom: 18,
        }}
      >
        {subtitle}
      </p>


      {children}

    </motion.div>

  );
};


/* ============================================================
   PERFORMANCE CARD
============================================================ */

const PerformanceCard = ({
  title,
  subtitle,
  icon,
  color,
  habit,
  completion,
  xp,
}) => {

  return (

    <motion.div
      whileHover={{
        y: -2,
      }}
      style={{
        background:
          'var(--glass-bg)',
        border:
          '1px solid var(--glass-border)',
        borderRadius: 17,
        padding: 20,
        minWidth: 0,
        width: '100%',
        boxSizing: 'border-box',
      }}
    >

      <div
        style={{
          display: 'flex',
          alignItems:
            'center',
          justifyContent:
            'space-between',
          marginBottom: 16,
        }}
      >

        <div>

          <div
            style={{
              display: 'flex',
              alignItems:
                'center',
              gap: 8,
              marginBottom: 3,
            }}
          >

            <span
              style={{
                color,
                display: 'flex',
              }}
            >
              {icon}
            </span>


            <h3
              style={{
                fontSize: 15,
                fontWeight: 700,
                margin: 0,
              }}
            >
              {title}
            </h3>

          </div>


          <p
            style={{
              color:
                'var(--text-muted)',
              fontSize: 11,
              margin: 0,
            }}
          >
            {subtitle}
          </p>

        </div>

      </div>


      {!habit ? (

        <div
          style={{
            padding:
              '24px 10px',
            textAlign:
              'center',
            color:
              'var(--text-muted)',
            fontSize: 12,
          }}
        >
          Not enough data yet.
        </div>

      ) : (

        <>

          <div
            style={{
              padding: 14,
              borderRadius: 11,
              background:
                'rgba(255,255,255,0.025)',
              border:
                '1px solid var(--border)',
              marginBottom: 14,
              minWidth: 0,
            }}
          >

            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                marginBottom: 3,
                overflow: 'hidden',
                textOverflow:
                  'ellipsis',
                whiteSpace:
                  'nowrap',
              }}
            >
              {habit.title ||
                habit.name ||
                'Unnamed Habit'}
            </div>


            <div
              style={{
                fontSize: 11,
                color:
                  'var(--text-muted)',
              }}
            >
              {habit.category ||
                'General'}
            </div>

          </div>


          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                '1fr 1fr',
              gap: 10,
            }}
          >

            <MiniStat
              label="Completions"
              value={
                completion || 0
              }
              color={color}
            />

            <MiniStat
              label="XP Earned"
              value={xp || 0}
              color={color}
            />

          </div>

        </>

      )}

    </motion.div>

  );
};


/* ============================================================
   MINI STAT
============================================================ */

const MiniStat = ({
  label,
  value,
  color,
}) => {

  return (

    <div
      style={{
        padding:
          '10px 12px',
        borderRadius: 10,
        background:
          'rgba(255,255,255,0.025)',
        border:
          '1px solid var(--border)',
        minWidth: 0,
      }}
    >

      <div
        style={{
          fontSize: 10,
          color:
            'var(--text-muted)',
          marginBottom: 3,
        }}
      >
        {label}
      </div>


      <div
        style={{
          fontFamily:
            'Rajdhani, sans-serif',
          fontSize: 20,
          fontWeight: 700,
          color,
        }}
      >
        {value}
      </div>

    </div>

  );
};


/* ============================================================
   EMPTY STATE
============================================================ */

const EmptyState = ({
  icon,
  text,
}) => {

  return (

    <div
      style={{
        height: 220,
        display: 'flex',
        flexDirection:
          'column',
        alignItems:
          'center',
        justifyContent:
          'center',
        color:
          'var(--text-muted)',
        gap: 10,
      }}
    >

      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: 12,
          display: 'flex',
          alignItems:
            'center',
          justifyContent:
            'center',
          background:
            'rgba(255,255,255,0.03)',
          border:
            '1px solid var(--border)',
        }}
      >
        {icon}
      </div>


      <span
        style={{
          fontSize: 12,
          textAlign: 'center',
          maxWidth: 230,
        }}
      >
        {text}
      </span>

    </div>

  );
};


export default AnalyticsPage;