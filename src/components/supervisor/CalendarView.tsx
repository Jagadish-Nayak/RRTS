// import { useState } from 'react';
// import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// interface Event {
//   date: string;
//   time: string;
//   title: string;
//   type: 'Not Inspected' | "Inspected" | 'Ongoing';
//   name: string;
// }

// const getColor = (type: string) => {
//   switch (type) {
//     case 'Not Inspected': return 'bg-blue-50';
//     case 'Inspected': return 'bg-orange-50';
//     case 'Ongoing': return 'bg-purple-50';
//   }
// }

// interface CalendarViewProps {
//   events: Event[];
//   onDateSelect: (date: string) => void;
// }
// export function CalendarView({ events, onDateSelect }: CalendarViewProps) {
//   const [currentMonth, setCurrentMonth] = useState(new Date());

//   const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
//   const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

//   const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
//   const weeks: number[][] = [];
//   let week = Array(7).fill(null);

//   days.forEach((day, index) => {
//     const dayIndex = (firstDayOfMonth + index) % 7;
//     week[dayIndex] = day;
    
//     if (dayIndex === 6 || index === days.length - 1) {
//       weeks.push([...week]);
//       week = Array(7).fill(null);
//     }
//   });

//   const hasEvent = (day: number) => {
//     const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
//     return events.some(event => event.date === dateStr);
//   };

//   return (
//     <div className="bg-white rounded-lg text-gray-700 shadow-md p-4">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold">
//           {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
//         </h2>
//         <div className="flex gap-2">
//           <button
//             onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
//             className="p-2 hover:bg-gray-100 rounded-full"
//           >
//             <FaChevronLeft />
//           </button>
//           <button
//             onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
//             className="p-2 hover:bg-gray-100 rounded-full"
//           >
//             <FaChevronRight />
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-7 gap-1">
//         {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
//           <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
//             {day}
//           </div>
//         ))}
        
//         {weeks.map((week, weekIndex) => (
//           week.map((day, dayIndex) => (
//             <div
//               key={`${weekIndex}-${dayIndex}`}
//               onClick={() => day && onDateSelect(`${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`)}
//               className={`
//                 relative p-2 text-center cursor-pointer hover:bg-gray-50 rounded-lg
//                 ${day ? getColor(events.find(event => event.date === `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`)?.type || '') : 'bg-gray-50'}
//               `}
//             >
//               {day && (
//                 <>
                
//                   <span className={`
//                     ${hasEvent(day) ? 'text-blue-600 font-semibold' : 'text-gray-700'}
//                   `}>
//                     {day}
//                   </span>
//                   {hasEvent(day) && (
//                     <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
//                       <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           ))
//         ))}
//       </div>
//     </div>
//   );
// } 

import { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface Event {
  date: string;
  time: string;
  title: string;
  type:  'Supervisor Assigned' | "Inspected" | 'Ongoing' | 'Completed';
  name: string;
}

const getColor = (type: string) => {
  switch (type) {
    case 'Supervisor Assigned': return 'bg-yellow-200';
    case 'Inspected': return 'bg-orange-200';
    case 'Ongoing': return 'bg-purple-200';
    case 'Completed': return 'bg-green-200';
    default: return 'bg-teal-200';
  }
}

interface CalendarViewProps {
  events: Event[];
  onDateSelect: (date: string) => void;
}

export function CalendarView({ events, onDateSelect }: CalendarViewProps) {
  //console.log(events);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });

  useEffect(() => {
    onDateSelect(selectedDate);
  }, []);

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

  // const hasEvent = (day: number) => {
  //   const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  //   return events.some(event => event.date === dateStr);
  // };

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

        {weeks.map((week, weekIndex) =>
          week.map((day, dayIndex) => {
            const dateStr = day
              ? `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              : '';

            const event = events.find(e => e.date === dateStr);
            const bgColor = getColor(event?.type || '');

            return (
              <div
                key={`${weekIndex}-${dayIndex}`}
                onClick={() => {
                  if (day) {
                    setSelectedDate(dateStr);
                    onDateSelect(dateStr);
                  }
                }}
                className={`relative p-2 text-center cursor-pointer hover:bg-gray-50 rounded-lg`}
              >
                {day && (
                  <>
                    <div
                      className={`w-8 h-8 mx-auto flex items-center justify-center rounded-full
                        ${event ? bgColor : ''} 
                        ${selectedDate === dateStr ? 'ring-2 ring-blue-500' : ''}`}
                    >
                      <span className={`${event ? 'text-white font-semibold' : 'text-gray-700'}`}>
                        {day}
                      </span>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
