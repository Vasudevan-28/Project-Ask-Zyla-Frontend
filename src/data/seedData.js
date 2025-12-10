const seed = {
  todos: {
    // 25 Nov 2025 default todo items
    "2025-11-25": [
      { id: "default-1", text: "Complete Morning Routine", isDefault: true, checked: false },
      { id: "default-2", text: "Complete Afternoon Routine", isDefault: true, checked: false },
      { id: "default-3", text: "Complete Evening Routine", isDefault: true, checked: false }
    ],
    "2025-11-26": [
      { id: "default-1", text: "Complete Morning Routine", isDefault: true, checked: false },
      { id: "default-2", text: "Complete Afternoon Routine", isDefault: true, checked: false },
      { id: "default-3", text: "Complete Evening Routine", isDefault: true, checked: false }
    ]
  },
  routines: {
    morning: [],
    afternoon: [],
    evening: []
  },
  streak: {
    currentStreak: 0,
    lastStreakDate: null
  },
  settings: {
    theme: localStorage.getItem("zyla_theme") || "dark",
    notificationsEnabled: false
  }
};

export default seed;
