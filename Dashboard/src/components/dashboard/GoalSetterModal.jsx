import { motion } from 'framer-motion';
import { useState } from 'react';

function GoalSetterModal({ isOpen, onClose, onSave, currentGoal, theme }) {
  const [goalHours, setGoalHours] = useState(currentGoal);

  if (!isOpen) return null;

  const handleSave = () => {
    if (goalHours >= 1 && goalHours <= 24) {
      onSave(goalHours);
      onClose();
    } else {
      alert('Please enter a goal between 1 and 24 hours.');
    }
  };

  return (
    <motion.div
      className={`fixed inset-0 ${theme === 'dark' ? 'bg-[#0A0A2A]/60' : 'bg-black/40'} flex items-center justify-center z-50 p-4`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={`p-4 sm:p-6 rounded-2xl holographic glow max-w-sm w-full text-${theme === 'dark' ? 'gray-100' : 'gray-900'}`}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        <h3 className="text-lg sm:text-xl font-orbitron text-primary mb-4">Set Daily Goal</h3>
        <input
          type="number"
          value={goalHours}
          onChange={(e) => setGoalHours(parseFloat(e.target.value))}
          className={`w-full p-2 bg-secondary text-primary rounded-lg mb-4 border border-primary focus:outline-none focus:ring-2 focus:ring-primary/50`}
          min="1"
          max="24"
          step="0.5"
          aria-label="Daily goal hours"
        />
        <div className="flex justify-end gap-2">
          <motion.button
            onClick={onClose}
            className="px-4 py-2 bg-secondary text-primary rounded-lg hover:bg-opacity-80 glow text-sm sm:text-base font-bold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Cancel"
          >
            Cancel
          </motion.button>
          <motion.button
            onClick={handleSave}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 glow text-sm sm:text-base font-bold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Save goal"
          >
            Save
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default GoalSetterModal;