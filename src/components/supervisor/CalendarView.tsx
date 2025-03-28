import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface Event {
  date: string;
  time: string;
  title: string;
  type: 'meeting' | 'task' | 'other';
}

interface CalendarViewProps {
  events: Event[];
  onDateSelect: (date: string) => void;
}
export function CalendarView({ events, onDateSelect }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const weeks: number[][] = [];
  let week = Array(7).fill(null);

  days.forEach((day, index) => {
    const dayIndex = (firstDayOfMonth + index) % 7;
    week[dayIndex] = day;
    
    if (dayIndex === 6 || index === days.length - 1) {
      weeks.push([...week]);
      week = Array(7).fill(null);
    }
  });

  const hasEvent = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.some(event => event.date === dateStr);
  };

  return (
    <div className="bg-white rounded-lg text-gray-700 shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
        
        {weeks.map((week, weekIndex) => (
          week.map((day, dayIndex) => (
            <div
              key={`${weekIndex}-${dayIndex}`}
              onClick={() => day && onDateSelect(`${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`)}
              className={`
                relative p-2 text-center cursor-pointer hover:bg-gray-50 rounded-lg
                ${day ? 'hover:bg-blue-50' : 'bg-gray-50'}
              `}
            >
              {day && (
                <>
                
                  <span className={`
                    ${hasEvent(day) ? 'text-blue-600 font-semibold' : 'text-gray-700'}
                  `}>
                    {day}
                  </span>
                  {hasEvent(day) && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                      <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        ))}
      </div>
    </div>
  );
} 