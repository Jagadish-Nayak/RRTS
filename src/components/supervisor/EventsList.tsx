interface Event {
  date: string;
  time: string;
  title: string;
  type: 'meeting' | 'task' | 'other';
}

interface EventsListProps {
  events: Event[];
  selectedDate: string;
}

export function EventsList({ events, selectedDate }: EventsListProps) {
  const filteredEvents = events.filter(event => event.date === selectedDate);

  return (
    <div className="bg-white text-gray-700 rounded-lg shadow-md p-4 mb-8 mt-4">
      <h3 className="text-lg font-semibold mb-4">
        Events for {new Date(selectedDate).toLocaleDateString('en-GB')}
      </h3>
      <div className="space-y-3">
        {filteredEvents.map((event, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              event.type === 'meeting' ? 'bg-blue-50' :
              event.type === 'task' ? 'bg-orange-50' : 'bg-gray-50'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">{event.title}</span>
              <span className="text-sm text-gray-600">{event.time}</span>
            </div>
          </div>
        ))}
        {filteredEvents.length === 0 && (
          <p className="text-gray-500 text-center py-4">No events scheduled</p>
        )}
      </div>
    </div>
  );
}
