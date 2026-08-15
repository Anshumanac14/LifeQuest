const User = require('../models/User');
const Habit = require('../models/Habit');
const Achievement = require('../models/Achievement');
const Quest = require('../models/Quest');

const seedDemoUser = async () => {
  try {
    const demoEmail = 'alex@lifequest.app';
    let demoUser = await User.findOne({ email: demoEmail });

    if (!demoUser) {
      demoUser = await User.create({
        name: 'Alex',
        email: demoEmail,
        password: 'password123',
        level: 24,
        xp: 8420,
        totalXp: 35000,
        title: 'Warrior',
        stats: {
          strength: 71,
          intelligence: 83,
          focus: 62,
          wisdom: 68,
          recovery: 55,
          discipline: 79,
        },
        currentStreak: 14,
        bestStreak: 21,
        consistency: 87,
        totalCompletions: 142,
        isDemo: true,
      });

      // Sample habits
      await Habit.insertMany([
        {
          userId: demoUser._id,
          name: 'Study DSA',
          category: 'Learning',
          difficulty: 'Hard',
          target: '60 minutes',
          minimumTarget: '10 minutes',
          stat: 'intelligence',
          xpReward: 40,
          minimumXpReward: 20,
          icon: '🧠',
          order: 1,
        },
        {
          userId: demoUser._id,
          name: 'Workout / Gym',
          category: 'Fitness',
          difficulty: 'Hard',
          target: '45 minutes',
          minimumTarget: '15 minutes',
          stat: 'strength',
          xpReward: 50,
          minimumXpReward: 25,
          icon: '💪',
          order: 2,
        },
        {
          userId: demoUser._id,
          name: 'Read Non-Fiction',
          category: 'Learning',
          difficulty: 'Easy',
          target: '20 minutes',
          minimumTarget: '5 minutes',
          stat: 'wisdom',
          xpReward: 15,
          minimumXpReward: 8,
          icon: '📚',
          order: 3,
        },
        {
          userId: demoUser._id,
          name: 'Meditation',
          category: 'Mind',
          difficulty: 'Medium',
          target: '15 minutes',
          minimumTarget: '5 minutes',
          stat: 'focus',
          xpReward: 25,
          minimumXpReward: 12,
          icon: '🧘',
          order: 4,
        },
        {
          userId: demoUser._id,
          name: 'Sleep before 12:30',
          category: 'Health',
          difficulty: 'Medium',
          target: '12:30 AM',
          minimumTarget: '1:00 AM',
          stat: 'recovery',
          xpReward: 30,
          minimumXpReward: 15,
          icon: '🌙',
          order: 5,
        },
      ]);

      // Sample unlocked achievements
      await Achievement.insertMany([
        { userId: demoUser._id, achievementId: 'first_flame' },
        { userId: demoUser._id, achievementId: 'seven_days' },
        { userId: demoUser._id, achievementId: 'two_weeks' },
        { userId: demoUser._id, achievementId: 'level_10' },
        { userId: demoUser._id, achievementId: 'knowledge_seeker' },
      ]);

      console.log('✅ Demo user Alex (Level 24 Warrior) seeded successfully!');
    }
    return demoUser;
  } catch (error) {
    console.error('Error seeding demo user:', error.message);
  }
};

module.exports = { seedDemoUser };
